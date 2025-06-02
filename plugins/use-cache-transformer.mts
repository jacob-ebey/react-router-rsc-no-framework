import * as crypto from "node:crypto";

import * as babelCore from "@babel/core";
import { transformAsync, transformFromAstAsync } from "@babel/core";
import { Transformer } from "@parcel/plugin";
import { addNamed as addNamedImport } from "@babel/helper-module-imports";
// @ts-expect-error These modules don't have types
import babelPluginSyntaxJSX from "@babel/plugin-syntax-jsx";
// @ts-expect-error These modules don't have types
import babelPresetTypeScript from "@babel/preset-typescript";
import semver from "semver";

import { remapAstLocations } from "./utils.mts";

export default new Transformer({
  loadConfig({ config }) {
    return {
      cacheImportPath: "@/lib/cache",
      cacheExportName: "cache",
    };
  },
  canReuseAST({ ast }) {
    return ast.type === "babel" && semver.satisfies(ast.version, "^7.0.0");
  },
  async transform({ asset, config, options }) {
    const code = await asset.getCode();

    if (!code.match(/['"]use cache['"]/)) {
      return [asset];
    }

    let cacheImported: babelCore.types.Identifier | null = null;
    let programPath!: babelCore.NodePath<babelCore.types.Program>;
    const babelConfig = {
      filename: asset.filePath,
      presets: [[babelPresetTypeScript, { jsx: "preserve" }]],
      plugins: [
        babelPluginSyntaxJSX,
        () => {
          return {
            visitor: {
              Program(path: babelCore.NodePath<babelCore.types.Program>) {
                programPath = path;
              },
              Directive(path: babelCore.NodePath<babelCore.types.Directive>) {
                const directive = path.node.value.value;
                if (directive !== "use cache") {
                  return;
                }
                path.remove();

                if (!cacheImported) {
                  cacheImported = addNamedImport(
                    programPath,
                    config.cacheExportName,
                    config.cacheImportPath
                  );
                }

                const functionScope = path.findParent(
                  (path) =>
                    path.isFunctionDeclaration() ||
                    path.isFunctionExpression() ||
                    path.isArrowFunctionExpression()
                ) as babelCore.NodePath<
                  | babelCore.types.FunctionDeclaration
                  | babelCore.types.FunctionExpression
                  | babelCore.types.ArrowFunctionExpression
                > | null;
                if (!functionScope) return;

                const nonLocalVariables = getNonLocalVariables(functionScope);
                const usedArgs = getUsedFunctionArguments(functionScope);

                const clone = babelCore.types.cloneNode(
                  functionScope.node,
                  false,
                  true
                );
                clone.body = babelCore.types.blockStatement([
                  babelCore.types.returnStatement(
                    babelCore.types.callExpression(
                      babelCore.types.callExpression(cacheImported, [
                        babelCore.types.arrowFunctionExpression(
                          [],
                          babelCore.types.cloneNode(functionScope.node.body),
                          true
                        ),
                        babelCore.types.arrayExpression([
                          babelCore.types.stringLiteral(
                            getCacheId(asset.filePath, functionScope)
                          ),
                          ...Array.from(nonLocalVariables).map((name) =>
                            babelCore.types.identifier(name)
                          ),
                          ...usedArgs,
                        ]),
                      ]),
                      []
                    )
                  ),
                ]);

                functionScope.replaceWith(clone);
              },
            },
          };
        },
      ],
    };

    const ast = await asset.getAST();
    let res: babelCore.BabelFileResult | null;
    if (ast) {
      res = await babelCore.transformFromAstAsync(
        ast.program,
        asset.isASTDirty() ? undefined : await asset.getCode(),
        babelConfig
      );
    } else {
      res = await transformAsync(code, babelConfig);
    }
    if (res?.ast) {
      const map = await asset.getMap();
      if (map) {
        remapAstLocations(babelCore.types, res.ast, map);
      }
      asset.setAST({
        type: "babel",
        version: "7.0.0",
        program: res.ast,
      });
    }
    asset.setCode(res?.code ?? code);
    asset.type = "js";

    return [asset];
  },
});

function getCacheId(
  filename: string,
  path: babelCore.NodePath<
    | babelCore.types.FunctionDeclaration
    | babelCore.types.FunctionExpression
    | babelCore.types.ArrowFunctionExpression
  >
): string {
  let id = filename;
  const location = path.node.loc;
  if (!location) {
    throw new Error("Function does not have a location");
  }
  id =
    crypto
      .createHash("sha256")
      .update(filename)
      .update(path.toString())
      .digest("hex") +
    ":" +
    // TODO: Only add filename and location in development.
    filename +
    `:${location.start.line}:${location.start.column}`;
  return id;
}

function getUsedFunctionArguments(
  path: babelCore.NodePath<
    | babelCore.types.FunctionDeclaration
    | babelCore.types.FunctionExpression
    | babelCore.types.ArrowFunctionExpression
  >
) {
  const paramNodes = path.node.params;
  const identifiers: babelCore.types.Identifier[] = [];

  for (const param of paramNodes) {
    if (babelCore.types.isIdentifier(param)) {
      identifiers.push(param);
    } else if (babelCore.types.isObjectPattern(param)) {
      for (const prop of param.properties) {
        if (babelCore.types.isObjectProperty(prop)) {
          if (babelCore.types.isIdentifier(prop.key)) {
            if (babelCore.types.isIdentifier(prop.value)) {
              identifiers.push(prop.value);
            } else {
              identifiers.push(prop.key);
            }
          }
        }
      }
    } else if (babelCore.types.isArrayPattern(param)) {
      for (const elem of param.elements) {
        if (babelCore.types.isIdentifier(elem)) {
          identifiers.push(elem);
        }
      }
    } else if (
      babelCore.types.isRestElement(param) &&
      babelCore.types.isIdentifier(param.argument)
    ) {
      identifiers.push(param.argument);
    } else {
      throw new Error(
        `Unsupported parameter type: ${param.type} in function ${(path.node as any).id?.name || "anonymous"}`
      );
    }
  }

  return identifiers.filter((id) => {
    return path.isReferenced(id);
  });
}

function getNonLocalVariables(
  path: babelCore.NodePath<
    | babelCore.types.FunctionDeclaration
    | babelCore.types.FunctionExpression
    | babelCore.types.ArrowFunctionExpression
  >
) {
  const nonLocalVariables = new Set<string>();
  const programScope = path.scope.getProgramParent();

  path.traverse({
    Identifier(identPath: babelCore.NodePath<babelCore.types.Identifier>) {
      const { name } = identPath.node;
      if (nonLocalVariables.has(name) || !identPath.isReferencedIdentifier()) {
        return;
      }

      const binding = identPath.scope.getBinding(name);
      if (!binding) {
        // probably a global, or an unbound variable. ignore it.
        return;
      }
      if (binding.scope === programScope) {
        // module-level declaration. no need to close over it.
        return;
      }

      if (
        // function args or a var at the top-level of its body
        binding.scope === path.scope ||
        // decls from blocks within the function
        isChildScope({
          parent: path.scope,
          child: binding.scope,
          root: programScope,
        })
      ) {
        // the binding came from within the function = it's not closed-over, so don't add it.
        return;
      }

      nonLocalVariables.add(name);
    },
  });

  return nonLocalVariables;
}

function isChildScope({
  root,
  parent,
  child,
}: {
  root: babelCore.NodePath["scope"];
  parent: babelCore.NodePath["scope"];
  child: babelCore.NodePath["scope"];
}) {
  let curScope = child;
  while (curScope !== root) {
    if (curScope.parent === parent) {
      return true;
    }
    curScope = curScope.parent;
  }
  return false;
}

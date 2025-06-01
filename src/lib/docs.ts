// @ts-expect-error - no types
import cq from "concurrent-queue";

import { cache, cacheLife } from "@/lib/cache";

import { processMarkdown } from "./md";

export type DocFile = {
  path: string;
  sha: string;
  load(): Promise<MarkdownDoc>;
};

export type Docs = {
  sha: string;
  files: Array<DocFile>;
};

export type MarkdownDoc = {
  attributes: {
    title?: string;
    order?: number;
  };
  html: string;
};

const getDocsList = cache(() => {
  // TODO: "use cache";
  return fetch("https://github-md.com/remix-run/react-router/main").then(
    (res) =>
      res.json() as Promise<{
        sha: string;
        files: Array<{ path: string; sha: string }>;
      }>
  );
}, ["data-github-docs-list"]);

export const getDocs = async ({
  preload,
}: { preload?: boolean | string | string[] } = {}): Promise<Docs> => {
  return await getDocsList().then((docs): Docs => {
    const processDoc = createDocProcessor();

    return {
      ...docs,
      files: docs.files
        .filter((file) => file.path.startsWith("docs/"))
        .map((file): DocFile => {
          const result = {
            ...file,
            load: () => {
              // TODO: "use cache";
              return cache(() => {
                cacheLife("max");
                return fetch(
                  `https://raw.githubusercontent.com/remix-run/react-router/${docs.sha}/${file.path}`
                )
                  .then((res) => res.text())
                  .then(async (content) => {
                    const doc = await processDoc(content);
                    return {
                      attributes: doc.attributes as any,
                      html: doc.html,
                    };
                  });
              }, [docs.sha, file.path])();
            },
          };
          if (
            preload === true ||
            preload === file.path ||
            (Array.isArray(preload) && preload.includes(file.path))
          ) {
            result.load().catch(() => {});
          }
          return result;
        }),
    };
  });
};

function createDocProcessor() {
  return cq()
    .limit({ concurrency: 1 })
    .process(async (content: string) => {
      return await processMarkdown(content);
    });
}

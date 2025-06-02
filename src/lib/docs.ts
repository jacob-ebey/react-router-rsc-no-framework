// @ts-expect-error - no types
import cq from "concurrent-queue";

import { cacheLife } from "@/lib/cache";

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

function getDocsList() {
  "use cache";

  return fetch("https://github-md.com/remix-run/react-router/main").then(
    (res) =>
      res.json() as Promise<{
        sha: string;
        files: Array<{ path: string; sha: string }>;
      }>
  );
}

const processDoc = cq()
  .limit({ concurrency: 1 })
  .process(async (content: string) => {
    return await processMarkdown(content);
  });

export const getDocs = async ({
  preload,
}: { preload?: boolean | string | string[] } = {}): Promise<Docs> => {
  return await getDocsList().then((docs): Docs => {
    const sha = docs.sha;

    return {
      ...docs,
      files: docs.files
        .filter((file) => file.path.startsWith("docs/"))
        .map((file): DocFile => {
          const filepath = file.path;

          const result = {
            ...file,
            load: () => {
              "use cache";

              cacheLife("max");

              return fetch(
                `https://raw.githubusercontent.com/remix-run/react-router/${sha}/${filepath}`
              )
                .then((res) => res.text())
                .then(async (content) => {
                  const doc = await processDoc(content);
                  return {
                    attributes: doc.attributes as any,
                    html: doc.html,
                  };
                });
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

export function loadChangelog() {
  "use cache";

  return fetch(
    "https://raw.githubusercontent.com/remix-run/react-router/main/CHANGELOG.md"
  )
    .then((res) => res.text())
    .then(processMarkdown);
}

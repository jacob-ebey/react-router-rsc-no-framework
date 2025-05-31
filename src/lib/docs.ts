// @ts-expect-error - no types
import cq from "concurrent-queue";

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

declare global {
  var docsCache: Promise<Docs> | undefined;
}

export async function getDocs({
  preload,
}: { preload?: boolean | string | string[] } = {}): Promise<Docs> {
  if (globalThis.docsCache) {
    return globalThis.docsCache;
  }

  const processDoc = createDocProcessor();

  globalThis.docsCache = fetch(
    "https://github-md.com/remix-run/react-router/main"
  )
    .then(
      (res) =>
        res.json() as Promise<{
          sha: string;
          files: Array<{ path: string; sha: string }>;
        }>
    )
    .then((docs): Docs => {
      return {
        ...docs,
        files: docs.files
          .filter((file) => file.path.startsWith("docs/"))
          .map((file): DocFile => {
            let loadPromise: Promise<MarkdownDoc> | null = null;
            const result = {
              ...file,
              load: () => {
                if (loadPromise) {
                  return loadPromise;
                }
                // loadPromise = fetch(
                //   `https://github-md.com/remix-run/react-router/${docs.sha}/${file.path}`
                // )
                //   .then((res) => res.json())
                loadPromise = fetch(
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
                loadPromise.catch(() => {
                  loadPromise = null;
                });

                return loadPromise;
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
  globalThis.docsCache.catch(() => {
    globalThis.docsCache = undefined;
  });

  return globalThis.docsCache;
}

function createDocProcessor() {
  return cq()
    .limit({ concurrency: 1 })
    .process(async (content: string) => {
      return await processMarkdown(content);
    });
}

import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router/rsc";

import { appName } from "@/global-config";
import { getDocs } from "@/lib/docs";
import { processMarkdown } from "@/lib/md";

export async function loader({ params }: LoaderFunctionArgs) {
  const docParam = params["*"];
  const docPath = docParam ? `docs/${docParam}.md` : undefined;

  const docs = await getDocs({ preload: docPath });
  const doc = docs.files.find((file) => file.path === docPath);

  if (!doc) {
    return data(null, 404);
  }
  return null;
}

export default async function DocsHome() {
  const doc = await processMarkdown(
    await fetch(
      "https://raw.githubusercontent.com/remix-run/react-router/main/docs/index.md"
    ).then((res) => res.text()),
    {
      resolveHref(href) {
        return href;
      },
    }
  );
  return (
    <>
      <title>{`${doc.attributes?.title} | ${appName}`}</title>

      <div className="flex flex-1 flex-col gap-4 px-4 py-8">
        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </>
  );
}

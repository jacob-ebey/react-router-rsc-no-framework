import { appName } from "@/global-config";
import { processMarkdown } from "@/lib/md";

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

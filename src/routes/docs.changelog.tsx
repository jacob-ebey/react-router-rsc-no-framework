import { appName } from "@/global-config";
import { processMarkdown } from "@/lib/md";

async function loadChangelog() {
  "use cache";

  return processMarkdown(
    await fetch(
      "https://raw.githubusercontent.com/remix-run/react-router/main/CHANGELOG.md"
    ).then((res) => res.text())
  );
}

export default async function DocsHome() {
  const doc = await loadChangelog();

  return (
    <>
      <title>{`Changelog | ${appName}`}</title>

      <div className="flex flex-1 flex-col gap-4 px-4 py-8">
        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </>
  );
}

import { appName } from "@/global-config";
import { cache } from "@/lib/cache";
import { processMarkdown } from "@/lib/md";

export default async function DocsHome() {
  const doc = await cache(
    () => "data-changelog",
    async () => {
      // TODO: "use cache";
      return processMarkdown(
        await fetch(
          "https://raw.githubusercontent.com/remix-run/react-router/main/CHANGELOG.md"
        ).then((res) => res.text())
      );
    }
  )();
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

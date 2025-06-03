import { appName } from "@/global-config";

import { loadChangelog } from "./lib/docs";

export default async function Changelog() {
  "use cache";

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

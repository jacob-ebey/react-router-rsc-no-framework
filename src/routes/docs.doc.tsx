import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router/rsc";

import { NotFoundCard } from "@/components/not-found-card";
import { appName } from "@/global-config";
import { cache } from "@/lib/cache";
import { getDocs } from "@/lib/docs";

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

export default cache(
  ({ params }) => `doc-cache--${params["*"]}`,
  async function Doc({ params }: { params: { "*": string } }) {
    const docParam = params["*"];
    const docPath = docParam ? `docs/${docParam}.md` : undefined;

    const docs = await getDocs({ preload: docPath });
    const doc = await docs.files.find((file) => file.path === docPath)?.load();

    return (
      <>
        {doc ? (
          <>
            <title>{`${doc.attributes?.title} | ${appName}`}</title>
            <div className="flex flex-1 flex-col gap-4 px-4 py-8">
              <article
                className="prose"
                dangerouslySetInnerHTML={{ __html: doc.html }}
              />
            </div>
          </>
        ) : (
          <>
            <title>{`Not Found | ${appName}`}</title>
            <div className="flex flex-1 flex-col gap-4 p-4 items-center justify-center">
              <NotFoundCard />
            </div>
          </>
        )}
      </>
    );
  }
);

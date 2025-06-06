import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router/rsc";

import { RouteErrorBoundary } from "@/components/error-boundary";
import { NotFoundCard } from "@/components/not-found-card";
import { appName } from "@/global-config";

import { getDocs } from "./lib/docs";

export async function loader({ params }: LoaderFunctionArgs) {
  const docParam = params["*"];
  const docPath = docParam ? `docs/${docParam}.md` : undefined;

  const docs = await getDocs({ preload: docPath });
  const doc = await docs.files.find((file) => file.path === docPath)?.load();

  if (!doc || doc.attributes.hidden) {
    throw data(null, 404);
  }
  return null;
}

export default async function Doc({ params }: { params: { "*": string } }) {
  "use cache";

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

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

"use client";

import {
  useRouteError,
  useAsyncError,
  isRouteErrorResponse,
} from "react-router";

function ErrorBoundary({ error }: { error: unknown }) {
  let header = "Ooops!";
  let message = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    header = "" + error.status;
    message =
      error.statusText ||
      (error.status === 404
        ? "Page not found."
        : "An unexpected error occurred.");
  } else {
    // console.error(error);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-8">
      <div className="prose">
        <h1 className="">{header}</h1>
        <p className="">{message}</p>
      </div>
    </div>
  );
}

export function AsyncErrorBoundary() {
  const error = useAsyncError();
  return <ErrorBoundary error={error} />;
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundary error={error} />;
}

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
    message = error.statusText || "An unexpected error occurred.";
  } else {
    // console.error(error);
  }

  return (
    <div>
      <p className="error-boundary__header">{header}</p>
      <p className="error-boundary__message">{message}</p>
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

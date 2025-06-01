"use client";

import * as React from "react";
// @ts-expect-error
import { createFromReadableStream as createFromReadableStreamBrowser } from "react-server-dom-parcel/client.browser";
// @ts-expect-error
import { createFromReadableStream as createFromReadableStreamEdge } from "react-server-dom-parcel/client.edge";

const createFromReadableStream =
  typeof document !== "undefined"
    ? createFromReadableStreamBrowser
    : createFromReadableStreamEdge;

export function RenderCached({ cached }: { cached: string }) {
  const children = React.useMemo(
    () =>
      Promise.resolve(
        createFromReadableStream(
          new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode(cached));
              controller.close();
            },
          }),
          {
            replayConsoleLogs: false,
          }
        )
      ),
    [cached]
  );

  return <>{React.use(children)}</>;
}

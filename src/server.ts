import * as React from "react" assert { env: "react-client" };
import { createRequestListener } from "@mjackson/node-fetch-server";
import express from "express";
import compression from "compression";
// @ts-expect-error - no types
import { renderToReadableStream as renderHTMLToReadableStream } from "react-dom/server.edge" assert { env: "react-client" };
import {
  unstable_routeRSCServerRequest,
  unstable_RSCStaticRouter,
} from "react-router" assert { env: "react-client" };
// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-parcel/client.edge" assert { env: "react-client" };

import { callServer } from "./react-server.ts" assert { env: "react-server" };

const app = express();
app.use(compression());

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_, res) => {
  res.status(404);
  res.send("Not Found");
});

app.use(express.static("public"));

app.use("/client", express.static("dist/client"));

app.use(
  createRequestListener(async (request) => {
    return unstable_routeRSCServerRequest({
      request,
      callServer,
      decode: createFromReadableStream,
      async renderHTML(getPayload) {
        return await renderHTMLToReadableStream(
          React.createElement(unstable_RSCStaticRouter, { getPayload }),
          {
            bootstrapScriptContent: (
              callServer as unknown as { bootstrapScript: string }
            ).bootstrapScript,
          }
        );
      },
    });
  })
);

app.listen(3000);
console.log("Server listening on port 3000 (http://localhost:3000)");

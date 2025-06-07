import { createRequestListener } from "@mjackson/node-fetch-server";
import compression from "compression";
import { drizzle } from "drizzle-orm/libsql";
import express from "express";
import * as React from "react";
import { env } from "std-env";
import { renderToReadableStream as renderHTMLToReadableStream } from "react-dom/server.edge" with { env: "react-client" };
import {
  unstable_routeRSCServerRequest,
  unstable_RSCStaticRouter,
} from "react-router" with { env: "react-client" };
// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-parcel/client.edge" with { env: "react-client" };

import { DbStorage } from "./db/client";
import * as schema from "./db/schema";
import { callServer } from "./react-server";

if (!env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}

const db = drizzle(env.DB_FILE_NAME, { schema });

const app = express();

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_, res) => {
  res.status(404);
  res.send("Not Found");
});

app.use(compression(), express.static("public"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist/prerendered"));
}
app.use(
  "/client",
  compression(),
  express.static("dist/client", {
    immutable: true,
    maxAge: "1y",
  })
);

app.use(
  createRequestListener(async (request) => {
    return DbStorage.run(db, () =>
      unstable_routeRSCServerRequest({
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
      })
    );
  })
);

const PORT = Number.parseInt(process.env.PORT || "3000");
export default app.listen(PORT);
console.log("Server listening on port 3000 (http://localhost:3000)");

import * as React from "react" with { env: "react-client" };
import { createRequestListener } from "@mjackson/node-fetch-server";
import express from "express";
import compression from "compression";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "std-env";
// @ts-expect-error - no types
import { renderToReadableStream as renderHTMLToReadableStream } from "react-dom/server.edge" with { env: "react-client" };
import {
  unstable_routeRSCServerRequest,
  unstable_RSCStaticRouter,
} from "react-router" with { env: "react-client" };
// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-parcel/client.edge" with { env: "react-client" };

import { callServer } from "./react-server" with { env: "react-server" };
import { DbStorage } from "./db/client";
import * as schema from "./db/schema";

if (!env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}

const db = drizzle(env.DB_FILE_NAME, { schema });

const app = express();
app.use(compression());

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_, res) => {
  res.status(404);
  res.send("Not Found");
});

app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist/prerendered"));
}
app.use("/client", express.static("dist/client"));

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

import { AsyncLocalStorage } from "node:async_hooks";

import * as React from "react";
// @ts-expect-error
import { renderToReadableStream } from "react-server-dom-parcel/server.edge";
// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-parcel/client.edge";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

import { RenderCached } from "./cache.client";

type CacheLife =
  | "seconds"
  | "minutes"
  | "default"
  | "hours"
  | "days"
  | "weeks"
  | "max";

const cacheLifeValues: CacheLife[] = [
  "seconds",
  "minutes",
  "default",
  "hours",
  "days",
  "weeks",
  "max",
];
const cacheLifeMap: Map<CacheLife, number> = new Map(
  cacheLifeValues.map((life, index) => [life, index])
);

const cacheLifeTimes: Map<CacheLife, number> = new Map([
  ["seconds", 1000], // 1 second
  ["minutes", 60 * 1000], // 1 minute
  ["default", 5 * 60 * 1000], // 5 minutes
  ["hours", 60 * 60 * 1000], // 1 hour
  ["days", 24 * 60 * 60 * 1000], // 1 day
  ["weeks", 7 * 24 * 60 * 60 * 1000], // 7 days
  ["max", 6 * 30 * 24 * 60 * 60 * 1000], // 6 months
]);

type CacheStorage = { life?: CacheLife };
const cacheStorage = new AsyncLocalStorage<CacheStorage>();

export function cacheLife(life: CacheLife) {
  const store = cacheStorage.getStore();
  if (!store) {
    throw new Error("cacheLife must be called within a cache context");
  }
  if (
    !store.life ||
    (cacheLifeMap.get(life) ?? Number.MIN_SAFE_INTEGER) <
      (cacheLifeMap.get(store.life) ?? Number.MAX_SAFE_INTEGER)
  ) {
    store.life = life;
  }
}

const _storage = createStorage({
  driver: fsDriver({ base: "./tmp", watchOptions: { persistent: true } }),
});

const storage = {
  async getItem(key: string) {
    const stored = await _storage.get<{
      rendered: string;
      isElement: boolean;
      expires: number;
    }>(key);
    if (!stored) return null;

    if ((stored.expires ?? 0) < Date.now()) {
      await _storage.remove(key);
      return null;
    }

    if (process.env.NODE_ENV !== "production") {
      if (stored.isElement) return null;
    }

    return stored;
  },
  setItem(
    key: string,
    value: { rendered: string; isElement: boolean; expires: number }
  ) {
    if (process.env.NODE_ENV !== "production") {
      if (value.isElement) return;
    }
    return _storage.set(key, value);
  },
};

declare global {
  var reactCache:
    | Map<string, Promise<{ rendered: string; isElement: boolean }>>
    | undefined;
}

export function cache<Func extends (...args: any[]) => any>(
  getKey: (...args: Parameters<Func>) => string,
  func: Func
): MakeAsync<Func> {
  return async (...args) => {
    const key = getKey(...args);
    globalThis.reactCache ??= new Map();
    const cached =
      (await globalThis.reactCache.get(key)) ?? (await storage.getItem(key));

    if (cached) {
      const { rendered, isElement } = cached;
      if (isElement) {
        return <RenderCached cached={rendered} />;
      }

      return await createFromReadableStream(
        new ReadableStream({
          async start(controller) {
            controller.enqueue(new TextEncoder().encode(rendered));
            controller.close();
          },
        })
      );
    }

    let result: Promise<any>;
    let syncError = false;
    const cacheContext: CacheStorage = {};
    try {
      result = cacheStorage.run(cacheContext, async () => func(...args));
      await result;
    } catch (error) {
      syncError = true;
      result = Promise.reject(error);
    }

    if (!syncError) {
      globalThis.reactCache ??= new Map();

      globalThis.reactCache.set(
        key,
        Promise.resolve<ReadableStream<Uint8Array>>(
          renderToReadableStream(result)
        )
          .then((stream): Promise<string> => new Response(stream).text())
          .then(async (rendered) => {
            const cached = {
              rendered,
              isElement: React.isValidElement(await result),
              expires:
                Date.now() +
                (cacheLifeTimes.get(cacheContext.life ?? "default") ??
                  cacheLifeTimes.get("default")!),
            };

            await storage.setItem(key, cached);

            return cached;
          })
      );
    }

    return result;
  };
}

type MakeAsync<Func extends (...args: any[]) => any> = (
  ...args: Parameters<Func>
) => Promise<Awaited<ReturnType<Func>>>;

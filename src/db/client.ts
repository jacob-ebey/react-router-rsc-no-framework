import { AsyncLocalStorage } from "node:async_hooks";

import type { LibSQLDatabase } from "drizzle-orm/libsql";

import type * as schema from "./schema";

declare global {
  var DbStorage: AsyncLocalStorage<LibSQLDatabase<typeof schema>>;
}

export const DbStorage = (globalThis.DbStorage ??= new AsyncLocalStorage<
  LibSQLDatabase<typeof schema>
>());

export function getDb() {
  const store = DbStorage.getStore();
  if (!store) {
    throw new Error(
      "Database context is not available. Ensure it is provided."
    );
  }
  return store;
}

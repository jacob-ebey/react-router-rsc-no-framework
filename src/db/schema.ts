import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
});

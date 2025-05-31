import { defineConfig } from "drizzle-kit";
import { env } from "std-env";

if (!env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});

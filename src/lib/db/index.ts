import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

let cached: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!connectionString) {
    throw new Error(
      "No Postgres connection string found. Set DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING.",
    );
  }
  if (!cached) {
    const sql = neon(connectionString);
    cached = drizzle(sql, { schema });
  }
  return cached;
}

export const hasDatabase = Boolean(connectionString);
export { schema };

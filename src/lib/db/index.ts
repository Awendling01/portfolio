import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let cached: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment to enable database features.",
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

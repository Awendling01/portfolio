import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations need a DIRECT (non-pooled) connection — Neon's pooler (PgBouncer)
    // strips session features drizzle-kit migrate needs to wrap DDL in transactions.
    // Prefer the non-pooled vars first; pooled vars are a last-resort fallback.
    // Runtime queries (src/lib/db/index.ts) intentionally invert this priority —
    // serverless functions want PgBouncer for connection reuse.
    url:
      process.env.DATABASE_URL_UNPOOLED ??       // Neon Native Vercel Integration
      process.env.POSTGRES_URL_NON_POOLING ??    // Legacy Vercel Postgres template name
      process.env.DATABASE_URL ??                // pooled — last-resort fallback
      process.env.POSTGRES_URL ??                // pooled — last-resort fallback
      "",
  },
  strict: true,
  verbose: true,
} satisfies Config;

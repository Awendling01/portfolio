import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export type LoginRateCheck =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; recentFailures: number };

export const LOGIN_WINDOW_SECONDS = 15 * 60; // 15 minutes
export const LOGIN_MAX_FAILURES = 5;

/**
 * DB-backed rate limit: count failed login attempts for this hashed IP within
 * the last LOGIN_WINDOW_SECONDS. If the threshold is hit, deny until the
 * oldest failure in the window ages out.
 *
 * Persists across deploys and serverless instances; in-memory wouldn't.
 */
export async function checkLoginRate(
  ipHash: string | null,
): Promise<LoginRateCheck> {
  if (!ipHash || !hasDatabase) return { allowed: true };

  const db = getDb();
  const rows = await db
    .select({
      failures: sql<number>`count(*)::int`,
      oldestFailureAt: sql<
        Date | null
      >`min(created_at) filter (where succeeded = false)`,
    })
    .from(schema.loginAttempts)
    .where(
      sql`${schema.loginAttempts.ipHash} = ${ipHash}
        and ${schema.loginAttempts.succeeded} = false
        and ${schema.loginAttempts.createdAt} > now() - interval '${sql.raw(
          String(LOGIN_WINDOW_SECONDS),
        )} seconds'`,
    );

  const stats = rows[0];
  if (!stats) return { allowed: true };

  if (stats.failures < LOGIN_MAX_FAILURES) return { allowed: true };

  // Window full. Wait for the oldest failure to fall off.
  const oldestMs = stats.oldestFailureAt
    ? new Date(stats.oldestFailureAt).getTime()
    : Date.now();
  const retryAt = oldestMs + LOGIN_WINDOW_SECONDS * 1000;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((retryAt - Date.now()) / 1000),
  );

  return {
    allowed: false,
    retryAfterSeconds,
    recentFailures: stats.failures,
  };
}

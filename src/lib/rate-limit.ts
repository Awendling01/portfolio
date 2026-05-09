import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export type RateCheck =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; recentCount: number };

const LOGIN_WINDOW_SECONDS = 15 * 60; // 15 min
const LOGIN_MAX_FAILURES = 5;

const CONTACT_WINDOW_SECONDS = 60 * 60; // 1 hour
const CONTACT_MAX_PER_WINDOW = 5;

const VIEWS_WINDOW_SECONDS = 60; // 1 min
const VIEWS_MAX_PER_WINDOW = 60;

/**
 * DB-backed rate limit on failed login attempts.
 */
export async function checkLoginRate(
  ipHash: string | null,
): Promise<RateCheck> {
  if (!ipHash || !hasDatabase) return { allowed: true };

  const db = getDb();
  const rows = await db
    .select({
      failures: sql<number>`count(*)::int`,
      oldestAt: sql<
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
  if (!stats || stats.failures < LOGIN_MAX_FAILURES) return { allowed: true };

  return computeRetry(stats.oldestAt, LOGIN_WINDOW_SECONDS, stats.failures);
}

/**
 * Rate limit successful contact-form submissions per hashed-IP per hour.
 * Failed validation never hits the DB, so the limit only counts real
 * submissions. An attacker can't bypass by spamming invalid data.
 */
export async function checkContactRate(
  ipHash: string | null,
): Promise<RateCheck> {
  if (!ipHash || !hasDatabase) return { allowed: true };

  const db = getDb();
  const rows = await db
    .select({
      count: sql<number>`count(*)::int`,
      oldestAt: sql<Date | null>`min(created_at)`,
    })
    .from(schema.messages)
    .where(
      sql`${schema.messages.ipHash} = ${ipHash}
        and ${schema.messages.createdAt} > now() - interval '${sql.raw(
          String(CONTACT_WINDOW_SECONDS),
        )} seconds'`,
    );

  const stats = rows[0];
  if (!stats || stats.count < CONTACT_MAX_PER_WINDOW) return { allowed: true };

  return computeRetry(stats.oldestAt, CONTACT_WINDOW_SECONDS, stats.count);
}

/**
 * Rate limit /api/views by hashed-IP. Stops attackers from inflating views,
 * polluting the visit log, and burning the IPinfo quota.
 */
export async function checkViewsRate(
  ipHash: string | null,
): Promise<RateCheck> {
  if (!ipHash || !hasDatabase) return { allowed: true };

  const db = getDb();
  const rows = await db
    .select({
      count: sql<number>`count(*)::int`,
      oldestAt: sql<Date | null>`min(created_at)`,
    })
    .from(schema.visits)
    .where(
      sql`${schema.visits.ipHash} = ${ipHash}
        and ${schema.visits.createdAt} > now() - interval '${sql.raw(
          String(VIEWS_WINDOW_SECONDS),
        )} seconds'`,
    );

  const stats = rows[0];
  if (!stats || stats.count < VIEWS_MAX_PER_WINDOW) return { allowed: true };

  return computeRetry(stats.oldestAt, VIEWS_WINDOW_SECONDS, stats.count);
}

function computeRetry(
  oldestAt: Date | null,
  windowSeconds: number,
  count: number,
): RateCheck {
  const oldestMs = oldestAt ? new Date(oldestAt).getTime() : Date.now();
  const retryAt = oldestMs + windowSeconds * 1000;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((retryAt - Date.now()) / 1000),
  );
  return { allowed: false, retryAfterSeconds, recentCount: count };
}

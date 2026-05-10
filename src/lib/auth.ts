import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Probability that a `createSession` call also runs the expired-row sweep.
// Cheap enough at any rate, but no point doing it on every login either.
const CLEANUP_PROBABILITY = 0.1;

// Prefix on the HMAC fallback session value. Distinguishes it from the
// 43-char base64url DB-backed token (which never contains a dot).
const HMAC_PREFIX = "hmac";

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

// ─── HMAC-signed fallback session (no-DB envs) ───────────────────────────
//
// When DATABASE_URL is unset (e.g. local dev without Postgres), we can't
// persist `admin_sessions` rows. Falling back to a stateless HMAC-signed
// cookie keeps the admin reachable for local testing. The trade-off vs.
// the DB-backed path: no per-session revocation, no per-session metadata.
// In production DATABASE_URL is set, so this path never runs.

function hmacSessionKey(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", "andrew-portfolio-session-v1")
    .update(password)
    .digest();
}

function createHmacSession(): string {
  const key = hmacSessionKey();
  if (!key) throw new Error("ADMIN_PASSWORD not set");
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `admin:${expiresAt}`;
  const sig = createHmac("sha256", key).update(payload).digest("hex");
  return `${HMAC_PREFIX}.${expiresAt}.${sig}`;
}

function verifyHmacSession(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== HMAC_PREFIX) return false;
  const expiresAt = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(expiresAt)) return false;
  if (expiresAt < Math.floor(Date.now() / 1000)) return false;

  const key = hmacSessionKey();
  if (!key) return false;
  const expected = createHmac("sha256", key)
    .update(`admin:${expiresAt}`)
    .digest("hex");
  if (parts[2].length !== expected.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(parts[2], "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

/**
 * Cryptographically random session token. 32 bytes = 256 bits, base64url-encoded
 * (no padding, URL-safe). The raw token goes in the cookie; only the SHA-256
 * hash is persisted, so a DB read can't be used to forge cookies.
 */
function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Create a server-side session, returning the raw cookie value.
 *
 * SECURITY: stores only `sha256(token)` — a leaked DB row gives an attacker
 * the hash, which can't be used to forge a valid cookie. The full token only
 * exists in the cookie itself.
 */
export async function createSession(opts: {
  ipHash: string | null;
  userAgent: string | null;
}): Promise<string> {
  // No DB → fall back to stateless HMAC-signed cookie. Keeps local dev
  // reachable without forcing a Postgres connection just to log in.
  if (!hasDatabase) {
    return createHmacSession();
  }

  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const db = getDb();
  await db.insert(schema.adminSessions).values({
    tokenHash,
    expiresAt,
    ipHash: opts.ipHash,
    userAgent: opts.userAgent,
  });

  // Probabilistic cleanup of expired rows so the table doesn't grow forever.
  if (Math.random() < CLEANUP_PROBABILITY) {
    try {
      await db
        .delete(schema.adminSessions)
        .where(lt(schema.adminSessions.expiresAt, new Date()));
    } catch (err) {
      console.error("auth: expired-session cleanup failed", err);
    }
  }

  return token;
}

/**
 * Verify a cookie-supplied session token against the DB. Returns true only if:
 * - DB is configured
 * - The hashed token exists
 * - The expiry is in the future
 *
 * Wiping `admin_sessions` (or deleting a single row) revokes every / one
 * active session. Rotating `ADMIN_PASSWORD` no longer auto-invalidates
 * sessions — call `revokeAllSessions()` explicitly if you want that.
 */
export async function verifySession(
  rawToken: string | null | undefined,
): Promise<boolean> {
  if (!rawToken) return false;

  // HMAC-signed fallback (no-DB envs and any tokens issued during a no-DB
  // session). Identified by the "hmac." prefix.
  if (rawToken.startsWith(`${HMAC_PREFIX}.`)) {
    return verifyHmacSession(rawToken);
  }

  // Sanity bound — randomBytes(32).toString("base64url") yields a 43-char token.
  if (rawToken.length < 32 || rawToken.length > 128) return false;
  if (!hasDatabase) return false;

  try {
    const db = getDb();
    const tokenHash = hashToken(rawToken);
    const rows = await db
      .select({
        expiresAt: schema.adminSessions.expiresAt,
      })
      .from(schema.adminSessions)
      .where(eq(schema.adminSessions.tokenHash, tokenHash))
      .limit(1);

    const row = rows[0];
    if (!row) return false;
    if (row.expiresAt.getTime() < Date.now()) return false;
    return true;
  } catch (err) {
    console.error("auth: verifySession failed", err);
    return false;
  }
}

/** Delete a single session by its raw token (called from logout). */
export async function revokeSession(
  rawToken: string | null | undefined,
): Promise<void> {
  if (!rawToken) return;
  if (!hasDatabase) return;
  try {
    const db = getDb();
    const tokenHash = hashToken(rawToken);
    await db
      .delete(schema.adminSessions)
      .where(eq(schema.adminSessions.tokenHash, tokenHash));
  } catch (err) {
    console.error("auth: revokeSession failed", err);
  }
}

/**
 * Constant-time compare for the submitted password against the env value.
 * Both inputs are encoded to a fixed length (sha256 of bytes) before
 * comparison so the comparison never short-circuits on length.
 */
export function passwordMatches(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHmac("sha256", "compare").update(submitted).digest();
  const b = createHmac("sha256", "compare").update(expected).digest();
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

const SAFE_NEXT = /^\/admin(\/[a-z0-9/_-]*)?$/i;

export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/admin";
  if (!SAFE_NEXT.test(next)) return "/admin";
  return next;
}

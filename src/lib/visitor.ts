import { createHmac, randomUUID } from "node:crypto";

export const VISITOR_COOKIE_NAME = "vid";
export const VISITOR_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 days

const HASH_LABEL = "andrew-portfolio-ip-hash-v1";

function hashSecret(): string {
  // Prefer a dedicated secret; fall back to ADMIN_PASSWORD so hashing still
  // works in dev. Either one keeps raw IPs out of the database.
  return (
    process.env.VISIT_HASH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "fallback-dev-secret-change-me"
  );
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return createHmac("sha256", hashSecret())
    .update(`${HASH_LABEL}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidVisitorId(value: string | null | undefined): boolean {
  return Boolean(value && UUID_RE.test(value));
}

export function newVisitorId(): string {
  return randomUUID();
}

/** Pull the client IP from the standard proxy headers. */
export function getClientIp(headers: Headers): string | null {
  const candidates = [
    headers.get("x-vercel-forwarded-for"),
    headers.get("x-forwarded-for"),
    headers.get("x-real-ip"),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    // x-forwarded-for can be a comma-separated list; the first entry is the
    // original client.
    const first = raw.split(",")[0]?.trim();
    if (first) return first;
  }
  return null;
}

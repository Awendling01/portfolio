import { createHmac, randomUUID } from "node:crypto";

export const VISITOR_COOKIE_NAME = "vid";
export const VISITOR_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 days

const HASH_LABEL = "andrew-portfolio-ip-hash-v1";

// One-time warning latch. Avoid logging on every request — the env state
// doesn't change between requests in the same process.
let warnedFallback = false;

function hashSecret(): string | null {
  // Prefer a dedicated secret; fall back to ADMIN_PASSWORD only because rotating
  // it then also rotates IP hashes (acceptable). Never use a hard-coded literal:
  // this repo is public, so a baked-in default would let anyone pre-compute the
  // hashes of arbitrary IP ranges.
  const dedicated = process.env.VISIT_HASH_SECRET;
  if (dedicated) return dedicated;

  const fallback = process.env.ADMIN_PASSWORD;
  if (fallback) {
    if (!warnedFallback && process.env.NODE_ENV === "production") {
      warnedFallback = true;
      console.warn(
        "visitor: VISIT_HASH_SECRET is not set — falling back to ADMIN_PASSWORD as the IP-hash key. Rotating ADMIN_PASSWORD will invalidate every historical IP hash.",
      );
    }
    return fallback;
  }
  return null;
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const secret = hashSecret();
  if (!secret) return null; // No secret configured — skip hashing entirely.
  return createHmac("sha256", secret)
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

/**
 * Pull the client IP from the standard proxy headers.
 *
 * SECURITY: This function trusts platform-set proxy headers
 * (`x-vercel-forwarded-for`, `x-forwarded-for`, `x-real-ip`). On Vercel these
 * are set by the platform's edge before the request reaches us, and any
 * client-supplied versions are stripped — they can be trusted as the real
 * source IP. If this app is ever deployed behind a different ingress (or
 * exposed on `localhost` to a network), an attacker can spoof these headers
 * to bypass per-IP rate limits and pollute the visit log. Re-validate the
 * trust boundary if the deploy target changes.
 */
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

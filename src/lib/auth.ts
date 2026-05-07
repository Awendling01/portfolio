import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const KEY_PREFIX = "andrew-portfolio-session-v1";

function deriveKey(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  // Derive a 32-byte key from the admin password. Rotating the password
  // automatically invalidates every existing session.
  return createHmac("sha256", KEY_PREFIX).update(password).digest();
}

function sign(payload: string, key: Buffer): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

export function createSessionValue(): string {
  const key = deriveKey();
  if (!key) throw new Error("ADMIN_PASSWORD not set");
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `admin:${expiresAt}`;
  const signature = sign(payload, key);
  return `${expiresAt}.${signature}`;
}

export function verifySessionValue(value: string | null | undefined): boolean {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const expiresAtStr = value.slice(0, dot);
  const signature = value.slice(dot + 1);

  const expiresAt = Number.parseInt(expiresAtStr, 10);
  if (!Number.isFinite(expiresAt)) return false;
  if (expiresAt < Math.floor(Date.now() / 1000)) return false;

  const key = deriveKey();
  if (!key) return false;

  const expected = sign(`admin:${expiresAt}`, key);
  if (signature.length !== expected.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
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

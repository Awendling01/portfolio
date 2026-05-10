-- Server-side admin session records. Cookie holds an opaque random ID; the
-- DB stores its SHA-256 hash plus expiry. Every admin request looks up the
-- hash here, so a leaked cookie is invalidated by either expiry, deletion
-- on logout, or wiping this table to revoke every active session.

CREATE TABLE IF NOT EXISTS "admin_sessions" (
  "id" serial PRIMARY KEY,
  "token_hash" text NOT NULL UNIQUE,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at" timestamp with time zone NOT NULL,
  "last_seen_at" timestamp with time zone NOT NULL DEFAULT now(),
  "user_agent" text,
  "ip_hash" text
);

CREATE INDEX IF NOT EXISTS "admin_sessions_expires_at_idx"
  ON "admin_sessions" ("expires_at");

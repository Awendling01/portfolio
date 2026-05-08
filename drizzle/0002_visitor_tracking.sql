-- Per-visit columns for session grouping + IP enrichment + dwell time
ALTER TABLE "visits"
  ADD COLUMN IF NOT EXISTS "session_id" text,
  ADD COLUMN IF NOT EXISTS "ip_hash" text,
  ADD COLUMN IF NOT EXISTS "org" text,
  ADD COLUMN IF NOT EXISTS "asn" text,
  ADD COLUMN IF NOT EXISTS "as_domain" text,
  ADD COLUMN IF NOT EXISTS "dwell_ms" integer;

CREATE INDEX IF NOT EXISTS "visits_session_id_idx" ON "visits" ("session_id");
CREATE INDEX IF NOT EXISTS "visits_ip_hash_idx" ON "visits" ("ip_hash");

-- Login attempt log: every POST to /login lands here, success or fail
CREATE TABLE IF NOT EXISTS "login_attempts" (
  "id" serial PRIMARY KEY,
  "ip_hash" text,
  "succeeded" boolean NOT NULL,
  "user_agent" text,
  "country" text,
  "org" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "login_attempts_created_at_idx" ON "login_attempts" ("created_at");
CREATE INDEX IF NOT EXISTS "login_attempts_ip_hash_idx" ON "login_attempts" ("ip_hash");

-- Track sender's hashed IP on contact-form messages so we can rate-limit
-- by source without storing raw IPs.
ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "ip_hash" text;

CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages" ("created_at");
CREATE INDEX IF NOT EXISTS "messages_ip_hash_idx" ON "messages" ("ip_hash");

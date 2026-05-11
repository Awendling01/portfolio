-- Add read / responded / deleted state to contact-form messages so the
-- admin inbox can be triaged. Timestamps not booleans: records WHEN the
-- transition happened in one column. `deleted_at` is the standard soft-
-- delete pattern — restore is just `set deleted_at = null`.

ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "read_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "responded_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;

CREATE INDEX IF NOT EXISTS "messages_deleted_at_idx" ON "messages" ("deleted_at");

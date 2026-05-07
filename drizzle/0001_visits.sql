CREATE TABLE IF NOT EXISTS "visits" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "path" text,
  "referrer" text,
  "user_agent" text,
  "country" text,
  "region" text,
  "city" text,
  "is_bot" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "visits_created_at_idx" ON "visits" ("created_at");
CREATE INDEX IF NOT EXISTS "visits_slug_idx" ON "visits" ("slug");

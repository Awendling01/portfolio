CREATE TABLE IF NOT EXISTS "views" (
  "slug" text PRIMARY KEY NOT NULL,
  "count" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

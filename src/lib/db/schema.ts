import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const views = pgTable("views", {
  slug: text("slug").primaryKey(),
  count: integer("count").notNull().default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const visits = pgTable(
  "visits",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    path: text("path"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    sessionId: text("session_id"),
    ipHash: text("ip_hash"),
    org: text("org"),
    asn: text("asn"),
    asDomain: text("as_domain"),
    dwellMs: integer("dwell_ms"),
    isBot: boolean("is_bot").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("visits_created_at_idx").on(t.createdAt),
    slugIdx: index("visits_slug_idx").on(t.slug),
    sessionIdx: index("visits_session_id_idx").on(t.sessionId),
    ipHashIdx: index("visits_ip_hash_idx").on(t.ipHash),
  }),
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    ipHash: text("ip_hash"),
    succeeded: boolean("succeeded").notNull(),
    userAgent: text("user_agent"),
    country: text("country"),
    org: text("org"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("login_attempts_created_at_idx").on(t.createdAt),
    ipHashIdx: index("login_attempts_ip_hash_idx").on(t.ipHash),
  }),
);

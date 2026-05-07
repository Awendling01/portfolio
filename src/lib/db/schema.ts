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
    isBot: boolean("is_bot").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("visits_created_at_idx").on(t.createdAt),
    slugIdx: index("visits_slug_idx").on(t.slug),
  }),
);

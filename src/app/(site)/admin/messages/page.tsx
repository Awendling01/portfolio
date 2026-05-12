import { desc, sql, isNull, isNotNull, and } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import MessageCard from "@/components/admin/MessageCard";
import NotConfigured from "@/components/admin/NotConfigured";
import FilterTab from "@/components/ui/FilterTab";

export const dynamic = "force-dynamic";

type Filter = "inbox" | "unread" | "responded" | "trash";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "unread", label: "Unread" },
  { key: "responded", label: "Responded" },
  { key: "trash", label: "Trash" },
];

function parseFilter(raw: string | undefined): Filter {
  if (raw === "unread" || raw === "responded" || raw === "trash") return raw;
  return "inbox";
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  if (!hasDatabase) {
    return <NotConfigured context="to view contact messages" />;
  }

  const { filter: rawFilter } = await searchParams;
  const filter = parseFilter(rawFilter);
  const db = getDb();

  // One pass for all four tab counts so the badges stay correct as
  // messages flip between states.
  const [counts] = await db
    .select({
      inbox: sql<number>`count(*) filter (where deleted_at is null)::int`,
      unread: sql<number>`count(*) filter (where read_at is null and deleted_at is null)::int`,
      responded: sql<number>`count(*) filter (where responded_at is not null and deleted_at is null)::int`,
      trash: sql<number>`count(*) filter (where deleted_at is not null)::int`,
    })
    .from(schema.messages);

  const where =
    filter === "inbox"
      ? isNull(schema.messages.deletedAt)
      : filter === "unread"
        ? and(
            isNull(schema.messages.readAt),
            isNull(schema.messages.deletedAt),
          )
        : filter === "responded"
          ? and(
              isNotNull(schema.messages.respondedAt),
              isNull(schema.messages.deletedAt),
            )
          : isNotNull(schema.messages.deletedAt);

  const rows = await db
    .select()
    .from(schema.messages)
    .where(where)
    .orderBy(desc(schema.messages.createdAt))
    .limit(500);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Messages
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Contact form submissions · {rows.length} in {filter}
        </p>
      </div>

      {/* Filter tabs — counts pulled in the same query as the rows so they
          stay in sync after every state transition. */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <FilterTab
            key={f.key}
            href={
              f.key === "inbox"
                ? "/admin/messages"
                : `/admin/messages?filter=${f.key}`
            }
            active={f.key === filter}
            label={f.label}
            count={counts[f.key]}
          />
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 text-center text-sm text-[var(--text)]">
          {filter === "trash"
            ? "Trash is empty."
            : filter === "unread"
              ? "Nothing unread — inbox zero."
              : filter === "responded"
                ? "No responded messages yet."
                : "No messages yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
        </div>
      )}
    </div>
  );
}

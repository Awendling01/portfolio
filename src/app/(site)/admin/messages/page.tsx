import { desc, sql, isNull, isNotNull, and } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import NotConfigured from "@/components/admin/NotConfigured";
import FilterTab from "@/components/ui/FilterTab";
import { timeAgo } from "@/lib/format";
import {
  markMessageRead,
  toggleMessageResponded,
  softDeleteMessage,
  restoreMessage,
} from "./actions";

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
          {rows.map((m) => {
            const created = new Date(m.createdAt);
            const isUnread = !m.readAt && !m.deletedAt;
            const isResponded = !!m.respondedAt;
            const isDeleted = !!m.deletedAt;
            return (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-colors ${
                  isDeleted
                    ? "border-[var(--border)]/60 bg-[var(--surface)]/40 opacity-70"
                    : isUnread
                      ? "border-[var(--accent)]/30 bg-[var(--surface)]/80"
                      : "border-[var(--border)] bg-[var(--surface)]/80"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-base font-semibold text-white tracking-tight">
                      {m.name}
                    </span>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm text-[var(--accent)] hover:underline break-all"
                    >
                      {m.email}
                    </a>
                    {isUnread ? (
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] bg-[var(--accent)]/[0.12] px-2 py-0.5 rounded">
                        New
                      </span>
                    ) : null}
                    {isResponded ? (
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--green)] bg-[var(--green)]/[0.10] px-2 py-0.5 rounded">
                        Responded
                      </span>
                    ) : null}
                  </div>
                  <span
                    className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]"
                    title={created.toISOString()}
                  >
                    {timeAgo(created)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--text2)] leading-relaxed whitespace-pre-wrap break-words">
                  {m.message}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 mono text-[11px] text-[var(--text)]">
                  <span>#{m.id}</span>
                  <a
                    href={`mailto:${m.email}?subject=Re: your message via andrewwendling.info`}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    Reply →
                  </a>

                  {!isDeleted && isUnread ? (
                    <form action={markMessageRead} className="contents">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Mark read
                      </button>
                    </form>
                  ) : null}

                  {!isDeleted ? (
                    <form action={toggleMessageResponded} className="contents">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className={`transition-colors cursor-pointer ${
                          isResponded
                            ? "text-[var(--green)] hover:text-white"
                            : "hover:text-[var(--green)]"
                        }`}
                      >
                        {isResponded ? "Mark unresponded" : "Mark responded"}
                      </button>
                    </form>
                  ) : null}

                  {isDeleted ? (
                    <form action={restoreMessage} className="contents">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Restore
                      </button>
                    </form>
                  ) : (
                    <form action={softDeleteMessage} className="contents">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="hover:text-[var(--rose)] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

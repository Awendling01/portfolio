import { desc } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return date.toISOString().slice(0, 10);
}

export default async function MessagesPage() {
  if (!hasDatabase) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
        Database not configured. Set <code>DATABASE_URL</code> in Vercel.
      </div>
    );
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(schema.messages)
    .orderBy(desc(schema.messages.createdAt))
    .limit(500);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Messages
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Contact form submissions · {rows.length} most recent
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 text-center text-sm text-[var(--text)]">
          No messages yet. Submit a test from{" "}
          <a
            href="/contact"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            /contact
          </a>{" "}
          to verify the form.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => {
            const created = new Date(m.createdAt);
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-5 sm:p-6"
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
                <div className="mt-4 flex flex-wrap items-center gap-3 mono text-[11px] text-[var(--text)]">
                  <span>#{m.id}</span>
                  <a
                    href={`mailto:${m.email}?subject=Re: your message via andrewwendling.info`}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    Reply →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

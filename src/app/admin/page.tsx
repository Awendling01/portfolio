import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadStats() {
  if (!hasDatabase) return null;
  const db = getDb();

  const [visitTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      humans: sql<number>`count(*) filter (where is_bot = false)::int`,
      bots: sql<number>`count(*) filter (where is_bot = true)::int`,
      humans24h: sql<number>`count(*) filter (where created_at > now() - interval '24 hours' and is_bot = false)::int`,
      humans7d: sql<number>`count(*) filter (where created_at > now() - interval '7 days' and is_bot = false)::int`,
      humanSessions7d: sql<number>`count(distinct session_id) filter (where session_id is not null and created_at > now() - interval '7 days' and is_bot = false)::int`,
      corpSessions7d: sql<number>`count(distinct session_id) filter (where session_id is not null and created_at > now() - interval '7 days' and is_bot = false and as_domain is not null)::int`,
    })
    .from(schema.visits);

  const [messageTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last7d: sql<number>`count(*) filter (where created_at > now() - interval '7 days')::int`,
    })
    .from(schema.messages);

  const [loginStats] = await db
    .select({
      failures24h: sql<number>`count(*) filter (where succeeded = false and created_at > now() - interval '24 hours')::int`,
      uniqueAttackers7d: sql<number>`count(distinct ip_hash) filter (where succeeded = false and created_at > now() - interval '7 days')::int`,
    })
    .from(schema.loginAttempts);

  // Top organizations visiting the site (excluding bots and direct/no-org)
  const topOrgs = await db
    .select({
      org: schema.visits.org,
      asDomain: schema.visits.asDomain,
      sessions: sql<number>`count(distinct session_id)::int`,
      lastSeen: sql<Date>`max(created_at)`,
    })
    .from(schema.visits)
    .where(
      sql`is_bot = false and org is not null and session_id is not null
        and created_at > now() - interval '30 days'`,
    )
    .groupBy(schema.visits.org, schema.visits.asDomain)
    .orderBy(sql`count(distinct session_id) desc`)
    .limit(8);

  return { visitTotals, messageTotals, loginStats, topOrgs };
}

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6";

export default async function AdminIndex() {
  const stats = await loadStats();

  if (!stats) {
    return (
      <div className={card}>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Database not configured
        </h1>
        <p className="mt-2 text-sm text-[var(--text)]">
          Set <code>DATABASE_URL</code> (or one of the
          <code> POSTGRES_*</code> equivalents) in Vercel to enable admin data.
        </p>
      </div>
    );
  }

  const { visitTotals, messageTotals, loginStats, topOrgs } = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Live counts from Postgres. Sessions are unique browsers, not
          page-loads.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Sessions (7d)"
          value={visitTotals.humanSessions7d}
          accent="accent"
          sub={`${visitTotals.humans7d} pageviews`}
        />
        <Stat
          label="Corporate sessions"
          value={visitTotals.corpSessions7d}
          accent="accent2"
          sub="last 30d, with org info"
        />
        <Stat
          label="Bot pings"
          value={visitTotals.bots}
          accent="amber"
          sub="all time"
        />
        <Stat
          label="Failed logins (24h)"
          value={loginStats.failures24h}
          accent={loginStats.failures24h > 0 ? "rose" : "muted"}
          sub={`${loginStats.uniqueAttackers7d} unique IPs (7d)`}
        />
      </div>

      <section>
        <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
          Top organizations (last 30 days)
        </h2>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)]/40">
              <tr className="text-left mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium text-right">Sessions</th>
                <th className="px-4 py-3 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {topOrgs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-[var(--text)]"
                  >
                    No identified organizations yet. Real corporate visits
                    appear here once IPinfo enrichment is enabled.
                  </td>
                </tr>
              ) : (
                topOrgs.map((o) => (
                  <tr
                    key={`${o.org}-${o.asDomain}`}
                    className="border-t border-[var(--border)]/60"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {o.org}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--text2)]">
                      {o.asDomain ?? "—"}
                    </td>
                    <td className="px-4 py-3 mono text-sm text-[var(--accent)] text-right font-bold">
                      {o.sessions}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text2)]">
                      {new Date(o.lastSeen).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/visitors"
          className={`${card} hover:border-[var(--accent)]/60 transition-colors`}
        >
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Visitors
          </div>
          <div className="mt-3 text-3xl font-bold text-white tracking-tight">
            {visitTotals.humans.toLocaleString()}
          </div>
          <p className="mt-2 text-xs text-[var(--text)]">
            All-time human visits ({visitTotals.total.toLocaleString()} total
            including bots)
          </p>
          <div className="mt-4 mono text-xs text-[var(--text2)]">
            Open table →
          </div>
        </Link>

        <Link
          href="/admin/messages"
          className={`${card} hover:border-[var(--accent)]/60 transition-colors`}
        >
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Messages
          </div>
          <div className="mt-3 text-3xl font-bold text-white tracking-tight">
            {messageTotals.total.toLocaleString()}
          </div>
          <p className="mt-2 text-xs text-[var(--text)]">
            All-time contact form submissions
          </p>
          <div className="mt-4 mono text-xs text-[var(--text2)]">
            Open table →
          </div>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: number;
  accent: "accent" | "accent2" | "green" | "amber" | "rose" | "muted";
  sub?: string;
}) {
  const color = {
    accent: "text-[var(--accent)]",
    accent2: "text-[var(--accent2)]",
    green: "text-[var(--green)]",
    amber: "text-[var(--amber)]",
    rose: "text-[var(--rose)]",
    muted: "text-[var(--text2)]",
  }[accent];

  return (
    <div className={card}>
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>
        {value.toLocaleString()}
      </div>
      {sub ? <div className="mt-1 text-xs text-[var(--text)]">{sub}</div> : null}
    </div>
  );
}

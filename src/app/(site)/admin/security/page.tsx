import { desc, sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import Stat from "@/components/admin/Stat";
import NotConfigured from "@/components/admin/NotConfigured";
import { shortUA, formatTimeWithSeconds } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  if (!hasDatabase) {
    return <NotConfigured context="to view login attempts" />;
  }

  const db = getDb();

  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      failures: sql<number>`count(*) filter (where succeeded = false)::int`,
      successes: sql<number>`count(*) filter (where succeeded = true)::int`,
      last24hFailures: sql<number>`count(*) filter (where succeeded = false and created_at > now() - interval '24 hours')::int`,
      uniqueAttackers: sql<number>`count(distinct ip_hash) filter (where succeeded = false)::int`,
    })
    .from(schema.loginAttempts);

  const recent = await db
    .select()
    .from(schema.loginAttempts)
    .orderBy(desc(schema.loginAttempts.createdAt))
    .limit(100);

  const topAttackers = await db
    .select({
      ipHash: schema.loginAttempts.ipHash,
      org: sql<string | null>`max(org)`,
      country: sql<string | null>`max(country)`,
      failures: sql<number>`count(*) filter (where succeeded = false)::int`,
      lastAttempt: sql<Date>`max(created_at)`,
    })
    .from(schema.loginAttempts)
    .where(sql`succeeded = false`)
    .groupBy(schema.loginAttempts.ipHash)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Security
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Login attempts on <code>/login</code>. Each attempt is rate-limited to
          5 per hashed-IP per 15 minutes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Failed (24h)"
          value={stats.last24hFailures}
          tone={stats.last24hFailures > 0 ? "amber" : "muted"}
        />
        <Stat label="Failed total" value={stats.failures} />
        <Stat label="Successful" value={stats.successes} tone="green" />
        <Stat
          label="Unique attackers"
          value={stats.uniqueAttackers}
          tone={stats.uniqueAttackers > 5 ? "amber" : "muted"}
        />
      </div>

      <section>
        <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
          Top attackers (most failed attempts)
        </h2>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)]/40">
              <tr className="text-left mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
                <th className="px-4 py-3 font-medium">IP hash</th>
                <th className="px-4 py-3 font-medium">Org</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium text-right">Failures</th>
                <th className="px-4 py-3 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {topAttackers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-[var(--text)]"
                  >
                    No failed login attempts yet.
                  </td>
                </tr>
              ) : (
                topAttackers.map((a) => (
                  <tr
                    key={a.ipHash ?? "null"}
                    className="border-t border-[var(--border)]/60"
                  >
                    <td className="px-4 py-3 mono text-xs text-[var(--text2)]">
                      {a.ipHash ? a.ipHash.slice(0, 12) + "…" : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-white">
                      {a.org ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text2)]">
                      {a.country ?? "—"}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--rose)] text-right font-bold">
                      {a.failures}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--text2)]">
                      {formatTimeWithSeconds(new Date(a.lastAttempt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
          Recent attempts (last 100)
        </h2>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)]/40">
              <tr className="text-left mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">Org</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">IP hash</th>
                <th className="px-4 py-3 font-medium">Browser</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-[var(--text)]"
                  >
                    No login activity yet.
                  </td>
                </tr>
              ) : (
                recent.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-[var(--border)]/60 hover:bg-[var(--surface2)]/40"
                  >
                    <td
                      className="px-4 py-3 mono text-xs text-[var(--text2)] whitespace-nowrap"
                      title={a.createdAt.toISOString()}
                    >
                      {formatTimeWithSeconds(a.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {a.succeeded ? (
                        <span className="inline-flex items-center mono text-[10px] uppercase tracking-[0.16em] text-[var(--green)] border border-[var(--green)]/40 bg-[var(--green)]/10 rounded-full px-2 py-0.5">
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center mono text-[10px] uppercase tracking-[0.16em] text-[var(--rose)] border border-[var(--rose)]/40 bg-[var(--rose)]/10 rounded-full px-2 py-0.5">
                          Fail
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-white">
                      {a.org ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text2)]">
                      {a.country ?? "—"}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--text)]">
                      {a.ipHash ? a.ipHash.slice(0, 12) + "…" : "—"}
                    </td>
                    <td
                      className="px-4 py-3 text-xs text-[var(--text2)]"
                      title={a.userAgent ?? undefined}
                    >
                      {shortUA(a.userAgent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

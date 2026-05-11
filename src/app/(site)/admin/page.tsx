import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import Stat from "@/components/admin/Stat";
import NotConfigured from "@/components/admin/NotConfigured";
import { formatTime } from "@/lib/format";

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

const cardClass =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6";

export default async function AdminIndex() {
  const stats = await loadStats();

  if (!stats) {
    return <NotConfigured context="to enable admin data" />;
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
          tone="accent"
          sub={`${visitTotals.humans7d} pageviews`}
          info={{
            has: "The count of distinct human browser sessions that hit the public site in the last 7 days. The sub-line shows total pageviews in the same window — sessions counts unique browsers, pageviews counts each page load (one session can contribute many pageviews).",
            does: "Tells you roughly how many recent visitors you've had. Sessions is closer to 'people' than pageviews is — one person reading three pages back-to-back is one session, three pageviews. The two together give a quick read on volume vs. depth of engagement.",
            how: "Computed in loadStats() at the top of src/app/(site)/admin/page.tsx. SQL is `count(distinct session_id) filter (where session_id is not null and created_at > now() - interval '7 days' and is_bot = false)` from the visits table. Sessions are identified by the httpOnly 'vid' cookie set on first visit (90-day UUID, see src/lib/visitor.ts). Bots are excluded via the is_bot flag set at insert time by src/lib/bot.ts (UA regex + cloud-ASN heuristic).",
          }}
        />
        <Stat
          label="Corporate sessions"
          value={visitTotals.corpSessions7d}
          tone="accent2"
          sub="last 30d, with org info"
          info={{
            has: "The count of distinct human browser sessions in the last 30 days whose IP enrichment returned a non-residential 'as_domain' value — i.e., the visitor's IP belongs to a corporate ASN, not a consumer ISP. Recruiter signal: someone scoping you out from a company network.",
            does: "Flags visits coming from corporate networks vs. residential ones. Useful for noticing when a hiring manager at $company is reading your portfolio from their office. Not every corp visit is a recruiter, and not every recruiter visit comes from corp IP (they might be on home wifi), but the trendline is suggestive.",
            how: "loadStats() in src/app/(site)/admin/page.tsx. SQL counts distinct session_id where as_domain is not null and is_bot = false over the 30-day window. The as_domain value is populated at visit-insert time by src/lib/ipinfo.ts (calls IPinfo Lite API, see IPINFO_TOKEN env var). The full per-org breakdown lives in the 'Top organizations' table further down this page.",
          }}
        />
        <Stat
          label="Bot pings"
          value={visitTotals.bots}
          tone="amber"
          sub="all time"
          info={{
            has: "All-time count of visits where the bot detector flagged the request as automated. Includes search crawlers (Googlebot, Bingbot), link-preview fetchers (Slackbot, Twitterbot, LinkedInBot), uptime monitors, and headless scrapers.",
            does: "Confirms your site is actually being crawled and indexed (high bot count from Googlebot = SEO is working) and lets you eyeball whether bot traffic is dominating the analytics. The other admin stats all exclude bots, so this is the only place bot volume is surfaced directly.",
            how: "loadStats() in src/app/(site)/admin/page.tsx. SQL is `count(*) filter (where is_bot = true)` from visits. The is_bot flag is set at insert time by classifyVisitor() in src/lib/bot.ts — combines a User-Agent regex (matching ~30 known bot strings) with a cloud-ASN heuristic (datacenter IPs from AWS/GCP/Azure/etc. are flagged even with a forged browser UA).",
          }}
        />
        <Stat
          label="Failed logins (24h)"
          value={loginStats.failures24h}
          tone={loginStats.failures24h > 0 ? "rose" : "muted"}
          sub={`${loginStats.uniqueAttackers7d} unique IPs (7d)`}
          info={{
            has: "The count of failed password attempts on /login in the last 24 hours. The sub-line shows the count of distinct hashed IPs that have produced any failed attempt over the past 7 days — i.e., how many different actors are probing.",
            does: "First-line indicator of password-guessing activity against the admin gate. A non-zero 24h count means someone tried and failed recently; a steady stream of unique IPs suggests a distributed attempt. Drill into /admin/security for the full per-attempt timeline.",
            how: "loadStats() in src/app/(site)/admin/page.tsx. SQL queries the login_attempts table (one row per login POST, written by the server action in src/app/(site)/login/actions.ts). Counts rows where succeeded = false within the relevant time window. IPs are HMAC-hashed before storage (src/lib/visitor.ts hashIp() with the VISIT_HASH_SECRET env var) so the raw IP is never persisted. /login itself is rate-limited at 5 failed attempts per IP per 15 minutes, see src/lib/rate-limit.ts.",
          }}
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
                      {formatTime(new Date(o.lastSeen))}
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
          className={`${cardClass} hover:border-[var(--accent)]/60 transition-colors`}
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
          className={`${cardClass} hover:border-[var(--accent)]/60 transition-colors`}
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

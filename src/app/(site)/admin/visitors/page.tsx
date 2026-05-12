import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db";
import NotConfigured from "@/components/admin/NotConfigured";
import VisitorTableRow, {
  type VisitorRowData,
} from "@/components/admin/VisitorTableRow";

export const dynamic = "force-dynamic";

type Search = { bots?: string; window?: string; limit?: string };

const PAGE_SIZE_DEFAULT = 100;
const PAGE_SIZE_MAX = 500;

// Window keys map to a count of hours so the SQL query can bind a numeric
// parameter instead of stitching an interval string into the query body.
// Hardcoded values; never sourced from user input.
const WINDOWS = {
  "24h": 24,
  "7d": 24 * 7,
  "30d": 24 * 30,
  all: null,
} as const;
type WindowKey = keyof typeof WINDOWS;

function parseWindow(raw: string | undefined): WindowKey {
  if (raw && raw in WINDOWS) return raw as WindowKey;
  return "7d";
}

function parseLimit(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return PAGE_SIZE_DEFAULT;
  return Math.min(Math.floor(n), PAGE_SIZE_MAX);
}

// The row component owns VisitorRowData (was previously named VisitorRow
// inline). Aliased back to VisitorRow so the SQL-result typing below
// reads the same.
type VisitorRow = VisitorRowData;

export default async function VisitorsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const showBots = params.bots === "1";
  const windowKey = parseWindow(params.window);
  const limit = parseLimit(params.limit);

  if (!hasDatabase) {
    return <NotConfigured context="to view visitor sessions" />;
  }

  const db = getDb();
  const windowHours = WINDOWS[windowKey];

  // Group visits by session_id (or ip_hash, or per-visit id for legacy rows
  // that have neither). For each group: first/last seen, page count, full
  // chain of paths, total dwell, and the IP-enrichment metadata.
  const result = await db.execute(sql`
    WITH grouped AS (
      SELECT
        COALESCE(session_id, ip_hash, 'visit-' || id::text) AS group_key,
        session_id,
        ip_hash,
        MIN(created_at) AS first_seen,
        MAX(created_at) AS last_seen,
        COUNT(*)::int AS page_count,
        array_agg(path ORDER BY created_at) FILTER (WHERE path IS NOT NULL) AS paths,
        MAX(org) AS org,
        MAX(asn) AS asn,
        MAX(as_domain) AS as_domain,
        MAX(country) AS country,
        MAX(region) AS region,
        MAX(city) AS city,
        MAX(user_agent) AS user_agent,
        (array_agg(referrer ORDER BY created_at) FILTER (WHERE referrer IS NOT NULL))[1] AS referrer,
        bool_or(is_bot) AS is_bot,
        COALESCE(SUM(dwell_ms), 0)::int AS total_dwell_ms
      FROM visits
      ${
        windowHours !== null
          ? sql`WHERE created_at > now() - ${windowHours} * interval '1 hour'`
          : sql``
      }
      GROUP BY COALESCE(session_id, ip_hash, 'visit-' || id::text), session_id, ip_hash
    )
    SELECT
      g.*,
      COALESCE(rv.visit_count, 1)::int AS visit_count
    FROM grouped g
    LEFT JOIN LATERAL (
      SELECT COUNT(DISTINCT date_trunc('day', created_at))::int AS visit_count
      FROM visits v2
      WHERE g.session_id IS NOT NULL AND v2.session_id = g.session_id
    ) rv ON true
    ${showBots ? sql`` : sql`WHERE g.is_bot = false`}
    ORDER BY g.last_seen DESC
    LIMIT ${limit}
  `);

  const rows = (result as unknown as { rows: Record<string, unknown>[] }).rows.map(
    (r): VisitorRow => ({
      sessionId: (r.session_id as string | null) ?? null,
      ipHash: (r.ip_hash as string | null) ?? null,
      firstSeen: new Date(r.first_seen as string),
      lastSeen: new Date(r.last_seen as string),
      pageCount: Number(r.page_count ?? 0),
      paths: (r.paths as string[] | null) ?? null,
      org: (r.org as string | null) ?? null,
      asn: (r.asn as string | null) ?? null,
      asDomain: (r.as_domain as string | null) ?? null,
      country: (r.country as string | null) ?? null,
      region: (r.region as string | null) ?? null,
      city: (r.city as string | null) ?? null,
      userAgent: (r.user_agent as string | null) ?? null,
      referrer: (r.referrer as string | null) ?? null,
      isBot: Boolean(r.is_bot),
      totalDwellMs: Number(r.total_dwell_ms ?? 0),
      visitCount: Number(r.visit_count ?? 1),
    }),
  );

  const buildHref = (overrides: Partial<Search>) => {
    const next = {
      bots: showBots ? "1" : undefined,
      window: windowKey,
      limit: String(limit),
      ...overrides,
    };
    const params = new URLSearchParams();
    if (next.bots) params.set("bots", "1");
    if (next.window) params.set("window", next.window);
    if (next.limit) params.set("limit", next.limit);
    const qs = params.toString();
    return `/admin/visitors${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Visitors
          </h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            {rows.length} {showBots ? "sessions (incl. bots)" : "human sessions"}{" "}
            · grouped by browser session ·{" "}
            <Link
              href={buildHref({ bots: showBots ? undefined : "1" })}
              className="text-[var(--accent)] hover:underline"
            >
              {showBots ? "Hide bots" : "Show bots"}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
          <span>Window</span>
          {(["24h", "7d", "30d", "all"] as WindowKey[]).map((w) => (
            <Link
              key={w}
              href={buildHref({ window: w })}
              className={`px-2 py-1 rounded-md border ${
                w === windowKey
                  ? "border-[var(--accent)] text-white"
                  : "border-[var(--border)] hover:border-[var(--accent)]/60"
              }`}
            >
              {w}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)]/40">
              <tr className="text-left mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
                <th className="px-4 py-3 font-medium">Last seen</th>
                <th className="px-4 py-3 font-medium">Org · Network</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Page chain</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Browser</th>
                <th className="px-4 py-3 font-medium">Referrer</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-[var(--text)]"
                  >
                    No sessions in this window.
                  </td>
                </tr>
              ) : (
                rows.map((v) => (
                  <VisitorTableRow
                    key={`${v.sessionId ?? v.ipHash ?? v.firstSeen.toISOString()}-${v.firstSeen.getTime()}`}
                    visitor={v}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

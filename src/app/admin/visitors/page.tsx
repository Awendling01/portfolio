import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

type Search = { bots?: string; window?: string; limit?: string };

const PAGE_SIZE_DEFAULT = 100;
const PAGE_SIZE_MAX = 500;

const WINDOWS = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
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

type VisitorRow = {
  sessionId: string | null;
  ipHash: string | null;
  firstSeen: Date;
  lastSeen: Date;
  pageCount: number;
  paths: string[] | null;
  org: string | null;
  asn: string | null;
  asDomain: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  userAgent: string | null;
  referrer: string | null;
  isBot: boolean;
  totalDwellMs: number;
  visitCount: number;
};

function shortUA(ua: string | null): string {
  if (!ua) return "—";
  const browserMatch = ua.match(
    /(Chrome|Firefox|Safari|Edge|Opera|CriOS|FxiOS)\/([\d.]+)/i,
  );
  const parts: string[] = [];
  if (browserMatch) parts.push(`${browserMatch[1]} ${browserMatch[2].split(".")[0]}`);
  if (/iPhone|iPad|iPod/i.test(ua)) parts.push("iOS");
  else if (/Android/i.test(ua)) parts.push("Android");
  else if (/Mac OS X/i.test(ua)) parts.push("macOS");
  else if (/Windows/i.test(ua)) parts.push("Windows");
  else if (/Linux/i.test(ua)) parts.push("Linux");
  return parts.length ? parts.join(" · ") : ua.slice(0, 40);
}

function shortReferrer(ref: string | null): string {
  if (!ref) return "—";
  try {
    const u = new URL(ref);
    const host = u.hostname.replace(/^www\./, "");
    return u.pathname === "/" ? host : host + u.pathname;
  } catch {
    return ref.slice(0, 40);
  }
}

function formatTime(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDwell(ms: number | null): string {
  if (!ms || ms < 1000) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs ? `${m}m ${rs}s` : `${m}m`;
}

function dedupeChain(paths: string[] | null): string[] {
  if (!paths || paths.length === 0) return [];
  const out: string[] = [];
  for (const p of paths) {
    if (!p) continue;
    if (out[out.length - 1] !== p) out.push(p);
  }
  return out;
}

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
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
        Database not configured. Set <code>DATABASE_URL</code> in Vercel.
      </div>
    );
  }

  const db = getDb();
  const windowInterval = WINDOWS[windowKey];

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
        windowInterval
          ? sql`WHERE created_at > now() - interval '${sql.raw(windowInterval)}'`
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
                rows.map((v) => {
                  const location =
                    [v.city, v.region, v.country].filter(Boolean).join(", ") ||
                    "—";
                  const chain = dedupeChain(v.paths);
                  const orgLabel = v.org ?? v.asn ?? "—";
                  const isCorp =
                    v.asDomain &&
                    !/(comcast|spectrum|att|verizon|charter|cox|tmobile|orange|telia|swisscom|telefonica|deutsche|vodafone|residential|broadband|isp|telecom|cable|fiber)/i.test(
                      v.asDomain,
                    ) &&
                    !v.isBot;
                  const sessionHref = v.sessionId
                    ? `/admin/visitors/${v.sessionId}`
                    : null;

                  return (
                    <tr
                      key={`${v.sessionId ?? v.ipHash ?? v.firstSeen.toISOString()}-${v.firstSeen.getTime()}`}
                      className="border-t border-[var(--border)]/60 hover:bg-[var(--surface2)]/40"
                    >
                      <td
                        className="px-4 py-3 mono text-xs text-[var(--text2)] whitespace-nowrap"
                        title={`First seen: ${v.firstSeen.toISOString()}\nLast seen: ${v.lastSeen.toISOString()}`}
                      >
                        {formatTime(v.lastSeen)}
                        {v.visitCount > 1 ? (
                          <span
                            className="ml-1 mono text-[10px] text-[var(--accent2)]"
                            title={`Returned on ${v.visitCount} different days`}
                          >
                            ×{v.visitCount}
                          </span>
                        ) : null}
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        title={v.asn ?? undefined}
                      >
                        {isCorp ? (
                          <span className="font-medium text-white">
                            {orgLabel}
                          </span>
                        ) : (
                          <span className="text-[var(--text2)]">
                            {orgLabel}
                          </span>
                        )}
                        {v.asDomain ? (
                          <div className="mono text-[10px] text-[var(--text)]">
                            {v.asDomain}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text2)]">
                        {location}
                      </td>
                      <td className="px-4 py-3 mono text-xs text-white">
                        {chain.length === 0 ? (
                          <span className="text-[var(--text)]">—</span>
                        ) : sessionHref ? (
                          <Link
                            href={sessionHref}
                            className="hover:text-[var(--accent)] hover:underline"
                          >
                            {chain.slice(0, 4).join(" → ")}
                            {chain.length > 4 ? ` → +${chain.length - 4}` : ""}
                          </Link>
                        ) : (
                          <>
                            {chain.slice(0, 4).join(" → ")}
                            {chain.length > 4 ? ` → +${chain.length - 4}` : ""}
                          </>
                        )}
                        <span className="ml-2 mono text-[10px] text-[var(--text)]">
                          ({v.pageCount}p)
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 mono text-xs text-[var(--text2)] whitespace-nowrap"
                        title={`Total dwell across pages: ${v.totalDwellMs}ms`}
                      >
                        {formatDwell(v.totalDwellMs)}
                      </td>
                      <td
                        className="px-4 py-3 text-xs text-[var(--text2)]"
                        title={v.userAgent ?? undefined}
                      >
                        {shortUA(v.userAgent)}
                      </td>
                      <td
                        className="px-4 py-3 mono text-xs text-[var(--text)] truncate max-w-[200px]"
                        title={v.referrer ?? undefined}
                      >
                        {shortReferrer(v.referrer)}
                      </td>
                      <td className="px-4 py-3">
                        {v.isBot ? (
                          <span className="inline-flex items-center gap-1 mono text-[10px] uppercase tracking-[0.16em] text-[var(--amber)] border border-[var(--amber)]/40 bg-[var(--amber)]/10 rounded-full px-2 py-0.5">
                            Bot
                          </span>
                        ) : isCorp ? (
                          <span className="inline-flex items-center gap-1 mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)] border border-[var(--accent)]/40 bg-[var(--accent)]/10 rounded-full px-2 py-0.5">
                            Corp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 mono text-[10px] uppercase tracking-[0.16em] text-[var(--green)] border border-[var(--green)]/40 bg-[var(--green)]/10 rounded-full px-2 py-0.5">
                            Human
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

type Search = { bots?: string; limit?: string };

const PAGE_SIZE_DEFAULT = 200;
const PAGE_SIZE_MAX = 1000;

function parseLimit(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return PAGE_SIZE_DEFAULT;
  return Math.min(Math.floor(n), PAGE_SIZE_MAX);
}

function shortUA(ua: string | null): string {
  if (!ua) return "—";
  // Pull a readable summary out of the full UA string.
  const parts: string[] = [];
  const browserMatch =
    ua.match(/(Chrome|Firefox|Safari|Edge|Opera|CriOS|FxiOS)\/([\d.]+)/i) ||
    null;
  if (browserMatch) parts.push(`${browserMatch[1]} ${browserMatch[2].split(".")[0]}`);
  if (/iPhone|iPad|iPod/i.test(ua)) parts.push("iOS");
  else if (/Android/i.test(ua)) parts.push("Android");
  else if (/Mac OS X/i.test(ua)) parts.push("macOS");
  else if (/Windows/i.test(ua)) parts.push("Windows");
  else if (/Linux/i.test(ua)) parts.push("Linux");
  return parts.length ? parts.join(" · ") : ua.slice(0, 40) + (ua.length > 40 ? "…" : "");
}

function shortReferrer(ref: string | null): string {
  if (!ref) return "—";
  try {
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, "") + (url.pathname === "/" ? "" : url.pathname);
  } catch {
    return ref.slice(0, 40);
  }
}

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

export default async function VisitorsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const showBots = params.bots === "1";
  const limit = parseLimit(params.limit);

  if (!hasDatabase) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
        Database not configured. Set <code>DATABASE_URL</code> in Vercel.
      </div>
    );
  }

  const db = getDb();
  const rowsQuery = db
    .select()
    .from(schema.visits)
    .orderBy(desc(schema.visits.createdAt))
    .limit(limit);

  const rows = showBots
    ? await rowsQuery
    : await rowsQuery.where(eq(schema.visits.isBot, false));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Visitors
          </h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            Latest {rows.length} {showBots ? "rows" : "human visits"} ·{" "}
            <Link
              href={
                showBots
                  ? `/admin/visitors?limit=${limit}`
                  : `/admin/visitors?bots=1&limit=${limit}`
              }
              className="text-[var(--accent)] hover:underline"
            >
              {showBots ? "Hide bots" : "Show bots"}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
          <span>Limit</span>
          {[100, 200, 500, 1000].map((n) => (
            <Link
              key={n}
              href={`/admin/visitors?${showBots ? "bots=1&" : ""}limit=${n}`}
              className={`px-2 py-1 rounded-md border ${
                n === limit
                  ? "border-[var(--accent)] text-white"
                  : "border-[var(--border)] hover:border-[var(--accent)]/60"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)]/40">
              <tr className="text-left mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Browser</th>
                <th className="px-4 py-3 font-medium">Referrer</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-[var(--text)]"
                  >
                    No visits yet. Try loading the public site in another tab.
                  </td>
                </tr>
              ) : (
                rows.map((v) => {
                  const created = new Date(v.createdAt);
                  const location = [v.city, v.region, v.country]
                    .filter(Boolean)
                    .join(", ") || "—";
                  return (
                    <tr
                      key={v.id}
                      className="border-t border-[var(--border)]/60 hover:bg-[var(--surface2)]/40"
                    >
                      <td
                        className="px-4 py-3 mono text-xs text-[var(--text2)] whitespace-nowrap"
                        title={created.toISOString()}
                      >
                        {timeAgo(created)}
                      </td>
                      <td className="px-4 py-3 mono text-xs text-white whitespace-nowrap">
                        {v.path ?? `/${v.slug === "home" ? "" : v.slug}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text2)]">
                        {location}
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

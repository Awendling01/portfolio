import { hasDatabase } from "@/lib/db";
import {
  getDailyBuckets,
  getEngagementStats,
  getNewVsReturning,
  getTopBrowsers,
  getTopCountries,
  getTopOs,
  getTopPages,
  getTopReferrers,
  ANALYTICS_WINDOW_DAYS,
} from "@/lib/analytics-queries";
import {
  getSearchConsoleStatus,
  getTopQueries,
  getTopPages as getSearchTopPages,
} from "@/lib/search-console";
import { DailyBarChart, Donut, RankedBars } from "@/components/admin/Charts";

export const dynamic = "force-dynamic";

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6";

function formatDuration(ms: number): string {
  if (ms < 1000) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs ? `${m}m ${rs}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function countryName(code: string): string {
  // Tiny ISO-3166 alpha-2 → name map for the codes most likely to show up.
  // Anything missing falls back to the raw code.
  const map: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    NL: "Netherlands",
    IT: "Italy",
    ES: "Spain",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    BE: "Belgium",
    CH: "Switzerland",
    AT: "Austria",
    IE: "Ireland",
    PT: "Portugal",
    PL: "Poland",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    JP: "Japan",
    KR: "South Korea",
    CN: "China",
    IN: "India",
    SG: "Singapore",
    HK: "Hong Kong",
    TW: "Taiwan",
    IL: "Israel",
    AE: "UAE",
    SA: "Saudi Arabia",
    ZA: "South Africa",
    NZ: "New Zealand",
    RU: "Russia",
    UA: "Ukraine",
    TR: "Turkey",
  };
  return map[code.toUpperCase()] ?? code;
}

export default async function AnalyticsPage() {
  if (!hasDatabase) {
    return <div className={card}>Database not configured.</div>;
  }

  const [
    daily,
    pages,
    referrers,
    countries,
    browsers,
    os,
    engagement,
    newReturn,
  ] = await Promise.all([
    getDailyBuckets(),
    getTopPages(),
    getTopReferrers(),
    getTopCountries(),
    getTopBrowsers(),
    getTopOs(),
    getEngagementStats(),
    getNewVsReturning(),
  ]);

  const scStatus = getSearchConsoleStatus();
  const [scQueries, scPages] = scStatus.configured
    ? await Promise.all([getTopQueries(), getSearchTopPages()])
    : [null, null];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Last {ANALYTICS_WINDOW_DAYS} days · sourced from your own visit log ·
          excludes bots.
        </p>
      </div>

      {/* Top stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Sessions" value={engagement.totalSessions.toLocaleString()} />
        <Stat
          label="Pageviews"
          value={engagement.totalPageviews.toLocaleString()}
        />
        <Stat
          label="Pages / session"
          value={engagement.avgPagesPerSession.toFixed(2)}
        />
        <Stat
          label="Bounce rate"
          value={formatPct(engagement.bounceRate)}
          tone={engagement.bounceRate > 0.7 ? "amber" : "default"}
        />
        <Stat
          label="Total read time"
          value={formatDuration(engagement.totalReadTimeMs)}
          tone="green"
        />
      </div>

      {/* Daily chart */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)]">
            Visitors over time
          </h2>
          <div className="flex items-center gap-3 mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)]">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: "var(--accent)" }}
              />
              Sessions
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm opacity-50"
                style={{ backgroundColor: "var(--accent2)" }}
              />
              Pageviews
            </span>
          </div>
        </div>
        <div className={card}>
          <DailyBarChart data={daily} />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className={card}>
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
            Top pages
          </h2>
          <RankedBars
            rows={pages.map((p) => ({
              label: p.page,
              value: p.pageviews,
              sub:
                p.avgDwellMs > 1000
                  ? `${formatDuration(p.avgDwellMs)} avg`
                  : undefined,
            }))}
            formatValue={(n) => `${n}`}
          />
        </section>

        <section className={card}>
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
            Top referrers
          </h2>
          <RankedBars
            rows={referrers.map((r) => ({
              label: r.host,
              value: r.sessions,
            }))}
          />
        </section>

        <section className={card}>
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
            Top countries
          </h2>
          <RankedBars
            rows={countries.map((c) => ({
              label: countryName(c.country),
              value: c.sessions,
            }))}
          />
        </section>

        <section className={card}>
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
            New vs returning
          </h2>
          <Donut
            segments={[
              {
                label: "New",
                value: newReturn.newSessions,
                color: "var(--accent)",
              },
              {
                label: "Returning",
                value: newReturn.returningSessions,
                color: "var(--accent2)",
              },
            ]}
            total={newReturn.newSessions + newReturn.returningSessions}
            centerLabel="Sessions"
            centerValue={(
              newReturn.newSessions + newReturn.returningSessions
            ).toLocaleString()}
          />
        </section>

        <section className={card}>
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
            Browsers
          </h2>
          <RankedBars
            rows={browsers.map((b) => ({
              label: b.browser,
              value: b.sessions,
            }))}
          />
        </section>

        <section className={card}>
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
            Operating systems
          </h2>
          <RankedBars
            rows={os.map((o) => ({
              label: o.os,
              value: o.sessions,
            }))}
          />
        </section>
      </div>

      {/* Search Console */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)]">
            Google Search
          </h2>
          {scStatus.configured ? (
            <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--green)]">
              Connected · last 28d
            </span>
          ) : (
            <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--amber)]">
              Not configured
            </span>
          )}
        </div>

        {!scStatus.configured ? (
          <div className={card}>
            <p className="text-sm text-white">
              Search Console isn&apos;t connected yet.
            </p>
            <p className="mt-2 text-sm text-[var(--text)]">
              {scStatus.reason}
            </p>
            {scStatus.serviceAccountEmail ? (
              <p className="mt-3 mono text-xs text-[var(--text2)]">
                Service account:{" "}
                <span className="text-white">
                  {scStatus.serviceAccountEmail}
                </span>{" "}
                — make sure it&apos;s added to your Search Console property as
                a Restricted user.
              </p>
            ) : null}
          </div>
        ) : !scQueries ? (
          <div className={card}>
            <p className="text-sm text-[var(--amber)]">
              Couldn&apos;t reach Search Console (no data yet, or auth failed).
            </p>
            <p className="mt-2 text-sm text-[var(--text)]">
              Common causes: site verification incomplete, the service account
              doesn&apos;t have access to the property, or the
              <code className="mx-1">SEARCH_CONSOLE_SITE_URL</code>
              doesn&apos;t match the property exactly.
            </p>
            {scStatus.serviceAccountEmail ? (
              <p className="mt-3 mono text-xs text-[var(--text2)]">
                Service account:{" "}
                <span className="text-white">
                  {scStatus.serviceAccountEmail}
                </span>
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Clicks"
                value={scQueries.totals.clicks.toLocaleString()}
              />
              <Stat
                label="Impressions"
                value={scQueries.totals.impressions.toLocaleString()}
              />
              <Stat
                label="Avg CTR"
                value={formatPct(scQueries.totals.avgCtr)}
              />
              <Stat
                label="Avg position"
                value={
                  scQueries.totals.avgPosition
                    ? scQueries.totals.avgPosition.toFixed(1)
                    : "—"
                }
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className={card}>
                <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
                  Top search queries
                </h3>
                {scQueries.rows.length === 0 ? (
                  <p className="text-sm text-[var(--text)]">
                    No search impressions yet. Once Google indexes the site and
                    people search for terms that match, they&apos;ll appear
                    here.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {scQueries.rows.slice(0, 15).map((r) => (
                      <li
                        key={r.keys.join("|")}
                        className="flex items-baseline justify-between gap-3 border-b border-[var(--border)]/40 pb-2 last:border-0"
                      >
                        <span className="text-white truncate">{r.keys[0]}</span>
                        <span className="mono text-xs text-[var(--text2)] shrink-0 flex gap-3">
                          <span title="Clicks">
                            <span className="text-[var(--accent)]">
                              {r.clicks}
                            </span>{" "}
                            clk
                          </span>
                          <span title="Impressions">
                            {r.impressions} imp
                          </span>
                          <span title="Average position">
                            #{r.position.toFixed(1)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={card}>
                <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
                  Top landing pages from Google
                </h3>
                {!scPages || scPages.rows.length === 0 ? (
                  <p className="text-sm text-[var(--text)]">No data yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {scPages.rows.slice(0, 10).map((r) => {
                      let path = r.keys[0];
                      try {
                        path = new URL(r.keys[0]).pathname;
                      } catch {
                        // keep raw
                      }
                      return (
                        <li
                          key={r.keys[0]}
                          className="flex items-baseline justify-between gap-3 border-b border-[var(--border)]/40 pb-2 last:border-0"
                        >
                          <span className="mono text-xs text-white truncate">
                            {path}
                          </span>
                          <span className="mono text-xs text-[var(--text2)] shrink-0 flex gap-3">
                            <span>
                              <span className="text-[var(--accent)]">
                                {r.clicks}
                              </span>{" "}
                              clk
                            </span>
                            <span>{r.impressions} imp</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "green" | "amber";
}) {
  const color =
    tone === "green"
      ? "text-[var(--green)]"
      : tone === "amber"
        ? "text-[var(--amber)]"
        : "text-white";
  return (
    <div className={card}>
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-bold tracking-tight ${color}`}>
        {value}
      </div>
    </div>
  );
}

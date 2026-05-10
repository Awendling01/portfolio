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
import { DailyBarChart, Donut, RankedBars } from "@/components/admin/Charts";
import Stat from "@/components/admin/Stat";
import NotConfigured from "@/components/admin/NotConfigured";
import { formatDuration, formatPct, countryName } from "@/lib/format";

// Search Console deep link: drops you straight into your property instead of
// the generic dashboard. Update if the verified site URL changes.
const SEARCH_CONSOLE_URL =
  "https://search.google.com/search-console?resource_id=https://www.andrewwendling.info/";

export const dynamic = "force-dynamic";

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6";

export default async function AnalyticsPage() {
  if (!hasDatabase) {
    return <NotConfigured context="to enable analytics" />;
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
        <Stat label="Sessions" value={engagement.totalSessions} size="md" />
        <Stat label="Pageviews" value={engagement.totalPageviews} size="md" />
        <Stat
          label="Pages / session"
          value={engagement.avgPagesPerSession.toFixed(2)}
          size="md"
        />
        <Stat
          label="Bounce rate"
          value={formatPct(engagement.bounceRate)}
          tone={engagement.bounceRate > 0.7 ? "amber" : "default"}
          size="md"
        />
        <Stat
          label="Total read time"
          value={formatDuration(engagement.totalReadTimeMs)}
          tone="green"
          size="md"
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

      {/* Google Search Console — external link, not embedded */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)]">
            Google Search Console
          </h2>
          <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)]">
            Lives on Google
          </span>
        </div>

        <div className={card}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm text-white leading-relaxed">
                Top search queries, click-through rate, impressions, and
                average ranking from Google Search.
              </p>
              <p className="mt-2 text-sm text-[var(--text)] leading-relaxed">
                Embedding this data in the admin would require keeping a
                Google OAuth refresh token alive forever — Google revokes
                them every 7 days for unverified apps. Not worth the
                ceremony for data that&apos;s one click away.
              </p>
            </div>

            <a
              href={SEARCH_CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-200 will-change-transform bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] hover:-translate-y-[1px]"
            >
              Open Search Console
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>

          <div className="mt-6 pt-5 border-t border-[var(--border)]/50">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
              What you&apos;ll see there
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--text2)]">
              <li className="flex items-baseline gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] shrink-0 translate-y-[-2px]" />
                <span>
                  <span className="text-white">Performance</span> — top search
                  queries that brought visitors, ordered by impressions
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent2)] shrink-0 translate-y-[-2px]" />
                <span>
                  <span className="text-white">Click-through rate</span> —
                  clicks vs impressions per query and per page
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--green)] shrink-0 translate-y-[-2px]" />
                <span>
                  <span className="text-white">Average position</span> — where
                  your pages rank in Google search results
                </span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--amber)] shrink-0 translate-y-[-2px]" />
                <span>
                  <span className="text-white">Indexing status</span> — which
                  pages Google has crawled, errors, sitemap submission
                </span>
              </li>
            </ul>
            <p className="mt-4 mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)]">
              First data appears 2–5 days after verification ·
              <span className="ml-1.5">site verified May 9, 2026</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


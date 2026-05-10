import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

const DAYS = 30;

export type DailyBucket = {
  date: Date;
  sessions: number;
  pageviews: number;
};

export type TopPage = {
  page: string;
  sessions: number;
  pageviews: number;
  avgDwellMs: number;
};

export type TopReferrer = {
  host: string;
  sessions: number;
};

export type TopCountry = {
  country: string;
  sessions: number;
};

export type TopBrowser = {
  browser: string;
  sessions: number;
};

export type TopOs = {
  os: string;
  sessions: number;
};

export type EngagementStats = {
  totalSessions: number;
  totalPageviews: number;
  avgPagesPerSession: number;
  bounceRate: number; // 0..1
  totalReadTimeMs: number;
};

export type NewVsReturning = {
  newSessions: number;
  returningSessions: number;
};

type Rows<T> = { rows: T[] };

function asRows<T>(result: unknown): T[] {
  return (result as Rows<T>).rows ?? [];
}

/** Daily-bucketed sessions + pageviews, with zero-fill for missing days. */
export async function getDailyBuckets(): Promise<DailyBucket[]> {
  const db = getDb();
  const result = await db.execute(sql`
    SELECT
      d.day::date AS date,
      COALESCE(v.sessions, 0)::int AS sessions,
      COALESCE(v.pageviews, 0)::int AS pageviews
    FROM generate_series(
      date_trunc('day', now() - ${DAYS - 1} * interval '1 day'),
      date_trunc('day', now()),
      '1 day'::interval
    ) AS d(day)
    LEFT JOIN (
      SELECT
        date_trunc('day', created_at) AS day,
        COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL) AS sessions,
        COUNT(*) AS pageviews
      FROM visits
      WHERE created_at > now() - ${DAYS} * interval '1 day'
        AND is_bot = false
      GROUP BY 1
    ) v ON v.day = d.day
    ORDER BY d.day ASC
  `);

  return asRows<{ date: string; sessions: number; pageviews: number }>(
    result,
  ).map((r) => ({
    date: new Date(r.date),
    sessions: Number(r.sessions),
    pageviews: Number(r.pageviews),
  }));
}

export async function getTopPages(): Promise<TopPage[]> {
  const db = getDb();
  const result = await db.execute(sql`
    SELECT
      COALESCE(NULLIF(path, ''), '/' || NULLIF(slug, 'home'), '/') AS page,
      COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL)::int AS sessions,
      COUNT(*)::int AS pageviews,
      COALESCE(
        AVG(dwell_ms) FILTER (WHERE dwell_ms IS NOT NULL AND dwell_ms > 1000),
        0
      )::int AS avg_dwell_ms
    FROM visits
    WHERE created_at > now() - ${DAYS} * interval '1 day'
      AND is_bot = false
    GROUP BY 1
    ORDER BY pageviews DESC
    LIMIT 10
  `);

  return asRows<{
    page: string;
    sessions: number;
    pageviews: number;
    avg_dwell_ms: number;
  }>(result).map((r) => ({
    page: r.page ?? "/",
    sessions: Number(r.sessions),
    pageviews: Number(r.pageviews),
    avgDwellMs: Number(r.avg_dwell_ms),
  }));
}

export async function getTopReferrers(): Promise<TopReferrer[]> {
  const db = getDb();
  const result = await db.execute(sql`
    SELECT
      host,
      COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL)::int AS sessions
    FROM (
      SELECT
        session_id,
        CASE
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct / none'
          ELSE COALESCE(
            substring(referrer FROM 'https?://(?:www\\.)?([^/]+)'),
            'Other'
          )
        END AS host
      FROM visits
      WHERE created_at > now() - ${DAYS} * interval '1 day'
        AND is_bot = false
    ) sub
    GROUP BY 1
    ORDER BY sessions DESC
    LIMIT 10
  `);

  return asRows<{ host: string; sessions: number }>(result).map((r) => ({
    host: r.host,
    sessions: Number(r.sessions),
  }));
}

export async function getTopCountries(): Promise<TopCountry[]> {
  const db = getDb();
  const result = await db.execute(sql`
    SELECT
      country,
      COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL)::int AS sessions
    FROM visits
    WHERE created_at > now() - ${DAYS} * interval '1 day'
      AND is_bot = false
      AND country IS NOT NULL
    GROUP BY 1
    ORDER BY sessions DESC
    LIMIT 10
  `);

  return asRows<{ country: string; sessions: number }>(result).map((r) => ({
    country: r.country,
    sessions: Number(r.sessions),
  }));
}

export async function getTopBrowsers(): Promise<TopBrowser[]> {
  const db = getDb();
  // Order matters: Edge UA contains "Chrome/", Chrome UA contains "Safari/".
  const result = await db.execute(sql`
    SELECT browser, COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL)::int AS sessions
    FROM (
      SELECT
        session_id,
        CASE
          WHEN user_agent ~* 'Edg/' THEN 'Edge'
          WHEN user_agent ~* 'OPR/|Opera' THEN 'Opera'
          WHEN user_agent ~* 'Firefox/|FxiOS/' THEN 'Firefox'
          WHEN user_agent ~* 'CriOS/|Chrome/' THEN 'Chrome'
          WHEN user_agent ~* 'Safari/' THEN 'Safari'
          ELSE 'Other'
        END AS browser
      FROM visits
      WHERE created_at > now() - ${DAYS} * interval '1 day'
        AND is_bot = false
    ) sub
    GROUP BY 1
    ORDER BY sessions DESC
  `);

  return asRows<{ browser: string; sessions: number }>(result).map((r) => ({
    browser: r.browser,
    sessions: Number(r.sessions),
  }));
}

export async function getTopOs(): Promise<TopOs[]> {
  const db = getDb();
  const result = await db.execute(sql`
    SELECT os, COUNT(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL)::int AS sessions
    FROM (
      SELECT
        session_id,
        CASE
          WHEN user_agent ~* 'iPhone|iPad|iPod' THEN 'iOS'
          WHEN user_agent ~* 'Android' THEN 'Android'
          WHEN user_agent ~* 'Mac OS X' THEN 'macOS'
          WHEN user_agent ~* 'Windows' THEN 'Windows'
          WHEN user_agent ~* 'Linux' THEN 'Linux'
          ELSE 'Other'
        END AS os
      FROM visits
      WHERE created_at > now() - ${DAYS} * interval '1 day'
        AND is_bot = false
    ) sub
    GROUP BY 1
    ORDER BY sessions DESC
  `);

  return asRows<{ os: string; sessions: number }>(result).map((r) => ({
    os: r.os,
    sessions: Number(r.sessions),
  }));
}

export async function getEngagementStats(): Promise<EngagementStats> {
  const db = getDb();
  const result = await db.execute(sql`
    WITH session_pages AS (
      SELECT session_id, COUNT(*)::int AS page_count, SUM(COALESCE(dwell_ms, 0))::bigint AS total_dwell_ms
      FROM visits
      WHERE created_at > now() - ${DAYS} * interval '1 day'
        AND is_bot = false
        AND session_id IS NOT NULL
      GROUP BY session_id
    ),
    pv AS (
      SELECT COUNT(*)::int AS pageviews
      FROM visits
      WHERE created_at > now() - ${DAYS} * interval '1 day'
        AND is_bot = false
    )
    SELECT
      (SELECT COUNT(*) FROM session_pages)::int AS total_sessions,
      (SELECT pageviews FROM pv)::int AS total_pageviews,
      COALESCE((SELECT AVG(page_count) FROM session_pages), 0)::numeric(10,2) AS avg_pages_per_session,
      COALESCE(
        (SELECT COUNT(*) FILTER (WHERE page_count = 1)::numeric / NULLIF(COUNT(*), 0) FROM session_pages),
        0
      )::numeric(10,4) AS bounce_rate,
      COALESCE((SELECT SUM(total_dwell_ms) FROM session_pages), 0)::bigint AS total_read_time_ms
  `);

  const rows = asRows<{
    total_sessions: number;
    total_pageviews: number;
    avg_pages_per_session: string;
    bounce_rate: string;
    total_read_time_ms: string;
  }>(result);

  const r = rows[0];
  if (!r) {
    return {
      totalSessions: 0,
      totalPageviews: 0,
      avgPagesPerSession: 0,
      bounceRate: 0,
      totalReadTimeMs: 0,
    };
  }
  return {
    totalSessions: Number(r.total_sessions),
    totalPageviews: Number(r.total_pageviews),
    avgPagesPerSession: Number(r.avg_pages_per_session),
    bounceRate: Number(r.bounce_rate),
    totalReadTimeMs: Number(r.total_read_time_ms),
  };
}

export async function getNewVsReturning(): Promise<NewVsReturning> {
  const db = getDb();
  const result = await db.execute(sql`
    WITH active_sessions AS (
      SELECT DISTINCT session_id
      FROM visits
      WHERE session_id IS NOT NULL
        AND is_bot = false
        AND created_at > now() - ${DAYS} * interval '1 day'
    ),
    first_visit AS (
      SELECT v.session_id, MIN(v.created_at) AS first_at
      FROM visits v
      INNER JOIN active_sessions a ON a.session_id = v.session_id
      GROUP BY v.session_id
    )
    SELECT
      COUNT(*) FILTER (WHERE first_at > now() - ${DAYS} * interval '1 day')::int AS new_sessions,
      COUNT(*) FILTER (WHERE first_at <= now() - ${DAYS} * interval '1 day')::int AS returning_sessions
    FROM first_visit
  `);

  const rows = asRows<{ new_sessions: number; returning_sessions: number }>(
    result,
  );
  const r = rows[0];
  if (!r) return { newSessions: 0, returningSessions: 0 };
  return {
    newSessions: Number(r.new_sessions),
    returningSessions: Number(r.returning_sessions),
  };
}

export const ANALYTICS_WINDOW_DAYS = DAYS;

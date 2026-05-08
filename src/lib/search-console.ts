import {
  getGoogleAccessToken,
  googleServiceAccountConfigured,
  getServiceAccountEmail,
} from "./google-jwt";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API = "https://searchconsole.googleapis.com/webmasters/v3";

export type SearchRow = {
  keys: string[]; // ordered per request dimensions
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchAnalyticsResponse = {
  rows: SearchRow[];
  totals: {
    clicks: number;
    impressions: number;
    avgCtr: number;
    avgPosition: number;
  };
};

export type SearchConsoleStatus =
  | { configured: false; reason: string; serviceAccountEmail: string | null }
  | { configured: true; siteUrl: string; serviceAccountEmail: string | null };

export function getSearchConsoleStatus(): SearchConsoleStatus {
  const email = getServiceAccountEmail();
  if (!googleServiceAccountConfigured()) {
    return {
      configured: false,
      reason:
        "GOOGLE_SERVICE_ACCOUNT_KEY env var is missing. Paste the JSON key from your Google Cloud service account.",
      serviceAccountEmail: null,
    };
  }
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) {
    return {
      configured: false,
      reason:
        "SEARCH_CONSOLE_SITE_URL env var is missing. Set it to https://andrewwendling.info/ (trailing slash matters).",
      serviceAccountEmail: email,
    };
  }
  return { configured: true, siteUrl, serviceAccountEmail: email };
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function callSearchAnalytics(opts: {
  siteUrl: string;
  dimensions: string[];
  rowLimit?: number;
  days?: number;
}): Promise<SearchAnalyticsResponse | null> {
  const token = await getGoogleAccessToken(SCOPE);
  if (!token) return null;

  const days = opts.days ?? 28;
  const body = {
    startDate: isoDaysAgo(days),
    endDate: isoDaysAgo(0),
    dimensions: opts.dimensions,
    rowLimit: opts.rowLimit ?? 25,
    dataState: "all",
  };

  const url = `${API}/sites/${encodeURIComponent(opts.siteUrl)}/searchAnalytics/query`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        "search-console: query failed",
        res.status,
        text.slice(0, 500),
      );
      return null;
    }

    const data: { rows?: SearchRow[] } = await res.json();
    const rows = data.rows ?? [];

    const totals = rows.reduce(
      (acc, r) => {
        acc.clicks += r.clicks;
        acc.impressions += r.impressions;
        return acc;
      },
      { clicks: 0, impressions: 0, avgCtr: 0, avgPosition: 0 },
    );
    if (totals.impressions > 0) {
      totals.avgCtr = totals.clicks / totals.impressions;
    }
    if (rows.length > 0) {
      totals.avgPosition =
        rows.reduce((s, r) => s + r.position, 0) / rows.length;
    }

    return { rows, totals };
  } catch (err) {
    console.error("search-console: fetch failed", err);
    return null;
  }
}

export async function getTopQueries(): Promise<SearchAnalyticsResponse | null> {
  const status = getSearchConsoleStatus();
  if (!status.configured) return null;
  return callSearchAnalytics({
    siteUrl: status.siteUrl,
    dimensions: ["query"],
    rowLimit: 25,
  });
}

export async function getTopPages(): Promise<SearchAnalyticsResponse | null> {
  const status = getSearchConsoleStatus();
  if (!status.configured) return null;
  return callSearchAnalytics({
    siteUrl: status.siteUrl,
    dimensions: ["page"],
    rowLimit: 10,
  });
}

export async function getDailyTotals(): Promise<SearchAnalyticsResponse | null> {
  const status = getSearchConsoleStatus();
  if (!status.configured) return null;
  return callSearchAnalytics({
    siteUrl: status.siteUrl,
    dimensions: ["date"],
    rowLimit: 60,
  });
}

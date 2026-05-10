// Shared formatting helpers used across admin pages. Each was duplicated
// across 2-4 files before this consolidation; keeping a single source of
// truth makes it cheaper to tweak presentation rules globally.

/** Relative timestamp like "12s ago", "5m ago", "3h ago", "2d ago", or ISO date. */
export function timeAgo(date: Date): string {
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

/** Compact date+time for table cells. */
export function formatTime(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Like formatTime but with seconds. Used on security/login-attempts where
 *  sub-minute timing is forensic signal (3 fails in 5s vs 50 min). */
export function formatTimeWithSeconds(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Full date+time including seconds — used on the visitor detail page. */
export function formatExact(d: Date): string {
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** ms gap between consecutive visits, prefixed with "+". */
export function formatGap(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `+${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs ? `+${m}m ${rs}s` : `+${m}m`;
  const h = Math.floor(m / 60);
  return `+${h}h ${m % 60}m`;
}

/** Read time / dwell duration. Returns "—" for under 1s of dwell. */
export function formatDwell(ms: number | null): string {
  if (!ms || ms < 1000) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs ? `${m}m ${rs}s` : `${m}m`;
}

/** Same idea as formatDwell but always returns a value (used for cumulative read time). */
export function formatDuration(ms: number): string {
  if (ms < 1000) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs ? `${m}m ${rs}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

/** Decimal 0..1 formatted as a percent with one place. */
export function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/** Boil a User-Agent string down to "Browser version · OS". */
export function shortUA(ua: string | null): string {
  if (!ua) return "—";
  const browserMatch = ua.match(
    /(Chrome|Firefox|Safari|Edge|Opera|CriOS|FxiOS)\/([\d.]+)/i,
  );
  const parts: string[] = [];
  if (browserMatch) {
    parts.push(`${browserMatch[1]} ${browserMatch[2].split(".")[0]}`);
  }
  if (/iPhone|iPad|iPod/i.test(ua)) parts.push("iOS");
  else if (/Android/i.test(ua)) parts.push("Android");
  else if (/Mac OS X/i.test(ua)) parts.push("macOS");
  else if (/Windows/i.test(ua)) parts.push("Windows");
  else if (/Linux/i.test(ua)) parts.push("Linux");
  return parts.length ? parts.join(" · ") : ua.slice(0, 40);
}

/** Referrer hostname only (e.g. "linkedin.com/jobs/view/123"). */
export function shortReferrer(ref: string | null): string {
  if (!ref) return "—";
  try {
    const u = new URL(ref);
    const host = u.hostname.replace(/^www\./, "");
    return u.pathname === "/" ? host : host + u.pathname;
  } catch {
    return ref.slice(0, 40);
  }
}

/** ISO-3166 alpha-2 → display name for the codes most likely to appear. */
const COUNTRY_NAMES: Record<string, string> = {
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

export function countryName(code: string): string {
  return COUNTRY_NAMES[code.toUpperCase()] ?? code;
}

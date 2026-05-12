import Link from "next/link";
import {
  formatDwell,
  formatTime,
  shortReferrer,
  shortUA,
} from "@/lib/format";

// One row of the /admin/visitors table — handles the 8 cells (last seen,
// org/network, location, page chain, time on site, browser, referrer,
// visitor type badge) and the corp-vs-residential heuristic that powers
// both the org-name boldness and the Type badge color.
//
// Extracted from src/app/(site)/admin/visitors/page.tsx so the page
// reads as `rows.map(v => <VisitorTableRow visitor={v} />)` rather than
// 100 lines of inline cell JSX. The dedupeChain helper rides along
// because it's only used by this row.

export type VisitorRowData = {
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

function dedupeChain(paths: string[] | null): string[] {
  if (!paths || paths.length === 0) return [];
  const out: string[] = [];
  for (const p of paths) {
    if (!p) continue;
    if (out[out.length - 1] !== p) out.push(p);
  }
  return out;
}

type Props = {
  visitor: VisitorRowData;
};

export default function VisitorTableRow({ visitor: v }: Props) {
  const location =
    [v.city, v.region, v.country].filter(Boolean).join(", ") || "—";
  const chain = dedupeChain(v.paths);
  const orgLabel = v.org ?? v.asn ?? "—";
  // Heuristic: an ASN domain that doesn't match any known consumer-ISP
  // keyword is treated as a corporate network. False positives are
  // tolerable (just colors a row cyan); the actual visitor still shows.
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
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatExact(d: Date): string {
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
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

function formatGap(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `+${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs ? `+${m}m ${rs}s` : `+${m}m`;
  const h = Math.floor(m / 60);
  return `+${h}h ${m % 60}m`;
}

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6";

export default async function VisitorDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  if (!UUID_RE.test(sessionId)) notFound();
  if (!hasDatabase) {
    return <div className={card}>Database not configured.</div>;
  }

  const db = getDb();
  const visits = await db
    .select()
    .from(schema.visits)
    .where(eq(schema.visits.sessionId, sessionId))
    .orderBy(asc(schema.visits.createdAt));

  if (visits.length === 0) notFound();

  const first = visits[0];
  const last = visits[visits.length - 1];
  const totalDwell = visits.reduce((sum, v) => sum + (v.dwellMs ?? 0), 0);
  const span = last.createdAt.getTime() - first.createdAt.getTime();
  const isBotSession = visits.some((v) => v.isBot);
  const orgs = Array.from(
    new Set(visits.map((v) => v.org).filter(Boolean) as string[]),
  );
  const asns = Array.from(
    new Set(visits.map((v) => v.asn).filter(Boolean) as string[]),
  );
  const referrers = Array.from(
    new Set(visits.map((v) => v.referrer).filter(Boolean) as string[]),
  );
  const userAgents = Array.from(
    new Set(visits.map((v) => v.userAgent).filter(Boolean) as string[]),
  );
  const location =
    [first.city, first.region, first.country].filter(Boolean).join(", ") ||
    "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/visitors"
          className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)] hover:text-[var(--accent)]"
        >
          ← All visitors
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Session {sessionId.slice(0, 8)}
        </h1>
        <p className="mt-1 mono text-xs text-[var(--text)]">{sessionId}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Pages" value={String(visits.length)} />
        <Stat
          label="Span"
          value={
            span < 60_000
              ? `${Math.round(span / 1000)}s`
              : span < 3_600_000
                ? `${Math.round(span / 60_000)}m`
                : `${Math.round(span / 3_600_000)}h`
          }
        />
        <Stat label="Read time" value={formatDwell(totalDwell)} />
        <Stat
          label="Type"
          value={isBotSession ? "Bot" : "Human"}
          tone={isBotSession ? "amber" : "green"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
            Identity
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <Row
              label="Organization"
              value={orgs.length ? orgs.join(", ") : "—"}
            />
            <Row label="ASN" value={asns.length ? asns.join(", ") : "—"} />
            <Row label="Location" value={location} />
            <Row
              label="Referrers"
              value={referrers.length ? referrers.join(", ") : "Direct / none"}
            />
          </dl>
        </div>

        <div className={card}>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
            Browser
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <Row
              label="User-Agent"
              value={userAgents[0] ?? "—"}
              mono
            />
            <Row label="First seen" value={formatExact(first.createdAt)} />
            <Row label="Last seen" value={formatExact(last.createdAt)} />
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]/60">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
            Page-by-page timeline
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg)]/40">
              <tr className="text-left mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Gap</th>
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">Read time</th>
                <th className="px-4 py-3 font-medium">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => {
                const gap =
                  i === 0
                    ? 0
                    : v.createdAt.getTime() - visits[i - 1].createdAt.getTime();
                return (
                  <tr
                    key={v.id}
                    className="border-t border-[var(--border)]/60 hover:bg-[var(--surface2)]/40"
                  >
                    <td
                      className="px-4 py-3 mono text-xs text-[var(--text2)] whitespace-nowrap"
                      title={v.createdAt.toISOString()}
                    >
                      {formatExact(v.createdAt)}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--text)] whitespace-nowrap">
                      {i === 0 ? "—" : formatGap(gap)}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-white">
                      {v.path ?? `/${v.slug === "home" ? "" : v.slug}`}
                    </td>
                    <td className="px-4 py-3 mono text-xs text-[var(--text2)] whitespace-nowrap">
                      {formatDwell(v.dwellMs)}
                    </td>
                    <td
                      className="px-4 py-3 mono text-xs text-[var(--text)] truncate max-w-[280px]"
                      title={v.referrer ?? undefined}
                    >
                      {v.referrer ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <dt className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)] shrink-0 w-28 pt-1">
        {label}
      </dt>
      <dd
        className={`text-sm text-[var(--text2)] break-all ${mono ? "mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

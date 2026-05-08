// Server-rendered SVG charts. No client JS, no runtime dependency.
// Two primitives: a daily bar chart and a horizontal "ranked bars" list.

import type { DailyBucket } from "@/lib/analytics-queries";

const ACCENT = "var(--accent)";
const ACCENT_2 = "var(--accent2)";
const TEXT = "var(--text)";
const BORDER = "var(--border)";

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}

export function DailyBarChart({ data }: { data: DailyBucket[] }) {
  if (data.length === 0) {
    return (
      <div className="text-sm text-[var(--text)]">No traffic data yet.</div>
    );
  }

  const width = 720;
  const height = 180;
  const padX = 28;
  const padTop = 16;
  const padBottom = 28;

  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const maxY = Math.max(1, ...data.map((d) => d.pageviews));
  const barWidth = innerW / data.length;
  const gap = Math.max(1, barWidth * 0.18);

  // Y-axis ticks: 0 and max
  const tickValues = maxY <= 4 ? [0, maxY] : [0, Math.round(maxY / 2), maxY];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
      aria-label="Visitors over time"
    >
      {/* gridlines */}
      {tickValues.map((tv) => {
        const y = padTop + innerH - (tv / maxY) * innerH;
        return (
          <g key={tv}>
            <line
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke={BORDER}
              strokeWidth={1}
              strokeDasharray={tv === 0 ? "0" : "2 4"}
              opacity={0.6}
            />
            <text
              x={padX - 6}
              y={y + 3}
              fontSize={10}
              textAnchor="end"
              fill={TEXT}
              className="mono"
            >
              {tv}
            </text>
          </g>
        );
      })}

      {/* bars */}
      {data.map((d, i) => {
        const pvHeight = (d.pageviews / maxY) * innerH;
        const sessHeight = (d.sessions / maxY) * innerH;
        const x = padX + i * barWidth + gap / 2;
        const w = barWidth - gap;
        return (
          <g key={d.date.toISOString()}>
            {/* total pageviews bar (lighter, behind) */}
            <rect
              x={x}
              y={padTop + innerH - pvHeight}
              width={w}
              height={pvHeight}
              fill={ACCENT_2}
              opacity={0.35}
              rx={2}
            >
              <title>
                {`${d.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}: ${d.pageviews} pageviews · ${d.sessions} sessions`}
              </title>
            </rect>
            {/* sessions bar (front, vivid) */}
            <rect
              x={x}
              y={padTop + innerH - sessHeight}
              width={w}
              height={sessHeight}
              fill={ACCENT}
              rx={2}
            >
              <title>
                {`${d.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}: ${d.sessions} sessions`}
              </title>
            </rect>
          </g>
        );
      })}

      {/* x-axis labels: every Nth bar */}
      {data.map((d, i) => {
        const skip = data.length > 14 ? Math.ceil(data.length / 7) : 1;
        if (i % skip !== 0 && i !== data.length - 1) return null;
        const x = padX + i * barWidth + barWidth / 2;
        return (
          <text
            key={`label-${d.date.toISOString()}`}
            x={x}
            y={height - 8}
            fontSize={9}
            textAnchor="middle"
            fill={TEXT}
            className="mono"
          >
            {shortDate(d.date)}
          </text>
        );
      })}
    </svg>
  );
}

export function RankedBars({
  rows,
  formatValue,
  hint,
}: {
  rows: { label: string; value: number; sub?: string }[];
  formatValue?: (n: number) => string;
  hint?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="text-sm text-[var(--text)]">
        {hint ?? "No data yet."}
      </div>
    );
  }

  const max = Math.max(1, ...rows.map((r) => r.value));
  const fmt = formatValue ?? ((n: number) => n.toLocaleString());

  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const pct = (r.value / max) * 100;
        return (
          <li key={r.label} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-white truncate" title={r.label}>
                {r.label}
              </span>
              <span className="mono text-xs text-[var(--text2)] shrink-0">
                {r.sub ? <span className="mr-2">{r.sub}</span> : null}
                {fmt(r.value)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--border)]/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Donut({
  segments,
  total,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
  centerLabel: string;
  centerValue: string;
}) {
  const size = 140;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  const safeTotal = Math.max(1, total);

  // Pre-compute each segment's dash geometry so we don't mutate state during
  // render (React 19's immutability rule).
  const positioned = segments.reduce<
    Array<{ s: (typeof segments)[number]; len: number; offset: number }>
  >((acc, s) => {
    const prevOffset = acc.length === 0 ? 0 : acc[acc.length - 1].offset + acc[acc.length - 1].len;
    const len = (s.value / safeTotal) * c;
    acc.push({ s, len, offset: prevOffset });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="shrink-0">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {positioned.map(({ s, len, offset }) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          >
            <title>{`${s.label}: ${s.value}`}</title>
          </circle>
        ))}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize={20}
          fontWeight={700}
          fill="white"
        >
          {centerValue}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize={9}
          fill={TEXT}
          className="mono uppercase"
          letterSpacing={2}
        >
          {centerLabel}
        </text>
      </svg>
      <ul className="text-sm space-y-1">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[var(--text2)]">{s.label}</span>
            <span className="mono text-xs text-[var(--text)] ml-auto">
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

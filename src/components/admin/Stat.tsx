// Single shared Stat tile used across every admin page (Overview,
// Analytics, Visitor detail, Security). Replaces four near-identical inline
// implementations that diverged subtly.

type Tone = "accent" | "accent2" | "green" | "amber" | "rose" | "muted" | "default";
type Size = "lg" | "md";

type Props = {
  label: string;
  value: string | number;
  tone?: Tone;
  /** Optional sub-label rendered under the value. */
  sub?: string;
  /** "lg" = text-3xl (marquee). "md" = text-2xl (default). */
  size?: Size;
};

const toneClass: Record<Tone, string> = {
  accent: "text-[var(--accent)]",
  accent2: "text-[var(--accent2)]",
  green: "text-[var(--green)]",
  amber: "text-[var(--amber)]",
  rose: "text-[var(--rose)]",
  muted: "text-[var(--text2)]",
  default: "text-white",
};

export default function Stat({
  label,
  value,
  tone = "default",
  sub,
  size = "lg",
}: Props) {
  const valueText = typeof value === "number" ? value.toLocaleString() : value;
  const sizeClass = size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
        {label}
      </div>
      <div className={`mt-2 ${sizeClass} font-bold tracking-tight ${toneClass[tone]}`}>
        {valueText}
      </div>
      {sub ? (
        <div className="mt-1 text-xs text-[var(--text)]">{sub}</div>
      ) : null}
    </div>
  );
}

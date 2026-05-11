// Single shared Stat tile used across every admin page (Overview,
// Analytics, Visitor detail, Security). Replaces four near-identical inline
// implementations that diverged subtly.

import InfoTooltip from "./InfoTooltip";

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
  /**
   * Optional explainer rendered as a tiny `i` icon in the top-right.
   * Hover to peek, click to pin. Three sections: what the card holds,
   * what it tells you, and how the underlying number is computed.
   */
  info?: { has: string; does: string; how: string };
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
  info,
}: Props) {
  const valueText = typeof value === "number" ? value.toLocaleString() : value;
  const sizeClass = size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
      {info ? (
        <div className="absolute top-3 right-3">
          <InfoTooltip {...info} />
        </div>
      ) : null}
      <div className={`mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)] ${info ? "pr-6" : ""}`}>
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

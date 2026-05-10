// Composable diagram primitives for case-study architecture sections.
//
// Built specifically because the previous ASCII-art `<pre>` blocks were
// fragile across fonts and didn't read as polished. Everything here is
// pure JSX + Tailwind so diagrams server-render with no JS, no font
// lottery, and no external dependency. Each case study composes its
// architecture from these primitives in `src/lib/case-studies/*.tsx`.

import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "accent2" | "green" | "amber" | "rose";

const toneClasses: Record<
  Tone,
  { border: string; bg: string; label: string; ring: string }
> = {
  neutral: {
    border: "border-[var(--border)]",
    bg: "bg-[var(--bg)]/40",
    label: "text-[var(--text)]",
    ring: "shadow-[0_0_0_1px_rgba(148,163,184,0.04)]",
  },
  accent: {
    border: "border-[var(--accent)]/35",
    bg: "bg-[var(--accent)]/[0.05]",
    label: "text-[var(--accent)]",
    ring: "shadow-[0_0_0_1px_rgba(56,189,248,0.08)]",
  },
  accent2: {
    border: "border-[var(--accent2)]/35",
    bg: "bg-[var(--accent2)]/[0.05]",
    label: "text-[var(--accent2)]",
    ring: "shadow-[0_0_0_1px_rgba(129,140,248,0.08)]",
  },
  green: {
    border: "border-[var(--green)]/35",
    bg: "bg-[var(--green)]/[0.05]",
    label: "text-[var(--green)]",
    ring: "shadow-[0_0_0_1px_rgba(52,211,153,0.08)]",
  },
  amber: {
    border: "border-[var(--amber)]/40",
    bg: "bg-[var(--amber)]/[0.05]",
    label: "text-[var(--amber)]",
    ring: "shadow-[0_0_0_1px_rgba(251,191,36,0.08)]",
  },
  rose: {
    border: "border-[var(--rose)]/40",
    bg: "bg-[var(--rose)]/[0.05]",
    label: "text-[var(--rose)]",
    ring: "shadow-[0_0_0_1px_rgba(244,63,94,0.08)]",
  },
};

/** Outer canvas — wraps a stack of rows / boxes / arrows. */
export function Diagram({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 sm:p-8">
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

/** Titled container with optional inner content (steps, prose, code). */
export function DiagramBox({
  label,
  tone = "neutral",
  children,
  className = "",
}: {
  label?: string;
  tone?: Tone;
  children?: ReactNode;
  className?: string;
}) {
  const t = toneClasses[tone];
  return (
    <div
      className={`rounded-xl border ${t.border} ${t.bg} ${t.ring} px-5 py-4 min-w-0 overflow-hidden ${className}`}
    >
      {label ? (
        <div
          className={`mono text-[10px] uppercase tracking-[0.2em] ${t.label} break-words ${
            children ? "mb-3" : ""
          }`}
        >
          {label}
        </div>
      ) : null}
      {children ? (
        <div className="space-y-1.5 mono text-[12.5px] leading-[1.55] text-[var(--text2)] break-words">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Numbered or labelled step row inside a box. */
export function DiagramStep({
  n,
  children,
  hint,
}: {
  n?: number | string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      {n !== undefined ? (
        <span className="mono text-[11px] tabular-nums text-[var(--accent)] shrink-0 w-5">
          {n}.
        </span>
      ) : null}
      <div className="flex-1 min-w-0">{children}</div>
      {hint ? (
        <span className="mono text-[10px] text-[var(--text)] shrink-0 whitespace-nowrap">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/** Inline code snippet — distinct from the surrounding mono prose.
 *  Wraps inside narrow grid cells (the long `Service::method` strings in
 *  payment/automation diagrams used to bleed past the box edge). */
export function DiagramCode({ children }: { children: ReactNode }) {
  return (
    <code className="mono text-[12px] text-white px-1.5 py-0.5 rounded-md border border-[var(--border)]/70 bg-[var(--bg)]/60 break-all whitespace-normal inline-block max-w-full">
      {children}
    </code>
  );
}

/** Vertical-down arrow with optional label. */
export function DiagramArrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <svg
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-[var(--text)]/80"
        aria-hidden="true"
      >
        <line x1="7" y1="0" x2="7" y2="14" strokeLinecap="round" />
        <path
          d="M2 12 L7 18 L12 12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {label ? (
        <span className="mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--text)]">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Side-by-side group of children — wraps to a column on small screens. */
export function DiagramRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch ${className}`}
    >
      {children}
    </div>
  );
}

/** Branch label — small chip used over a route/decision split. */
export function DiagramBranch({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  const t = toneClasses[tone];
  return (
    <div className="flex justify-center">
      <span
        className={`mono text-[10px] uppercase tracking-[0.18em] ${t.label} border ${t.border} ${t.bg} rounded-full px-3 py-1`}
      >
        {label}
      </span>
    </div>
  );
}

/** Inline tag — shown next to a step ("0 tokens", "← scrub PII"). */
export function DiagramHint({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const t = toneClasses[tone];
  return (
    <span
      className={`mono text-[10px] uppercase tracking-[0.16em] ${t.label}`}
    >
      {children}
    </span>
  );
}

/** Section heading inside a Diagram (e.g. "Routing decision"). */
export function DiagramHeading({ children }: { children: ReactNode }) {
  return (
    <div className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--text)] pt-1">
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

// Status pill / chip used in the hero row and (eventually) anywhere the
// "rounded-full mono-uppercase tag" pattern is needed. Wraps the wrapper
// className that gets copy-pasted at every call site, but keeps the icon
// as a ReactNode so callers stay in control of the icon's own classes
// (the green "Open to roles" chip uses a pulse dot, others use SVGs).

type Color = "green" | "accent" | "muted";

// Split into border/bg and text-color halves so the rendered class-string
// order matches the original inline JSX exactly — preserves byte-identical
// HTML output (verified via HTML snapshot diff during the refactor pass).
const colorBorderBg: Record<Color, string> = {
  green: "border-[var(--green)]/40 bg-[var(--green)]/10",
  accent: "border-[var(--accent)]/30 bg-[var(--accent)]/10",
  muted: "border-[var(--border)] bg-[var(--surface)]/60",
};

const colorText: Record<Color, string> = {
  green: "text-[var(--green)]",
  accent: "text-[var(--accent)]",
  muted: "text-[var(--text2)]",
};

type Props = {
  color: Color;
  icon?: ReactNode;
  children: ReactNode;
};

export default function StatusChip({ color, icon, children }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorBorderBg[color]} px-3 py-1.5 mono text-[10px] uppercase tracking-[0.16em] ${colorText[color]}`}
    >
      {icon}
      {children}
    </span>
  );
}

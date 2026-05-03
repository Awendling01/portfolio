import type { ReactNode } from "react";

type Color = "accent" | "accent2" | "green" | "amber" | "rose";

type Props = {
  color?: Color;
  children: ReactNode;
  className?: string;
};

const colorMap: Record<Color, string> = {
  accent: "bg-[var(--accent)]/12 text-[var(--accent)] border-[var(--accent)]/30",
  accent2:
    "bg-[var(--accent2)]/12 text-[var(--accent2)] border-[var(--accent2)]/30",
  green: "bg-[var(--green)]/12 text-[var(--green)] border-[var(--green)]/30",
  amber: "bg-[var(--amber)]/12 text-[var(--amber)] border-[var(--amber)]/30",
  rose: "bg-[var(--rose)]/12 text-[var(--rose)] border-[var(--rose)]/30",
};

export default function Badge({
  color = "accent",
  children,
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide uppercase mono ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
}

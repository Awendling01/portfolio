import type { HTMLAttributes } from "react";

type Padding = "compact" | "default" | "tight" | "large";

type Props = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  /**
   * Padding variants are responsive — mobile gets less padding so content
   * has room to breathe at narrow viewports, desktop gets the larger
   * editorial padding the design calls for.
   *
   * - "default" → p-5 sm:p-7 lg:p-8 (project / sales cards)
   * - "compact" → p-5 sm:p-6 (admin stat tiles, dashboards)
   * - "tight"   → p-4 sm:p-5 (dense list rows)
   * - "large"   → p-6 sm:p-8 lg:p-10 (bio / CTA hero cards)
   */
  padding?: Padding;
};

const paddingClass: Record<Padding, string> = {
  default: "p-5 sm:p-7 lg:p-8",
  compact: "p-5 sm:p-6",
  tight: "p-4 sm:p-5",
  large: "p-6 sm:p-8 lg:p-10",
};

export default function Card({
  className = "",
  hover = true,
  padding = "default",
  ...rest
}: Props) {
  const hoverStyles = hover
    ? "transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--accent)]/60 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.25)]"
    : "";
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm ${paddingClass[padding]} ${hoverStyles} ${className}`}
      {...rest}
    />
  );
}

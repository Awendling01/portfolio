import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export default function Card({
  className = "",
  hover = true,
  ...rest
}: Props) {
  const hoverStyles = hover
    ? "transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--accent)]/60 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.25)]"
    : "";
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm p-7 sm:p-8 ${hoverStyles} ${className}`}
      {...rest}
    />
  );
}

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const baseStyles =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium tracking-tight transition-all duration-200 will-change-transform";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] hover:-translate-y-[1px]",
  outline:
    "border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-white hover:-translate-y-[1px]",
  ghost: "text-[var(--text2)] hover:text-white hover:bg-[var(--surface)]",
};

export default function Button({
  href,
  variant = "primary",
  external,
  className = "",
  children,
  ...rest
}: Props) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;
  if (external || /^https?:\/\//.test(href) || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

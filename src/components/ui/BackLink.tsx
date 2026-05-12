import Link from "next/link";
import type { ReactNode } from "react";
import Container from "./Container";

// Mono-uppercase back link at the top of deep-dive pages. Wrapped in a
// Container so callers don't repeat the same outer layout. Used by the
// three project deep-dive pages (/work/moniscope, /work/shopify,
// /work/futureshirts) — same className, same vertical padding.
//
// CaseStudyHero has its own inline back-link with a dynamic project
// label; it isn't migrated here because it lives in a different layout
// context (no surrounding Container).

type Props = {
  href: string;
  children: ReactNode;
};

export default function BackLink({ href, children }: Props) {
  return (
    <Container>
      <div className="pt-[60px] pb-3">
        <Link
          href={href}
          className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        >
          {children}
        </Link>
      </div>
    </Container>
  );
}

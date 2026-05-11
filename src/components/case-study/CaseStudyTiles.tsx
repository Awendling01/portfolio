import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";

type Props = {
  /**
   * Base path for the project (e.g. "/work/moniscope" or "/work/shopify").
   * Each tile links to `${basePath}/${slug}`.
   */
  basePath: string;
  /** Ordered list of case-study slugs to render. */
  order: readonly string[];
  /** Lookup table from slug → CaseStudy, supplied by the caller. */
  studies: Record<string, CaseStudy>;
};

export default function CaseStudyTiles({ basePath, order, studies }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {order.map((slug) => {
        const study = studies[slug];
        if (!study) return null;
        return (
          <Link
            key={slug}
            href={`${basePath}/${slug}`}
            className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 transition-all hover:-translate-y-[2px] hover:border-[var(--accent)]/50 hover:shadow-[0_24px_60px_-28px_rgba(56,189,248,0.25)]"
          >
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
              {study.number}
            </div>
            <h3 className="mt-2 text-[18px] font-semibold leading-[1.25] text-white group-hover:text-[var(--accent)] transition-colors">
              {study.shortTitle}
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-[1.55] text-[var(--text)]">
              {study.oneLiner}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
              Read case study →
            </span>
          </Link>
        );
      })}
    </div>
  );
}

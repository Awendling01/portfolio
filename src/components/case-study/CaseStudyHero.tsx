import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";
import InlineCode from "./InlineCode";

type Props = {
  study: CaseStudy;
  /**
   * Display label for the parent project (e.g. "MONISCOPE", "Off-Roading E-Commerce").
   * Shown in the eyebrow + back-link.
   */
  projectLabel: string;
  /** URL of the parent project page (e.g. `/work/moniscope` or `/work/shopify`). */
  projectHref: string;
};

export default function CaseStudyHero({
  study,
  projectLabel,
  projectHref,
}: Props) {
  return (
    <>
      <div className="pt-[60px] pb-3">
        <Link
          href={projectHref}
          className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        >
          ← Back to {projectLabel}
        </Link>
      </div>

      <section className="pt-4 pb-10">
        <div className="mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
          Case study {study.number} · {projectLabel}
        </div>
        <h1 className="mt-3.5 text-[clamp(28px,7vw,50px)] font-extrabold tracking-[-0.025em] text-white leading-[1.08] break-words">
          {study.title}
        </h1>
        <p className="mt-5 max-w-[720px] text-[17px] leading-[1.7] text-[var(--text2)]">
          <InlineCode>{study.lede}</InlineCode>
        </p>

        {study.pullQuote ? (
          <div className="mt-5 rounded-r-lg border-l-[3px] border-[var(--accent)] bg-[var(--accent)]/[0.07] px-5 py-4 text-[16px] leading-[1.6] text-[var(--text2)]">
            <InlineCode>{study.pullQuote}</InlineCode>
          </div>
        ) : null}

        <div className="mt-6 rounded-r-lg border-l-[3px] border-[var(--accent2)] bg-[var(--accent2)]/[0.07] px-5 py-3.5 text-[14px] text-[var(--text2)]">
          <InlineCode>{study.prelaunchNote}</InlineCode>
        </div>
      </section>
    </>
  );
}

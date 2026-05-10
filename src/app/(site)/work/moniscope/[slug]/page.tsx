import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import WhereItShowsUp from "@/components/case-study/WhereItShowsUp";
import WhyTiles from "@/components/case-study/WhyTiles";
import CodeFlow from "@/components/case-study/CodeFlow";
import InlineCode from "@/components/case-study/InlineCode";
import {
  getMoniscopeCaseStudy,
  getAdjacentCaseStudies,
  moniscopeCaseStudyOrder,
  type MoniscopeCaseStudySlug,
} from "@/lib/case-studies";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return moniscopeCaseStudyOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getMoniscopeCaseStudy(slug);
  if (!study) return { title: "Not found" };
  return {
    title: `${study.shortTitle} · MONISCOPE case study`,
    description: study.oneLiner,
    alternates: { canonical: `/work/moniscope/${slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = getMoniscopeCaseStudy(slug);
  if (!study) notFound();

  const { prev, next } = getAdjacentCaseStudies(slug as MoniscopeCaseStudySlug);

  return (
    <>
      <Container>
        <CaseStudyHero
          study={study}
          projectLabel="MONISCOPE"
          projectHref="/work/moniscope"
        />
      </Container>

      <section className="py-9">
        <Container>
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
            {study.whereSection.tag}
          </div>
          <h2 className="text-[26px] font-bold tracking-tight text-white mb-3">
            {study.whereSection.heading}
          </h2>
          <WhereItShowsUp data={study.whereItShowsUp} />
        </Container>
      </section>

      <section className="py-9">
        <Container>
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
            {study.whySection.tag}
          </div>
          <h2 className="text-[26px] font-bold tracking-tight text-white mb-4">
            {study.whySection.heading}
          </h2>
          <WhyTiles tiles={study.whyTiles} />
        </Container>
      </section>

      <section className="py-9">
        <Container>
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
            {study.architectureSection.tag}
          </div>
          <h2 className="text-[26px] font-bold tracking-tight text-white mb-3">
            {study.architectureSection.heading}
          </h2>
          {study.architectureDiagram}
        </Container>
      </section>

      <section className="py-9">
        <Container>
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-3">
            {study.snippetsSection.tag}
          </div>
          <h2 className="text-[26px] font-bold tracking-tight text-white mb-3">
            {study.snippetsSection.heading}
          </h2>
          <p className="text-[var(--text)] max-w-[720px] mb-2">
            <InlineCode>{study.snippetsSection.intro}</InlineCode>
          </p>
          <CodeFlow snippets={study.snippets} />
        </Container>
      </section>

      <section className="py-9">
        <Container>
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)]/40 px-6 py-5">
            <h4 className="mono text-[12px] uppercase tracking-[0.18em] text-[var(--text)]">
              Source
            </h4>
            <p className="mt-1.5 text-[13.5px] text-[var(--text2)]">
              <InlineCode>{study.sourceFooter}</InlineCode>
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="flex flex-wrap gap-3">
            {prev ? (
              <Link
                href={`/work/moniscope/${prev.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-tight rounded-full border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-white transition-all"
              >
                ← {prev.shortTitle}
              </Link>
            ) : null}
            <Link
              href="/work/moniscope"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-tight rounded-full border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-white transition-all"
            >
              Back to MONISCOPE
            </Link>
            {next ? (
              <Link
                href={`/work/moniscope/${next.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-tight rounded-full border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-white transition-all"
              >
                {next.shortTitle} →
              </Link>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}

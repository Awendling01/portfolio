import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CaseStudyTiles from "@/components/case-study/CaseStudyTiles";
import {
  kioskCaseStudies,
  kioskCaseStudyOrder,
} from "@/lib/case-studies";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "offroad-kiosk");

export const metadata: Metadata = {
  title: "AI Trade-Show Kiosk + Shopify Engagement",
  description:
    "Two-device trade-show kiosk built for an off-roading e-commerce client. Four-model AI image pipeline (gpt-image-1.5, gpt-4o-mini, Claid 4× upscale, Replicate rembg) with a 7-level fallback chain, plus the full Shopify/Klaviyo/Recharge delivery. Two engineering deep-dives — the AI pipeline and the prompt-engineering harness.",
};

export default function KioskDetailPage() {
  if (!project) notFound();

  return (
    <>
      <Container>
        <div className="pt-[60px] pb-3">
          <Link
            href="/work"
            className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            ← Back to Work
          </Link>
        </div>
      </Container>

      <section className="pt-4 pb-10">
        <Container>
          <ScrollReveal>
            <ProjectCard project={project} />
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Engineering Case Studies"
              title="Two deep-dives into the AI surface"
              subtitle="The kiosk is an AI feature wrapped in a UI — these are the parts worth showing. Each case study is a focused walkthrough — architecture, the engineering 'why,' and real annotated source. Each is independently linkable, so you can share the one that matches the role."
            />
          </ScrollReveal>
          <ScrollReveal>
            <CaseStudyTiles
              basePath="/work/kiosk"
              order={kioskCaseStudyOrder}
              studies={kioskCaseStudies}
            />
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Card
            padding="large"
            hover={false}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Want to see the harness or the diagnostics object?
              </h3>
              <p className="mt-2 text-sm text-[var(--text)] max-w-xl">
                Happy to walk through the 8-prompt comparison run, the
                per-phase ms timings, or the full 7-level routing decision
                on a call.
              </p>
            </div>
            <Button href="/contact">Get In Touch</Button>
          </Card>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/ui/BackLink";
import Container from "@/components/ui/Container";
import CtaCard from "@/components/ui/CtaCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import CaseStudyTiles from "@/components/case-study/CaseStudyTiles";
import {
  moniscopeCaseStudies,
  moniscopeCaseStudyOrder,
} from "@/lib/case-studies";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "moniscope");

export const metadata: Metadata = {
  title: "MONISCOPE — Multi-Tenant Self-Storage SaaS (Founder + Sole Engineer)",
  description:
    "Multi-tenant SaaS for the self-storage industry, built for Spanish Fort Self Storage (my family's operation) and designed to serve operators beyond it. Five engineering deep-dives — AI assistant, multi-processor payments, automation engine, event-driven architecture, and reporting engine.",
};

export default function MoniscopeDetailPage() {
  if (!project) notFound();

  return (
    <>
      <BackLink href="/work">← Back to Work</BackLink>

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
              title="Five deep-dives into the parts worth showing"
              subtitle="Pre-launch product, production-grade code. Each case study is a focused walkthrough — architecture, the engineering 'why,' and real annotated source. Each is independently linkable, so you can share the one that matches the role."
            />
          </ScrollReveal>
          <ScrollReveal>
            <CaseStudyTiles
              basePath="/work/moniscope"
              order={moniscopeCaseStudyOrder}
              studies={moniscopeCaseStudies}
            />
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <CtaCard
            heading="Want a guided walkthrough?"
            body="Live demos, deeper architecture conversations, or specific code on request. Always happy to talk through this stuff."
          />
        </Container>
      </section>
    </>
  );
}

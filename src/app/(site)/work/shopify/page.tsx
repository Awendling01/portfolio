import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/ui/BackLink";
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
  title: "Off-Roading E-Commerce Engagement",
  description:
    "Multi-system Shopify engagement for an off-roading e-commerce client: 61-section admin audit, 3 Klaviyo flows built from scratch (Welcome, Browse Abandonment, Abandoned Cart), custom JavaScript dwell-time tracking feeding 6-path Django conditional upsells, Shopify Flow customer-tagging architecture, JSON-LD schema deployment, 5-email Recharge failed-payment recovery, Meta catalog repair — plus a two-device AI trade-show kiosk proposed and built mid-engagement after observing customer pain at a booth. Three engineering deep-dives: AI image pipeline, prompt-engineering harness, and Klaviyo personalization architecture.",
};

export default function KioskDetailPage() {
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
              title="Three engineering deep-dives"
              subtitle="Two on the AI kiosk surface (image pipeline + prompt-engineering harness), one on the Shopify side of the engagement (Klaviyo personalization architecture — dwell-time JS, customer-tag taxonomy, 6-path Django conditional logic). Each is a focused walkthrough — architecture, the engineering 'why,' and real annotated source. Independently linkable, so share the one that matches the role."
            />
          </ScrollReveal>
          <ScrollReveal>
            <CaseStudyTiles
              basePath="/work/shopify"
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

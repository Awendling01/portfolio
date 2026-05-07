import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import Button from "@/components/ui/Button";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Full case studies of Andrew Wendling's recent engineering work — SaaS platforms, AI-powered kiosks, e-commerce consulting, ERP systems, and fintech.",
};

export default function WorkPage() {
  return (
    <>
      <section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
        <Container>
          <SectionHeader
            tag="Case Studies"
            title="Selected work, with the boring parts left in"
            subtitle="Five projects across SaaS, contract, and full-time roles. What I built, what shipped, what mattered to the business."
          />
        </Container>
      </section>
      <section className="py-10 sm:py-12">
        <Container>
          <div className="space-y-6">
            {projects.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 60}>
                <ProjectCard project={p} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-20">
        <Container>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Want a deeper walkthrough?
              </h3>
              <p className="mt-2 text-sm text-[var(--text)] max-w-xl">
                Happy to share live demos, architecture diagrams, or specific
                code. Just send me a note.
              </p>
            </div>
            <Button href="/contact">Get In Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

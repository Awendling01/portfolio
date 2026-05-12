import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import CtaCard from "@/components/ui/CtaCard";
import { projects, type Project } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Full case studies of recent engineering work — Shopify operations and integrations, multi-tenant SaaS, FinTech, and local SEO. Grouped by capability so platform-specific reviewers can scan to the section that matters.",
};

// Themed groups so a recruiter scanning for "Shopify experience" hits a
// section header instead of mining 5 mixed project cards. Order matches
// the CLAUDE.md positioning statement (Shopify integrations lead).
const groups: { tag: string; title: string; slugs: string[] }[] = [
  {
    tag: "Shopify & E-Commerce",
    title: "Shopify operations + integrations at scale",
    slugs: ["offroad-kiosk", "futureshirts-erp"],
  },
  {
    tag: "Multi-Tenant SaaS",
    title: "Founder + sole engineer",
    slugs: ["moniscope"],
  },
  {
    tag: "Local SEO + Analytics",
    title: "Concurrent consulting",
    slugs: ["local-service-seo"],
  },
  {
    tag: "FinTech",
    title: "Cross-platform banking",
    slugs: ["trabian-mvb-fintech"],
  },
];

function detailHref(slug: string): string | undefined {
  if (slug === "moniscope") return "/work/moniscope";
  if (slug === "offroad-kiosk") return "/work/shopify";
  if (slug === "futureshirts-erp") return "/work/futureshirts";
  return undefined;
}

const bySlug = new Map<string, Project>(projects.map((p) => [p.slug, p]));

export default function WorkPage() {
  return (
    <>
      <section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
        <Container>
          <SectionHeader
            tag="Case Studies"
            title="Selected work, with the boring parts left in"
            subtitle="Grouped by capability — Shopify operations and integrations, multi-tenant SaaS, FinTech, and local SEO — so platform-specific reviewers can scan to the section that matters."
          />
        </Container>
      </section>

      {groups.map((group) => (
        <section key={group.tag} className="py-10 sm:py-12">
          <Container>
            <ScrollReveal>
              <SectionHeader tag={group.tag} title={group.title} />
            </ScrollReveal>
            <div className="space-y-6 mt-8">
              {group.slugs.map((slug, i) => {
                const project = bySlug.get(slug);
                if (!project) return null;
                return (
                  <section key={slug} id={slug}>
                    <ScrollReveal delay={i * 60}>
                      <ProjectCard
                        project={project}
                        density="wide"
                        detailHref={detailHref(slug)}
                      />
                    </ScrollReveal>
                  </section>
                );
              })}
            </div>
          </Container>
        </section>
      ))}

      <section className="py-20">
        <Container>
          <CtaCard
            heading="Want a deeper walkthrough?"
            body="Happy to share live demos, architecture diagrams, or specific code. Just send me a note."
          />
        </Container>
      </section>
    </>
  );
}

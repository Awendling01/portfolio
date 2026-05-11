import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "futureshirts-erp");

export const metadata: Metadata = {
  title: "FutureShirts — Internal ERP / IMS",
  description:
    "Three years contributing extensively to an internal ERP / IMS at a full-service entertainment merchandise company. Carrier API + Google Maps Geocoding, Shopify Admin GraphQL across 55+ artist storefronts, finance + operations reporting, codebase Vue 2 → 3 Composition API migration, Domain-Driven Design Laravel architecture, and Cypress test mentorship of a junior dev. Reported to the SVP of IT.",
};

type SectionGroup = {
  heading: string;
  body: string;
  bullets: string[];
};

const architecture: SectionGroup[] = [
  {
    heading: "Domain-Driven Design",
    body: "Business operations modeled as discrete action classes — one class, one verb, one return shape. Cross-feature side effects went through domain events so the carrier-API path didn't have to know what the reporting path cared about.",
    bullets: [
      "Action classes for business operations — single-responsibility, testable in isolation",
      "Domain events for cross-feature communication — listeners registered per concern, no implicit coupling",
      "Repository pattern over raw Eloquent in the hot paths (shipment, order sync, GraphQL fan-out)",
      "Controllers thin: validate → dispatch action → return view / JSON",
    ],
  },
  {
    heading: "Codebase Vue 2 → 3 Composition API migration",
    body: "Inherited a Vue 2 Options API codebase. Migrated component-by-component to Vue 3 + Composition API across the project's lifetime, shipping in chunks so each merge stayed reviewable and the app stayed deployable the whole time.",
    bullets: [
      "Per-component conversion: data/methods/computed → ref / reactive / computed under setup()",
      "Standardized on TypeScript-friendly patterns so future hires didn't need to relearn the conventions",
      "Behind Inertia.js — the modern monolith pattern, no separate SPA build pipeline",
    ],
  },
];

const integrations: SectionGroup[] = [
  {
    heading: "Carrier APIs + address validation",
    body: "Multi-carrier shipping (USPS, FedEx, DHL) routed through EZPost as the single integration surface. Inbound webhook events updated order state; outbound calls were rate-limited and retry-safe.",
    bullets: [
      "EZPost as the carrier-API abstraction layer — one shape, three downstream providers",
      "Webhook handlers for tracking-event updates (in transit / delivered / exception)",
      "Google Maps Geocoding API for shipping-address validation + zone lookups before label generation",
    ],
  },
  {
    heading: "Shopify Admin GraphQL across 55+ artist storefronts",
    body: "Each artist had their own Shopify store. The internal ERP needed live product, inventory, and order data across the entire fleet — couldn't poll REST without rate-limiting everyone. GraphQL Admin API with batched queries and paginated cursors was the right shape.",
    bullets: [
      "Live product / order / inventory queries against the Admin GraphQL API",
      "Batched queries to stay inside Shopify's leaky-bucket rate limits",
      "55+ storefronts feeding a single internal view",
    ],
  },
  {
    heading: "atVenu POS sync for tour merchandise",
    body: "Tour shows ran live-event POS through atVenu. Sales data fed back into the ERP nightly so finance and tour managers saw the same numbers without manually exporting CSVs.",
    bullets: [
      "Scheduled sync into the internal data model",
      "Reconciled against Shopify online-sale data for unified per-artist reporting",
    ],
  },
];

const reportingBullets: string[] = [
  "Finance dashboards — revenue, refunds, fees, per-artist splits",
  "Operations dashboards — pick rate, ship rate, inventory aging, returns",
  "On-demand pulls for tour managers and artist managers",
  "Exportable to CSV / PDF for the finance close cycle",
];

const processBullets: string[] = [
  "Jira sprint-planning input — proposed scope, surfaced dependencies, sized stories before sprint kickoff (not just executing the planned work)",
  "Cypress test-suite mentoring of a junior dev — pairing on selectors, fixtures, and CI integration until they could own the test gate",
  "Code reviews + daily standups on a hybrid team (in-office + remote)",
  "Laracon attendee — kept current on the Laravel ecosystem outside the day job",
];

function SectionList({ groups }: { groups: SectionGroup[] }) {
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <Card key={g.heading} hover={false}>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {g.heading}
          </h3>
          <p className="mt-2 text-[15px] text-[var(--text)] leading-relaxed">
            {g.body}
          </p>
          <ul className="mt-4 space-y-2.5">
            {g.bullets.map((b) => (
              <li
                key={b}
                className="relative pl-5 text-sm text-[var(--text2)] leading-relaxed"
              >
                <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                {b}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

function PlainBulletList({ items }: { items: string[] }) {
  return (
    <Card hover={false}>
      <ul className="space-y-2.5">
        {items.map((b) => (
          <li
            key={b}
            className="relative pl-5 text-sm text-[var(--text2)] leading-relaxed"
          >
            <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            {b}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function FutureShirtsDetailPage() {
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

      <section className="py-12 sm:py-16">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Architecture"
              title="Domain-Driven Design + a codebase Vue migration"
              subtitle="The work that wasn't visible to anyone outside the dev team but shaped every feature shipped on top of it."
            />
          </ScrollReveal>
          <ScrollReveal>
            <SectionList groups={architecture} />
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Integrations"
              title="Shipping, storefronts, and live-event POS"
              subtitle="Three external surfaces feeding one internal ERP."
            />
          </ScrollReveal>
          <ScrollReveal>
            <SectionList groups={integrations} />
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Reporting & internal tooling"
              title="Numbers the finance and operations teams trusted"
              subtitle="Dashboards built for the people closing the books and the people shipping the boxes."
            />
          </ScrollReveal>
          <ScrollReveal>
            <PlainBulletList items={reportingBullets} />
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Process & growth"
              title="Sprint input, mentoring, and staying current"
              subtitle="Three years on the same team is enough to do more than execute tickets."
            />
          </ScrollReveal>
          <ScrollReveal>
            <PlainBulletList items={processBullets} />
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
                Want to talk through any of this on a call?
              </h3>
              <p className="mt-2 text-sm text-[var(--text)] max-w-xl">
                Happy to walk through the DDD architecture, the Vue migration
                approach, or any of the integration surfaces in more detail.
              </p>
            </div>
            <Button href="/contact">Get In Touch</Button>
          </Card>
        </Container>
      </section>
    </>
  );
}

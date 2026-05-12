import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SalesSection from "@/components/sales/SalesSection";
import SalesCard from "@/components/sales/SalesCard";
import EducationCard from "@/components/about/EducationCard";
import { salesRoles, education, contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Andrew Wendling is a full-stack engineer with 5+ years in production SaaS and 6+ years in sales leadership. Based in Spanish Fort, AL.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
        <Container>
          <SectionHeader
            tag="About"
            title="5+ years engineering. Top-3% sales background underneath."
            subtitle="Engineering is the work — multi-tenant SaaS, AI integrations, and production builds against Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost, and Google Business Profile. Sales is the multiplier, not the origin story."
          />
        </Container>
      </section>

      {/* Bio */}
      <section className="pb-12">
        <Container>
          <ScrollReveal>
            <Card padding="large" hover={false} className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-5 text-[var(--text2)] text-[15px] leading-relaxed">
                <p>
                  I&apos;m Andy Wendling — a full-stack software engineer in
                  Spanish Fort, Alabama. Laravel, Vue, Inertia.js, and Node.js
                  on the backend, React and Next.js on the frontend, and
                  production integrations against Shopify, Stripe, Twilio,
                  Klaviyo, Recharge, Plaid, EZPost, and Google Business
                  Profile.
                </p>
                <p>
                  Right now I&apos;m building{" "}
                  <span className="text-white font-medium">MONISCOPE</span> — a
                  multi-tenant SaaS for the self-storage industry, designed
                  around Spanish Fort Self Storage (my family&apos;s
                  operation) and built to serve operators beyond it. 1,852+
                  automated tests, a 9-stage delinquency state machine
                  implementing Alabama lien law, two-way SMS via Twilio over
                  Reverb WebSockets, yield pricing, a 6-report engine, and AI
                  features through the Anthropic API. Claude Code runs as a
                  structured development partner — multi-session
                  architectural sweeps and JSON handoff logs. I architect the
                  systems; the test suite is the gate.
                </p>
                <p>
                  Before MONISCOPE: three years at FutureShirts contributing
                  extensively to an internal ERP that processes 200,000+
                  packages a year across 55+ artist storefronts. The role was
                  full SDLC on a hybrid team — daily standups, refinement /
                  grooming, weekly PM syncs, Jira-driven sprints, code
                  reviews, two-plus days a week in office, remote the rest.
                  Before that: 14 months on React / React Native / GraphQL
                  banking apps at Trabian / MVB Bank; a JumpCrew Salesforce
                  administration stretch; and a March–April 2026 Next.js 16 /
                  React 19 contract for an off-roading e-commerce client (a
                  two-device trade-show kiosk built around a real AI image
                  pipeline, plus a full Shopify/Klaviyo/Recharge engagement
                  for the same client).
                </p>
                <p>
                  Before any of that I spent six years in customer-facing
                  sales — top 3% nationally at AT&amp;T, top 5% district at
                  T-Mobile (team of 8), 2 stores at uBreakiFix. Open to
                  full-stack engineering, Solutions Engineer, Implementation
                  Engineer, Developer Relations, Customer Success, or any
                  engineer- or customer-facing role where the combination of
                  production code and a sales-trained ear is useful.
                </p>
              </div>
              <aside className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-6 space-y-4 mono text-xs">
                {/* Headshot sits at the top of the aside — the natural place
                    for a face on a /about page. next/image handles responsive
                    serving + AVIF/WebP optimization automatically. */}
                <div className="overflow-hidden rounded-lg border border-[var(--border)]/70">
                  <Image
                    src="/headshot.jpg"
                    alt="Andrew Wendling"
                    width={798}
                    height={1200}
                    priority
                    sizes="(max-width: 768px) 90vw, 280px"
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <div className="uppercase tracking-[0.2em] text-[var(--text)] mb-1">
                    Based in
                  </div>
                  <div className="text-white">{contact.location}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[0.2em] text-[var(--text)] mb-1">
                    Open to
                  </div>
                  <div className="text-white leading-snug">
                    Remote · Relocation
                  </div>
                </div>
                <div>
                  <div className="uppercase tracking-[0.2em] text-[var(--text)] mb-1">
                    Roles
                  </div>
                  <div className="text-white leading-snug">
                    Full-Stack Developer · Solutions Engineer · Implementation
                    Engineer · Developer Relations · Customer Success
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--border)]/70">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[var(--accent)] hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="pt-3 border-t border-[var(--border)]/70">
                  <Button href="/resume.pdf" download variant="outline">
                    Download resume (PDF)
                  </Button>
                </div>
              </aside>
            </Card>
          </ScrollReveal>
        </Container>
      </section>

      {/* Sales & Leadership — elevated */}
      <SalesSection>
        <ScrollReveal>
          <SectionHeader
            tag="The Sales Multiplier"
            title="Six years of customer-facing work before the engineering career"
            subtitle="Top 3% nationally at AT&T. Top 5% district at T-Mobile, leading a team of 8. 2 stores at uBreakiFix. Plus a CRM-administration stretch at JumpCrew that bridged into engineering. The combination is the differentiator."
          />
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6 auto-rows-fr">
          {salesRoles.map((role, i) => (
            <ScrollReveal
              key={role.company}
              delay={i * 80}
              className="h-full"
            >
              <SalesCard role={role} />
            </ScrollReveal>
          ))}
        </div>
      </SalesSection>

      {/* AI utilization — separates "AI as product feature" from "AI as
          development tool," with deep-dive links into the case studies. */}
      <section className="py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="AI Utilization"
              title="AI as a product feature, plus AI as a development tool"
              subtitle="Two stories, kept separate so neither dilutes the other. Production AI features I architected and shipped — and the way I use Claude Code as a structured development partner to build them."
            />
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5 auto-rows-fr">
            <ScrollReveal className="h-full">
              <Card hover={false} className="h-full flex flex-col">
                <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
                  AI as product feature
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight lg:min-h-[3.75rem]">
                  Production AI I designed and shipped
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-[var(--text2)] leading-relaxed lg:min-h-[18rem]">
                  <li className="flex items-baseline gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] shrink-0 translate-y-[-2px]" />
                    <span>
                      <span className="text-white">MONISCOPE Brain</span> —
                      deterministic-first conversational pipeline (intent
                      classifier → RBAC-filtered FactPack → handler registry,
                      Claude only as a sandboxed fallback). 8-category
                      hard-block deny list, three-layer PII redaction, soft +
                      hard token budgets, provider-swappable LLM abstraction.
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent2)] shrink-0 translate-y-[-2px]" />
                    <span>
                      <span className="text-white">AI Trade-Show Kiosk</span>{" "}
                      (off-roading e-commerce client) — four-model AI image
                      pipeline (gpt-image-1.5, gpt-4o-mini, Claid 4× upscale,
                      Replicate rembg) with a 7-level fallback chain,
                      variance-based candidate scoring, and opentype.js text
                      burn-in to bypass librsvg&apos;s serverless font bug.
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-5 flex flex-wrap gap-2 mono text-[11px] uppercase tracking-[0.16em]">
                  <Link
                    href="/work/moniscope/ai-assistant"
                    className="text-[var(--accent)] hover:underline"
                  >
                    MONISCOPE Brain →
                  </Link>
                  <span className="text-[var(--text)]">·</span>
                  <Link
                    href="/work/shopify/ai-pipeline"
                    className="text-[var(--accent2)] hover:underline"
                  >
                    Kiosk pipeline →
                  </Link>
                  <span className="text-[var(--text)]">·</span>
                  <Link
                    href="/work/shopify/prompt-engineering"
                    className="text-[var(--accent2)] hover:underline"
                  >
                    Prompt engineering →
                  </Link>
                </div>
              </Card>
            </ScrollReveal>

            <ScrollReveal className="h-full">
              <Card hover={false} className="h-full flex flex-col">
                <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)] mb-3">
                  AI as development tool
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight lg:min-h-[3.75rem]">
                  Claude Code as a structured dev partner
                </h3>
                <div className="mt-5 lg:min-h-[18rem]">
                  <p className="text-sm text-[var(--text2)] leading-relaxed">
                    I architect the systems and use Claude Code as a
                    multi-session development partner — architectural sweeps,
                    JSON handoff logs between sessions, and an opinionated{" "}
                    <code>CLAUDE.md</code> that pins voice rules, accuracy
                    guardrails, and forbidden framings.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-[var(--text2)] leading-relaxed">
                    <li className="flex items-baseline gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--green)] shrink-0 translate-y-[-2px]" />
                      <span>
                        Tests are the validation gate, not the model&apos;s
                        output —{" "}
                        <span className="text-white">
                          1,852+ automated tests
                        </span>{" "}
                        across Pest/PHPUnit and Cypress
                      </span>
                    </li>
                    <li className="flex items-baseline gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--green)] shrink-0 translate-y-[-2px]" />
                      <span>
                        Architectural decisions are mine; the model accelerates
                        execution
                      </span>
                    </li>
                    <li className="flex items-baseline gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--green)] shrink-0 translate-y-[-2px]" />
                      <span>
                        Privacy guardrails baked into the workflow — case-study
                        excerpts are curated TypeScript strings, never live
                        filesystem reads
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto pt-5">
                  <p className="text-sm text-[var(--text)] italic leading-relaxed">
                    Force multiplier, not a crutch.
                  </p>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Stack — canonical list lives on /uses */}
      <section className="py-12">
        <Container>
          <ScrollReveal>
            <div className="flex items-center justify-center">
              <Link
                href="/uses"
                className="mono text-xs uppercase tracking-[0.18em] text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                See the full stack on /uses →
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Education */}
      <section className="py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Education"
              title="Software development + ongoing technical certifications"
            />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-4 auto-rows-fr">
            {education.map((e, i) => (
              <ScrollReveal
                key={e.title + e.dates}
                delay={i * 60}
                className="h-full"
              >
                <EducationCard education={e} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <Card
            padding="large"
            hover={false}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hiring an engineer who&apos;s already shipped against your APIs?
              </h3>
              <p className="mt-2 text-sm text-[var(--text)] max-w-xl">
                Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost,
                Google Business Profile, OpenAI, Anthropic — I&apos;ve
                shipped against their APIs. Let&apos;s talk about the role.
              </p>
            </div>
            <Button href="/contact">Get In Touch</Button>
          </Card>
        </Container>
      </section>
    </>
  );
}

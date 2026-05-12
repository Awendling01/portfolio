import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import StatBar from "@/components/ui/StatBar";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import StatusChip from "@/components/ui/StatusChip";
import TwoCareers from "@/components/sections/TwoCareers";
import WhatIBring from "@/components/sections/WhatIBring";
import Testimonials from "@/components/sections/Testimonials";
import { projects, heroStats, contact } from "@/lib/content";

const featured = projects.filter((p) => p.featured);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-[clamp(30px,9vw,64px)] leading-[1.08] sm:leading-[1.04] font-extrabold tracking-[-0.025em] text-white break-words">
              <span className="block">
                <span className="digit-accent">5+</span> years engineering.
              </span>
              <span className="block">
                <span className="digit-accent">6+</span> years in sales
                leadership.
              </span>
              <span className="block mt-3">
                Engineer who can{" "}
                <span className="shimmer">carry a quota</span>.
              </span>
            </h1>

            <div className="mt-7 flex flex-wrap gap-2">
              <StatusChip
                color="green"
                icon={
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--green)] pulse-dot" />
                }
              >
                Open to Engineering / SE / IE / DevRel / CSM
              </StatusChip>
              <StatusChip
                color="accent"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                }
              >
                Shopify · Stripe · Twilio · Klaviyo · Recharge · Plaid · EZPost · Google Business Profile
              </StatusChip>
              <StatusChip
                color="muted"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                }
              >
                Spanish Fort, AL · Remote-friendly
              </StatusChip>
              <StatusChip
                color="muted"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                    />
                  </svg>
                }
              >
                Laravel · Next.js · TypeScript
              </StatusChip>
              <StatusChip
                color="muted"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                  </svg>
                }
              >
                Available immediately
              </StatusChip>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/contact">Get In Touch</Button>
              <Button href={contact.linkedin} variant="outline" external>
                LinkedIn →
              </Button>
              <Button href={contact.github} variant="outline" external>
                GitHub →
              </Button>
            </div>

            <a
              href="#work"
              aria-label="Scroll to projects section"
              className="mt-12 inline-flex items-center gap-3 text-[var(--text)] hover:text-[var(--accent)] transition-colors group"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border2)] group-hover:border-[var(--accent)]/60 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 bounce-down"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
              <span className="mono text-xs uppercase tracking-[0.2em]">
                Projects below
              </span>
            </a>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-6">
        <Container>
          <ScrollReveal>
            <StatBar stats={heroStats} />
          </ScrollReveal>
        </Container>
      </section>

      {/* What I bring */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="What I Bring"
              title="Production engineering with the customer instinct."
            />
          </ScrollReveal>
          <ScrollReveal>
            <WhatIBring />
          </ScrollReveal>
        </Container>
      </section>

      {/* Featured Projects */}
      <section id="work" className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Selected Work"
              title="Recent projects across SaaS, contract, and full-time roles"
              subtitle="A snapshot of recent work — full case studies on the work page."
            />
          </ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-6 auto-rows-fr">
            {featured.map((p, i) => (
              <ScrollReveal
                key={p.slug}
                delay={i * 80}
                className="h-full"
              >
                <ProjectCard
                  project={p}
                  detailHref={
                    p.slug === "moniscope"
                      ? "/work/moniscope"
                      : p.slug === "offroad-kiosk"
                        ? "/work/shopify"
                        : p.slug === "futureshirts-erp"
                          ? "/work/futureshirts"
                          : undefined
                  }
                  hideDeepDiveCTA={p.slug === "futureshirts-erp"}
                />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/work" variant="outline">
              See all projects →
            </Button>
          </div>
        </Container>
      </section>

      {/* Two Careers */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="The Combination"
              title="5+ years of engineering with a sales career underneath"
              subtitle="Not a transition — a multiplier. Engineering is the work. Sales is why I can sit in a customer call and ship the integration the same week."
            />
          </ScrollReveal>
          <ScrollReveal>
            <TwoCareers />
          </ScrollReveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="In Their Words"
              title="What teammates and managers have said"
              subtitle="Recommendations pulled from LinkedIn — full versions linked at the bottom of the section."
            />
          </ScrollReveal>
          <ScrollReveal>
            <Testimonials />
          </ScrollReveal>
        </Container>
      </section>

      {/* GitHub — hidden while deciding which repos to pin */}
      {/*
      <section className="py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="On GitHub"
              title="Pinned repositories"
              subtitle="Live from the GitHub GraphQL API. Cached hourly."
            />
          </ScrollReveal>
          <ScrollReveal>
            <Suspense
              fallback={
                <div className="mono text-xs uppercase tracking-[0.18em] text-[var(--text)]">
                  Loading repositories…
                </div>
              }
            >
              <GitHubRepos />
            </Suspense>
          </ScrollReveal>
        </Container>
      </section>
      */}

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface2)] p-10 sm:p-14 text-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(60% 80% at 80% 0%, rgba(56,189,248,0.15), transparent 70%), radial-gradient(60% 80% at 0% 100%, rgba(129,140,248,0.12), transparent 70%)",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Let&apos;s talk.
                </h2>
                <p className="mt-4 text-[var(--text)] max-w-xl mx-auto leading-relaxed">
                  Full-stack engineering, Solutions Engineer, Implementation
                  Engineer, Developer Relations, Customer Success — or any
                  engineer- or customer-facing role where production code and
                  a sales-trained ear both matter. Based in Spanish Fort, AL
                  · open to remote and relocation.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href="/contact">Send a message</Button>
                  <Button
                    href={`mailto:${contact.email}`}
                    variant="outline"
                  >
                    {contact.email}
                  </Button>
                </div>
                <div className="mt-6 mono text-xs text-[var(--text)]">
                  <Link
                    href="/about"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    Read the full story →
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}

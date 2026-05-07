import Link from "next/link";
import { Suspense } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import StatBar from "@/components/ui/StatBar";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import TwoCareers from "@/components/sections/TwoCareers";
import GitHubRepos from "@/components/integrations/GitHubRepos";
import { projects, heroStats, contact } from "@/lib/content";

const featured = projects.filter((p) => p.featured);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--green)]/40 bg-[var(--green)]/10 px-3.5 py-1.5 mono text-[11px] uppercase tracking-[0.18em] text-[var(--green)]">
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--green)] pulse-dot" />
              Open to Developer · SE · CSM Roles
            </span>

            <h1 className="mt-6 text-[40px] leading-[1.05] sm:text-[64px] sm:leading-[1.04] font-extrabold tracking-[-0.025em] text-white">
              Five years building.
              <br />
              Six years selling.
              <br />
              Engineer who can{" "}
              <span className="shimmer">carry a quota</span>.
            </h1>

            <p className="mt-7 text-base sm:text-lg text-[var(--text)] max-w-2xl leading-relaxed">
              Full-stack engineer with 5+ years shipping production SaaS — and
              6+ years before that selling, coaching, and leading sales teams to
              top-3% national performance. I move easily between architecture
              decisions, customer conversations, and the messy middle where
              software and revenue actually meet.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/contact">Get In Touch</Button>
              <Button href={contact.linkedin} variant="outline" external>
                LinkedIn →
              </Button>
              <Button href={contact.github} variant="outline" external>
                GitHub →
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-3 text-[var(--text)] mono text-xs uppercase tracking-[0.2em]">
              <span className="w-10 h-px bg-[var(--border2)]" />
              Scroll for projects
            </div>
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
          <div className="grid lg:grid-cols-2 gap-6">
            {featured.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 80}>
                <ProjectCard project={p} />
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
              tag="Two Careers, One Hire"
              title="Engineering depth + 6 years of sales leadership"
              subtitle="The combination that makes Solutions Engineering, Sales Engineering, and Customer Success natural fits."
            />
          </ScrollReveal>
          <ScrollReveal>
            <TwoCareers />
          </ScrollReveal>
        </Container>
      </section>

      {/* GitHub */}
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
                  I&apos;m actively looking for Developer, Solutions Engineer,
                  Sales Engineer, and Customer Success Manager roles. Based in
                  Spanish Fort, AL — open to remote and relocation.
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

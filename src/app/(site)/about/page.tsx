import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import SalesSection from "@/components/sales/SalesSection";
import SalesCard from "@/components/sales/SalesCard";
import {
  salesRoles,
  jumpcrewNote,
  education,
  skills,
  contact,
} from "@/lib/content";

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
            title="Engineer who came up through sales"
            subtitle="Two careers stacked back-to-back — six years of sales leadership before five years in production engineering. The combination is the point."
          />
        </Container>
      </section>

      {/* Bio */}
      <section className="pb-12">
        <Container>
          <ScrollReveal>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 sm:p-10 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-5 text-[var(--text2)] text-[15px] leading-relaxed">
                <p>
                  I&apos;m Andrew Wendling — a full-stack software engineer
                  living in Spanish Fort, Alabama. I write Laravel and Vue on
                  the backend, React and Next.js on the frontend, and own
                  everything in between when the situation calls for it.
                </p>
                <p>
                  My most recent work is{" "}
                  <span className="text-white font-medium">MONISCOPE</span>, a
                  multi-tenant SaaS platform for the self-storage industry that
                  I&apos;m building solo as both engineer and product owner. It
                  has 1,850+ automated tests, a yield pricing engine, two-way
                  SMS, a 9-stage delinquency state machine modeled on Alabama
                  lien law, and AI-assisted features through the Anthropic API.
                  Before that I spent three years at FutureShirts contributing
                  extensively to an internal ERP that processes 200,000+
                  packages a year across 55+ artist storefronts.
                </p>
                <p>
                  Before any of the engineering, I spent six years selling — top
                  3% nationally at AT&T, top 5% district at T-Mobile (where I
                  led a team of 8), and two stores under my management at
                  uBreakiFix. That background is why I&apos;m specifically
                  building toward Solutions Engineering, Sales Engineering, and
                  Customer Success Manager roles. I already speak both
                  languages.
                </p>
              </div>
              <aside className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-6 space-y-3 mono text-xs">
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
                    Developer · Solutions Engineer · Sales Engineer · CSM
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
                  <a
                    href="/resume.pdf"
                    download
                    className="text-[var(--accent)] hover:underline"
                  >
                    Download resume (PDF) →
                  </a>
                </div>
              </aside>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Sales & Leadership — elevated */}
      <SalesSection>
        <ScrollReveal>
          <SectionHeader
            tag="Sales & Leadership"
            title="Six years of revenue ownership before I shipped my first commit"
            subtitle="This is a deliberate part of the pitch — not a footnote. SE and CSM hires almost always need this exact path."
          />
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {salesRoles.map((role, i) => (
            <ScrollReveal key={role.company} delay={i * 80}>
              <SalesCard role={role} />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {jumpcrewNote.company}
              </h3>
              <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)]">
                {jumpcrewNote.role} · {jumpcrewNote.dates}
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--text2)] leading-relaxed">
              {jumpcrewNote.description}
            </p>
            <div className="mt-3 mono text-[11px] text-[var(--text)]">
              {jumpcrewNote.tech.join(" · ")}
            </div>
          </div>
        </ScrollReveal>
      </SalesSection>

      {/* Skills */}
      <section className="py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Stack"
              title="Technical skills"
              subtitle="Languages, platforms, and tooling I've shipped with — not a wishlist."
            />
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(skills).map(([cat, items], i) => (
              <ScrollReveal key={cat} delay={(i % 3) * 60}>
                <div className="h-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-6">
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {cat}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="mono text-[11px] text-[var(--text2)] border border-[var(--border)] bg-[var(--bg)]/60 rounded-md px-2 py-1"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Education */}
      <section className="py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              tag="Education"
              title="Software development + continuing AI/cloud training"
            />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-4">
            {education.map((e, i) => (
              <ScrollReveal key={e.title + e.dates} delay={i * 60}>
                <div className="h-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-6">
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {e.title}
                  </h3>
                  <div className="mt-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
                    {e.institution}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text)]">
                    {e.dates}
                  </div>
                  {e.note ? (
                    <div className="mt-3 text-sm text-[var(--text2)]">
                      {e.note}
                    </div>
                  ) : null}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hiring an engineer who can also sit in a customer call?
              </h3>
              <p className="mt-2 text-sm text-[var(--text)] max-w-xl">
                That&apos;s exactly what I&apos;m optimized for. Let&apos;s talk
                about the role.
              </p>
            </div>
            <Button href="/contact">Get In Touch</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

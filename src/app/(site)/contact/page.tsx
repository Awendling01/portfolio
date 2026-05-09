import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/components/contact/ContactForm";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Andrew Wendling — full-stack engineer open to Developer, Solutions Engineer, Sales Engineer, and Customer Success Manager roles.",
};

const channels = [
  {
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    blurb: "Best for role intros and detailed conversations.",
  },
  {
    label: "LinkedIn",
    value: contact.linkedinHandle,
    href: contact.linkedin,
    blurb: "Connect, message, or DM.",
    external: true,
  },
  {
    label: "GitHub",
    value: contact.githubHandle,
    href: contact.github,
    blurb: "Code, side projects, contributions.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
        <Container>
          <SectionHeader
            tag="Contact"
            title="Let's talk."
            subtitle="Send a note below, or use one of the direct channels — whichever's faster. Replies usually go out within a business day."
          />
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <aside className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-5 transition-all hover:-translate-y-[2px] hover:border-[var(--accent)]/60 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.25)]"
                >
                  <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                    {c.label}
                  </div>
                  <div className="mt-2 text-base font-semibold text-white tracking-tight break-all">
                    {c.value}
                  </div>
                  <p className="mt-2 text-xs text-[var(--text)] leading-relaxed">
                    {c.blurb}
                  </p>
                </a>
              ))}
            </aside>
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Looking for
              </h3>
              <p className="mt-2 text-sm text-[var(--text2)] leading-relaxed">
                Developer · Solutions Engineer · Sales Engineer · Customer
                Success Manager. Based in {contact.location}. Open to remote and
                relocation.
              </p>
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm border border-[var(--border2)] text-[var(--text2)] whitespace-nowrap shrink-0 hover:border-[var(--accent)] hover:text-white hover:-translate-y-[1px] transition-all duration-200"
            >
              Download resume (PDF) →
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

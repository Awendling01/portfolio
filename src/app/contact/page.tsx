import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
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
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\D/g, "")}`,
    blurb: "Central time. Voicemail or text — both work.",
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
            subtitle="The fastest path is email. I usually reply within a business day. If you'd rather text or call, the number below is mine."
          />
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid sm:grid-cols-2 gap-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8 transition-all hover:-translate-y-[2px] hover:border-[var(--accent)]/60 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.25)]"
              >
                <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                  {c.label}
                </div>
                <div className="mt-3 text-xl font-semibold text-white tracking-tight break-all">
                  {c.value}
                </div>
                <p className="mt-3 text-sm text-[var(--text)] leading-relaxed">
                  {c.blurb}
                </p>
                <div className="mt-5 mono text-xs text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  Open →
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-7 sm:p-8">
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Looking for
            </h3>
            <p className="mt-2 text-sm text-[var(--text2)] leading-relaxed">
              Developer · Solutions Engineer · Sales Engineer · Customer Success
              Manager. Based in {contact.location}. Open to remote and
              relocation. A contact form with proper inbox routing is on the
              roadmap — until then, the channels above all reach me directly.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

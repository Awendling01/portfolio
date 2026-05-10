import { Suspense } from "react";
import Container from "@/components/ui/Container";
import { contact } from "@/lib/content";
import PathViewCounter from "@/components/integrations/PathViewCounter";
import SpotifyNowPlaying from "@/components/integrations/SpotifyNowPlaying";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const links: FooterLink[] = [
    { label: "Email", href: `mailto:${contact.email}` },
    { label: "LinkedIn", href: contact.linkedin, external: true },
    { label: "GitHub", href: contact.github, external: true },
  ];

  return (
    <footer className="relative z-10 mt-24 border-t border-[var(--border)]/80 bg-[var(--bg)]/80">
      <Container className="py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-white">{contact.name}</div>
          <div className="mono text-xs text-[var(--text)] mt-1 leading-relaxed">
            {contact.location} · Built with Next.js 16, Tailwind v4, Vercel
          </div>
          <div className="mt-3">
            <PathViewCounter />
          </div>
        </div>

        <div className="flex md:justify-center">
          <Suspense
            fallback={
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
                Loading…
              </div>
            }
          >
            <SpotifyNowPlaying />
          </Suspense>
        </div>

        <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm md:justify-end">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-[var(--text2)] hover:text-[var(--accent)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <span className="mono text-xs text-[var(--text)]">© {year}</span>
        </div>
      </Container>
    </footer>
  );
}

import Container from "@/components/ui/Container";
import { contact } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-24 border-t border-[var(--border)]/80 bg-[var(--bg)]/80">
      <Container className="py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="text-sm font-semibold text-white">{contact.name}</div>
          <div className="mono text-xs text-[var(--text)] mt-1">
            {contact.location} · Built with Next.js 16, Tailwind v4, Vercel
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a
            href={`mailto:${contact.email}`}
            className="text-[var(--text2)] hover:text-[var(--accent)] transition-colors"
          >
            Email
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text2)] hover:text-[var(--accent)] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text2)] hover:text-[var(--accent)] transition-colors"
          >
            GitHub
          </a>
          <span className="mono text-xs text-[var(--text)]">
            © {year}
          </span>
        </div>
      </Container>
    </footer>
  );
}

import { testimonials, linkedinRecommendationsUrl } from "@/lib/content";

const accentBg: Record<(typeof testimonials)[number]["accent"], string> = {
  accent: "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30",
  accent2:
    "bg-[var(--accent2)]/15 text-[var(--accent2)] border-[var(--accent2)]/30",
  green: "bg-[var(--green)]/15 text-[var(--green)] border-[var(--green)]/30",
  amber: "bg-[var(--amber)]/15 text-[var(--amber)] border-[var(--amber)]/30",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {testimonials.map((t) => (
        <figure
          key={t.name}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 sm:p-7 flex flex-col"
        >
          <svg
            className="w-7 h-7 text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.13 18.71V12.6H5.27c0-2.13.5-3.7 1.5-4.7s2.43-1.5 4.3-1.5V4.5c-2.86 0-5.05.81-6.58 2.43C2.97 8.55 2.2 10.84 2.2 13.83v4.88h6.93zm10.66 0V12.6h-3.86c0-2.13.5-3.7 1.5-4.7s2.43-1.5 4.3-1.5V4.5c-2.86 0-5.05.81-6.58 2.43-1.52 1.62-2.29 3.91-2.29 6.9v4.88h6.93z" />
          </svg>

          <blockquote className="mt-4 text-sm text-[var(--text2)] leading-relaxed flex-1">
            {t.quote}
          </blockquote>

          <figcaption className="mt-6 pt-5 border-t border-[var(--border)]/50 flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full border ${accentBg[t.accent]} mono text-xs font-semibold tracking-tight`}
              aria-hidden="true"
            >
              {initials(t.name)}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white tracking-tight truncate">
                {t.name}
              </div>
              <div className="text-xs text-[var(--text)] truncate">
                {t.title}
              </div>
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] mt-0.5 truncate">
                {t.context}
              </div>
            </div>
          </figcaption>
        </figure>
      ))}

      <div className="md:col-span-3 mt-2 text-center">
        <a
          href={linkedinRecommendationsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-xs uppercase tracking-[0.18em] text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        >
          See all recommendations on LinkedIn →
        </a>
      </div>
    </div>
  );
}

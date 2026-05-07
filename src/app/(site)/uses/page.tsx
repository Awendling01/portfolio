import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { uses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The tools, languages, and platforms Andrew Wendling uses day-to-day for full-stack engineering and SaaS work.",
};

export default function UsesPage() {
  return (
    <>
      <section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
        <Container>
          <SectionHeader
            tag="Uses"
            title="What I build with"
            subtitle="The actual stack behind the code I ship — not a wishlist. Updated when something changes."
          />
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-5">
            {uses.map((group, i) => (
              <ScrollReveal key={group.category} delay={(i % 2) * 60}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7">
                  <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                    {group.category}
                  </div>
                  <p className="mt-2 text-sm text-[var(--text)] leading-relaxed">
                    {group.blurb}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-baseline justify-between gap-3 border-b border-[var(--border)]/50 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-sm text-[var(--text2)] font-medium">
                          {item.name}
                        </span>
                        {item.note ? (
                          <span className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--text)] text-right">
                            {item.note}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

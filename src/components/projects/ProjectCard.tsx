import Link from "next/link";
import type { Project } from "@/lib/content";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import TechTags from "@/components/ui/TechTags";

type Density = "default" | "wide";

type Props = {
  project: Project;
  variant?: "compact" | "full";
  /**
   * "default" reserves vertical space on every section so two cards in a
   * side-by-side grid (home page) line up regardless of which one's content
   * is longest. "wide" drops those reservations — use for stacked
   * full-width layouts (/work) where content uniformity already comes from
   * the content shape (6 highlights, 4 metrics, similar tag counts).
   */
  density?: Density;
  /** When set, the whole card becomes a link to the project deep-dive page. */
  detailHref?: string;
};

export default function ProjectCard({
  project,
  variant = "full",
  density = "default",
  detailHref,
}: Props) {
  const isCompact = variant === "compact";
  const showHighlights = !isCompact && project.highlights.length > 0;
  const showMetrics = !isCompact && (project.metrics?.length ?? 0) > 0;

  const isGrid = density === "default";
  const titleMinH = isGrid ? "lg:min-h-[3.75rem]" : "";
  const subtitleMinH = isGrid ? "lg:min-h-[2.5rem]" : "";
  const metaMinH = isGrid ? "lg:min-h-[2.25rem]" : "";
  const descMinH = isGrid ? "lg:min-h-[5rem]" : "";
  const bulletMinH = isGrid ? "lg:min-h-[4.5em]" : "";
  const techMinH = isGrid ? "lg:min-h-[6.5rem]" : "";

  const inner = (
    <Card hover={!!detailHref} className="h-full flex flex-col">
      {/* Title row: title + badge */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className={`flex-1 min-w-0 text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight ${titleMinH}`}
        >
          <span
            className={
              detailHref
                ? "group-hover:text-[var(--accent)] transition-colors"
                : ""
            }
          >
            {project.title}
          </span>
        </h3>
        <div className="shrink-0">
          <Badge color={project.badgeColor}>{project.badge}</Badge>
        </div>
      </div>

      {/* Subtitle */}
      <p
        className={`mt-2.5 text-sm text-[var(--text)] leading-snug ${subtitleMinH}`}
      >
        {project.subtitle}
      </p>

      {/* Meta */}
      <div
        className={`mono mt-5 text-[11px] uppercase tracking-[0.18em] text-[var(--text)] leading-snug ${metaMinH}`}
      >
        {project.role}
        {project.company ? <> · {project.company}</> : null}
        <span className="mx-2 text-[var(--border2)]">|</span>
        {project.dates}
      </div>

      {/* Description */}
      <p
        className={`mt-5 text-[var(--text2)] text-[15px] leading-relaxed ${descMinH}`}
      >
        {project.description}
      </p>

      {/* Highlights — flex-1 absorbs any remaining space so the footer pins
          to the bottom and aligns across cards. */}
      {showHighlights ? (
        <ul className="mt-5 flex-1 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 content-start">
          {project.highlights.map((h) => (
            <li
              key={h}
              className={`relative pl-5 text-sm text-[var(--text2)] leading-relaxed ${bulletMinH}`}
            >
              <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              {h}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Footer block: tech tags + optional CTA + metrics, pinned to bottom */}
      <div className="mt-auto">
        <div className="pt-5 border-t border-[var(--border)]/70">
          <div className={techMinH}>
            <TechTags items={project.tech} />
          </div>
          {detailHref && isGrid ? (
            <div className="mt-4 flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] group-hover:text-white transition-colors">
              Read the deep dive
              <span aria-hidden="true">→</span>
            </div>
          ) : null}
        </div>
        {showMetrics && project.metrics ? (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center text-center rounded-lg border border-[var(--border)] bg-[var(--bg)]/60 px-2 py-3 min-h-[68px] min-w-0"
              >
                <div className="text-base sm:text-lg font-bold text-white leading-tight break-words">
                  {m.value}
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] mt-1 leading-tight break-words">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );

  if (detailHref) {
    return (
      <Link
        href={detailHref}
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 rounded-2xl"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}

import type { Project } from "@/lib/content";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import TechTags from "@/components/ui/TechTags";

type Props = {
  project: Project;
  variant?: "compact" | "full";
};

export default function ProjectCard({ project, variant = "full" }: Props) {
  const isCompact = variant === "compact";
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--text)]">{project.subtitle}</p>
        </div>
        <Badge color={project.badgeColor}>{project.badge}</Badge>
      </div>

      <div className="mono mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
        {project.role}
        {project.company ? <> · {project.company}</> : null}
        <span className="mx-2 text-[var(--border2)]">|</span>
        {project.dates}
      </div>

      <p className="mt-5 text-[var(--text2)] text-[15px] leading-relaxed">
        {project.description}
      </p>

      {!isCompact && project.highlights.length ? (
        <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="relative pl-5 text-sm text-[var(--text2)] leading-relaxed"
            >
              <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              {h}
            </li>
          ))}
        </ul>
      ) : null}

      {!isCompact && project.metrics?.length ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)]/60 px-3 py-3 text-center"
            >
              <div className="text-lg font-bold text-white">{m.value}</div>
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-auto pt-5 border-t border-[var(--border)]/70">
        <TechTags items={project.tech} />
      </div>
    </Card>
  );
}

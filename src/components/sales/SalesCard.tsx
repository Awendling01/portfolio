import type { SalesRole } from "@/lib/content";
import Card from "@/components/ui/Card";

const accentMap = {
  accent: "text-[var(--accent)]",
  accent2: "text-[var(--accent2)]",
  green: "text-[var(--green)]",
  amber: "text-[var(--amber)]",
} as const;

export default function SalesCard({ role }: { role: SalesRole }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {role.company}
          </h3>
          <p className="mt-1 text-sm text-[var(--text)]">{role.title}</p>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${accentMap[role.accent]}`}
          >
            {role.headlineStat}
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] mt-1">
            {role.headlineStatLabel}
          </div>
        </div>
      </div>

      <div className="mono mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
        {role.dates}
        <span className="mx-2 text-[var(--border2)]">|</span>
        {role.location}
      </div>

      <p className="mt-5 text-[var(--text2)] text-[15px] leading-relaxed">
        {role.details}
      </p>
    </Card>
  );
}

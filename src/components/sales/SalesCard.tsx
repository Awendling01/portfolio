import type { SalesRole } from "@/lib/content";
import Card from "@/components/ui/Card";

const accentText: Record<SalesRole["accent"], string> = {
  accent: "text-[var(--accent)]",
  accent2: "text-[var(--accent2)]",
  green: "text-[var(--green)]",
  amber: "text-[var(--amber)]",
};

export default function SalesCard({ role }: { role: SalesRole }) {
  return (
    <Card hover={false} className="h-full flex flex-col">
      {/* Title row: company + stat */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            {role.company}
          </h3>
          <p className="mt-2.5 text-sm text-[var(--text)] leading-snug lg:min-h-[2.5rem]">
            {role.title}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div
            className={`text-2xl sm:text-3xl font-bold tracking-tight leading-none ${accentText[role.accent]}`}
          >
            {role.headlineStat}
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] mt-1.5">
            {role.headlineStatLabel}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mono mt-5 text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
        {role.dates}
        <span className="mx-2 text-[var(--border2)]">|</span>
        {role.location}
      </div>

      {/* Description */}
      <p className="mt-5 text-[var(--text2)] text-[15px] leading-relaxed">
        {role.details}
      </p>
    </Card>
  );
}

type StatColor = "accent" | "accent2" | "green" | "amber";

type Stat = {
  value: string;
  label: string;
  color: StatColor;
};

const colorMap: Record<StatColor, string> = {
  accent: "text-[var(--accent)]",
  accent2: "text-[var(--accent2)]",
  green: "text-[var(--green)]",
  amber: "text-[var(--amber)]",
};

export default function StatBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden border border-[var(--border)]">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[var(--surface)] px-5 py-7 text-center"
        >
          <div
            className={`text-3xl sm:text-4xl font-bold tracking-tight ${colorMap[s.color]}`}
          >
            {s.value}
          </div>
          <div className="mt-2 text-[11px] mono uppercase tracking-[0.18em] text-[var(--text)]">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

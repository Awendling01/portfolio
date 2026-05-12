// Single education / certification card on the /about page. Renders
// inside the 3-column education grid; ScrollReveal stays outside so
// the per-card delay can be set at the map site.

type Props = {
  education: {
    title: string;
    institution: string;
    dates: string;
    note?: string;
  };
};

export default function EducationCard({ education: e }: Props) {
  return (
    <div className="h-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-6">
      <h3 className="text-base font-semibold text-white tracking-tight">
        {e.title}
      </h3>
      <div className="mt-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
        {e.institution}
      </div>
      <div className="mt-1 text-xs text-[var(--text)]">
        {e.dates}
      </div>
      {e.note ? (
        <div className="mt-3 text-sm text-[var(--text2)]">
          {e.note}
        </div>
      ) : null}
    </div>
  );
}

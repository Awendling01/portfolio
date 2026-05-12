import { RankedBars } from "./Charts";

// Card-wrapped section for a RankedBars chart on the analytics
// page. Five sections render identical card chrome (rounded-2xl
// border, mono-uppercase title) around a RankedBars list — this
// wraps that pattern so the analytics page reads as a sequence of
// titles + data, not 5 copies of the same JSX scaffolding.

type Row = {
  label: string;
  value: number;
  sub?: string;
};

type Props = {
  title: string;
  rows: Row[];
  formatValue?: (n: number) => string;
};

export default function RankedSection({ title, rows, formatValue }: Props) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
      <h2 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text)] mb-4">
        {title}
      </h2>
      <RankedBars rows={rows} formatValue={formatValue} />
    </section>
  );
}

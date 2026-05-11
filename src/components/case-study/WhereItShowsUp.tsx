import type { WhereItShowsUp } from "@/lib/case-studies";
import InlineCode from "./InlineCode";

type Props = { data: WhereItShowsUp };

const iconBgClass: Record<
  "green" | "accent2" | "rose" | "accent" | "amber",
  string
> = {
  green:
    "bg-[var(--green)]/15 text-[var(--green)] border-[var(--green)]/30",
  accent2:
    "bg-[var(--accent2)]/15 text-[var(--accent2)] border-[var(--accent2)]/30",
  rose: "bg-[var(--rose)]/15 text-[var(--rose)] border-[var(--rose)]/30",
  accent:
    "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30",
  amber:
    "bg-[var(--amber)]/15 text-[var(--amber)] border-[var(--amber)]/30",
};

const statColorClass: Record<
  "accent" | "accent2" | "green" | "amber",
  string
> = {
  accent: "text-[var(--accent)]",
  accent2: "text-[var(--accent2)]",
  green: "text-[var(--green)]",
  amber: "text-[var(--amber)]",
};

export default function WhereItShowsUp({ data }: Props) {
  switch (data.kind) {
    case "table":
      return (
        <>
          <p className="text-[var(--text)] mb-4 max-w-[720px]">
            <InlineCode>{data.intro}</InlineCode>
          </p>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg)]/40">
                <tr>
                  {data.columns.map((c) => (
                    <th
                      key={c}
                      className="text-left px-4 py-3 mono text-[11px] uppercase tracking-[0.16em] text-[var(--text)] font-medium"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-[var(--border)]/60"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-4 py-3 ${
                          j === 0
                            ? "text-white font-semibold"
                            : "text-[var(--text2)]"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );

    case "answer-types":
      return (
        <>
          <p className="text-[var(--text)] mb-4 max-w-[720px]">
            <InlineCode>{data.intro}</InlineCode>
          </p>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {data.types.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-4.5"
              >
                <div
                  className={`grid place-items-center w-7 h-7 rounded-lg mono text-[13px] font-bold border ${iconBgClass[t.iconColor]}`}
                >
                  {t.ic}
                </div>
                <div className="mt-3 mono text-[13.5px] font-semibold text-white">
                  {t.name}
                </div>
                <div className="mt-1 text-[12.5px] leading-[1.5] text-[var(--text)]">
                  <InlineCode>{t.desc}</InlineCode>
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case "stats":
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {data.entries.map((s) => (
            <div
              key={s.label}
              className="bg-[var(--surface)] px-4 py-5 text-center"
            >
              <div
                className={`text-[32px] font-bold tracking-[-0.02em] ${statColorClass[s.color]}`}
              >
                {s.value}
              </div>
              <div className="mt-1.5 mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      );

    case "report-grid":
      return (
        <div className="grid sm:grid-cols-3 gap-2 mt-3">
          {data.entries.map((e) => (
            <div
              key={e.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-3.5"
            >
              <div className="mono text-[12px] text-[var(--accent)]">
                {e.name}
              </div>
              <div className="mt-1 text-[12.5px] leading-[1.45] text-[var(--text)]">
                {e.desc}
              </div>
            </div>
          ))}
        </div>
      );

    case "rule-example":
      return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 px-5 py-4.5 mono text-[13.5px] leading-[1.8] text-[var(--text2)] whitespace-pre-line">
          {data.example}
        </div>
      );
  }
}

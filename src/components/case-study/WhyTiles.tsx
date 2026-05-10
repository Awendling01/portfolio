import type { WhyTile } from "@/lib/case-studies";
import InlineCode from "./InlineCode";

type Props = { tiles: WhyTile[] };

export default function WhyTiles({ tiles }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {tiles.map((t) => (
        <div
          key={t.number}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 px-5 py-4.5"
        >
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent)] mono text-[11px] font-bold text-[#0b1224] mb-2.5">
            {t.number}
          </div>
          <h3 className="text-[15px] leading-[1.35] font-semibold text-white">
            <InlineCode>{t.title}</InlineCode>
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[var(--text)]">
            <InlineCode>{t.body}</InlineCode>
          </p>
          <span className="mt-2 inline-block mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--accent2)]">
            {t.ref}
          </span>
        </div>
      ))}
    </div>
  );
}

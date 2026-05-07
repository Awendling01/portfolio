import { engineeringHighlights, salesHighlights } from "@/lib/content";

export default function TwoCareers() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Engineering
          </span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Building the systems
        </h3>
        <p className="mt-2 text-sm text-[var(--text)] leading-relaxed">
          Multi-tenant SaaS, payments, real-time messaging, AI integrations, and
          1,850+ tests behind production-grade Laravel and Next.js stacks.
        </p>
        <ul className="mt-5 space-y-2">
          {engineeringHighlights.map((h) => (
            <li
              key={h}
              className="relative pl-5 text-sm text-[var(--text2)] leading-relaxed"
            >
              <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)]">
            Sales & Leadership
          </span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Coaching teams to close
        </h3>
        <p className="mt-2 text-sm text-[var(--text)] leading-relaxed">
          Top-3% national rep, team lead of 8, and CRM administrator — six years
          turning numbers into outcomes before I ever shipped production code.
        </p>
        <ul className="mt-5 space-y-2">
          {salesHighlights.map((h) => (
            <li
              key={h}
              className="relative pl-5 text-sm text-[var(--text2)] leading-relaxed"
            >
              <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

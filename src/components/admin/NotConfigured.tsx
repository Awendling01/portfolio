// Shared placeholder rendered by every admin page when DATABASE_URL is unset.
// Pulled out so all five admin tabs (Overview, Analytics, Visitors, Messages,
// Security) show the same polished card instead of a half-styled one-liner.

type Props = {
  /** Optional title — defaults to "Database not configured". */
  title?: string;
  /**
   * Optional context-specific note appended after the boilerplate.
   * e.g. "to enable analytics" / "to view login attempts".
   */
  context?: string;
};

export default function NotConfigured({
  title = "Database not configured",
  context,
}: Props) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6">
      <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-[var(--text)] leading-relaxed">
        Set <code>DATABASE_URL</code> (or one of the{" "}
        <code>POSTGRES_*</code> equivalents) in Vercel
        {context ? ` ${context}` : ""}. The public site degrades gracefully
        without it; admin pages need it to render.
      </p>
    </div>
  );
}

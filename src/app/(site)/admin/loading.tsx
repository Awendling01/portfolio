// Renders while the server is fetching data for any admin page. Visible
// during route transitions and the initial DB-query roundtrip.
export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-[var(--border)]/50 rounded-md" />
        <div className="mt-2 h-4 w-72 bg-[var(--border)]/40 rounded-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6"
          >
            <div className="h-3 w-24 bg-[var(--border)]/50 rounded" />
            <div className="mt-4 h-8 w-20 bg-[var(--border)]/40 rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]/60">
          <div className="h-3 w-40 bg-[var(--border)]/50 rounded" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-[var(--border)]/30 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

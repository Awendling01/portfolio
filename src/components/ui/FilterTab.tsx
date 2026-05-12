import Link from "next/link";

// Filter tab pill used in the admin sections to switch between row
// subsets (e.g., the messages inbox: Inbox / Unread / Responded /
// Trash). Active tab gets the cyan accent border + tint; inactive
// tabs are bordered with the neutral surface color. Count badge sits
// to the right of the label.
//
// className strings are preserved verbatim from the original inline
// implementation to keep the rendered HTML byte-identical.

type Props = {
  href: string;
  active: boolean;
  label: string;
  count: number;
};

export default function FilterTab({ href, active, label, count }: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
        active
          ? "bg-[var(--accent)]/[0.12] text-[var(--accent)] border border-[var(--accent)]/40"
          : "border border-[var(--border)] text-[var(--text)] hover:text-white hover:border-[var(--text)]"
      }`}
    >
      {label}
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
          active ? "bg-[var(--accent)]/[0.18]" : "bg-[var(--surface)]/80"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

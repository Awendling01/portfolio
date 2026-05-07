import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-20 min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-7 h-7 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] font-bold text-xs">
              AW
            </span>
            <span className="mono text-[11px] uppercase tracking-[0.22em] text-[var(--text)]">
              Admin
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-[var(--text2)] hover:text-white hover:bg-[var(--surface)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="ml-2 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-white transition-colors"
            >
              ↗ Site
            </Link>
            <form action="/api/logout" method="POST" className="ml-1">
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--rose)] hover:text-[var(--rose)] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-6 py-10">
        {children}
      </main>
    </div>
  );
}

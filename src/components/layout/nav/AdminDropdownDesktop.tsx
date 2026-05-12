import Link from "next/link";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
} from "react";
import ChevronIcon from "./ChevronIcon";
import type { NavLink } from "./types";

// Desktop Admin dropdown — visible only when `isAuthed`. Trigger button
// + absolute-positioned menu with admin links + Logout form. Mirrors
// the Work dropdown's keyboard / click-outside contract; Nav.tsx owns
// the refs + state and passes them in here.

type Props = {
  adminLinks: NavLink[];
  adminOpen: boolean;
  setAdminOpen: (updater: (prev: boolean) => boolean) => void;
  adminMenuRef: RefObject<HTMLDivElement | null>;
  adminTriggerRef: RefObject<HTMLButtonElement | null>;
  onMenuKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  onTriggerKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement>) => void;
  pathname: string;
  isExactActive: (href: string) => boolean;
};

export default function AdminDropdownDesktop({
  adminLinks,
  adminOpen,
  setAdminOpen,
  adminMenuRef,
  adminTriggerRef,
  onMenuKeyDown,
  onTriggerKeyDown,
  pathname,
  isExactActive,
}: Props) {
  return (
    // Admin "right block" — appears only when signed in. Collapsed
    // behind an "Admin ▾" trigger so the regular nav doesn't have
    // to share visual weight with five permission-gated tabs.
    // Mirrors the Work dropdown's keyboard + click-outside contract.
    <div
      ref={adminMenuRef}
      className="ml-3 pl-3 border-l border-[var(--border)]/70 relative"
    >
      <button
        ref={adminTriggerRef}
        type="button"
        onClick={() => setAdminOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={adminOpen}
        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
          pathname.startsWith("/admin")
            ? "text-white"
            : "text-[var(--text)] hover:text-white"
        }`}
      >
        Admin
        <ChevronIcon expanded={adminOpen} />
      </button>
      {adminOpen ? (
        <div
          role="menu"
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 mt-1.5 w-56 rounded-xl border border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] py-1.5"
        >
          {adminLinks.map((l) => {
            const active = isExactActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                role="menuitem"
                aria-current={active ? "page" : undefined}
                className={`block px-3.5 py-2 mx-1.5 rounded-md text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 ${
                  active
                    ? "text-white bg-[var(--accent)]/[0.12]"
                    : "text-[var(--text2)] hover:text-white hover:bg-[var(--surface)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="my-1 mx-3 border-t border-[var(--border)]/70" />
          <form action="/api/logout" method="POST" className="mx-1.5">
            <button
              type="submit"
              role="menuitem"
              className="block w-full text-left px-3.5 py-2 rounded-md text-[13px] text-[var(--text2)] hover:text-[var(--rose)] hover:bg-[var(--rose)]/[0.08] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
            >
              Logout
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import Container from "@/components/ui/Container";
import ChevronIcon from "./ChevronIcon";
import type { DropdownItem, NavLink } from "./types";

// Mobile menu body — the full `<div className="md:hidden ...">` block
// that renders when the hamburger button is pressed. Bundles the
// primary link list, the Work accordion (matching the desktop dropdown
// items + their case-study children), and either the Admin accordion
// (when signed in) or a plain Login link. Mirrors the desktop menus'
// rendering rules so the mobile and desktop nav stay in sync as the
// `workDropdown` and `adminLinks` arrays evolve.

type Props = {
  links: NavLink[];
  adminLinks: NavLink[];
  workDropdown: DropdownItem[];
  mobileWorkOpen: boolean;
  setMobileWorkOpen: (updater: (prev: boolean) => boolean) => void;
  mobileAdminOpen: boolean;
  setMobileAdminOpen: (updater: (prev: boolean) => boolean) => void;
  isAuthed: boolean;
  isActive: (href: string) => boolean;
  isExactActive: (href: string) => boolean;
  isExpanded: (item: DropdownItem) => boolean;
  toggleExpanded: (
    e: ReactMouseEvent<HTMLButtonElement>,
    label: string,
  ) => void;
  closeMenu: () => void;
  pathname: string;
};

export default function MobileMenuBody({
  links,
  adminLinks,
  workDropdown,
  mobileWorkOpen,
  setMobileWorkOpen,
  mobileAdminOpen,
  setMobileAdminOpen,
  isAuthed,
  isActive,
  isExactActive,
  isExpanded,
  toggleExpanded,
  closeMenu,
  pathname,
}: Props) {
  return (
    <div className="md:hidden border-t border-[var(--border)]/70 bg-[var(--bg)]/95 backdrop-blur-md">
      <Container className="py-3 flex flex-col gap-1">
        {links.map((l) => {
          const active = isActive(l.href);
          if (l.hasDropdown) {
            return (
              <div key={l.href}>
                <button
                  type="button"
                  onClick={() => setMobileWorkOpen((v) => !v)}
                  aria-expanded={mobileWorkOpen}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-md cursor-pointer ${
                    active
                      ? "text-white bg-[var(--surface)]"
                      : "text-[var(--text)]"
                  }`}
                >
                  <span>{l.label}</span>
                  <ChevronIcon expanded={mobileWorkOpen} size="accordion" />
                </button>
                {mobileWorkOpen ? (
                  <div className="ml-3 mt-1 mb-2 border-l border-[var(--border)]/70 pl-3 flex flex-col gap-0.5">
                    {workDropdown.map((item) => {
                      const expanded = isExpanded(item);
                      const hasKids = !!item.children?.length;
                      return (
                        <div key={item.href}>
                          <div className="flex items-stretch">
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className={`flex-1 px-3 py-2.5 text-[13px] rounded-md ${
                                item.accent
                                  ? "text-[var(--accent)]"
                                  : "text-[var(--text2)]"
                              }`}
                            >
                              {item.label}
                              {item.note ? (
                                <span className="block mt-0.5 text-[11px] text-[var(--text)]">
                                  {item.note}
                                </span>
                              ) : null}
                            </Link>
                            {hasKids ? (
                              <button
                                type="button"
                                onClick={(e) =>
                                  toggleExpanded(e, item.label)
                                }
                                aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label} case studies`}
                                aria-expanded={expanded}
                                className="shrink-0 self-center inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--text)] hover:text-white cursor-pointer"
                              >
                                <ChevronIcon
                                  expanded={expanded}
                                  size="accordion"
                                />
                              </button>
                            ) : null}
                          </div>
                          {hasKids && expanded ? (
                            <div className="ml-3 mt-0.5 mb-1.5 border-l border-[var(--border)]/70 pl-3 flex flex-col">
                              {item.children!.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMenu}
                                  className="px-3 py-2 text-[12.5px] text-[var(--text2)] rounded-md hover:text-white"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className={`px-3 py-3 text-sm font-medium rounded-md ${
                active
                  ? "text-white bg-[var(--surface)]"
                  : "text-[var(--text)]"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        {isAuthed ? (
          // Mobile admin accordion — collapsed by default, expands to
          // reveal the 5 admin links + Logout. Mirrors the Work
          // accordion in the same hamburger menu for consistency.
          <div className="border-t border-[var(--border)]/50 mt-1 pt-3">
            <button
              type="button"
              onClick={() => setMobileAdminOpen((v) => !v)}
              aria-expanded={mobileAdminOpen}
              className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-md cursor-pointer ${
                pathname.startsWith("/admin")
                  ? "text-white bg-[var(--surface)]"
                  : "text-[var(--text)]"
              }`}
            >
              <span>Admin</span>
              <ChevronIcon expanded={mobileAdminOpen} size="accordion" />
            </button>
            {mobileAdminOpen ? (
              <div className="ml-3 mt-1 mb-2 border-l border-[var(--border)]/70 pl-3 flex flex-col gap-0.5">
                {adminLinks.map((l) => {
                  const active = isExactActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeMenu}
                      className={`px-3 py-2.5 text-[13.5px] rounded-md ${
                        active
                          ? "text-white bg-[var(--accent)]/[0.12]"
                          : "text-[var(--text2)]"
                      }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                <form
                  action="/api/logout"
                  method="POST"
                  className="px-3 mt-1"
                >
                  <button
                    type="submit"
                    className="text-[13.5px] text-[var(--text2)] hover:text-[var(--rose)] cursor-pointer"
                  >
                    Logout →
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        ) : (
          <Link
            href="/login"
            onClick={closeMenu}
            className="px-3 py-3 text-sm font-medium rounded-md text-[var(--text)] border-t border-[var(--border)]/50 mt-1 pt-3"
          >
            Login
          </Link>
        )}
      </Container>
    </div>
  );
}

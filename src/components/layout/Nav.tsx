"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Container from "@/components/ui/Container";
import ChevronIcon from "./nav/ChevronIcon";
import WorkDropdownDesktop from "./nav/WorkDropdownDesktop";
import AdminDropdownDesktop from "./nav/AdminDropdownDesktop";
import MobileMenuBody from "./nav/MobileMenuBody";
import { adminLinks, links, workDropdown } from "./nav/items";
import type { DropdownItem } from "./nav/types";

type Props = { isAuthed?: boolean };

export default function Nav({ isAuthed = false }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const workMenuRef = useRef<HTMLDivElement | null>(null);
  const workTriggerRef = useRef<HTMLButtonElement | null>(null);
  const adminMenuRef = useRef<HTMLDivElement | null>(null);
  const adminTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Strip hash for active-link comparison so /work#offroad-kiosk on the
  // /work page doesn't all light up the same item.
  const dropdownItemActive = (href: string) => {
    const [base] = href.split("#");
    if (base === "/work") return pathname === "/work";
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  // Auto-expand any project whose case study the user is currently viewing.
  // Combined with the user-toggled `expandedItems` set so toggling never
  // collapses what the pathname implies should be open.
  const isExpanded = (item: DropdownItem) => {
    if (expandedItems.has(item.label)) return true;
    if (!item.children?.length) return false;
    return (
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
  };

  const toggleExpanded = (
    e: ReactMouseEvent<HTMLButtonElement>,
    label: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside + Escape close the desktop dropdown. Escape returns focus
  // to the trigger so keyboard users don't lose their place.
  useEffect(() => {
    if (!workOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        workMenuRef.current &&
        !workMenuRef.current.contains(e.target as Node)
      ) {
        setWorkOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setWorkOpen(false);
        workTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [workOpen]);

  // Same click-outside + Escape behavior for the admin dropdown.
  useEffect(() => {
    if (!adminOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(e.target as Node)
      ) {
        setAdminOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAdminOpen(false);
        adminTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [adminOpen]);

  // Roving-focus arrow-key navigation inside the menu. Queries live DOM so
  // expanded children are included in the iteration order automatically.
  const handleMenuKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!workMenuRef.current) return;
    const items = Array.from(
      workMenuRef.current.querySelectorAll<HTMLAnchorElement>(
        '[role="menuitem"]',
      ),
    );
    if (items.length === 0) return;
    const activeEl = document.activeElement as HTMLElement | null;
    const idx = activeEl ? items.indexOf(activeEl as HTMLAnchorElement) : -1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx < 0 ? 0 : (idx + 1) % items.length;
      items[next].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx <= 0 ? items.length - 1 : idx - 1;
      items[prev].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === "Tab") {
      // Tab leaves the menu — treat that as "user moved on, close it".
      setWorkOpen(false);
    }
  };

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setWorkOpen(true);
      // Defer focus until the menu mounts.
      requestAnimationFrame(() => {
        workMenuRef.current
          ?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
          ?.focus();
      });
    }
  };

  // Same arrow-key + trigger handlers for the admin dropdown.
  const handleAdminMenuKeyDown = (
    e: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (!adminMenuRef.current) return;
    const items = Array.from(
      adminMenuRef.current.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>(
        '[role="menuitem"]',
      ),
    );
    if (items.length === 0) return;
    const activeEl = document.activeElement as HTMLElement | null;
    const idx = activeEl
      ? items.indexOf(
          activeEl as HTMLAnchorElement | HTMLButtonElement,
        )
      : -1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx < 0 ? 0 : (idx + 1) % items.length;
      items[next].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx <= 0 ? items.length - 1 : idx - 1;
      items[prev].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === "Tab") {
      setAdminOpen(false);
    }
  };

  const handleAdminTriggerKeyDown = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setAdminOpen(true);
      requestAnimationFrame(() => {
        adminMenuRef.current
          ?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
          ?.focus();
      });
    }
  };

  // Close every menu on route change. React 19 prefers "adjust state in
  // render" over an effect for derived state — comparing the previous
  // pathname is the recommended pattern.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [seenPathname, setSeenPathname] = useState(pathname);
  if (pathname !== seenPathname) {
    setSeenPathname(pathname);
    setOpen(false);
    setWorkOpen(false);
    setMobileWorkOpen(false);
    setAdminOpen(false);
    setMobileAdminOpen(false);
  }

  const closeMenu = () => setOpen(false);

  // Section-style match — used for the regular nav (`/work` lights up on
  // every `/work/*` page, etc.). The leading-slash check is what stops
  // `/` from matching everything.
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Exact-match for sibling tabs that share a prefix — used in the admin
  // block, where Overview (`/admin`) would otherwise also light up on
  // `/admin/visitors`, `/admin/security`, etc. Sibling tabs need a strict
  // current-page check, not a section-prefix check.
  const isExactActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)]/70 bg-[var(--bg)]/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] font-bold text-sm">
            AW
          </span>
          <span className="hidden sm:inline text-sm font-semibold tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">
            Andrew Wendling
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = isActive(l.href);
            if (l.hasDropdown) {
              return (
                <div key={l.href} ref={workMenuRef} className="relative">
                  <button
                    ref={workTriggerRef}
                    type="button"
                    onClick={() => setWorkOpen((v) => !v)}
                    onKeyDown={handleTriggerKeyDown}
                    aria-haspopup="menu"
                    aria-expanded={workOpen}
                    className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      active
                        ? "text-white"
                        : "text-[var(--text)] hover:text-white"
                    }`}
                  >
                    {l.label}
                    <ChevronIcon expanded={workOpen} />
                  </button>
                  {workOpen ? (
                    <WorkDropdownDesktop
                      items={workDropdown}
                      onMenuKeyDown={handleMenuKeyDown}
                      dropdownItemActive={dropdownItemActive}
                      isExpanded={isExpanded}
                      toggleExpanded={toggleExpanded}
                    />
                  ) : null}
                </div>
              );
            }
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "text-white"
                    : "text-[var(--text)] hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {isAuthed ? (
            <AdminDropdownDesktop
              adminLinks={adminLinks}
              adminOpen={adminOpen}
              setAdminOpen={setAdminOpen}
              adminMenuRef={adminMenuRef}
              adminTriggerRef={adminTriggerRef}
              onMenuKeyDown={handleAdminMenuKeyDown}
              onTriggerKeyDown={handleAdminTriggerKeyDown}
              pathname={pathname}
              isExactActive={isExactActive}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="ml-2 px-3 py-2 text-sm font-medium rounded-md text-[var(--text)] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/contact"
                className="ml-1 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] whitespace-nowrap hover:-translate-y-[1px] transition-transform"
              >
                Hire me
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--border)] text-[var(--text2)]"
        >
          <span className="sr-only">Open menu</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 7h16" strokeLinecap="round" />
                <path d="M4 12h16" strokeLinecap="round" />
                <path d="M4 17h16" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {open ? (
        <MobileMenuBody
          links={links}
          adminLinks={adminLinks}
          workDropdown={workDropdown}
          mobileWorkOpen={mobileWorkOpen}
          setMobileWorkOpen={setMobileWorkOpen}
          mobileAdminOpen={mobileAdminOpen}
          setMobileAdminOpen={setMobileAdminOpen}
          isAuthed={isAuthed}
          isActive={isActive}
          isExactActive={isExactActive}
          isExpanded={isExpanded}
          toggleExpanded={toggleExpanded}
          closeMenu={closeMenu}
          pathname={pathname}
        />
      ) : null}
    </header>
  );
}

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

type NavLink = { href: string; label: string; hasDropdown?: boolean };

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work", hasDropdown: true },
  { href: "/about", label: "About" },
  { href: "/uses", label: "Uses" },
  { href: "/contact", label: "Contact" },
];

// Admin tabs — rendered in a separate "right block" of the nav only when
// the visitor is signed in. Auth state arrives as the `isAuthed` prop from
// the (site) layout, which reads the cookie server-side.
const adminLinks: NavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/security", label: "Security" },
];

type DropdownChild = { label: string; href: string };

type DropdownItem = {
  label: string;
  href: string;
  note: string | null;
  accent: boolean;
  /** Optional case-study list — renders as a mini-accordion under the parent. */
  children?: DropdownChild[];
};

// Dropdown items shown under Work. MONISCOPE and the AI Trade-Show Kiosk are
// the two projects with deep-dive case-study sub-pages today; both expand to
// a mini-accordion of their case studies. The other entries are anchor links
// to /work#slug — no expansion.
const workDropdown: DropdownItem[] = [
  { label: "All Work", href: "/work", note: null, accent: false },
  {
    label: "MONISCOPE",
    href: "/work/moniscope",
    note: "Multi-tenant SaaS · 5 case studies",
    accent: true,
    children: [
      { label: "AI assistant", href: "/work/moniscope/ai-assistant" },
      { label: "Multi-processor payments", href: "/work/moniscope/payments" },
      { label: "Automation engine", href: "/work/moniscope/automation" },
      { label: "Event-driven architecture", href: "/work/moniscope/events" },
      { label: "Reporting engine", href: "/work/moniscope/reporting" },
    ],
  },
  {
    label: "AI Trade-Show Kiosk",
    href: "/work/kiosk",
    note: "Off-roading e-commerce client · 2 case studies",
    accent: true,
    children: [
      { label: "AI image pipeline", href: "/work/kiosk/ai-pipeline" },
      { label: "Prompt engineering", href: "/work/kiosk/prompt-engineering" },
    ],
  },
  {
    label: "Local Service SEO",
    href: "/work#local-service-seo",
    note: "Concurrent consulting engagement",
    accent: false,
  },
  {
    label: "FutureShirts ERP",
    href: "/work#futureshirts-erp",
    note: "200K+ shipments / yr",
    accent: false,
  },
  {
    label: "Trabian / MVB Bank",
    href: "/work#trabian-mvb-fintech",
    note: "Cross-platform banking",
    accent: false,
  },
];

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
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className={`transition-transform ${
                        workOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <path
                        d="M2 4.5l4 4 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {workOpen ? (
                    <div
                      role="menu"
                      onKeyDown={handleMenuKeyDown}
                      className="absolute top-full left-0 mt-1.5 w-80 rounded-xl border border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] py-1.5"
                    >
                      {workDropdown.map((item) => {
                        const itemActive = dropdownItemActive(item.href);
                        const expanded = isExpanded(item);
                        const hasKids = !!item.children?.length;
                        return (
                          <div key={item.href}>
                            <div
                              className={`flex items-stretch mx-1.5 rounded-md transition-colors ${
                                item.accent
                                  ? "bg-[var(--accent)]/[0.06] hover:bg-[var(--accent)]/[0.12]"
                                  : "hover:bg-[var(--surface)]"
                              } ${itemActive && !hasKids ? "bg-[var(--surface)]" : ""}`}
                            >
                              <Link
                                href={item.href}
                                role="menuitem"
                                aria-current={itemActive ? "page" : undefined}
                                className="flex-1 px-3.5 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
                              >
                                <div
                                  className={`text-sm font-medium ${
                                    item.accent
                                      ? "text-[var(--accent)]"
                                      : "text-white"
                                  }`}
                                >
                                  {item.label}
                                </div>
                                {item.note ? (
                                  <div className="mt-0.5 text-[12px] text-[var(--text)] leading-snug">
                                    {item.note}
                                  </div>
                                ) : null}
                              </Link>
                              {hasKids ? (
                                <button
                                  type="button"
                                  onClick={(e) => toggleExpanded(e, item.label)}
                                  aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label} case studies`}
                                  aria-expanded={expanded}
                                  className="shrink-0 self-center mr-1.5 inline-flex items-center justify-center w-7 h-7 rounded-md text-[var(--text)] hover:text-white hover:bg-[var(--surface2)]/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
                                >
                                  <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className={`transition-transform ${
                                      expanded ? "rotate-180" : ""
                                    }`}
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M2 4.5l4 4 4-4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              ) : null}
                            </div>
                            {hasKids && expanded ? (
                              <div className="ml-5 mt-0.5 mb-1 border-l border-[var(--border)]/70 pl-1.5 flex flex-col">
                                {item.children!.map((child) => {
                                  const childActive = dropdownItemActive(
                                    child.href,
                                  );
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      role="menuitem"
                                      aria-current={
                                        childActive ? "page" : undefined
                                      }
                                      className={`px-3 py-2 mr-1.5 rounded-md text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 ${
                                        childActive
                                          ? "text-white bg-[var(--surface)]"
                                          : "text-[var(--text2)] hover:text-white hover:bg-[var(--surface)]"
                                      }`}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
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
                onKeyDown={handleAdminTriggerKeyDown}
                aria-haspopup="menu"
                aria-expanded={adminOpen}
                className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  pathname.startsWith("/admin")
                    ? "text-white"
                    : "text-[var(--text)] hover:text-white"
                }`}
              >
                Admin
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className={`transition-transform ${
                    adminOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <path
                    d="M2 4.5l4 4 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {adminOpen ? (
                <div
                  role="menu"
                  onKeyDown={handleAdminMenuKeyDown}
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
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className={`transition-transform ${
                          mobileWorkOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="M2 4.5l4 4 4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
                                    <svg
                                      width="11"
                                      height="11"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      className={`transition-transform ${
                                        expanded ? "rotate-180" : ""
                                      }`}
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M2 4.5l4 4 4-4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
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
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className={`transition-transform ${
                      mobileAdminOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4.5l4 4 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
      ) : null}
    </header>
  );
}

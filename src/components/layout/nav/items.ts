import type { DropdownItem, NavLink } from "./types";

// Primary nav links. `hasDropdown: true` flips the row into a button +
// menu trigger; the Work link is the only one today.
export const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work", hasDropdown: true },
  { href: "/about", label: "About" },
  { href: "/uses", label: "Uses" },
  { href: "/contact", label: "Contact" },
];

// Admin tabs — rendered in a separate "right block" of the nav only when
// the visitor is signed in. Auth state arrives as the `isAuthed` prop from
// the (site) layout, which reads the cookie server-side.
export const adminLinks: NavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/security", label: "Security" },
];

// Dropdown items shown under Work. Grouped by capability — Shopify &
// E-Commerce first (matches the CLAUDE.md positioning that lists Shopify
// integrations first), then SaaS, then Local SEO, then FinTech.
//
// Three patterns coexist here:
//   1. Deep-dive page WITH case-study sub-pages (MONISCOPE, Off-Roading
//      Shopify) — `children` set; row renders with an expand chevron.
//   2. Deep-dive page with NO sub-pages (FutureShirts) — `href` points
//      at its own page but `children` is omitted; no expand chevron.
//   3. No deep-dive page (Local SEO, Trabian) — `href` is an anchor
//      to `/work#slug`.
export const workDropdown: DropdownItem[] = [
  { label: "All Work", href: "/work", note: null, accent: false },

  // ── Shopify & E-Commerce ─────────────────────────────────────────
  {
    label: "Shopify (Off-Roading)",
    href: "/work/shopify",
    note: "Off-roading e-commerce client · 3 case studies",
    accent: true,
    children: [
      {
        label: "Klaviyo personalization architecture",
        href: "/work/shopify/personalization",
      },
      {
        label: "AI image pipeline (kiosk add-on)",
        href: "/work/shopify/ai-pipeline",
      },
      {
        label: "Prompt engineering harness (kiosk add-on)",
        href: "/work/shopify/prompt-engineering",
      },
    ],
  },
  {
    label: "FutureShirts (Shopify GraphQL @ scale)",
    href: "/work/futureshirts",
    note: "55+ artist storefronts · 3-year deep dive",
    accent: true,
  },

  // ── Multi-Tenant SaaS ────────────────────────────────────────────
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

  // ── Local SEO + Analytics ────────────────────────────────────────
  {
    label: "Local Service SEO",
    href: "/work#local-service-seo",
    note: "Concurrent consulting engagement",
    accent: false,
  },

  // ── FinTech ──────────────────────────────────────────────────────
  {
    label: "Trabian / MVB Bank",
    href: "/work#trabian-mvb-fintech",
    note: "Cross-platform banking · React Native + GraphQL",
    accent: false,
  },
];

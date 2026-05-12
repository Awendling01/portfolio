import Link from "next/link";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import ChevronIcon from "./ChevronIcon";
import type { DropdownItem } from "./types";

// Desktop Work dropdown panel — the absolute-positioned menu that
// renders when `workOpen` is true. Parent (Nav.tsx) owns the trigger
// button and the open/close state; this component just renders the
// panel contents (items + per-item accordion chevron + expanded
// children list). Receives the active/expanded helpers as props so
// it doesn't need its own state.

type Props = {
  items: DropdownItem[];
  onMenuKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  dropdownItemActive: (href: string) => boolean;
  isExpanded: (item: DropdownItem) => boolean;
  toggleExpanded: (
    e: ReactMouseEvent<HTMLButtonElement>,
    label: string,
  ) => void;
};

export default function WorkDropdownDesktop({
  items,
  onMenuKeyDown,
  dropdownItemActive,
  isExpanded,
  toggleExpanded,
}: Props) {
  return (
    <div
      role="menu"
      onKeyDown={onMenuKeyDown}
      className="absolute top-full left-0 mt-1.5 w-80 rounded-xl border border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] py-1.5"
    >
      {items.map((item) => {
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
                  <ChevronIcon expanded={expanded} size="accordion" />
                </button>
              ) : null}
            </div>
            {hasKids && expanded ? (
              <div className="ml-5 mt-0.5 mb-1 border-l border-[var(--border)]/70 pl-1.5 flex flex-col">
                {item.children!.map((child) => {
                  const childActive = dropdownItemActive(child.href);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      role="menuitem"
                      aria-current={childActive ? "page" : undefined}
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
  );
}

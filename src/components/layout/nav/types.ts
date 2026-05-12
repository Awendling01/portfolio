// Shared types for the Nav and its extracted dropdown children. Kept in
// a leaf module to avoid a circular import between the parent Nav and
// the child components that consume the dropdown row shape.

export type NavLink = { href: string; label: string; hasDropdown?: boolean };

export type DropdownChild = { label: string; href: string };

export type DropdownItem = {
  label: string;
  href: string;
  note: string | null;
  accent: boolean;
  /** Optional case-study list — renders as a mini-accordion under the parent. */
  children?: DropdownChild[];
};

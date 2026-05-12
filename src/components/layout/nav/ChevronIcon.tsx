// Shared chevron SVG used 8 times in the Nav (Work + Admin dropdown
// triggers, desktop + mobile accordion expanders). Rotates 180° when
// `expanded` is true. Two size variants:
//   - "trigger" (10×10, strokeWidth 1.6) — used on the top-level Work
//     and Admin dropdown toggle buttons.
//   - "accordion" (11×11, strokeWidth 1.8) — used on the per-row
//     children expand button inside dropdown panels and on mobile
//     accordion toggles.
//
// Class string + SVG attributes match the original inline JSX so the
// rendered HTML stays byte-identical.

type Size = "trigger" | "accordion";

type Props = {
  expanded: boolean;
  size?: Size;
};

export default function ChevronIcon({ expanded, size = "trigger" }: Props) {
  const dim = size === "trigger" ? "10" : "11";
  const stroke = size === "trigger" ? "1.6" : "1.8";

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      className={`transition-transform ${expanded ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M2 4.5l4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

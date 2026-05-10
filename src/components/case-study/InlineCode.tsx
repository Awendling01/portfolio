import { Fragment, type ReactNode } from "react";

// Walks a string and replaces backtick-wrapped segments with styled <code>
// spans. Lets case-study prose written in TypeScript template literals
// (e.g. `facility.reviews`) render with proper inline-code typography
// without pulling in a full markdown renderer.
//
// Only handles inline code. Bold, italics, links, etc. stay literal —
// add them only if a real need shows up.
export default function InlineCode({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  const re = /`([^`]+)`/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(children)) !== null) {
    if (m.index > last) {
      parts.push(
        <Fragment key={`t${key++}`}>
          {children.slice(last, m.index)}
        </Fragment>,
      );
    }
    parts.push(
      <code
        key={`c${key++}`}
        className="mono text-[0.92em] px-1 py-0.5 rounded bg-[var(--bg)]/60 text-[var(--accent)]"
      >
        {m[1]}
      </code>,
    );
    last = m.index + m[0].length;
  }
  if (last < children.length) {
    parts.push(
      <Fragment key={`t${key++}`}>{children.slice(last)}</Fragment>,
    );
  }

  return <>{parts}</>;
}

import { highlight } from "@/lib/highlight";
import type { CodeSnippet } from "@/lib/case-studies";

type Props = { snippet: CodeSnippet };

// Async server component. Shiki tokenizes PHP at request time and we render
// the resulting HTML. The classes shiki emits get styled by the .case-code
// rule in globals.css, which overrides shiki's background and font so the
// block matches the rest of the portfolio chrome.
export default async function CodeBlock({ snippet }: Props) {
  const html = await highlight(snippet.code, snippet.lang);

  return (
    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--bg)]/40">
        <span className="mono text-xs text-[var(--text2)] truncate">
          {snippet.filename}
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text)] shrink-0">
          {snippet.lang}
        </span>
      </div>
      <div
        className="case-code"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

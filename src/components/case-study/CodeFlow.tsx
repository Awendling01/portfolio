import type { CodeSnippet } from "@/lib/case-studies";
import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";

type Props = { snippets: CodeSnippet[] };

export default function CodeFlow({ snippets }: Props) {
  return (
    <div className="space-y-8">
      {snippets.map((snippet) => (
        <div key={snippet.filename}>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent2)] mb-1.5">
            {snippet.stepLabel}
          </div>
          <h3 className="text-[19px] font-semibold text-white mb-2">
            <InlineCode>{snippet.stepHeading}</InlineCode>
          </h3>
          <p className="text-[14px] leading-[1.65] text-[var(--text)] max-w-[720px]">
            <InlineCode>{snippet.stepBlurb}</InlineCode>
          </p>
          <CodeBlock snippet={snippet} />
        </div>
      ))}
    </div>
  );
}

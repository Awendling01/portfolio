import { createHighlighter, type Highlighter } from "shiki";

type Lang = "php" | "ts";

// Singleton highlighter — created once per server process. Loading the
// grammars + theme costs ~100ms; we don't want to pay that on every request.
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-default"],
      langs: ["php", "typescript"],
    });
  }
  return highlighterPromise;
}

/**
 * Server-side syntax highlighting. Returns HTML safe to render via
 * dangerouslySetInnerHTML. The wrapping `<pre>` and `<code>` tags are
 * included; styling is overridden in globals.css to match the portfolio
 * palette and remove shiki's default background.
 */
export async function highlight(
  code: string,
  lang: Lang = "php",
): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: lang === "ts" ? "typescript" : "php",
    theme: "github-dark-default",
  });
}

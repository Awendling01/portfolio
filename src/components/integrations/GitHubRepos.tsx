import { getPinnedRepos } from "@/lib/github";

export default async function GitHubRepos() {
  const repos = await getPinnedRepos();
  if (!repos.length) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {repos.map((repo) => (
        <a
          key={repo.url}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 transition-all hover:-translate-y-[2px] hover:border-[var(--accent)]/60 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.25)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-semibold text-white tracking-tight break-all group-hover:text-[var(--accent)] transition-colors">
              {repo.name}
            </div>
            <div className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--text)] flex items-center gap-1">
              <span aria-hidden="true">★</span>
              {repo.stargazerCount}
            </div>
          </div>
          {repo.description ? (
            <p className="mt-2 text-xs text-[var(--text)] leading-relaxed line-clamp-3">
              {repo.description}
            </p>
          ) : null}
          {repo.primaryLanguage ? (
            <div className="mt-3 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    repo.primaryLanguage.color ?? "var(--accent)",
                }}
              />
              {repo.primaryLanguage.name}
            </div>
          ) : null}
        </a>
      ))}
    </div>
  );
}

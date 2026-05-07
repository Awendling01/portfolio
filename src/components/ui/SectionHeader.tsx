type Props = {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  tag,
  title,
  subtitle,
  align = "left",
}: Props) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl mb-12 ${alignment}`}>
      {tag ? (
        <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
          {tag}
        </div>
      ) : null}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-[var(--text)] text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

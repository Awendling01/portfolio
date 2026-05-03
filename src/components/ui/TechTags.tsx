type Props = {
  items: string[];
  className?: string;
};

export default function TechTags({ items, className = "" }: Props) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="mono text-[11px] tracking-tight text-[var(--text)] border border-[var(--border)] bg-[var(--bg)]/60 rounded-md px-2.5 py-1"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

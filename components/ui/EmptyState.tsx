export default function EmptyState({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="border border-dashed border-rule px-6 py-14 text-center">
      <svg
        viewBox="0 0 130 96"
        width="130"
        className="ink mx-auto"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M26 8H72L92 28V86H26Z" strokeWidth={1.6} className="stroke-ink fill-paper" />
        <path d="M72 8V28H92" strokeWidth={1.4} className="stroke-ink" />
        <path d="M38 44H80M38 54H70M38 64H76" strokeWidth={1.2} strokeDasharray="3 4" className="stroke-ink-soft/60" />
        <path d="M84 72L108 48L116 56L92 80Z" strokeWidth={1.4} className="stroke-accent fill-paper" />
        <path d="M84 72L82 84L92 80" strokeWidth={1.4} className="stroke-accent" />
      </svg>
      <p className="mt-6 font-display text-2xl">{title}</p>
      {note && <p className="mt-2 text-ink-soft">{note}</p>}
    </div>
  );
}
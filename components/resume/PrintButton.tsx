"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-ink/70 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
    >
      Print / Save as PDF
    </button>
  );
}
"use client";

import { providers } from "./data";

export default function ProviderPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Model provider
            </span>
            <div className="flex flex-wrap gap-2">
                {providers.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onChange(p.id)}
                        aria-pressed={value === p.id}
                        className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-[240ms] ${value === p.id
                                ? "border-accent bg-accent text-paper"
                                : "border-ink/70 hover:border-accent hover:text-accent"
                            }`}
                    >
                        {p.name}
                        {p.local ? " · local" : ""}
                    </button>
                ))}
            </div>
        </div>
    );
}
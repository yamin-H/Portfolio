"use client";

import type { Level } from "./types";

const options: { id: Level; label: string }[] = [
  { id: "simple", label: "Simple" },
  { id: "engineer", label: "Engineer" },
];

export default function LevelToggle({
  level,
  onChange,
}: {
  level: Level;
  onChange: (l: Level) => void;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Reading level
            </span>
            <div className="flex border border-ink/70">
                {options.map((o) => (
                    <button
                        key={o.id}
                        onClick={() => onChange(o.id)}
                        aria-pressed={level === o.id}
                        className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] ${level === o.id
                                ? "bg-ink text-paper"
                                : "hover:text-accent"
                            }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
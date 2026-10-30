"use client";

import { useState } from "react";

export default function CopyChip({
  text,
  prompt = "$",
}: {
  text: string;
  prompt?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: do nothing */
    }
  }

    return (
        <button
            onClick={copy}
            aria-label={`Copy ${text}`}
            className="group inline-flex items-center gap-3 border border-ink/70 bg-paper/60 px-4 py-3 font-mono text-sm transition-colors duration-[240ms] hover:border-accent hover:text-accent"
        >
            {prompt && <span className="text-accent">{prompt}</span>}
            {text}
            <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft group-hover:text-accent">
                {copied ? "Copied" : "Copy"}
            </span>
        </button>
    );
}
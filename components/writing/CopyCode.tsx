"use client";

import { useState } from "react";

export default function CopyCode({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      aria-label="Copy code"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked: do nothing */
        }
      }}
      className="transition-colors duration-[240ms] hover:text-accent"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}
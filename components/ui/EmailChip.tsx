"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

export default function EmailChip({ email }: { email: string }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: do nothing */
    }
  }

    return (
        <div className="relative inline-block max-w-full">
            <button
                onClick={copy}
                aria-label={`Copy ${email}`}
                className="group flex max-w-full items-center gap-5 border border-ink/70 bg-paper/70 px-5 py-4 text-left transition-colors duration-[240ms] hover:border-accent"
            >
                <span className="break-all font-display text-2xl tracking-tight sm:text-4xl">
                    {email}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-[240ms] group-hover:text-accent">
                    Copy
                </span>
            </button>

            <AnimatePresence>
                {copied && (
                    <motion.span
                        key="stamp"
                        aria-hidden="true"
                        initial={reduce ? false : { opacity: 0, scale: 1.6, rotate: -14 }}
                        animate={{ opacity: 1, scale: 1, rotate: -8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease }}
                        className="ink pointer-events-none absolute -right-3 -top-5 border-2 border-accent bg-paper/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent"
                    >
                        Copied
                    </motion.span>
                )}
            </AnimatePresence>

            <span className="sr-only" aria-live="polite">
                {copied ? "Email copied" : ""}
            </span>
        </div>
    );
}
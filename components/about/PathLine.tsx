"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

export default function PathLine({
  steps,
}: {
  steps: { label: string; note: string }[];
}) {
  const reduce = useReducedMotion();

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
      {steps.flatMap((s, i) => [
        <div key={s.label} className="border border-rule bg-paper/60 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
            0{i + 1}
          </p>
          <p className="mt-2 font-display text-xl leading-snug">{s.label}</p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            {s.note}
          </p>
        </div>,
        i < steps.length - 1 ? (
          <div
            key={`a${i}`}
            aria-hidden="true"
            className="flex items-center justify-center"
          >
            <svg
              viewBox="0 0 44 20"
              className="ink h-5 w-10 rotate-90 text-accent sm:rotate-0"
              fill="none"
            >
              <motion.path
                d="M2 10 C 14 8, 26 12, 40 10 M33 4 L40 10 L33 16"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, ease, delay: 0.25 + i * 0.35 }}
              />
            </svg>
          </div>
        ) : null,
      ])}
    </div>
  );
}
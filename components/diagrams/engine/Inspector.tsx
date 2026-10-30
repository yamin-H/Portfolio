"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import type { Level, Stage } from "./types";

export default function Inspector({
  stage,
  index,
  total,
  level,
  pinned,
  onFollow,
}: {
  stage: Stage | null;
  index: number;
  total: number;
  level: Level;
  pinned: boolean;
  onFollow: () => void;
}) {
  const reduce = useReducedMotion();

  if (!stage) {
    return (
      <div className="mt-8 border border-dashed border-rule px-6 py-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          Click any block to inspect it, or press Run
        </p>
      </div>
    );
  }

  const code = level === "engineer";
  const box =
    "mt-2 border border-rule bg-paper-deep/60 p-3 font-mono text-[12px] leading-relaxed whitespace-pre overflow-x-auto";

    return (
        <motion.div
            key={`${index}-${level}`}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-8 border border-rule bg-paper/60 p-5 sm:p-6"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    Stage 0{index + 1} of 0{total}
                </p>
                {pinned && (
                    <button
                        onClick={onFollow}
                        className="border border-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
                    >
                        Pinned · Follow the run
                    </button>
                )}
            </div>

            <h4 className="mt-3 font-display text-2xl tracking-tight">
                {stage.name[level]}
            </h4>
            <p className="mt-1 max-w-2xl text-ink-soft">{stage.role[level]}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                        Goes in
                    </p>
                    {code ? (
                        <pre className={box}>{stage.input.engineer}</pre>
                    ) : (
                        <p className="mt-2 leading-relaxed">{stage.input.simple}</p>
                    )}
                </div>
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                        Comes out
                    </p>
                    {code ? (
                        <pre className={box}>{stage.output.engineer}</pre>
                    ) : (
                        <p className="mt-2 leading-relaxed">{stage.output.simple}</p>
                    )}
                </div>
            </div>

            <div className="mt-6 border-t border-rule pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Why this exists
                </p>
                <p className="mt-2 max-w-2xl leading-relaxed">{stage.why[level]}</p>
            </div>
        </motion.div>
    );
}
"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import TLink from "@/components/ui/TLink";
import { CompactContext } from "@/components/diagrams/iso/BlockFrame";
import { blockMap } from "@/components/diagrams/iso/blocks";
import { ease } from "@/lib/motion";
import type { ArchiveProject } from "@/content/archive";

export default function ProjectCard({
  p,
  n,
  canPlay,
  first,
  nudge,
  delay,
  onPlay,
}: {
  p: ArchiveProject;
  n: number;
  canPlay: boolean;
  first: boolean; // the first playable card carries the handwritten hint
  nudge: boolean; // true while the "press play" hint is showing
  delay: number; // ripple stagger, in seconds
  onPlay: (el: HTMLElement) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [hot, setHot] = useState(false);
  const Block = blockMap[p.block];

  const ext = p.links.find((l) => l.href);
  const link = p.featured
    ? { href: `/projects/${p.slug}`, label: "Read the case study", mark: "→", internal: true }
    : ext
    ? { href: ext.href, label: ext.label, mark: "↗", internal: false }
    : null;

  // the title's link stretches over the whole card, so the card stays clickable
  const stretch = "after:absolute after:inset-0 after:content-['']";

  return (
    <div
      className="relative flex h-full flex-col border border-ink/60 bg-paper/60 p-4 transition-[transform,border-color] duration-[240ms] hover:-translate-y-0.5 hover:border-accent focus-within:border-accent"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="text-accent">
          P-{String(n).padStart(2, "0")} · {p.kind}
        </span>
        <span className="text-ink-soft">{p.year}</span>
      </div>

      <div
        className={`mat mat-${p.block} relative mt-4 border border-rule bg-paper-deep/40 px-3 pb-1 pt-3`}
      >
        <div aria-hidden="true">
          <CompactContext.Provider value={true}>
            <Block state={hot ? "active" : "idle"} />
          </CompactContext.Provider>
        </div>

        {canPlay && (
          <div className="absolute bottom-3 right-3 z-10">
            {nudge && !reduce && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-accent"
                initial={{ opacity: 0.8, scaleX: 1, scaleY: 1 }}
                animate={{ opacity: 0, scaleX: 1.22, scaleY: 1.9 }}
                transition={{
                  duration: 1.3,
                  ease,
                  delay,
                  repeat: first ? 2 : 0,
                  repeatDelay: 0.45,
                }}
              />
            )}
            <button
              type="button"
              onClick={(e) => onPlay(e.currentTarget)}
              aria-label={`Play the ${p.title} demo video`}
              className="press relative inline-flex items-center gap-2 border border-ink/80 bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] hover:border-accent hover:bg-accent hover:text-paper"
            >
              <svg
                viewBox="0 0 10 12"
                width="8"
                height="10"
                aria-hidden="true"
                className="fill-current"
              >
                <path d="M0 0L10 6L0 12Z" />
              </svg>
              Play demo
            </button>
          </div>
        )}

        <AnimatePresence>
          {nudge && first && canPlay && (
            <motion.div
              key="hint"
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[3.5rem] right-2 z-10 flex -rotate-3 flex-col items-end"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="bg-paper/90 px-2 py-0.5 font-display text-[15px] italic text-accent">
                press play to watch it run
              </span>
              <svg
                viewBox="0 0 40 34"
                className="ink mr-6 h-7 w-9 text-accent"
                fill="none"
              >
                <motion.path
                  d="M6 2 C 4 16, 16 26, 33 30 M25 22 L34 30 L23 33"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease, delay: 0.35 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h3 className="mt-5 font-display text-2xl leading-tight tracking-tight">
        {!link ? (
          p.title
        ) : link.internal ? (
          <TLink href={link.href} label={p.title} className={stretch}>
            {p.title}
          </TLink>
        ) : (
          <a href={link.href} target="_blank" rel="noreferrer" className={stretch}>
            {p.title}
          </a>
        )}
      </h3>
      <p className="mt-2 leading-relaxed text-ink-soft">{p.summary}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {p.stack.slice(0, 4).map((s) => (
          <span
            key={s}
            className="border border-rule px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft"
          >
            {s}
          </span>
        ))}
      </div>

      {link && (
        <p
          aria-hidden="true"
          className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-accent"
        >
          {link.label} {link.mark}
        </p>
      )}
    </div>
  );
}
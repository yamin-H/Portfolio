"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLenis } from "lenis/react";
import { ease } from "@/lib/motion";
import { useTimeline } from "@/components/diagrams/engine/useTimeline";
import { useLayoutKind } from "@/components/diagrams/engine/useLayoutKind";
import Controls from "@/components/diagrams/engine/Controls";
import Inspector from "@/components/diagrams/engine/Inspector";
import LevelToggle from "@/components/diagrams/engine/LevelToggle";
import Scrubber from "@/components/diagrams/engine/Scrubber";
import type { Level } from "@/components/diagrams/engine/types";
import { BareContext } from "@/components/diagrams/iso/BlockFrame";
import IsoGithub from "@/components/diagrams/iso/IsoGithub";
import IsoQueue from "@/components/diagrams/iso/IsoQueue";
import IsoWorker from "@/components/diagrams/iso/IsoWorker";
import IsoGraph from "@/components/diagrams/iso/IsoGraph";
import IsoVectors from "@/components/diagrams/iso/IsoVectors";
import IsoReview from "@/components/diagrams/iso/IsoReview";
import type { BlockState } from "@/components/diagrams/iso/tones";
import {
  TRAVEL,
  DWELL,
  DWELL_QUEUE_DOWN,
  layouts,
  steps,
  idleCaption,
  brokenCaption,
  recoveredCaption,
  RETRY_AT,
  BACKOFF,
} from "./system";
import {
  stages,
  labels,
  stops,
  simpleSteps,
  simpleBroken,
  simpleRecovered,
} from "./inspect";

const blocks = [IsoGithub, IsoQueue, IsoWorker, IsoGraph, IsoVectors, IsoReview];

const dwell = (stop: number, broken: boolean) =>
  broken && stop === 1 ? DWELL_QUEUE_DOWN : DWELL;

const mats = [
  "mat mat-github",
  "mat mat-queue",
  "mat mat-worker",
  "mat mat-graph",
  "mat mat-vectors",
  "mat mat-review",
];

/** One connector. Its drawn length is read straight off the timeline position. */
function EdgeLine({
  k,
  d,
  arrow,
  progress,
  arrived,
  pathRef,
}: {
  k: number;
  d: string;
  arrow: string;
  progress: MotionValue<number>;
  arrived: boolean;
  pathRef: (el: SVGPathElement | null) => void;
}) {
  const len = useTransform(progress, (v) => Math.max(0, Math.min(1, v - k)));
  const op = useTransform(progress, (v) => {
    const f = v - k;
    return f <= 0.004 ? 0 : f >= 1 ? 0.55 : 1;
  });

  return (
    <g>
      <path
        ref={pathRef}
        d={d}
        strokeWidth={1.4}
        strokeDasharray="4 5"
        className="stroke-ink-soft/45"
      />
      <motion.path
        d={d}
        strokeWidth={2.2}
        className="stroke-accent"
        style={{ pathLength: len, opacity: op }}
      />
      <path
        d={arrow}
        strokeWidth={1.8}
        className={`transition-[stroke] duration-[240ms] ${
          arrived ? "stroke-accent" : "stroke-ink-soft/60"
        }`}
      />
    </g>
  );
}

export default function PrReviewSystem() {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const [wrapRef, kind] = useLayoutKind(860);
  const tall = kind === "tall";
  const layout = layouts[tall ? "tall" : "wide"];

  const t = useTimeline({
    total: blocks.length,
    travel: TRAVEL,
    dwell,
    reduce,
  });
  const { progress, lit, broken } = t;

  const [level, setLevel] = useState<Level>("engineer");
  const [pinned, setPinned] = useState<number | null>(null);

  // retry badges while the queue is down
  const [retry, setRetry] = useState(0);
  const inRetry = broken && lit === 1;
  useEffect(() => {
    if (!inRetry) return;
    const ts = RETRY_AT.map((ms, i) => setTimeout(() => setRetry(i + 1), ms));
    return () => {
      ts.forEach(clearTimeout);
      setRetry(0);
    };
  }, [inRetry]);

  function stateOf(k: number): BlockState {
    if (broken && k === 1) {
      if (lit < 1) return "down";
      if (lit === 1) return retry >= 4 ? "active" : "down";
      return "idle";
    }
    return lit === k ? "active" : "idle";
  }

  // the packet sits on the connector at exactly the timeline position
  const edgeRefs = useRef<(SVGPathElement | null)[]>([]);
  const lensRef = useRef<number[]>([]);
  const dotRef = useRef<SVGGElement>(null);
  const litRef = useRef(lit);

  const place = useCallback(
    (v: number) => {
      const dot = dotRef.current;
      if (!dot) return;
      const e = Math.min(Math.floor(v), layout.edges.length - 1);
      const f = v - e;
      const path = edgeRefs.current[e];
      if (reduce || litRef.current < 0 || !path || f <= 0.004 || f >= 0.996) {
        dot.style.opacity = "0";
        return;
      }
      const len = (lensRef.current[e] ??= path.getTotalLength());
      const p = path.getPointAtLength(f * len);
      dot.setAttribute("transform", `translate(${p.x} ${p.y})`);
      dot.style.opacity = "1";
    },
    [reduce, layout]
  );

  useMotionValueEvent(progress, "change", place);
  useEffect(() => {
    litRef.current = lit;
    place(progress.get());
  }, [lit, place, progress]);

  // the layout changed: cached path lengths are no longer valid
  useEffect(() => {
    lensRef.current = [];
    place(progress.get());
  }, [kind, place, progress]);

  // scrolling helpers (used by the phone layout)
  const blockRefs = useRef<(SVGGElement | null)[]>([]);
  const inspectorRef = useRef<HTMLDivElement>(null);

  const scrollToEl = useCallback(
    (el: Element | null, offset = 0) => {
      if (!el) return;
      const y = Math.max(
        0,
        window.scrollY + el.getBoundingClientRect().top + offset
      );
      if (lenis) lenis.scrollTo(y, { duration: 1.1, immediate: reduce });
      else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    },
    [lenis, reduce]
  );

  // on a phone, keep the active block in view while the run plays
  useEffect(() => {
    if (!tall || !t.playing || lit < 0) return;
    scrollToEl(blockRefs.current[lit], -110);
  }, [tall, t.playing, lit, scrollToEl]);

  function togglePin(k: number) {
    const next = pinned === k ? null : k;
    setPinned(next);
    if (tall && next !== null) scrollToEl(inspectorRef.current, -88);
  }

  const simple = level === "simple";
  const recovered = retry >= 4;

  const caption =
    lit < 0
      ? idleCaption
      : broken && lit === 1
      ? recovered
        ? simple
          ? simpleRecovered
          : recoveredCaption
        : simple
        ? simpleBroken
        : brokenCaption
      : simple
      ? simpleSteps[lit]
      : steps[lit];

  const shown = pinned ?? (lit >= 0 ? lit : null);
  const q = layout.slots[1];

    return (
        <div ref={wrapRef}>
            {kind === null ? (
                // reserved space until the layout is measured
                <div className="aspect-[920/560]" aria-hidden="true" />
            ) : (
                <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <LevelToggle level={level} onChange={setLevel} />
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                            Select a block to inspect it
                        </p>
                    </div>

                    <svg
                        viewBox={`0 0 ${layout.w} ${layout.h}`}
                        className={
                            tall ? "mx-auto block w-full max-w-[320px]" : "block w-full"
                        }
                        role="group"
                        aria-label="System design of the PR Review Agent: GitHub, queue, worker, LangGraph, pgvector, inline review"
                    >
                        {/* connectors */}
                        <g
                            className="ink"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {layout.edges.map((e, k) => (
                                <EdgeLine
                                    key={k}
                                    k={k}
                                    d={e.d}
                                    arrow={e.arrow}
                                    progress={progress}
                                    arrived={lit >= k + 1}
                                    pathRef={(el) => {
                                        edgeRefs.current[k] = el;
                                    }}
                                />
                            ))}
                        </g>

                        {/* blocks: each one is a button that pins the inspector */}
                        <BareContext.Provider value={true}>
                            {blocks.map((Block, k) => {
                                const label = labels[level][k];
                                const isPinned = pinned === k;
                                return (
                                    <g
                                        key={k}
                                        ref={(el) => {
                                            blockRefs.current[k] = el;
                                        }}
                                        transform={`translate(${layout.slots[k].x} ${layout.slots[k].y})`}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Inspect ${label}`}
                                        aria-pressed={isPinned}
                                        onClick={() => togglePin(k)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                togglePin(k);
                                            }
                                        }}
                                        className={`${mats[k]} group cursor-pointer outline-none`}
                                    >
                                        <rect
                                            x={-100}
                                            y={-205}
                                            width={240}
                                            height={232}
                                            rx={3}
                                            fill="transparent"
                                            strokeWidth={1.2}
                                            strokeDasharray="5 5"
                                            className={`stroke-accent transition-opacity duration-[240ms] ${isPinned
                                                ? "opacity-100"
                                                : "opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
                                                }`}
                                        />
                                        <Block state={stateOf(k)} label={label} />
                                    </g>
                                );
                            })}
                        </BareContext.Provider>

                        {/* retry badge under the queue */}
                        {inRetry && retry >= 1 && retry <= 3 && (
                            <text
                                x={q.x + 20}
                                y={q.y + 38}
                                textAnchor="middle"
                                fontSize="10"
                                letterSpacing="1.4"
                                className="font-mono fill-alert"
                            >
                                {simple
                                    ? `TRYING AGAIN · WAIT ${BACKOFF[retry - 1]}s`
                                    : `RETRY ${retry} · BACKOFF ${BACKOFF[retry - 1]}s`}
                            </text>
                        )}
                        {inRetry && recovered && (
                            <text
                                x={q.x + 20}
                                y={q.y + 38}
                                textAnchor="middle"
                                fontSize="10"
                                letterSpacing="1.4"
                                className="font-mono fill-accent"
                            >
                                {simple ? "WORKED ON THE 3RD TRY" : "RETRY 3 SUCCEEDED"}
                            </text>
                        )}

                        {/* the packet */}
                        <g ref={dotRef} style={{ opacity: 0 }}>
                            <circle r={10} className="fill-accent/20" />
                            <circle r={4.5} className="fill-accent" />
                        </g>
                    </svg>

                    {/* controls: pinned to the bottom of the screen on phones */}
                    <div
                        className={
                            tall
                                ? "sticky bottom-0 z-30 -mx-4 mt-2 border-t border-rule bg-paper/95 px-4 pb-3 pt-3 backdrop-blur-sm"
                                : "mt-2"
                        }
                    >
                        <Scrubber
                            progress={progress}
                            stops={stops[level]}
                            lit={lit}
                            onSeek={t.seek}
                            onGo={t.goTo}
                            onGrab={t.grab}
                        />

                        <motion.p
                            key={`${lit}-${broken}-${recovered}-${level}`}
                            initial={reduce ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease }}
                            aria-live="polite"
                            className={`max-w-3xl font-display leading-snug ${tall ? "mt-3 min-h-[3.5rem] text-base" : "mt-4 min-h-[4.5rem] text-xl"
                                }`}
                        >
                            {caption}
                        </motion.p>

                        <Controls
                            step={lit}
                            total={blocks.length}
                            playing={t.playing}
                            broken={broken}
                            breakLabel={simple ? "Break the waiting list" : "Break the queue"}
                            onRun={t.run}
                            onNext={t.next}
                            onReset={t.reset}
                            onBreak={t.toggleBroken}
                        />
                    </div>

                    <div ref={inspectorRef}>
                        {tall && pinned !== null && (
                            <button
                                onClick={() => scrollToEl(blockRefs.current[pinned], -110)}
                                className="mt-6 border border-ink/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
                            >
                                ↑ Back to the block
                            </button>
                        )}
                        <Inspector
                            stage={shown === null ? null : stages[shown]}
                            index={shown ?? 0}
                            total={blocks.length}
                            level={level}
                            pinned={pinned !== null}
                            onFollow={() => setPinned(null)}
                        />
                    </div>

                    <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-ink-soft">
                        Illustrative example. PR #234, the similarity scores, and the retry
                        timings are sample values.
                    </p>
                </>
            )}
        </div>
    );
}
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLenis } from "lenis/react";
import { useTimeline } from "@/components/diagrams/engine/useTimeline";
import { useLayoutKind } from "@/components/diagrams/engine/useLayoutKind";
import Controls from "@/components/diagrams/engine/Controls";
import Inspector from "@/components/diagrams/engine/Inspector";
import LevelToggle from "@/components/diagrams/engine/LevelToggle";
import Scrubber from "@/components/diagrams/engine/Scrubber";
import type { Level } from "@/components/diagrams/engine/types";
import {
  TRAVEL,
  DWELL,
  DWELL_QUEUE_DOWN,
  RETRY_AT,
  BACKOFF,
} from "@/components/diagrams/pr-review/system";
import { labels, stops } from "@/components/diagrams/pr-review/inspect";
import { layouts, type FlatEdge } from "./layout";
import DiagramSkeleton from "@/components/diagrams/flat/Skeleton";
import {
  NodeFrame,
  GithubBody,
  QueueBody,
  WorkerBody,
  GraphBody,
  VectorsBody,
  ReviewBody,
  type WState,
} from "./widgets";
import Trace from "./Trace";
import {
  scenarios,
  tints,
  edgeLabels,
  payloadFor,
  captionFor,
  stagesFor,
  rankFor,
  queryOf,
  commentFor,
  buildTrace,
  knotsFor,
} from "./data";

const dwell = (stop: number, broken: boolean) =>
  broken && stop === 1 ? DWELL_QUEUE_DOWN : DWELL;

export function EdgeBase({
  e,
  pathRef,
}: {
  e: FlatEdge;
  pathRef: (el: SVGPathElement | null) => void;
}) {
  return (
    <g
      className="ink"
      pointerEvents="none"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x={e.box.x} y={e.box.y} width={e.box.w} height={e.box.h} fill="transparent" stroke="none" />
      <path ref={pathRef} d={e.d} strokeWidth={1.4} strokeDasharray="4 5" className="stroke-ink-soft/50" />
      <path d={e.arrow} strokeWidth={1.8} className="stroke-ink-soft/70" />
    </g>
  );
}

export function EdgeFill({
  k,
  e,
  progress,
  arrived,
}: {
  k: number;
  e: FlatEdge;
  progress: MotionValue<number>;
  arrived: boolean;
}) {
  const len = useTransform(progress, (v) => Math.max(0, Math.min(1, v - k)));
  const op = useTransform(progress, (v) => {
    const f = v - k;
    return f <= 0.004 ? 0 : f >= 1 ? 0.6 : 1;
  });
  return (
    <g
      className="ink"
      pointerEvents="none"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x={e.box.x} y={e.box.y} width={e.box.w} height={e.box.h} fill="transparent" stroke="none" />
      <motion.path
        d={e.d}
        strokeWidth={2.4}
        className="stroke-accent"
        style={{ pathLength: len, opacity: op }}
      />
      <path
        d={e.arrow}
        strokeWidth={2}
        className={`stroke-accent transition-opacity duration-[240ms] ${
          arrived ? "opacity-100" : "opacity-0"
        }`}
      />
    </g>
  );
}

export function EdgePill({
  k,
  e,
  text,
  progress,
}: {
  k: number;
  e: FlatEdge;
  text: string;
  progress: MotionValue<number>;
}) {
  const w = text.length * 5.7 + 18;
  const hot = useTransform(progress, [k, k + 0.1, k + 0.9, k + 1], [0, 1, 1, 0]);
  const cx = e.vertical ? e.mid.x + 62 + w / 2 : e.mid.x;
  const cy = e.vertical ? e.mid.y : e.mid.y - 32;

  return (
    <g transform={`translate(${cx - w / 2} ${cy - 9})`} pointerEvents="none">
      <rect width={w} height={18} rx={9} strokeWidth={1} className="fill-paper stroke-ink-soft/60" />
      <motion.rect
        width={w}
        height={18}
        rx={9}
        strokeWidth={1.2}
        className="fill-accent/15 stroke-accent"
        style={{ opacity: hot }}
      />
      <text x={w / 2} y={12.2} textAnchor="middle" fontSize="9.5" className="font-mono fill-ink">
        {text}
      </text>
    </g>
  );
}

export default function PrReviewFlat() {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const [wrapRef, kind] = useLayoutKind(860);
  const tall = kind === "tall";
  const layout = tall ? layouts.tall : layouts.wide;

  const t = useTimeline({ total: 6, travel: TRAVEL, dwell, reduce });
  const { progress, lit, broken } = t;

  const [level, setLevel] = useState<Level>("engineer");
  const [pinned, setPinned] = useState<number | null>(null);
  const [scId, setScId] = useState(scenarios[0].id);
  const simple = level === "simple";

  // what the visitor sent, and what the vector search finds for it
  const sc = scenarios.find((s) => s.id === scId) ?? scenarios[0];
  const q = useMemo(() => queryOf(sc), [sc]);
  const matches = useMemo(() => rankFor(q), [q]);
  const top = matches[0];
  const comment = useMemo(() => commentFor(top), [top]);
  const stages = useMemo(() => stagesFor(sc, matches, comment), [sc, matches, comment]);

  // retries while the queue is down
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
  const shownRetry = !broken ? 4 : lit > 1 ? 4 : lit === 1 ? retry : 0;

  const trace = useMemo(() => buildTrace(broken), [broken]);
  const knots = useMemo(
    () => knotsFor(trace, broken, shownRetry),
    [trace, broken, shownRetry]
  );

  function stateOf(k: number): WState {
    if (broken && k === 1) {
      if (lit < 1) return "down";
      if (lit === 1) return retry >= 4 ? "active" : "down";
      return "done";
    }
    if (lit < 0) return "idle";
    if (k < lit) return "done";
    if (k === lit) return "active";
    return "idle";
  }

  let qPhase: "idle" | "queued" | "retrying" = "idle";
  if (!broken) qPhase = lit === 1 ? "queued" : "idle";
  else if (lit === 1) qPhase = retry >= 4 ? "queued" : "retrying";

  const retryText =
    retry === 0
      ? simple
        ? "can't reach the list…"
        : "enqueue failed…"
      : simple
      ? `trying again · wait ${BACKOFF[retry - 1]}s`
      : `retry ${retry} · backoff ${BACKOFF[retry - 1]}s`;
  const qNote =
    broken && qPhase === "queued"
      ? simple
        ? "back online"
        : "recovered"
      : "FIFO →";

  // the payload card sits on the connector at exactly the timeline position
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
  useEffect(() => {
    lensRef.current = [];
    place(progress.get());
  }, [kind, place, progress]);

  // scrolling helpers (phone layout)
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const inspectorRef = useRef<HTMLDivElement>(null);

  const scrollToEl = useCallback(
    (el: Element | null, offset = 0) => {
      if (!el) return;
      const y = Math.max(0, window.scrollY + el.getBoundingClientRect().top + offset);
      if (lenis) lenis.scrollTo(y, { duration: 1.1, immediate: reduce });
      else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    },
    [lenis, reduce]
  );

  useEffect(() => {
    if (!tall || !t.playing || lit < 0) return;
    scrollToEl(nodeRefs.current[lit], -110);
  }, [tall, t.playing, lit, scrollToEl]);

  function togglePin(k: number) {
    const next = pinned === k ? null : k;
    setPinned(next);
    if (tall && next !== null) scrollToEl(inspectorRef.current, -88);
  }

  const caption = captionFor(level, lit, broken, retry, sc, top, comment);
  const shown = pinned ?? (lit >= 0 ? lit : null);
  const pay = lit >= 0 && lit < 5 ? payloadFor(lit, sc, top, level) : null;

  function body(k: number, st: WState) {
    const common = { state: st, tint: tints[k], reduce };
    switch (k) {
      case 0:
        return <GithubBody {...common} sc={sc} />;
      case 1:
        return (
          <QueueBody
            {...common}
            pr={sc.pr}
            phase={qPhase}
            retryText={retryText}
            note={qNote}
          />
        );
      case 2:
        return <WorkerBody {...common} />;
      case 3:
        return <GraphBody {...common} />;
      case 4:
        return <VectorsBody {...common} q={q} matches={matches} />;
      default:
        return <ReviewBody {...common} sc={sc} comment={comment} />;
    }
  }

  const chip = (on: boolean) =>
    `border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-[240ms] ${
      on
        ? "border-accent bg-accent text-paper"
        : "border-ink/70 hover:border-accent hover:text-accent"
    }`;

  return (
    <div ref={wrapRef}>
      {kind === null ? (
        <DiagramSkeleton />
      ) : (
        <>
          <div className="mb-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LevelToggle level={level} onChange={setLevel} />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                Select a node to inspect it
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {simple ? "Code change to review" : "Change under review"}
              </span>
              <div className="flex flex-wrap gap-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScId(s.id)}
                    aria-pressed={scId === s.id}
                    className={chip(scId === s.id)}
                  >
                    {s.label[level]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${layout.w} ${layout.h}`}
            className={tall ? "mx-auto block w-full max-w-[360px]" : "block w-full"}
            role="group"
            aria-label="System design of the PR Review Agent: GitHub webhook, queue, worker, LangGraph, pgvector, inline review"
          >
            {layout.edges.map((e, k) => (
              <EdgeBase
                key={`b${k}`}
                e={e}
                pathRef={(el) => {
                  edgeRefs.current[k] = el;
                }}
              />
            ))}
            {layout.edges.map((e, k) => (
              <EdgeFill
                key={`f${k}`}
                k={k}
                e={e}
                progress={progress}
                arrived={lit >= k + 1}
              />
            ))}

            {layout.nodes.map((n, k) => (
              <NodeFrame
                key={k}
                x={n.x}
                y={n.y}
                label={labels[level][k]}
                state={stateOf(k)}
                tint={tints[k]}
                pinned={pinned === k}
                onToggle={() => togglePin(k)}
                nodeRef={(el) => {
                  nodeRefs.current[k] = el;
                }}
              >
                {body(k, stateOf(k))}
              </NodeFrame>
            ))}

            {layout.edges.map((e, k) => (
              <EdgePill
                key={`p${k}`}
                k={k}
                e={e}
                text={edgeLabels[level][k]}
                progress={progress}
              />
            ))}

            {/* the payload, changing shape at every hop */}
            <g ref={dotRef} style={{ opacity: 0 }} pointerEvents="none">
              {pay && (
                <g transform="translate(-52 -17)">
                  <rect width={104} height={34} rx={4} strokeWidth={1.4} className="fill-paper stroke-accent" />
                  <text x={8} y={14} fontSize="8.5" letterSpacing="1" className="font-mono fill-accent">
                    {pay.a}
                  </text>
                  <text x={8} y={27} fontSize="10" className="font-mono fill-ink">
                    {pay.b}
                  </text>
                </g>
              )}
            </g>
          </svg>

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

            <p
              key={`${lit}-${broken}-${retry >= 4}-${level}-${scId}`}
              aria-live="polite"
              className={`max-w-3xl font-display leading-snug ${
                tall ? "mt-3 min-h-[3.5rem] text-base" : "mt-4 min-h-[4.5rem] text-xl"
              }`}
            >
              {caption}
            </p>

            <Controls
              step={lit}
              total={6}
              playing={t.playing}
              broken={broken}
              breakLabel={simple ? "Break the waiting list" : "Break the queue"}
              onRun={t.run}
              onNext={t.next}
              onReset={t.reset}
              onBreak={t.toggleBroken}
            />
          </div>

          <Trace
            trace={trace}
            knots={knots}
            progress={progress}
            lit={lit}
            retry={shownRetry}
            level={level}
            broken={broken}
            onGo={t.goTo}
          />

          <div ref={inspectorRef}>
            {tall && pinned !== null && (
              <button
                onClick={() => scrollToEl(nodeRefs.current[pinned], -110)}
                className="mt-6 border border-ink/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
              >
                ↑ Back to the node
              </button>
            )}
            <Inspector
              stage={shown === null ? null : stages[shown]}
              index={shown ?? 0}
              total={6}
              level={level}
              pinned={pinned !== null}
              onFollow={() => setPinned(null)}
            />
          </div>

          <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-ink-soft">
            Illustrative example. PR numbers, similarity scores, timings and the
            trace are sample values.
          </p>
        </>
      )}
    </div>
  );
}
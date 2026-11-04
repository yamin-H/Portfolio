"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { ease } from "@/lib/motion";
import { useTimeline } from "@/components/diagrams/engine/useTimeline";
import { useLayoutKind } from "@/components/diagrams/engine/useLayoutKind";
import Controls from "@/components/diagrams/engine/Controls";
import Inspector from "@/components/diagrams/engine/Inspector";
import LevelToggle from "@/components/diagrams/engine/LevelToggle";
import Scrubber from "@/components/diagrams/engine/Scrubber";
import type { Level } from "@/components/diagrams/engine/types";
import { TRAVEL } from "@/components/diagrams/pr-review/system";
import DiagramSkeleton from "@/components/diagrams/flat/Skeleton";
import {
  providers,
  stops,
  labelsFor,
  DWELL,
  DWELL_DENIED,
} from "@/components/diagrams/yamin/data";
import ProviderPicker from "@/components/diagrams/yamin/ProviderPicker";
import { layouts } from "../layout";
import { NodeFrame, type WState } from "../widgets";
import Trace from "../Trace";
import { EdgeBase, EdgeFill, EdgePill } from "../PrReviewFlat";
import {
  TerminalBody,
  AgentBody,
  ModelBody,
  ToolsBody,
  GateBody,
  ResultBody,
} from "./widgets";
import {
  tasks,
  yTints,
  yRows,
  MODEL_MS,
  edgeLabelsFor,
  payloadFor,
  captionFor,
  stagesFor,
  buildYaminTrace,
  boundaryFlat,
} from "./data";

const dwell = (stop: number, denied: boolean) =>
  denied && stop === 4 ? DWELL_DENIED : DWELL;

export default function YaminFlat() {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const [wrapRef, kind] = useLayoutKind(860);
  const tall = kind === "tall";
  const layout = tall ? layouts.tall : layouts.wide;

  const t = useTimeline({ total: 6, travel: TRAVEL, dwell, reduce });
  const { progress, lit, broken: denied } = t;

  const [level, setLevel] = useState<Level>("engineer");
  const [pinned, setPinned] = useState<number | null>(null);
  const [taskId, setTaskId] = useState(tasks[0].id);
  const [pid, setPid] = useState("groq");
  const simple = level === "simple";

  const task = tasks.find((x) => x.id === taskId) ?? tasks[0];
  const provider = providers.find((p) => p.id === pid) ?? providers[0];
  const ms = MODEL_MS[provider.id] ?? 800;

  const stages = useMemo(
    () => stagesFor(task, provider, denied),
    [task, provider, denied]
  );
  const trace = useMemo(
    () => buildYaminTrace(task, provider, denied),
    [task, provider, denied]
  );
  const bounds = useMemo(() => boundaryFlat(layout, tall), [layout, tall]);
  const labels = labelsFor(level, provider, denied, lit);

  function stateOf(k: number): WState {
    if (lit < 0) return "idle";
    if (denied && (k === 4 || k === 5) && lit >= k) return "down";
    if (k < lit) return "done";
    if (k === lit) return "active";
    return "idle";
  }

  const backText = simple
    ? "the result goes back to the model"
    : denied
    ? "“user denied” → model"
    : "tool_result → model";

  function body(k: number, st: WState) {
    const common = { state: st, tint: yTints[k], reduce };
    switch (k) {
      case 0:
        return <TerminalBody {...common} task={task} provider={provider.name} />;
      case 1:
        return <AgentBody {...common} />;
      case 2:
        return (
          <ModelBody
            {...common}
            provider={provider.name}
            local={provider.local}
            call={task.reads[1]}
            ms={ms}
          />
        );
      case 3:
        return <ToolsBody {...common} reads={task.reads} />;
      case 4:
        return (
          <GateBody {...common} task={task} denied={denied} reached={lit >= 4} />
        );
      default:
        return (
          <ResultBody
            {...common}
            task={task}
            denied={denied}
            reached={lit >= 5}
            back={backText}
          />
        );
    }
  }

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

  const caption = captionFor(level, lit, provider, denied, task);
  const shown = pinned ?? (lit >= 0 ? lit : null);
  const pay = lit >= 0 && lit < 5 ? payloadFor(lit, task, denied, level) : null;
  const payW = pay
    ? Math.max(104, pay.a.length * 6.1 + 16, pay.b.length * 6 + 16)
    : 104;
  const pills = edgeLabelsFor(level, task, denied);

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
                {simple ? "What you ask" : "Task"}
              </span>
              <div className="flex flex-wrap gap-2">
                {tasks.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setTaskId(x.id)}
                    aria-pressed={taskId === x.id}
                    className={chip(taskId === x.id)}
                  >
                    {x.label[level]}
                  </button>
                ))}
              </div>
            </div>
            <ProviderPicker value={pid} onChange={setPid} />
          </div>

          <svg
            viewBox={`0 0 ${layout.w} ${layout.h}`}
            className={tall ? "mx-auto block w-full max-w-[360px]" : "block w-full"}
            role="group"
            aria-label="System design of Yamin: terminal, agent loop, model provider, read-only tools, approval gate, result"
          >
            {/* the boundary of your machine */}
            <g
              className="ink"
              fill="none"
              strokeLinejoin="round"
              strokeWidth={1.4}
              strokeDasharray="6 7"
              pointerEvents="none"
            >
              <motion.path
                d={bounds.cloud}
                className="stroke-ink-soft/55"
                initial={false}
                animate={{ opacity: provider.local ? 0 : 1 }}
                transition={{ duration: reduce ? 0 : 0.5, ease }}
              />
              <motion.path
                d={bounds.local}
                className="stroke-ink-soft/55"
                initial={false}
                animate={{ opacity: provider.local ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease }}
              />
            </g>
            {bounds.labels
              .filter((l) => !(provider.local && l.cloudOnly))
              .map((l, i) => {
                const text = provider.local ? l.local : l.cloud;
                const w = text.length * 6.6 + 16;
                const x0 = l.anchor === "end" ? l.x - w : l.x;
                return (
                  <g key={i} pointerEvents="none">
                    <rect x={x0} y={l.y - 8} width={w} height={16} className="fill-paper" />
                    <text
                      x={x0 + 8}
                      y={l.y + 3.5}
                      fontSize="9"
                      letterSpacing="1.2"
                      className="font-mono fill-ink-soft"
                    >
                      {text}
                    </text>
                  </g>
                );
              })}

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
              <EdgeFill key={`f${k}`} k={k} e={e} progress={progress} arrived={lit >= k + 1} />
            ))}

            {layout.nodes.map((n, k) => (
              <NodeFrame
                key={k}
                x={n.x}
                y={n.y}
                label={labels[k]}
                state={stateOf(k)}
                tint={yTints[k]}
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
              <EdgePill key={`p${k}`} k={k} e={e} text={pills[k]} progress={progress} />
            ))}

            {/* the payload, changing shape at every hop */}
            <g ref={dotRef} style={{ opacity: 0 }} pointerEvents="none">
              {pay && (
                <g transform={`translate(${-payW / 2} -17)`}>
                  <rect width={payW} height={34} rx={4} strokeWidth={1.4} className="fill-paper stroke-accent" />
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
              key={`${lit}-${denied}-${level}-${taskId}-${pid}`}
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
              broken={denied}
              breakLabel={simple ? "Say no to the change" : "Deny the action"}
              repairLabel={simple ? "Say yes instead" : "Approve the action"}
              onRun={t.run}
              onNext={t.next}
              onReset={t.reset}
              onBreak={t.toggleBroken}
            />
          </div>

          <Trace
            trace={trace}
            knots={trace.knots}
            progress={progress}
            lit={lit}
            retry={4}
            level={level}
            broken={denied}
            onGo={t.goTo}
            rows={yRows}
            traceId="9a1c47e2"
            note={
              denied
                ? "Hatched is the wait for your answer. Red means the action was denied, so it never ran. Model latency changes with the provider. "
                : "Hatched is the wait for your answer. Model latency changes with the provider. "
            }
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
            Illustrative example. The task, file names, diff, timings and trace
            are sample values.
          </p>
        </>
      )}
    </div>
  );
}
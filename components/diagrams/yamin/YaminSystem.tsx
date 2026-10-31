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
import EdgeLine from "@/components/diagrams/engine/EdgeLine";
import type { Level } from "@/components/diagrams/engine/types";
import { BareContext } from "@/components/diagrams/iso/BlockFrame";
import IsoTerminal from "@/components/diagrams/iso/IsoTerminal";
import IsoAgent from "@/components/diagrams/iso/IsoAgent";
import IsoProvider from "@/components/diagrams/iso/IsoProvider";
import IsoTools from "@/components/diagrams/iso/IsoTools";
import IsoGate from "@/components/diagrams/iso/IsoGate";
import IsoResult from "@/components/diagrams/iso/IsoResult";
import type { BlockState } from "@/components/diagrams/iso/tones";
import { TRAVEL, layouts } from "@/components/diagrams/pr-review/system";
import {
  providers,
  DWELL,
  DWELL_DENIED,
  stops,
  labelsFor,
  captionFor,
  buildStages,
  boundaryFor,
} from "./data";
import ProviderPicker from "./ProviderPicker";

const TOTAL = 6;
const WIDE = { ...layouts.wide, h: 540 }; // a little extra room for the approval badge

const mats = [
  "mat mat-terminal",
  "mat mat-agent",
  "mat mat-provider",
  "mat mat-tools",
  "mat mat-gate",
  "mat mat-result",
];

const dwell = (stop: number, denied: boolean) =>
    denied && stop === 4 ? DWELL_DENIED : DWELL;

export default function YaminSystem() {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const [wrapRef, kind] = useLayoutKind(860);
  const tall = kind === "tall";
  const layout = tall ? layouts.tall : WIDE;

  const t = useTimeline({ total: TOTAL, travel: TRAVEL, dwell, reduce });
  const { progress, lit, broken: denied } = t;

  const [level, setLevel] = useState<Level>("engineer");
  const [pid, setPid] = useState("groq");
  const [pinned, setPinned] = useState<number | null>(null);
  const provider = providers.find((p) => p.id === pid) ?? providers[0];
  const simple = level === "simple";

  const stages = useMemo(() => buildStages(provider, denied), [provider, denied]);
  const labels = labelsFor(level, provider, denied, lit);
  const bounds = boundaryFor(layout, tall);

  function stateOf(k: number): BlockState {
    if (denied) {
      if (k === 4) return lit >= 4 ? "down" : "idle";
      if (k === 5) return lit === 5 ? "down" : "idle";
    }
    return lit === k ? "active" : "idle";
  }

  const draw: ((s: BlockState, l: string) => React.ReactNode)[] = [
    (s, l) => <IsoTerminal state={s} label={l} />,
    (s, l) => <IsoAgent state={s} label={l} />,
    (s, l) => <IsoProvider state={s} label={l} />,
    (s, l) => <IsoTools state={s} label={l} />,
    (s, l) => <IsoGate state={s} label={l} open={!denied && lit >= 5} />,
    (s, l) => <IsoResult state={s} label={l} denied={denied} />,
  ];

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
  useEffect(() => {
    lensRef.current = [];
    place(progress.get());
  }, [kind, place, progress]);

  // scrolling helpers (phone layout)
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

  useEffect(() => {
    if (!tall || !t.playing || lit < 0) return;
    scrollToEl(blockRefs.current[lit], -110);
  }, [tall, t.playing, lit, scrollToEl]);

  function togglePin(k: number) {
    const next = pinned === k ? null : k;
    setPinned(next);
    if (tall && next !== null) scrollToEl(inspectorRef.current, -88);
  }

  const caption = captionFor(level, lit, provider, denied);
  const shown = pinned ?? (lit >= 0 ? lit : null);

  // badge under the approval gate (wide layout only; the caption covers phones)
  const badge =
    lit < 4
      ? null
      : denied
      ? {
          text: simple ? "YOU SAID NO · NOTHING CHANGED" : "DENIED · NOTHING WRITTEN",
          alert: true,
        }
      : lit === 4
      ? {
          text: simple ? "WAITING FOR YOUR YES OR NO" : "APPROVE? [y/N]",
          alert: false,
        }
      : { text: simple ? "YOU SAID YES" : "APPROVED · y", alert: false };
  const g = layout.slots[4];

    return (
        <div ref={wrapRef}>
            {kind === null ? (
                <div className="aspect-[920/560]" aria-hidden="true" />
            ) : (
                <>
                    <div className="mb-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <LevelToggle level={level} onChange={setLevel} />
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                                Select a block to inspect it
                            </p>
                        </div>
                        <ProviderPicker value={pid} onChange={setPid} />
                    </div>

                    <svg
                        viewBox={`0 0 ${layout.w} ${layout.h}`}
                        className={
                            tall ? "mx-auto block w-full max-w-[320px]" : "block w-full"
                        }
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
                                    <g key={i}>
                                        <rect
                                            x={x0}
                                            y={l.y - 8}
                                            width={w}
                                            height={16}
                                            className="fill-paper"
                                        />
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

                        {/* blocks */}
                        <BareContext.Provider value={true}>
                            {draw.map((render, k) => {
                                const label = labels[k];
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
                                        {render(stateOf(k), label)}
                                    </g>
                                );
                            })}
                        </BareContext.Provider>

                        {!tall && badge && (
                            <text
                                x={g.x + 20}
                                y={g.y + 32}
                                textAnchor="middle"
                                fontSize="10"
                                letterSpacing="1.4"
                                className={`font-mono ${badge.alert ? "fill-alert" : "fill-accent"
                                    }`}
                            >
                                {badge.text}
                            </text>
                        )}

                        {/* the packet */}
                        <g ref={dotRef} style={{ opacity: 0 }}>
                            <circle r={10} className="fill-accent/20" />
                            <circle r={4.5} className="fill-accent" />
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

                        <motion.p
                            key={`${lit}-${denied}-${level}-${pid}`}
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
                            total={TOTAL}
                            playing={t.playing}
                            broken={denied}
                            breakLabel={simple ? "Say no to the change" : "Deny the edit"}
                            repairLabel={simple ? "Say yes instead" : "Approve the edit"}
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
                            total={TOTAL}
                            level={level}
                            pinned={pinned !== null}
                            onFollow={() => setPinned(null)}
                        />
                    </div>

                    <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-ink-soft">
                        Illustrative example. The task, file name and diff are sample
                        values.
                    </p>
                </>
            )}
        </div>
    );
}
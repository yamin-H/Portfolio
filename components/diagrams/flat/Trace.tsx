"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import type { Level } from "@/components/diagrams/engine/types";
import {
  fmtMs,
  ticksFor,
  timeAt,
  traceRows,
  type Span,
  type TraceData,
} from "./data";

type Props = {
  trace: TraceData;
  knots: number[];
  progress: MotionValue<number>;
  lit: number;
  retry: number;
  level: Level;
  broken: boolean;
  onGo: (stop: number) => void;
  rows?: Record<Level, string[]>;
  traceId?: string;
  note?: string;
};

export default function Trace({
  trace,
  knots,
  progress,
  lit,
  retry,
  level,
  broken,
  onGo,
  rows: rowLabels = traceRows,
  traceId = "4bf92f35",
  note,
}: Props) {
  const playRef = useRef<HTMLDivElement>(null);
  const litRef = useRef(lit);

  const place = useCallback(
    (v: number) => {
      const el = playRef.current;
      if (!el) return;
      if (litRef.current < 0) {
        el.style.opacity = "0";
        return;
      }
      el.style.opacity = "1";
      el.style.left = `${(timeAt(v, knots) / trace.total) * 100}%`;
    },
    [knots, trace.total]
  );

  useMotionValueEvent(progress, "change", place);

  useEffect(() => {
    litRef.current = lit;
    place(progress.get());
  }, [lit, place, progress]);

  // when the retry count (or the data) changes, the playhead glides instead of jumping
  useEffect(() => {
    const el = playRef.current;
    if (!el) return;
    el.style.transition = "left 420ms cubic-bezier(0.22,1,0.36,1)";
    place(progress.get());
    const id = setTimeout(() => {
      el.style.transition = "";
    }, 460);
    return () => clearTimeout(id);
  }, [retry, trace, place, progress]);

  const rows = rowLabels[level];
  const ticks = ticksFor(trace.total);
  const pct = (ms: number) => `${(ms / trace.total) * 100}%`;

  const stateOf = (s: Span): "future" | "active" | "done" => {
    if (s.needs !== undefined && retry < s.needs) return "future";
    if (lit < 0) return "future";
    if (s.stop < lit) return "done";
    if (s.stop === lit) return "active";
    return "future";
  };

  return (
    <section aria-label="Request trace" className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Trace
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          trace_id {traceId} · {fmtMs(trace.total)} · sample data
        </p>
      </div>

      <div className="mt-3 border border-rule bg-paper/50">
        <div className="grid grid-cols-[6.75rem_1fr] sm:grid-cols-[9.5rem_1fr]">
          <div>
            <div className="h-6 border-b border-rule" />
            {rows.map((name, r) => (
              <button
                key={name}
                type="button"
                onClick={() => onGo(r)}
                className={`flex h-8 w-full items-center border-b border-rule/70 px-2 text-left font-mono text-[10px] tracking-[0.04em] transition-colors duration-[240ms] hover:text-accent ${
                  lit === r ? "text-accent" : "text-ink-soft"
                }`}
              >
                <span className="truncate">{name}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="relative h-6 border-b border-rule">
              {ticks.map((t, i) => (
                <span
                  key={t}
                  className="absolute top-1 font-mono text-[9px] text-ink-soft"
                  style={{
                    left: pct(t),
                    transform: i === 0 ? "translateX(4px)" : "translateX(-50%)",
                  }}
                >
                  {t === 0 ? "0" : fmtMs(t)}
                </span>
              ))}
            </div>

            {rows.map((name, r) => (
              <div key={name} className="relative h-8 border-b border-rule/70">
                {ticks.map((t) => (
                  <span
                    key={t}
                    className="absolute inset-y-0 w-px bg-rule/60"
                    style={{ left: pct(t) }}
                  />
                ))}
                {trace.spans
                  .filter((s) => s.row === r)
                  .map((s, i) => {
                    const st = stateOf(s);
                    const w = (s.dur / trace.total) * 100;
                    let cls =
                      "absolute inset-y-1.5 overflow-hidden whitespace-nowrap px-1 font-mono text-[9px] leading-[18px] transition-[background-color,border-color,opacity] duration-[240ms] ";
                    const style: CSSProperties = {
                      left: pct(s.start),
                      width: `max(${w}%, 4px)`,
                    };
                    if (s.kind === "wait") {
                      style.backgroundImage =
                        "repeating-linear-gradient(135deg, rgba(90,91,96,0.55) 0 2px, transparent 2px 6px)";
                      cls +=
                        st === "future"
                          ? "border border-dashed border-ink-soft/40 opacity-40"
                          : "border border-ink-soft/60";
                    } else if (s.kind === "err") {
                      cls +=
                        st === "future"
                          ? "border border-dashed border-alert/50"
                          : "bg-alert text-paper";
                    } else {
                      cls +=
                        st === "future"
                          ? "border border-dashed border-ink-soft/50"
                          : st === "active"
                          ? "bg-accent text-paper"
                          : "bg-ink/70 text-paper";
                    }
                    return (
                      <div
                        key={i}
                        className={cls}
                        style={style}
                        title={`${s.label} · ${fmtMs(s.dur)}`}
                      >
                        {s.kind === "wait" ? (
                          w > 7 ? (
                            <span className="bg-paper px-1 text-ink-soft">
                              {s.label}
                            </span>
                          ) : null
                        ) : w > 14 ? (
                          s.label
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            ))}

            <div
              ref={playRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 top-0 w-px bg-accent"
              style={{ opacity: 0 }}
            >
              <span className="absolute -left-[3px] top-0 h-[7px] w-[7px] bg-accent" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-ink-soft">
        {note ??
          (broken
            ? "Red is a failed attempt. Hatched is the backoff wait before the next retry. "
            : "")}
        Click a row to jump to that service. Durations are sample values.
      </p>
    </section>
  );
}
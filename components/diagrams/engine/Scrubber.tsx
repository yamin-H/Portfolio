"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

type Props = {
  progress: MotionValue<number>;
  stops: string[];
  lit: number;
  onSeek: (v: number) => void;
  onGo: (stop: number) => void;
  onGrab: () => void;
};

export default function Scrubber({
  progress,
  stops,
  lit,
  onSeek,
  onGo,
  onGrab,
}: Props) {
  const last = stops.length - 1;
  const [v, setV] = useState(progress.get());
  useMotionValueEvent(progress, "change", setV);

  const pct = (v / last) * 100;

  const valueText =
    lit < 0
      ? "Not started"
      : lit < last && v - lit > 0.02
      ? `Between ${stops[lit]} and ${stops[lit + 1]}`
      : stops[Math.min(lit, last)];

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onGo(Math.min(last, Math.floor(v + 0.002) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onGo(Math.max(0, Math.ceil(v - 0.002) - 1));
    }
  }

    return (
        <div className="mt-2">
            <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Timeline
                </p>
                <p className="font-mono text-[10px] tracking-[0.12em] text-ink-soft">
                    Drag to scrub, or click a stage
                </p>
            </div>

            <div className="relative mt-2 h-7">
                <div className="absolute inset-y-0 left-[7px] right-[7px]">
                    <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink-soft/40" />
                    <div
                        className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-accent"
                        style={{ width: `${pct}%` }}
                    />
                    {stops.map((_, i) => (
                        <span
                            key={i}
                            className={`absolute top-1/2 h-2.5 w-px -translate-y-1/2 transition-colors duration-[240ms] ${lit >= 0 && v >= i - 0.002 ? "bg-accent" : "bg-ink-soft/60"
                                }`}
                            style={{ left: `${(i / last) * 100}%` }}
                        />
                    ))}
                </div>

                <input
                    type="range"
                    min={0}
                    max={last}
                    step={0.01}
                    value={v}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    onPointerDown={onGrab}
                    onKeyDown={onKeyDown}
                    aria-label="Scrub through the request"
                    aria-valuetext={valueText}
                    className="scrub absolute inset-0"
                />
            </div>

            <div className="relative mx-[7px] mt-1 h-6">
                {stops.map((name, i) => (
                    <button
                        key={name}
                        onClick={() => onGo(i)}
                        className={`absolute top-0 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-[240ms] hover:text-accent ${lit === i ? "text-accent" : "text-ink-soft"
                            }`}
                        style={{
                            left: `${(i / last) * 100}%`,
                            transform: `translateX(${i === 0 ? 0 : i === last ? -100 : -50}%)`,
                        }}
                    >
                        <span className="sm:hidden">0{i + 1}</span>
                        <span className="hidden sm:inline">{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
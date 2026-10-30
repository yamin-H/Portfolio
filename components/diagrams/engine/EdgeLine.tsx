"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

/** One connector. Its drawn length is read straight off the timeline position. */
export default function EdgeLine({
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
                className={`transition-[stroke] duration-[240ms] ${arrived ? "stroke-accent" : "stroke-ink-soft/60"
                    }`}
            />
        </g>
    );
}
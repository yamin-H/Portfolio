"use client";

import TLink from "@/components/ui/TLink";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

const SLOPE = 25 / 43.3;
const hatch = [68, 76, 84, 92, 100].map((x) => ({
  x,
  y1: 60 - (x - 60) * SLOPE + 6,
  y2: 110 - (x - 60) * SLOPE - 6,
}));

export default function Logo() {
  const reduce = useReducedMotion();

    return (
        <TLink
            href="/"
            label="Home"
            aria-label="Yamin Hossain, home"
            className="group flex items-center gap-3 shrink-0"
        >
            <svg
                viewBox="0 0 120 120"
                width="30"
                height="30"
                aria-hidden="true"
                className="ink shrink-0 transition-transform duration-[240ms] group-hover:-translate-y-[2px]"
            >
                <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                    <polygon
                        points="60,60 103.3,35 103.3,85 60,110"
                        stroke="none"
                        className="fill-ink/10"
                    />
                    {hatch.map((l) => (
                        <line
                            key={l.x}
                            x1={l.x}
                            y1={l.y1}
                            x2={l.x}
                            y2={l.y2}
                            strokeWidth={2.5}
                            className="stroke-ink/45"
                        />
                    ))}
                    <polygon
                        points="60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35"
                        strokeWidth={5}
                        className="stroke-ink"
                    />
                    <motion.path
                        d="M16.7 35 L60 60 L103.3 35 M60 60 L60 110"
                        strokeWidth={6.5}
                        className="stroke-accent"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.9, ease, delay: 0.3 }}
                    />
                </g>
            </svg>

            <span className="hidden font-display text-xl tracking-tight sm:inline whitespace-nowrap">
                Yamin Hossain
            </span>
        </TLink>
    );
}
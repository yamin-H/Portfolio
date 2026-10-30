"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { useDiagram } from "@/components/diagrams/engine/useDiagram";
import Controls from "@/components/diagrams/engine/Controls";
import {
  nodes,
  edges,
  steps,
  idleCaption,
  brokenCaption,
  stepDuration,
  NODE_W,
  NODE_H,
} from "./config";

export default function PrReviewDiagram() {
  const d = useDiagram(nodes.length, stepDuration);
  const reduce = useReducedMotion();
  const { step, broken } = d;

  const caption =
    step < 0 ? idleCaption : broken && step === 1 ? brokenCaption : steps[step];

    return (
        <div>
            <svg
                viewBox="0 0 560 420"
                className="w-full"
                role="img"
                aria-label="System design: GitHub webhook, queue, worker, LangGraph, pgvector, inline review comment"
            >
                {/* fills (crisp, not wobbled) */}
                {nodes.map((nd, i) => (
                    <rect
                        key={`f${i}`}
                        x={nd.x}
                        y={nd.y}
                        width={NODE_W}
                        height={NODE_H}
                        rx={2}
                        className={`transition-colors duration-[240ms] ${i === step
                                ? broken && i === 1
                                    ? "fill-alert/10"
                                    : "fill-accent/10"
                                : "fill-paper/70"
                            }`}
                    />
                ))}

                {/* outlines and edges (one shared hand) */}
                <g className="ink">
                    {nodes.map((nd, i) => (
                        <rect
                            key={`o${i}`}
                            x={nd.x}
                            y={nd.y}
                            width={NODE_W}
                            height={NODE_H}
                            rx={2}
                            fill="none"
                            strokeWidth={1.4}
                            className={`transition-[stroke] duration-[240ms] ${broken && i === 1
                                    ? "stroke-alert"
                                    : i === step
                                        ? "stroke-accent"
                                        : "stroke-ink"
                                }`}
                        />
                    ))}

                    {edges.map((path, k) => (
                        <g key={`e${k}`}>
                            <path
                                d={path}
                                fill="none"
                                strokeWidth={1.4}
                                strokeDasharray="4 5"
                                className="stroke-ink-soft/45"
                            />
                            <motion.path
                                d={path}
                                fill="none"
                                strokeWidth={2.2}
                                strokeLinecap="round"
                                className="stroke-accent"
                                initial={false}
                                animate={{
                                    pathLength: step >= k + 1 ? 1 : 0,
                                    opacity: step === k + 1 ? 1 : 0.5,
                                }}
                                transition={{
                                    duration: reduce ? 0 : step >= k + 1 ? 0.9 : 0.3,
                                    ease,
                                }}
                            />
                        </g>
                    ))}
                </g>

                {/* labels */}
                {nodes.map((nd, i) => (
                    <g key={`t${i}`}>
                        <text
                            x={nd.x + 16}
                            y={nd.y + 26}
                            fontSize="10"
                            letterSpacing="1.5"
                            className={`font-mono ${i === step ? "fill-accent" : "fill-ink-soft"
                                }`}
                        >
                            {nd.n}
                        </text>
                        <text
                            x={nd.x + 16}
                            y={nd.y + 52}
                            fontSize="20"
                            className="font-display fill-ink"
                        >
                            {nd.title}
                        </text>
                        <text
                            x={nd.x + 16}
                            y={nd.y + 69}
                            fontSize="10"
                            letterSpacing="0.5"
                            className="font-mono fill-ink-soft"
                        >
                            {nd.sub}
                        </text>
                    </g>
                ))}

                {broken && (
                    <text
                        x={nodes[1].x + NODE_W - 14}
                        y={nodes[1].y + 26}
                        textAnchor="end"
                        fontSize="10"
                        letterSpacing="1.5"
                        className="font-mono fill-alert"
                    >
                        {step === 1 ? "DOWN · RETRYING" : "DOWN"}
                    </text>
                )}
            </svg>

            <motion.p
                key={`${step}-${broken}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                aria-live="polite"
                className="mt-3 min-h-[4.5rem] font-display text-lg leading-snug"
            >
                {caption}
            </motion.p>

            <Controls
                step={step}
                total={nodes.length}
                playing={d.playing}
                broken={broken}
                breakLabel="Break the queue"
                onRun={d.run}
                onNext={d.next}
                onReset={d.reset}
                onBreak={d.toggleBroken}
            />

            <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-ink-soft">
                Illustrative example. PR #234 and the 0.87 score are sample values.
            </p>
        </div>
    );
}
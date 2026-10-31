"use client";

import { createContext, useContext } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { tones, fade, type BlockState, type Tone } from "./tones";

/** When true, blocks render as a <g> so a parent SVG can place them. */
export const BareContext = createContext(false);
/** When true, a standalone block drops its label and crops tight (used in cards). */
export const CompactContext = createContext(false);

type Props = {
  state: BlockState;
  label: string;
  ariaLabel: string;
  ground: React.ReactNode;
  cx?: number;
  leaderEnd?: number;
  children: (t: {
    tone: Tone;
    fade: string;
    reduce: boolean;
  }) => React.ReactNode;
};

export default function BlockFrame({
  state,
  label,
  ariaLabel,
  ground,
  cx = 20,
  leaderEnd = -128,
  children,
}: Props) {
  const bare = useContext(BareContext);
  const compact = useContext(CompactContext);
  const reduce = useReducedMotion() ?? false;
  const tone = tones[state];
  const dur = reduce ? 0 : 0.6;
  const pillW = label.length * 6.2 + 30;

    const body = (
        <>
            {/* ground shadow: drifts away and fades as the block lifts */}
            <motion.g
                initial={false}
                animate={{
                    x: state === "active" ? 22 : 12,
                    y: state === "active" ? 16 : 9,
                    opacity: state === "active" ? 0.55 : 1,
                }}
                transition={{ duration: dur, ease }}
            >
                {ground}
            </motion.g>

            {/* label pill + leader line */}
            {!compact && (
                <>
                    <line
                        x1={cx}
                        y1={-178}
                        x2={cx}
                        y2={leaderEnd}
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        className={`${tone.leader} ${fade}`}
                    />
                    <g>
                        <rect
                            x={cx - pillW / 2}
                            y={-198}
                            width={pillW}
                            height={20}
                            rx={10}
                            strokeWidth={1.2}
                            className={`${tone.pill} ${fade}`}
                        />
                        <text
                            x={cx}
                            y={-184.5}
                            textAnchor="middle"
                            fontSize="9"
                            letterSpacing="1.4"
                            className={`font-mono ${tone.pillText} ${fade}`}
                        >
                            {label}
                        </text>
                    </g>
                </>
            )}

            {/* the block: outer group lifts and shakes, inner group is inked */}
            <motion.g
                initial={false}
                animate={{
                    y: state === "active" ? -14 : 0,
                    x: state === "down" && !reduce ? [0, -3, 3, -2, 2, 0] : 0,
                }}
                transition={{
                    y: { duration: dur, ease },
                    x: { duration: 0.5, ease: "easeOut" },
                }}
            >
                <g className="ink" strokeLinejoin="round" strokeLinecap="round">
                    {children({ tone, fade, reduce })}
                </g>
            </motion.g>
        </>
    );

    if (bare) return <g>{body}</g>;

    return (
        <svg
            viewBox={compact ? "-100 -190 240 218" : "-110 -215 260 240"}
            className={
                compact ? "mx-auto block w-full" : "mx-auto w-full max-w-md"
            }
            role="img"
            aria-label={ariaLabel}
        >
            {body}
        </svg>
    );
}
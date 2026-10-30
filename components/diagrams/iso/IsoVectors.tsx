"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import type { BlockState } from "./tones";

const CX = 20;
const RXE = 58;
const RYE = 29;
const DH = 20;
const GAP = 8;

const bases = [0, -(DH + GAP), -2 * (DH + GAP)];

/** Dense hatching on the right half, sparse on the left, following the disc curve. */
function discHatch(base: number) {
  const out: { x: number; y1: number; y2: number }[] = [];
  for (let i = 1, x = 6; x < RXE - 1; i++, x += 4) {
    const edge = base + RYE * Math.sqrt(1 - (x / RXE) ** 2);
    const frac = 0.55 + 0.45 * (((i * 37) % 11) / 10);
    out.push({ x: CX + x, y1: edge, y2: edge - DH * frac });
  }
  for (let i = 1, x = 12; x < RXE - 1; i++, x += 9) {
    const edge = base + RYE * Math.sqrt(1 - (x / RXE) ** 2);
    const frac = 0.3 + 0.4 * (((i * 53) % 11) / 10);
    out.push({ x: CX - x, y1: edge, y2: edge - DH * frac });
  }
  return out;
}

const hatches = bases.map(discHatch);

// embedding ticks on the top disc, laid along the iso axis
const topY = bases[2] - DH;
const tickT = [-27, -18, -9, 0, 9, 18, 27];
const tickH = [6, 12, 9, 15, 8, 11, 6];
const ticks = tickT.map((t, i) => {
  const y = topY - t / 2 + 3;
  return { x: CX + t, y1: y, y2: y - tickH[i] };
});

export default function IsoVectors({
  state = "idle",
  label = "PGVECTOR · 384-DIM",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric vector store block, ${state}`}
            leaderEnd={-100}
            ground={
                <ellipse
                    cx={CX}
                    cy={4}
                    rx={RXE + 8}
                    ry={RYE + 4}
                    className="fill-ink/10"
                />
            }
        >
            {({ tone, fade, reduce }) => (
                <>
                    {bases.map((base, i) => {
                        const top = base - DH;
                        const body = `M ${CX - RXE} ${top} L ${CX - RXE} ${base} A ${RXE} ${RYE} 0 0 0 ${CX + RXE
                            } ${base} L ${CX + RXE} ${top}`;

                        return (
                            <motion.g
                                key={i}
                                initial={false}
                                animate={{ y: active ? -i * 7 : 0 }}
                                transition={{
                                    duration: reduce ? 0 : 0.55,
                                    ease,
                                    delay: reduce || !active ? 0 : i * 0.07,
                                }}
                            >
                                <path
                                    d={body}
                                    strokeWidth={1.6}
                                    className={`fill-paper-deep ${tone.edge} ${fade}`}
                                />
                                {hatches[i].map((l, k) => (
                                    <line
                                        key={k}
                                        x1={l.x}
                                        y1={l.y1}
                                        x2={l.x}
                                        y2={l.y2}
                                        strokeWidth={0.9}
                                        className={`${tone.hatch} ${fade}`}
                                    />
                                ))}
                                <ellipse
                                    cx={CX}
                                    cy={top}
                                    rx={RXE}
                                    ry={RYE}
                                    strokeWidth={1.6}
                                    className={`fill-paper ${tone.edge} ${fade}`}
                                />
                                <ellipse
                                    cx={CX}
                                    cy={top}
                                    rx={RXE}
                                    ry={RYE}
                                    stroke="none"
                                    className={`${tone.tint} ${fade}`}
                                />

                                {i < 2 && (
                                    <ellipse
                                        cx={CX}
                                        cy={top}
                                        rx={RXE * 0.55}
                                        ry={RYE * 0.55}
                                        fill="none"
                                        strokeWidth={0.8}
                                        className={`${tone.hatch} ${fade}`}
                                    />
                                )}

                                {i === 2 &&
                                    ticks.map((t, k) => (
                                        <motion.line
                                            key={k}
                                            x1={t.x}
                                            y1={t.y1}
                                            x2={t.x}
                                            y2={t.y2}
                                            strokeWidth={1.6}
                                            className={`${tone.edge} ${fade}`}
                                            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                                            initial={false}
                                            animate={{ scaleY: active ? 1.6 : 1 }}
                                            transition={{
                                                duration: reduce ? 0 : 0.45,
                                                ease,
                                                delay: reduce || !active ? 0 : 0.25 + k * 0.05,
                                            }}
                                        />
                                    ))}
                            </motion.g>
                        );
                    })}
                </>
            )}
        </BlockFrame>
    );
}
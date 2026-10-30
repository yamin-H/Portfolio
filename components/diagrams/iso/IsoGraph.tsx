"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch, type V } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 14;
const S = 16; // node footprint
const NH = 8; // node height

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 8, 0.4);
const rightHatch = hatch("right", W, H, 4, 0.6);

const Ft: V = scale(UP, H);

// six nodes snaking through the plate: (a along width, b along depth)
const grid: [number, number][] = [
  [18, 14],
  [56, 14],
  [94, 14],
  [94, 56],
  [56, 56],
  [18, 56],
];

const at = (a: number, b: number): V =>
  add(add(Ft, scale(RX, a)), scale(LY, b));

const centers = grid.map(([a, b]) => at(a + S / 2, b + S / 2));
const nodes = grid.map(([a, b]) => box(at(a, b), S, S, NH));

const edges = centers.slice(0, -1).map((c, i) => {
  const n = centers[i + 1];
  return `M${c[0]} ${c[1]} L${n[0]} ${n[1]}`;
});

// paint the farthest nodes first
const order = grid
  .map((_, i) => i)
  .sort((x, y) => grid[y][0] + grid[y][1] - (grid[x][0] + grid[x][1]));

export default function IsoGraph({
  state = "idle",
  label = "LANGGRAPH · 6 NODES",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";
  const delay = (ms: number) => ({
    transitionDelay: active ? `${ms}ms` : "0ms",
  });

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric LangGraph block, ${state}`}
            leaderEnd={-136}
            ground={<polygon points={main.ground} className="fill-ink/10" />}
        >
            {({ tone, fade, reduce }) => (
                <>
                    <polygon
                        points={main.left}
                        strokeWidth={1.6}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={main.right}
                        strokeWidth={1.6}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <Hatch lines={leftHatch} className={`${tone.hatch} ${fade}`} />
                    <Hatch lines={rightHatch} className={`${tone.hatch} ${fade}`} />

                    <polygon
                        points={main.top}
                        strokeWidth={1.6}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={main.top}
                        stroke="none"
                        className={`${tone.tint} ${fade}`}
                    />

                    {/* edges, lit in sequence */}
                    {edges.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            strokeWidth={1.6}
                            strokeDasharray={active ? undefined : "3 3"}
                            className={`${active ? tone.edge : tone.hatch} ${fade}`}
                            style={reduce ? undefined : delay(i * 110 + 55)}
                        />
                    ))}

                    {/* nodes, far to near */}
                    {order.map((i) => (
                        <motion.g
                            key={i}
                            initial={false}
                            animate={{ y: active ? -5 : 0 }}
                            transition={{
                                duration: reduce ? 0 : 0.45,
                                ease,
                                delay: reduce || !active ? 0 : i * 0.11,
                            }}
                        >
                            <polygon
                                points={nodes[i].left}
                                strokeWidth={1.1}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                                style={reduce ? undefined : delay(i * 110)}
                            />
                            <polygon
                                points={nodes[i].right}
                                strokeWidth={1.1}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                                style={reduce ? undefined : delay(i * 110)}
                            />
                            <polygon
                                points={nodes[i].top}
                                strokeWidth={1.1}
                                className={`fill-paper ${tone.edge} ${fade}`}
                                style={reduce ? undefined : delay(i * 110)}
                            />
                            <polygon
                                points={nodes[i].top}
                                stroke="none"
                                className={`${tone.tint} ${fade}`}
                                style={reduce ? undefined : delay(i * 110)}
                            />
                        </motion.g>
                    ))}
                </>
            )}
        </BlockFrame>
    );
}
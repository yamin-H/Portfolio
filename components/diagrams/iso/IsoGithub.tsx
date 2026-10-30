"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 36;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 9, 0.3);
const rightHatch = hatch("right", W, H, 4, 0.6);

// standing PR card on top of the slab
const origin = add(add(scale(UP, H), scale(RX, 40)), scale(LY, 42));
const PW = 50;
const PD = 6;
const PH = 36;
const card = box(origin, PW, PD, PH);

const P = (t: number, u: number) =>
  [origin[0] + t, origin[1] - t / 2 - u] as const;

const diff = [
  { u: 30, t1: 6, t2: 40 },
  { u: 23, t1: 6, t2: 28 },
  { u: 16, t1: 6, t2: 44 },
  { u: 9, t1: 6, t2: 20 },
].map((l) => {
  const [x1, y1] = P(l.t1, l.u);
  const [x2, y2] = P(l.t2, l.u);
  return `M${x1} ${y1} L${x2} ${y2}`;
});

export default function IsoGithub({
  state = "idle",
  label = "GITHUB · WEBHOOK",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric GitHub block, ${state}`}
            leaderEnd={-148}
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

                    {/* webhook port */}
                    <circle
                        cx={-22}
                        cy={-25}
                        r={4}
                        strokeWidth={1.2}
                        className={`${tone.pill} ${fade}`}
                    />

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

                    {/* PR card */}
                    <motion.g
                        initial={false}
                        animate={{ y: active ? -8 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease }}
                    >
                        <polygon
                            points={card.left}
                            strokeWidth={1.2}
                            className={`fill-paper-deep ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={card.right}
                            strokeWidth={1.2}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={card.top}
                            strokeWidth={1.2}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />

                        {/* diff lines redraw each time the block becomes active */}
                        <g key={active ? "a" : "i"}>
                            {diff.map((d, i) => (
                                <motion.path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    strokeWidth={1.5}
                                    className={`${tone.edge} ${fade}`}
                                    initial={{ pathLength: active ? 0 : 1 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: reduce ? 0 : 0.45,
                                        ease,
                                        delay: reduce || !active ? 0 : 0.2 + i * 0.12,
                                    }}
                                />
                            ))}
                        </g>
                    </motion.g>
                </>
            )}
        </BlockFrame>
    );
}
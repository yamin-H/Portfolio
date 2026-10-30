"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 30;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 9, 0.3);
const rightHatch = hatch("right", W, H, 4, 0.6);

// standing comment card
const origin = add(add(scale(UP, H), scale(RX, 25)), scale(LY, 40));
const PW = 76;
const PD = 6;
const PH = 46;
const card = box(origin, PW, PD, PH);

// a point on the card's wide face
const P = (t: number, u: number) =>
  `${(origin[0] + t).toFixed(1)} ${(origin[1] - t / 2 - u).toFixed(1)}`;

const lines = [
  { u: 36, t1: 8, t2: 64 },
  { u: 29, t1: 8, t2: 50 },
  { u: 22, t1: 8, t2: 68 },
  { u: 15, t1: 8, t2: 36 },
].map((l) => `M${P(l.t1, l.u)} L${P(l.t2, l.u)}`);

// ink circle around the second line (the one that cites PR #234)
const k = 0.5523;
const t0 = 30;
const u0 = 29;
const rt = 27;
const ru = 6.5;
const circle =
  `M${P(t0 - rt, u0)} ` +
  `C${P(t0 - rt, u0 + k * ru)} ${P(t0 - k * rt, u0 + ru)} ${P(t0, u0 + ru)} ` +
  `C${P(t0 + k * rt, u0 + ru)} ${P(t0 + rt, u0 + k * ru)} ${P(t0 + rt, u0)} ` +
  `C${P(t0 + rt, u0 - k * ru)} ${P(t0 + k * rt, u0 - ru)} ${P(t0, u0 - ru)} ` +
  `C${P(t0 - k * rt, u0 - ru)} ${P(t0 - rt, u0 - k * ru)} ${P(t0 - rt, u0)}`;

export default function IsoReview({
  state = "idle",
  label = "REVIEW · INLINE COMMENT",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric review block, ${state}`}
            leaderEnd={-146}
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

                        {/* comment lines write in each time the block becomes active */}
                        <g key={active ? "a" : "i"}>
                            {lines.map((d, i) => (
                                <motion.path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    strokeWidth={1.5}
                                    className={`${tone.edge} ${fade}`}
                                    initial={{ pathLength: active ? 0 : 1 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: reduce ? 0 : 0.5,
                                        ease,
                                        delay: reduce || !active ? 0 : 0.2 + i * 0.14,
                                    }}
                                />
                            ))}
                        </g>

                        {/* the circle: drawn after the lines */}
                        <motion.path
                            d={circle}
                            fill="none"
                            strokeWidth={1.6}
                            className={`${tone.edge} ${fade}`}
                            initial={false}
                            animate={{
                                pathLength: active ? 1 : 0,
                                opacity: active ? 1 : 0,
                            }}
                            transition={{
                                duration: reduce ? 0 : active ? 0.6 : 0.2,
                                ease,
                                delay: reduce || !active ? 0 : 0.85,
                            }}
                        />
                    </motion.g>
                </>
            )}
        </BlockFrame>
    );
}
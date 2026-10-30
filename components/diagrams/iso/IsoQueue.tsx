"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, pts, add, scale, RX, LY, UP, hatch, type V } from "./geometry";
import type { BlockState } from "./tones";

export type { BlockState };

const W = 130;
const D = 90;
const H = 56;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 8, 0.35);
const rightHatch = hatch("right", W, H, 4, 0.6);

const Ft: V = scale(UP, H);
const t0 = add(add(Ft, scale(RX, 8)), scale(LY, 8));
const t1 = add(t0, scale(RX, W - 16));
const t2 = add(t1, scale(LY, D - 16));
const t3 = add(t0, scale(LY, D - 16));
const tray = pts(t0, t1, t2, t3);

const cards = [16, 48, 80].map((s) =>
  box(add(add(Ft, scale(RX, s)), scale(LY, 16)), 24, 58, 8)
);

export default function IsoQueue({
  state = "idle",
  label = "QUEUE · BULLMQ",
}: {
  state?: BlockState;
  label?: string;
}) {
    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric queue block, ${state}`}
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
                    <polygon
                        points={tray}
                        strokeWidth={1}
                        className={`fill-ink/5 ${tone.edge} ${fade}`}
                    />

                    {cards.map((c, i) => (
                        <motion.g
                            key={i}
                            initial={false}
                            animate={{ y: state === "active" ? -6 : 0 }}
                            transition={{
                                duration: reduce ? 0 : 0.5,
                                ease,
                                delay: reduce || state !== "active" ? 0 : i * 0.09,
                            }}
                        >
                            <polygon
                                points={c.left}
                                strokeWidth={1}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                            />
                            <polygon
                                points={c.right}
                                strokeWidth={1}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                            />
                            <polygon
                                points={c.top}
                                strokeWidth={1}
                                className={`fill-paper ${tone.edge} ${fade}`}
                            />
                        </motion.g>
                    ))}
                </>
            )}
        </BlockFrame>
    );
}
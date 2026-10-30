"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 40;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 10, 0.25);
const rightHatch = hatch("right", W, H, 4, 0.6);

// three vent slots along the left face
const slots = [10, 18, 26].map((hk) => ({
  x1: -26,
  y1: -13 - hk,
  x2: -(D - 12),
  y2: -(D - 12) / 2 - hk,
}));

// raised plate on top, chunk tiles standing on it
const plateOrigin = add(add(scale(UP, H), scale(RX, 10)), scale(LY, 10));
const plate = box(plateOrigin, W - 20, D - 20, 6);
const plateTop = add(plateOrigin, scale(UP, 6));
const tiles = [10, 43, 76].map((s) =>
  box(add(add(plateTop, scale(RX, s)), scale(LY, 13)), 24, 44, 8)
);

export default function IsoWorker({
  state = "idle",
  label = "WORKER · FASTAPI",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric worker block, ${state}`}
            leaderEnd={-108}
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

                    {slots.map((s, i) => (
                        <line
                            key={i}
                            x1={s.x1}
                            y1={s.y1}
                            x2={s.x2}
                            y2={s.y2}
                            strokeWidth={1.5}
                            className={`${tone.edge} ${fade}`}
                        />
                    ))}

                    {/* status LED */}
                    <circle
                        cx={-14}
                        cy={-37}
                        r={3.6}
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

                    {/* raised plate */}
                    <polygon
                        points={plate.left}
                        strokeWidth={1.2}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={plate.right}
                        strokeWidth={1.2}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={plate.top}
                        strokeWidth={1.2}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />

                    {/* chunk tiles: far ones painted first */}
                    {[2, 1, 0].map((i) => (
                        <motion.g
                            key={i}
                            initial={false}
                            animate={{
                                x: active ? (i - 1) * 8 : 0,
                                y: active ? -5 - (i - 1) * 4 : 0,
                            }}
                            transition={{
                                duration: reduce ? 0 : 0.55,
                                ease,
                                delay: reduce || !active ? 0 : i * 0.08,
                            }}
                        >
                            <polygon
                                points={tiles[i].left}
                                strokeWidth={1}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                            />
                            <polygon
                                points={tiles[i].right}
                                strokeWidth={1}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                            />
                            <polygon
                                points={tiles[i].top}
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
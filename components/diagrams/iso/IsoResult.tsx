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

const origin = add(add(scale(UP, H), scale(RX, 25)), scale(LY, 40));
const card = box(origin, 76, 6, 46);
const P = (t: number, u: number) =>
  `${(origin[0] + t).toFixed(1)} ${(origin[1] - t / 2 - u).toFixed(1)}`;

const lines = [
  `M${P(8, 40)} L${P(62, 40)}`,
  `M${P(8, 33)} L${P(46, 33)}`,
];
const check = `M${P(10, 17)} L${P(18, 9)} L${P(36, 27)}`;
const cross = `M${P(12, 9)} L${P(30, 27)} M${P(30, 9)} L${P(12, 27)}`;

export default function IsoResult({
  state = "idle",
  label = "RESULT · LOOPS BACK",
  denied = false,
}: {
  state?: BlockState;
  label?: string;
  denied?: boolean;
}) {
  const show = state !== "idle";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric result block, ${state}`}
            leaderEnd={-154}
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
                        animate={{ y: show ? -8 : 0 }}
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

                        <g key={show ? "a" : "i"}>
                            {lines.map((d, i) => (
                                <motion.path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    strokeWidth={1.5}
                                    className={`${tone.edge} ${fade}`}
                                    initial={{ pathLength: show ? 0 : 1 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: reduce ? 0 : 0.45,
                                        ease,
                                        delay: reduce || !show ? 0 : 0.2 + i * 0.14,
                                    }}
                                />
                            ))}
                        </g>

                        <motion.path
                            d={denied ? cross : check}
                            fill="none"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${tone.edge} ${fade}`}
                            initial={false}
                            animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
                            transition={{
                                duration: reduce ? 0 : show ? 0.6 : 0.2,
                                ease,
                                delay: reduce || !show ? 0 : 0.75,
                            }}
                        />
                    </motion.g>
                </>
            )}
        </BlockFrame>
    );
}
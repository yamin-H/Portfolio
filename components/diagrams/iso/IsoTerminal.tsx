"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch, type V } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 22;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 9, 0.3);
const rightHatch = hatch("right", W, H, 4, 0.6);

const Ft: V = scale(UP, H);

// screen standing at the back of the slab
const so = add(add(Ft, scale(RX, 26)), scale(LY, 44));
const screen = box(so, 78, 6, 50);
const S = (t: number, u: number) =>
  `${(so[0] + t).toFixed(1)} ${(so[1] - t / 2 - u).toFixed(1)}`;

const strokes = [
  `M${S(8, 42)} L${S(14, 38)} L${S(8, 34)}`,
  `M${S(20, 38)} L${S(62, 38)}`,
  `M${S(8, 27)} L${S(50, 27)}`,
  `M${S(8, 18)} L${S(30, 18)}`,
];

// keyboard on the slab, in front of the screen
const ko = add(add(Ft, scale(RX, 28)), scale(LY, 8));
const kb = box(ko, 74, 26, 3);
const kbTop = add(ko, scale(UP, 3));
const keyRow = (d: number) => {
  const a = add(add(kbTop, scale(RX, 7)), scale(LY, d));
  const b = add(a, scale(RX, 60));
  return `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
};

export default function IsoTerminal({
  state = "idle",
  label = "TERMINAL · CLI",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric terminal block, ${state}`}
            leaderEnd={-152}
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

                    {/* screen */}
                    <motion.g
                        initial={false}
                        animate={{ y: active ? -6 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease }}
                    >
                        <polygon
                            points={screen.left}
                            strokeWidth={1.3}
                            className={`fill-paper-deep ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={screen.right}
                            strokeWidth={1.3}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={screen.top}
                            strokeWidth={1.3}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />
                        <g key={active ? "a" : "i"}>
                            {strokes.map((d, i) => (
                                <motion.path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    strokeWidth={1.5}
                                    className={`stroke-phosphor ${fade}`}
                                    initial={{ pathLength: active ? 0 : 1 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: reduce ? 0 : 0.45,
                                        ease,
                                        delay: reduce || !active ? 0 : 0.2 + i * 0.13,
                                    }}
                                />
                            ))}
                        </g>
                    </motion.g>

                    {/* keyboard */}
                    <polygon
                        points={kb.left}
                        strokeWidth={1.2}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={kb.right}
                        strokeWidth={1.2}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={kb.top}
                        strokeWidth={1.2}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />
                    {[9, 17].map((d) => (
                        <path
                            key={d}
                            d={keyRow(d)}
                            fill="none"
                            strokeWidth={1}
                            strokeDasharray="2 3"
                            className={`${tone.hatch} ${fade}`}
                        />
                    ))}
                </>
            )}
        </BlockFrame>
    );
}
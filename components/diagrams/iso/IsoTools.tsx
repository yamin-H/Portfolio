"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch, type V } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 16;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 9, 0.3);
const rightHatch = hatch("right", W, H, 4, 0.6);

const Ft: V = scale(UP, H);
const origins = [6, 50, 94].map((s) => add(add(Ft, scale(RX, s)), scale(LY, 40)));
const tabs = origins.map((o) => box(o, 30, 5, 36));

const face = (o: V) => (t: number, u: number) =>
  `${(o[0] + t).toFixed(1)} ${(o[1] - t / 2 - u).toFixed(1)}`;
const f = origins.map(face);

const ring = (p: (t: number, u: number) => string, ct: number, cu: number, r: number) => {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    return p(ct + r * Math.cos(a), cu + r * Math.sin(a));
  });
  return `M${pts.join(" L")} Z`;
};

// list_directory, read_file, search_code
const glyphs: string[][] = [
  [
    `M${f[0](8, 28)} L${f[0](24, 28)}`,
    `M${f[0](8, 28)} L${f[0](8, 14)}`,
    `M${f[0](8, 21)} L${f[0](24, 21)}`,
    `M${f[0](8, 14)} L${f[0](22, 14)}`,
  ],
  [
    `M${f[1](6, 29)} L${f[1](18, 29)}`,
    `M${f[1](6, 22)} L${f[1](24, 22)}`,
    `M${f[1](6, 16)} L${f[1](24, 16)}`,
    `M${f[1](6, 10)} L${f[1](16, 10)}`,
  ],
  [ring(f[2], 13, 23, 7), `M${f[2](18, 18)} L${f[2](25, 10)}`],
];

export default function IsoTools({
  state = "idle",
  label = "READ-ONLY TOOLS",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric read-only tools block, ${state}`}
            leaderEnd={-140}
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

                    {/* far tablet first */}
                    {[2, 1, 0].map((i) => (
                        <motion.g
                            key={i}
                            initial={false}
                            animate={{ y: active ? -6 : 0 }}
                            transition={{
                                duration: reduce ? 0 : 0.5,
                                ease,
                                delay: reduce || !active ? 0 : i * 0.09,
                            }}
                        >
                            <polygon
                                points={tabs[i].left}
                                strokeWidth={1.2}
                                className={`fill-paper-deep ${tone.edge} ${fade}`}
                            />
                            <polygon
                                points={tabs[i].right}
                                strokeWidth={1.2}
                                className={`fill-paper ${tone.edge} ${fade}`}
                            />
                            <polygon
                                points={tabs[i].top}
                                strokeWidth={1.2}
                                className={`fill-paper ${tone.edge} ${fade}`}
                            />
                            {glyphs[i].map((d, k) => (
                                <path
                                    key={k}
                                    d={d}
                                    fill="none"
                                    strokeWidth={1.3}
                                    strokeLinecap="round"
                                    className={`${tone.edge} ${fade}`}
                                />
                            ))}
                        </motion.g>
                    ))}
                </>
            )}
        </BlockFrame>
    );
}
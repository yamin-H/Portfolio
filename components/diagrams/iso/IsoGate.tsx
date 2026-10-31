"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch, type V } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 20;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 9, 0.3);
const rightHatch = hatch("right", W, H, 4, 0.6);

const Ft: V = scale(UP, H);
const postO = (t: number): V => add(add(Ft, scale(RX, t)), scale(LY, 39));
const post1 = box(postO(8), 12, 12, 46);
const post2 = box(postO(110), 12, 12, 46);

// the barrier arm, between the posts
const ao = add(add(add(Ft, scale(RX, 20)), scale(LY, 41)), scale(UP, 12));
const arm = box(ao, 90, 5, 8);
const stripes = [10, 20, 30, 40, 50, 60, 70, 80].map(
  (t) => `M${ao[0] + t} ${ao[1] - t / 2} L${ao[0] + t} ${ao[1] - t / 2 - 8}`
);

// lamp on the near post
const lamp: V = [postO(8)[0], postO(8)[1] - 6 - 46];

export default function IsoGate({
  state = "idle",
  label = "APPROVAL · Y/N",
  open = false,
}: {
  state?: BlockState;
  label?: string;
  open?: boolean;
}) {
    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric approval gate block, ${state}${open ? ", open" : ""}`}
            leaderEnd={-156}
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

                    {/* far post, arm, near post */}
                    <polygon
                        points={post2.left}
                        strokeWidth={1.3}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={post2.right}
                        strokeWidth={1.3}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={post2.top}
                        strokeWidth={1.3}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />

                    <motion.g
                        initial={false}
                        animate={{ y: open ? -26 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.7, ease }}
                    >
                        <polygon
                            points={arm.left}
                            strokeWidth={1.2}
                            className={`fill-paper-deep ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={arm.right}
                            strokeWidth={1.2}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={arm.top}
                            strokeWidth={1.2}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />
                        {stripes.map((d, i) => (
                            <path
                                key={i}
                                d={d}
                                fill="none"
                                strokeWidth={3.4}
                                className={`stroke-ink/85 ${fade}`}
                            />
                        ))}
                    </motion.g>

                    <polygon
                        points={post1.left}
                        strokeWidth={1.3}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={post1.right}
                        strokeWidth={1.3}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={post1.top}
                        strokeWidth={1.3}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />
                    <circle
                        cx={lamp[0]}
                        cy={lamp[1]}
                        r={3}
                        strokeWidth={1.1}
                        className={`${tone.pill} ${fade}`}
                    />
                </>
            )}
        </BlockFrame>
    );
}
"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, add, scale, RX, LY, UP, hatch } from "./geometry";
import type { BlockState } from "./tones";

const W = 130;
const D = 90;
const H = 26;

const main = box([0, 0], W, D, H);
const leftHatch = hatch("left", D, H, 8, 0.35);
const rightHatch = hatch("right", W, H, 4, 0.6);

// the loop ring, drawn flat on the top face
const CX = 20;
const CY = -55 - H;
const RXE = 58;
const RYE = 29;
const ring =
  `M${CX - RXE} ${CY} A${RXE} ${RYE} 0 1 1 ${CX + RXE} ${CY} ` +
  `A${RXE} ${RYE} 0 1 1 ${CX - RXE} ${CY}`;
const arrow = `M${CX - 2} ${CY + RYE - 4} L${CX - 9} ${CY + RYE} L${CX - 2} ${CY + RYE + 4}`;

// the core, centred on the ring
const co = add(
  add(scale(UP, H), scale(RX, W / 2 - 13)),
  scale(LY, D / 2 - 13)
);
const core = box(co, 26, 26, 16);

export default function IsoAgent({
  state = "idle",
  label = "AGENT · LOOP",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric agent loop block, ${state}`}
            leaderEnd={-116}
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

                    {/* ring: dashed at rest, traced in ink when active */}
                    <path
                        d={ring}
                        fill="none"
                        strokeWidth={1.2}
                        strokeDasharray="3 5"
                        className={`${tone.hatch} ${fade}`}
                    />
                    <motion.path
                        d={ring}
                        fill="none"
                        strokeWidth={2}
                        className={`${tone.edge} ${fade}`}
                        initial={false}
                        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                        transition={{
                            duration: reduce ? 0 : active ? 1.1 : 0.2,
                            ease,
                        }}
                    />
                    <path
                        d={arrow}
                        fill="none"
                        strokeWidth={1.6}
                        className={`${tone.edge} ${fade}`}
                    />

                    {/* core */}
                    <motion.g
                        initial={false}
                        animate={{ y: active ? -6 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease }}
                    >
                        <polygon
                            points={core.left}
                            strokeWidth={1.3}
                            className={`fill-paper-deep ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={core.right}
                            strokeWidth={1.3}
                            className={`fill-paper-deep ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={core.top}
                            strokeWidth={1.3}
                            className={`fill-paper ${tone.edge} ${fade}`}
                        />
                        <polygon
                            points={core.top}
                            stroke="none"
                            className={`${tone.tint} ${fade}`}
                        />
                    </motion.g>
                </>
            )}
        </BlockFrame>
    );
}
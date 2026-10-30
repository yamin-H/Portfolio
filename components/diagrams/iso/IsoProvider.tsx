"use client";

import BlockFrame from "./BlockFrame";
import Hatch from "./Hatch";
import { box, hatch, type V } from "./geometry";
import type { BlockState } from "./tones";

const BASE = box([0, 0], 130, 90, 8);

const O: V = [20, -28]; // tower origin, centred on the base
const TW = 70;
const TH = 54;
const tower = box(O, TW, TW, TH);
const rightHatch = hatch("right", TW, TH, 4, 0.6);

const L = (s: number, h: number) => `${O[0] - s} ${O[1] - s / 2 - h}`;
const slots = [10, 20, 30, 40].map((h) => `M${L(8, h)} L${L(62, h)}`);

// antenna on the top face
const TOPC: V = [20, O[1] - 35 - TH];
const AY = TOPC[1] - 18;
const arc = (r: number, dir: 1 | -1) =>
  `M${20 + dir * r * 0.55} ${AY - r * 0.75} Q${20 + dir * r} ${AY} ${
    20 + dir * r * 0.55
  } ${AY + r * 0.75}`;
const arcs = [9, 16].flatMap((r) => [arc(r, 1), arc(r, -1)]);

export default function IsoProvider({
  state = "idle",
  label = "PROVIDER · GROQ",
}: {
  state?: BlockState;
  label?: string;
}) {
  const active = state === "active";

    return (
        <BlockFrame
            state={state}
            label={label}
            ariaLabel={`Isometric model provider block, ${state}`}
            leaderEnd={-156}
            ground={<polygon points={BASE.ground} className="fill-ink/10" />}
        >
            {({ tone, fade }) => (
                <>
                    {/* base plate */}
                    <polygon
                        points={BASE.left}
                        strokeWidth={1.4}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={BASE.right}
                        strokeWidth={1.4}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={BASE.top}
                        strokeWidth={1.4}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />

                    {/* tower */}
                    <polygon
                        points={tower.left}
                        strokeWidth={1.6}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={tower.right}
                        strokeWidth={1.6}
                        className={`fill-paper-deep ${tone.edge} ${fade}`}
                    />
                    <g transform={`translate(${O[0]} ${O[1]})`}>
                        <Hatch lines={rightHatch} className={`${tone.hatch} ${fade}`} />
                    </g>
                    {slots.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            strokeWidth={1.5}
                            className={`${tone.edge} ${fade}`}
                        />
                    ))}
                    <polygon
                        points={tower.top}
                        strokeWidth={1.6}
                        className={`fill-paper ${tone.edge} ${fade}`}
                    />
                    <polygon
                        points={tower.top}
                        stroke="none"
                        className={`${tone.tint} ${fade}`}
                    />

                    {/* antenna and signal arcs */}
                    <line
                        x1={20}
                        y1={TOPC[1]}
                        x2={20}
                        y2={AY + 4}
                        strokeWidth={1.5}
                        className={`${tone.edge} ${fade}`}
                    />
                    <circle
                        cx={20}
                        cy={AY}
                        r={3.5}
                        strokeWidth={1.3}
                        className={`${tone.pill} ${fade}`}
                    />
                    {arcs.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                            className={`${active ? tone.edge : tone.hatch} ${fade}`}
                        />
                    ))}
                </>
            )}
        </BlockFrame>
    );
}
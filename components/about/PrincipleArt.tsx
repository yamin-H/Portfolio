"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

const view = { once: true, margin: "-15% 0px" } as const;

function Draw({
  d,
  delay = 0,
  w = 1.6,
  cls = "stroke-ink",
}: {
  d: string;
  delay?: number;
  w?: number;
  cls?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cls}
      initial={reduce ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={view}
      transition={{ duration: 0.7, ease, delay }}
    />
  );
}

function Show({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={view}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.g>
  );
}

const txt = "font-mono fill-ink-soft";

/** 1. Reliability: a request fails, waits longer each time, then succeeds. */
export function RetryArt() {
  const y = 96;
  const fails = [90, 124, 186];
  const ok = 306;
  const cross = (cx: number) =>
    `M${cx - 7} ${y - 7} L${cx + 7} ${y + 7} M${cx + 7} ${y - 7} L${cx - 7} ${y + 7}`;
  const gaps: [number, number][] = [
    [24, 90],
    [90, 124],
    [124, 186],
    [186, ok],
  ];

  return (
    <svg
      viewBox="0 0 360 180"
      className="block w-full"
      role="img"
      aria-label="A request fails three times, waits longer each time, then succeeds"
    >
      <g className="ink">
        <Draw d={`M24 ${y} L340 ${y}`} cls="stroke-ink-soft/60" w={1.3} />
        <Draw d={`M24 ${y - 12} L24 ${y + 12}`} w={2} />
        {gaps.map(([a, b], i) => (
          <Draw
            key={i}
            d={`M${a + 8} ${y - 14} Q${(a + b) / 2} ${y - 22 - (b - a) * 0.28} ${b - 8} ${y - 14}`}
            cls="stroke-ink-soft/70"
            w={1.2}
            delay={0.3 + i * 0.15}
          />
        ))}
        {fails.map((cx, i) => (
          <Draw
            key={cx}
            d={cross(cx)}
            cls="stroke-alert"
            w={2}
            delay={0.2 + i * 0.18}
          />
        ))}
        <Draw
          d={`M${ok - 9} ${y} L${ok - 2} ${y + 8} L${ok + 11} ${y - 9}`}
          cls="stroke-accent"
          w={2.4}
          delay={1}
        />
      </g>
      <Show delay={0.4}>
        <text x={24} y={y + 30} fontSize="9" letterSpacing="1.2" className={txt}>
          REQUEST
        </text>
        <text x={186} y={150} textAnchor="middle" fontSize="9" letterSpacing="1.2" className={txt}>
          THE WAIT GROWS EACH TIME
        </text>
        <text x={ok} y={y + 30} textAnchor="middle" fontSize="9" letterSpacing="1.2" className="font-mono fill-accent">
          DONE
        </text>
      </Show>
    </svg>
  );
}

/** 2. No lock-in: one agent, any provider. */
export function ProvidersArt() {
  const provs = [
    { n: "Groq", y: 28 },
    { n: "OpenAI", y: 68 },
    { n: "Claude", y: 108 },
    { n: "Ollama · local", y: 148 },
  ];
  const hy = 88;

  return (
    <svg
      viewBox="0 0 360 180"
      className="block w-full"
      role="img"
      aria-label="One agent connected to Groq, OpenAI, Claude and a local Ollama model"
    >
      <g className="ink">
        <Draw d="M34 66 H106 V110 H34 Z" w={1.8} />
        {provs.map((p, i) => {
          const local = i === provs.length - 1;
          return (
            <g key={p.n}>
              <Draw
                d={`M106 ${hy} C170 ${hy}, 190 ${p.y}, 241 ${p.y}`}
                cls={local ? "stroke-accent" : "stroke-ink-soft/70"}
                w={local ? 2 : 1.4}
                delay={0.25 + i * 0.12}
              />
              <Draw
                d={`M${250} ${p.y} m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0`}
                cls={local ? "stroke-accent" : "stroke-ink"}
                w={1.6}
                delay={0.5 + i * 0.12}
              />
            </g>
          );
        })}
      </g>
      <Show delay={0.3}>
        <text x={70} y={hy + 3} textAnchor="middle" fontSize="10" letterSpacing="1.4" className="font-mono fill-ink">
          YAMIN
        </text>
        {provs.map((p, i) => (
          <text
            key={p.n}
            x={270}
            y={p.y + 3.5}
            fontSize="9"
            letterSpacing="1"
            className={`font-mono ${i === provs.length - 1 ? "fill-accent" : "fill-ink-soft"}`}
          >
            {p.n.toUpperCase()}
          </text>
        ))}
      </Show>
    </svg>
  );
}

/** 3. Your keys, your machine: the key stays inside; only the request goes out. */
export function KeysArt() {
    return (
        <svg
            viewBox="0 0 360 180"
            className="block w-full"
            role="img"
            aria-label="An API key stored inside your machine; only the request leaves, to the model"
        >
            <Show>
                <rect
                    x={16}
                    y={24}
                    width={200}
                    height={132}
                    rx={10}
                    fill="none"
                    strokeWidth={1.4}
                    strokeDasharray="6 7"
                    className="stroke-ink-soft/60"
                />
                <text x={30} y={44} fontSize="9" letterSpacing="1.4" className={txt}>
                    YOUR MACHINE
                </text>
            </Show>
            <g className="ink">
                {/* key */}
                <Draw d="M66 100 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" w={1.8} />
                <Draw d="M66 100 H104 M92 100 V108 M100 100 V106" w={1.8} delay={0.2} />
                {/* the agent block */}
                <Draw d="M130 80 H190 V120 H130 Z" w={1.8} delay={0.3} />
                <Draw d="M108 100 H128" cls="stroke-accent" w={1.6} delay={0.5} />
                {/* the request that leaves */}
                <Draw d="M190 100 H274 M266 94 L276 100 L266 106" cls="stroke-accent" w={2} delay={0.7} />
                {/* the model, outside */}
                <Draw
                    d="M290 120 C276 120, 274 100, 290 98 C292 82, 318 80, 324 96 C342 94, 346 120, 328 120 Z"
                    w={1.8}
                    delay={0.9}
                />
            </g>
            <Show delay={0.5}>
                <text x={56} y={134} textAnchor="middle" fontSize="9" letterSpacing="1" className={txt}>
                    API KEY · STORED HERE
                </text>
                <text x={160} y={104} textAnchor="middle" fontSize="9" letterSpacing="1.2" className="font-mono fill-ink">
                    YAMIN
                </text>
                <text x={310} y={144} textAnchor="middle" fontSize="9" letterSpacing="1" className={txt}>
                    MODEL
                </text>
                <text x={232} y={92} textAnchor="middle" fontSize="9" letterSpacing="1" className="font-mono fill-accent">
                    REQUEST
                </text>
            </Show>
        </svg>
    );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { cards } from "@/content/memory";
import { NW, NH, HEAD } from "./layout";
import { fmt, wrap, type Match, type Scenario } from "./data";

export type WState = "idle" | "active" | "done" | "down";

const fade = "transition-[stroke,fill] duration-[240ms]";
const dur = (reduce: boolean, s: number) => (reduce ? 0 : s);
const fillBox = { transformBox: "fill-box", transformOrigin: "center" } as const;

type BodyProps = { state: WState; tint: string; reduce: boolean };
const isShown = (s: WState) => s === "active" || s === "done";

/* ---------- the frame every node shares ---------- */

export function NodeFrame({
  x,
  y,
  label,
  state,
  tint,
  pinned,
  onToggle,
  nodeRef,
  children,
}: {
  x: number;
  y: number;
  label: string;
  state: WState;
  tint: string;
  pinned: boolean;
  onToggle: () => void;
  nodeRef?: (el: SVGGElement | null) => void;
  children: React.ReactNode;
}) {
  const edge =
    state === "down"
      ? "stroke-alert"
      : state === "active"
      ? "stroke-accent"
      : "stroke-ink";
  const wash =
    state === "down"
      ? "fill-alert/20"
      : state === "active"
      ? "fill-accent/20"
      : "fill-transparent";
  const head = `M0 ${HEAD} V6 A6 6 0 0 1 6 0 H${NW - 6} A6 6 0 0 1 ${NW} 6 V${HEAD} Z`;

  return (
    <g
      ref={nodeRef}
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${label}`}
      aria-pressed={pinned}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="group cursor-pointer outline-none"
    >
      <rect
        x={-8}
        y={-8}
        width={NW + 16}
        height={NH + 16}
        rx={8}
        fill="transparent"
        strokeWidth={1.2}
        strokeDasharray="5 5"
        className={`stroke-accent transition-opacity duration-[240ms] ${
          pinned
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
        }`}
      />

      <g className="ink" strokeLinejoin="round" strokeLinecap="round">
        <rect
          width={NW}
          height={NH}
          rx={6}
          strokeWidth={1.6}
          className={`fill-paper ${edge} ${fade}`}
        />
        <path d={head} stroke="none" fill={tint} fillOpacity={0.75} />
        <path d={head} stroke="none" className={`${wash} ${fade}`} />
        <line
          x1={0}
          y1={HEAD}
          x2={NW}
          y2={HEAD}
          strokeWidth={1.4}
          className={`${edge} ${fade}`}
        />
      </g>

      <text
        x={12}
        y={17}
        fontSize="9.5"
        letterSpacing="1.4"
        className="font-mono fill-ink"
      >
        {label}
      </text>
      {state === "done" ? (
        <text x={NW - 20} y={18} fontSize="12" className="font-mono fill-accent">
          ✓
        </text>
      ) : (
        <circle
          cx={NW - 14}
          cy={13}
          r={4}
          strokeWidth={1.3}
          className={`${fade} ${
            state === "active"
              ? "fill-accent stroke-accent"
              : state === "down"
              ? "fill-alert stroke-alert"
              : "fill-none stroke-ink-soft"
          }`}
        />
      )}

      <g transform={`translate(0 ${HEAD})`}>{children}</g>
    </g>
  );
}

/* ---------- 1. GitHub: a pull request with a diff ---------- */

export function GithubBody({
  state,
  tint,
  reduce,
  sc,
}: BodyProps & { sc: Scenario }) {
  const shown = isShown(state);
  const active = state === "active";

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M34 18V126" strokeWidth={1.4} className="stroke-ink-soft" />
        <path
          d="M34 100C34 84 52 86 52 70V54"
          strokeWidth={1.4}
          className="stroke-ink-soft"
        />
        {[34, 66, 100].map((cy) => (
          <circle
            key={cy}
            cx={34}
            cy={cy}
            r={4.5}
            strokeWidth={1.4}
            className="stroke-ink"
            style={{ fill: tint }}
          />
        ))}
        <circle
          cx={52}
          cy={49}
          r={4.5}
          strokeWidth={1.4}
          className={`${fade} ${
            shown ? "fill-accent stroke-accent" : "fill-paper stroke-ink"
          }`}
        />
        <rect
          x={78}
          y={14}
          width={138}
          height={110}
          rx={4}
          strokeWidth={1.5}
          className={`fill-paper ${fade} ${
            shown ? "stroke-accent" : "stroke-ink"
          }`}
        />
      </g>

      <rect x={88} y={68} width={118} height={18} className="fill-alert/10" />
      <rect x={88} y={88} width={118} height={18} className="fill-add/10" />
      <g className="font-mono">
        <text x={88} y={34} fontSize="10.5" fontWeight={500} className="fill-ink">
          #{sc.pr}
        </text>
        <rect
          x={168}
          y={22}
          width={40}
          height={15}
          rx={7.5}
          strokeWidth={1}
          className="fill-add/15 stroke-add"
        />
        <text x={188} y={32.5} fontSize="8.5" textAnchor="middle" className="fill-add">
          Open
        </text>
        <text x={88} y={52} fontSize="9.5" className="fill-ink-soft">
          {sc.title}
        </text>
        <text x={93} y={80.5} fontSize="9.5" className="fill-alert">
          − {sc.minus}
        </text>
        <text x={93} y={100.5} fontSize="9.5" className="fill-add">
          + {sc.plus}
        </text>
      </g>

      {active && !reduce && (
        <motion.circle
          key="ping"
          cx={216}
          cy={72}
          r={5}
          fill="none"
          strokeWidth={1.6}
          className="stroke-accent"
          style={fillBox}
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 0.9, ease }}
        />
      )}
    </>
  );
}

/* ---------- 2. Queue: slots, a token, depth ---------- */

export function QueueBody({
  state,
  tint,
  reduce,
  pr,
  phase,
  retryText,
  note,
}: BodyProps & {
  pr: number;
  phase: "idle" | "queued" | "retrying";
  retryText: string;
  note: string;
}) {
  const down = state === "down";
  const edge = down
    ? "stroke-alert"
    : state === "active"
    ? "stroke-accent"
    : "stroke-ink";
  const slot = (i: number) => 23 + i * 38;
  const slide = reduce
    ? {}
    : {
        initial: { x: -152 },
        animate: { x: 0 },
        transition: { duration: 0.8, ease },
      };

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x={16}
          y={48}
          width={198}
          height={48}
          rx={4}
          strokeWidth={1.5}
          className={`fill-paper-deep/60 ${edge} ${fade}`}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={slot(i)}
            y={56}
            width={32}
            height={32}
            rx={2}
            strokeWidth={1.1}
            strokeDasharray="3 3"
            className="fill-paper stroke-ink-soft/60"
          />
        ))}
        {phase === "queued" && (
          <motion.g key="tok-shape" {...slide}>
            <rect
              x={slot(4) + 2}
              y={60}
              width={28}
              height={24}
              rx={2}
              strokeWidth={1.4}
              className="stroke-accent"
              style={{ fill: tint }}
            />
          </motion.g>
        )}
        {phase === "retrying" && (
          <rect
            x={16}
            y={12}
            width={28}
            height={24}
            rx={2}
            strokeWidth={1.4}
            strokeDasharray="4 3"
            className="fill-paper stroke-alert"
          />
        )}
      </g>

      <g className="font-mono">
        {phase === "queued" && (
          <motion.g key="tok-text" {...slide}>
            <text
              x={slot(4) + 16}
              y={75.5}
              textAnchor="middle"
              fontSize="8.5"
              className="fill-ink"
            >
              #{pr}
            </text>
          </motion.g>
        )}
        {phase === "retrying" && (
          <>
            <text x={30} y={27.5} textAnchor="middle" fontSize="8.5" className="fill-alert">
              #{pr}
            </text>
            <text x={52} y={28} fontSize="9.5" className="fill-alert">
              {retryText}
            </text>
          </>
        )}
        {down && (
          <>
            <rect
              x={55}
              y={62}
              width={120}
              height={20}
              rx={3}
              strokeWidth={1.2}
              className="fill-paper stroke-alert"
            />
            <text
              x={115}
              y={75.5}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="1.2"
              className="fill-alert"
            >
              ECONNREFUSED
            </text>
          </>
        )}
        <text x={16} y={118} fontSize="9.5" className="fill-ink-soft">
          depth {phase === "queued" ? 1 : 0}
        </text>
        <text
          x={214}
          y={118}
          textAnchor="end"
          fontSize="9.5"
          className={note === "FIFO →" ? "fill-ink-soft" : "fill-accent"}
        >
          {note}
        </text>
      </g>
    </>
  );
}

/* ---------- 3. Worker: a service that splits the diff ---------- */

const GEAR = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  const r = (n: number) => +n.toFixed(2);
  return {
    x1: r(115 + Math.cos(a) * 12.5),
    y1: r(64 + Math.sin(a) * 12.5),
    x2: r(115 + Math.cos(a) * 16.5),
    y2: r(64 + Math.sin(a) * 16.5),
  };
});

export function WorkerBody({ state, tint, reduce }: BodyProps) {
  const shown = isShown(state);
  const active = state === "active";
  const e = shown ? "stroke-accent" : "stroke-ink";

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x={14}
          y={44}
          width={42}
          height={56}
          rx={3}
          strokeWidth={1.4}
          className="fill-paper stroke-ink"
        />
        {[
          [58, 28],
          [68, 34],
          [78, 22],
          [88, 30],
        ].map(([y, w]) => (
          <path
            key={y}
            d={`M20 ${y}H${20 + w}`}
            strokeWidth={1.3}
            className="stroke-ink-soft"
          />
        ))}
        <path
          d="M58 72H80M74 68L80 72L74 76"
          strokeWidth={1.4}
          className="stroke-ink-soft"
        />
        <path
          d="M148 72H166M160 68L166 72L160 76"
          strokeWidth={1.4}
          className="stroke-ink-soft"
        />
        <rect
          x={84}
          y={30}
          width={62}
          height={84}
          rx={5}
          strokeWidth={1.5}
          className={`${e} ${fade}`}
          style={{ fill: tint }}
        />
        <motion.g
          initial={false}
          animate={{ rotate: shown ? 180 : 0 }}
          transition={{ duration: dur(reduce, 0.9), ease }}
          style={fillBox}
        >
          <circle cx={115} cy={64} r={9} strokeWidth={1.4} className="fill-paper stroke-ink" />
          {GEAR.map((t, i) => (
            <line key={i} {...t} strokeWidth={1.8} className="stroke-ink" />
          ))}
        </motion.g>
        {[0, 1, 2].map((i) => (
          <motion.g
            key={i}
            initial={false}
            animate={{ opacity: shown ? 1 : 0.35, scaleX: shown ? 1 : 0.7 }}
            transition={{
              duration: dur(reduce, 0.5),
              ease,
              delay: reduce || !active ? 0 : 0.25 + i * 0.12,
            }}
            style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          >
            <rect
              x={170}
              y={24 + i * 36}
              width={46}
              height={24}
              rx={3}
              strokeWidth={1.3}
              className={`${e} ${fade}`}
              style={{ fill: tint }}
            />
            <path
              d={`M176 ${33 + i * 36}H206M176 ${40 + i * 36}H196`}
              strokeWidth={1.2}
              className="stroke-ink-soft"
            />
          </motion.g>
        ))}
      </g>

      <g className="font-mono">
        <text x={35} y={114} textAnchor="middle" fontSize="9" className="fill-ink-soft">
          diff
        </text>
        <text x={115} y={104} textAnchor="middle" fontSize="9" letterSpacing="1" className="fill-ink">
          chunk()
        </text>
        <text
          x={193}
          y={130}
          textAnchor="middle"
          fontSize="9"
          className={`fill-ink-soft transition-opacity duration-[240ms] ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          3 chunks
        </text>
      </g>
    </>
  );
}

/* ---------- 4. LangGraph: a real small graph ---------- */

const GN: [number, number][] = [
  [26, 72],
  [68, 38],
  [68, 106],
  [116, 72],
  [162, 72],
  [204, 72],
];
const GE: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [4, 5],
];

export function GraphBody({ state, tint, reduce }: BodyProps) {
  const shown = isShown(state);
  const active = state === "active";
  const delay = (i: number) => ({
    transitionDelay: active && !reduce ? `${i * 130}ms` : "0ms",
  });

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round">
        {GE.map(([a, b]) => (
          <line
            key={`${a}${b}`}
            x1={GN[a][0]}
            y1={GN[a][1]}
            x2={GN[b][0]}
            y2={GN[b][1]}
            strokeWidth={1.6}
            className={`${fade} ${shown ? "stroke-accent" : "stroke-ink-soft/70"}`}
            style={delay(b)}
          />
        ))}
        {GN.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={10}
            strokeWidth={1.5}
            className={`${fade} ${shown ? "stroke-accent" : "stroke-ink"}`}
            style={{ ...delay(i), fill: shown ? tint : "var(--color-paper)" }}
          />
        ))}
      </g>
      <g className="font-mono">
        {GN.map(([x, y], i) => (
          <text
            key={i}
            x={x}
            y={y + 3.3}
            textAnchor="middle"
            fontSize="9"
            className="fill-ink"
          >
            {i + 1}
          </text>
        ))}
        <text x={115} y={134} textAnchor="middle" fontSize="9" className="fill-ink-soft">
          6 nodes · per chunk
        </text>
      </g>
    </>
  );
}

/* ---------- 5. pgvector: the vector space ---------- */

const PX = 14;
const PY = 6;
const PW = 202;
const PH = 108;
const pt = (nx: number, ny: number): [number, number] => [
  PX + nx * PW,
  PY + ny * PH,
];

export function VectorsBody({
  state,
  tint,
  reduce,
  q,
  matches,
}: BodyProps & { q: { x: number; y: number }; matches: Match[] }) {
  const shown = isShown(state);
  const active = state === "active";
  const top = matches.slice(0, 3);
  const rank = new Map(top.map((m, i) => [m.card.n, i]));
  const [qx, qy] = pt(q.x, q.y);

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round">
        <rect
          x={PX}
          y={PY}
          width={PW}
          height={PH}
          rx={3}
          strokeWidth={1.4}
          className="stroke-ink-soft"
          style={{ fill: tint }}
          fillOpacity={0.3}
        />
        {cards.map((c) => {
          const [x, y] = pt(c.nx, c.ny);
          const r = shown ? rank.get(c.n) : undefined;
          return (
            <circle
              key={c.n}
              cx={x}
              cy={y}
              r={r === 0 ? 4.6 : r !== undefined ? 3.8 : 2.6}
              strokeWidth={r !== undefined ? 1.5 : 0}
              className={`${fade} ${
                r === 0
                  ? "fill-accent stroke-accent"
                  : r !== undefined
                  ? "fill-paper stroke-accent"
                  : "fill-ink-soft/55"
              }`}
            />
          );
        })}
        {top.map((m, i) => {
          const [x, y] = pt(m.card.nx, m.card.ny);
          return (
            <motion.path
              key={m.card.n}
              d={`M${qx} ${qy}L${x} ${y}`}
              strokeWidth={i === 0 ? 2.2 : 1.4}
              className="stroke-accent"
              initial={false}
              animate={{
                pathLength: shown ? 1 : 0,
                opacity: shown ? (i === 0 ? 1 : 0.65) : 0,
              }}
              transition={{
                duration: dur(reduce, 0.55),
                ease,
                delay: reduce || !active ? 0 : 0.5 + i * 0.15,
              }}
            />
          );
        })}
        <motion.g
          initial={false}
          animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.4 }}
          transition={{
            duration: dur(reduce, 0.45),
            ease,
            delay: reduce || !active ? 0 : 0.15,
          }}
          style={fillBox}
        >
          <circle cx={qx} cy={qy} r={7} strokeWidth={1.8} className="stroke-accent" />
          <path
            d={`M${qx - 12} ${qy}H${qx - 7}M${qx + 7} ${qy}H${qx + 12}M${qx} ${qy - 12}V${qy - 7}M${qx} ${qy + 7}V${qy + 12}`}
            strokeWidth={1.8}
            className="stroke-accent"
          />
          <circle cx={qx} cy={qy} r={2} stroke="none" className="fill-accent" />
        </motion.g>
      </g>

      <g className="font-mono">
        {top.map((m, i) => {
          const [x, y] = pt(m.card.nx, m.card.ny);
          return (
            <motion.text
              key={m.card.n}
              x={x + 7}
              y={y - 6}
              fontSize="8.5"
              className="fill-accent"
              initial={false}
              animate={{ opacity: shown ? 1 : 0 }}
              transition={{
                duration: 0.3,
                delay: reduce || !active ? 0 : 0.9 + i * 0.1,
              }}
            >
              {fmt(m.s)}
            </motion.text>
          );
        })}
        <text x={14} y={131} fontSize="9" className="fill-ink-soft">
          cosine · 384-dim
        </text>
        <text x={216} y={131} textAnchor="end" fontSize="9" className="fill-ink-soft">
          top-3
        </text>
      </g>
    </>
  );
}

/* ---------- 6. Review: the comment, typed out ---------- */

export function useTyped(text: string, mode: "off" | "type" | "full", reduce: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (mode === "off") {
      setN(0);
      return;
    }
    if (mode === "full" || reduce) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [text, mode, reduce]);
  return n;
}

export function ReviewBody({
  state,
  tint,
  reduce,
  sc,
  comment,
}: BodyProps & { sc: Scenario; comment: string }) {
  const shown = isShown(state);
  const lines = useMemo(() => wrap(comment, 31), [comment]);
  const n = useTyped(
    comment,
    state === "active" ? "type" : shown ? "full" : "off",
    reduce
  );

  let left = n;
  const out = lines.map((l) => {
    const take = Math.max(0, Math.min(l.length, left));
    left -= l.length + 1;
    return l.slice(0, take);
  });

    return (
        <>
            <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect
                    x={14}
                    y={6}
                    width={202}
                    height={22}
                    rx={3}
                    strokeWidth={1.2}
                    className="fill-add/10 stroke-ink-soft/70"
                />
                <rect
                    x={14}
                    y={36}
                    width={202}
                    height={100}
                    rx={5}
                    strokeWidth={1.5}
                    className={`${fade} ${shown ? "stroke-accent" : "stroke-ink"}`}
                    style={{ fill: tint }}
                    fillOpacity={0.3}
                />
                <circle cx={32} cy={55} r={9} strokeWidth={1.3} className="fill-paper stroke-ink" />
                {!shown &&
                    [78, 91, 104].map((y) => (
                        <path
                            key={y}
                            d={`M24 ${y}H${y === 104 ? 120 : 200}`}
                            strokeWidth={1.2}
                            strokeDasharray="3 4"
                            className="stroke-ink-soft/40"
                        />
                    ))}
            </g>
            <g className="font-mono">
                <text x={22} y={21} fontSize="9" className="fill-ink-soft">
                    {sc.file}
                </text>
                <text x={118} y={21} fontSize="9.5" className="fill-add">
                    + {sc.plus}
                </text>
                <text x={32} y={58} textAnchor="middle" fontSize="8" className="fill-ink">
                    AI
                </text>
                <text x={48} y={58} fontSize="9.5" fontWeight={500} className="fill-ink">
                    PR Review Agent
                </text>
                {out.map((l, i) => (
                    <text key={i} x={24} y={84 + i * 13} fontSize="9.5" className="fill-ink">
                        {l}
                    </text>
                ))}
            </g>
        </>
    );
}
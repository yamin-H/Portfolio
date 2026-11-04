"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { useTyped, type WState } from "../widgets";
import { wrap } from "../data";
import type { Task } from "./data";

const fade = "transition-[stroke,fill] duration-[240ms]";
const shownOf = (s: WState) => s === "active" || s === "done";
const edgeOf = (s: WState) =>
  s === "down" ? "stroke-alert" : s === "active" ? "stroke-accent" : "stroke-ink";

type Base = { state: WState; tint: string; reduce: boolean };

/* ---------- 1. Terminal: a dark window, the task typed in ---------- */

export function TerminalBody({
  state,
  reduce,
  task,
  provider,
}: Base & { task: Task; provider: string }) {
  const shown = shownOf(state);
  const lines = useMemo(() => wrap(task.prompt, 22), [task.prompt]);
  const n = useTyped(
    task.prompt,
    state === "active" ? "type" : shown ? "full" : "off",
    reduce
  );

  let left = n;
  const out = lines.map((l) => {
    const take = Math.max(0, Math.min(l.length, left));
    left -= l.length + 1;
    return l.slice(0, take);
  });
  const cur = out.reduce((a, l, i) => (l.length ? i : a), 0);
  const cx = 36 + out[cur].length * 5.7;

  return (
    <>
      <g className="ink" strokeLinejoin="round">
        <rect
          x={14}
          y={6}
          width={202}
          height={124}
          rx={4}
          strokeWidth={1.6}
          className={`${shown ? "stroke-accent" : "stroke-ink"} ${fade}`}
          style={{ fill: "#17211e" }}
        />
        <path d="M14 25H216" fill="none" strokeWidth={1} className="stroke-paper/25" />
      </g>
      {[24, 33, 42].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={15.5}
          r={2.6}
          style={{ fill: ["#e0705e", "#e0b85a", "#6fbf86"][i] }}
        />
      ))}
      <g className="font-mono">
        <text x={54} y={18.5} fontSize="8.5" className="fill-paper/60">
          {task.dir}
        </text>
        <text x={24} y={46} fontSize="9.5" className="fill-phosphor">
          $ yamin
        </text>
        <text x={24} y={64} fontSize="9.5" style={{ fill: "#8fa2ff" }}>
          &gt;
        </text>
        {out.map((l, i) => (
          <text key={i} x={36} y={64 + i * 13} fontSize="9.5" className="fill-phosphor">
            {l}
          </text>
        ))}
        <text x={24} y={122} fontSize="8.5" className="fill-paper/50">
          via {provider}
        </text>
      </g>
      {state !== "done" && (
        <rect
          x={cx}
          y={64 + cur * 13 - 9}
          width={5}
          height={11}
          className="fill-phosphor"
        />
      )}
    </>
  );
}

/* ---------- 2. Agent loop: a ring, and what goes into the request ---------- */

const R = 34;
const CX = 66;
const CY = 62;
const RING = `M${CX - R} ${CY}A${R} ${R} 0 1 1 ${CX + R} ${CY}A${R} ${R} 0 1 1 ${CX - R} ${CY}`;
const CHIPS = [
  { t: "messages", y: 14 },
  { t: "tools × 6", y: 46 },
  { t: "key · local", y: 78 },
];

export function AgentBody({ state, tint, reduce }: Base) {
  const shown = shownOf(state);
  const active = state === "active";
  const delay = (i: number) => ({
    transitionDelay: active && !reduce ? `${300 + i * 140}ms` : "0ms",
  });

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={RING} strokeWidth={1.3} strokeDasharray="3 5" className="stroke-ink-soft/70" />
        <motion.path
          d={RING}
          strokeWidth={2.2}
          className="stroke-accent"
          initial={false}
          animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : shown ? 1.1 : 0.2, ease }}
        />
        <path
          d="M40.6 45L42 38L35 39.4"
          strokeWidth={1.8}
          className={`${fade} ${shown ? "stroke-accent" : "stroke-ink"}`}
        />
        {CHIPS.map((c, i) => (
          <g key={c.t}>
            <path
              d={`M${CX + R} ${CY}C112 ${CY} 112 ${c.y + 12} 124 ${c.y + 12}`}
              strokeWidth={1.2}
              strokeDasharray="3 4"
              className="stroke-ink-soft/60"
            />
            <rect
              x={124}
              y={c.y}
              width={92}
              height={24}
              rx={3}
              strokeWidth={1.4}
              className={`${fade} ${shown ? "stroke-accent" : "stroke-ink"}`}
              style={{ ...delay(i), fill: shown ? tint : "var(--color-paper)" }}
            />
          </g>
        ))}
      </g>
      <g className="font-mono">
        <text x={CX} y={CY + 3.5} textAnchor="middle" fontSize="10" className="fill-ink">
          loop()
        </text>
        {CHIPS.map((c) => (
          <text key={c.t} x={132} y={c.y + 15.5} fontSize="9.5" className="fill-ink">
            {c.t}
          </text>
        ))}
        <text x={115} y={136} textAnchor="middle" fontSize="9" className="fill-ink-soft">
          key stays on your machine
        </text>
      </g>
    </>
  );
}

/* ---------- 3. Model: a cloud, or a local chip, and the tool call it returns ---------- */

const CLOUD =
  "M30 96C10 96 8 70 28 68C28 44 58 38 70 54C80 36 112 40 114 62C134 62 138 96 116 96Z";

export function ModelBody({
  state,
  tint,
  provider,
  local,
  call,
  ms,
}: Base & { provider: string; local: boolean; call: string; ms: number }) {
  const shown = shownOf(state);
  const e = shown ? "stroke-accent" : "stroke-ink";

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {local ? (
          <>
            <rect
              x={62}
              y={18}
              width={106}
              height={56}
              rx={5}
              strokeWidth={1.6}
              className={`${e} ${fade}`}
              style={{ fill: tint }}
            />
            {[28, 38, 48, 58].map((y) => (
              <path
                key={y}
                d={`M54 ${y}H62M168 ${y}H176`}
                strokeWidth={1.4}
                className={`${e} ${fade}`}
              />
            ))}
          </>
        ) : (
          <path
            d={CLOUD}
            transform="translate(44 -22)"
            strokeWidth={1.6}
            className={`${e} ${fade}`}
            style={{ fill: tint }}
          />
        )}
        <path
          d="M115 78V90M111 85L115 90L119 85"
          strokeWidth={1.3}
          strokeDasharray="3 3"
          className="stroke-ink-soft/70"
        />
        <rect
          x={14}
          y={94}
          width={202}
          height={38}
          rx={4}
          strokeWidth={1.4}
          strokeDasharray={shown ? undefined : "4 4"}
          className={`${fade} ${shown ? "stroke-accent" : "stroke-ink-soft/60"}`}
          style={{ fill: shown ? "var(--color-paper)" : "transparent" }}
        />
      </g>
      <g className="font-mono">
        <text
          x={115}
          y={local ? 42 : 56}
          textAnchor="middle"
          fontSize="11"
          fontWeight={500}
          className="fill-ink"
        >
          {provider.toUpperCase()}
        </text>
        <text
          x={115}
          y={local ? 56 : 68}
          textAnchor="middle"
          fontSize="8.5"
          className="fill-ink-soft"
        >
          {local ? "local endpoint" : "remote API"}
        </text>
        <text
          x={216}
          y={14}
          textAnchor="end"
          fontSize="9"
          className={`fill-accent transition-opacity duration-[240ms] ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          {ms}ms
        </text>
        <text x={24} y={108} fontSize="8.5" letterSpacing="1" className="fill-accent">
          tool_call
        </text>
        <text
          x={24}
          y={124}
          fontSize="9.5"
          className={`fill-ink transition-opacity duration-[240ms] ${
            shown ? "opacity-100" : "opacity-30"
          }`}
        >
          {shown ? call : "…"}
        </text>
      </g>
    </>
  );
}

/* ---------- 4. Read-only tools: three that run without asking ---------- */

const ROWS = [8, 48, 88];

export function ToolsBody({
  state,
  tint,
  reduce,
  reads,
}: Base & { reads: string[] }) {
  const shown = shownOf(state);
  const active = state === "active";
  const e = shown ? "stroke-accent" : "stroke-ink";
  const delay = (i: number) => ({
    transitionDelay: active && !reduce ? `${i * 180}ms` : "0ms",
  });

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {ROWS.map((y, i) => (
          <g key={y}>
            <rect
              x={14}
              y={y}
              width={202}
              height={34}
              rx={4}
              strokeWidth={1.4}
              className={`${fade} ${e}`}
              style={{ ...delay(i), fill: shown ? tint : "var(--color-paper)" }}
            />
            {i === 0 && (
              <path
                d={`M27 ${y + 9}H45M27 ${y + 9}V${y + 25}M27 ${y + 17}H42M27 ${y + 25}H40`}
                strokeWidth={1.3}
                className={`${fade} ${e}`}
                style={delay(i)}
              />
            )}
            {i === 1 && (
              <>
                <rect
                  x={28}
                  y={y + 7}
                  width={16}
                  height={20}
                  rx={1.5}
                  strokeWidth={1.3}
                  className={`fill-paper ${fade} ${e}`}
                  style={delay(i)}
                />
                <path
                  d={`M32 ${y + 14}H40M32 ${y + 19}H40M32 ${y + 24}H37`}
                  strokeWidth={1.2}
                  className={`${fade} ${e}`}
                  style={delay(i)}
                />
              </>
            )}
            {i === 2 && (
              <>
                <circle
                  cx={34}
                  cy={y + 15}
                  r={6}
                  strokeWidth={1.3}
                  className={`fill-paper ${fade} ${e}`}
                  style={delay(i)}
                />
                <path
                  d={`M38.5 ${y + 19.5}L45 ${y + 26}`}
                  strokeWidth={1.5}
                  className={`${fade} ${e}`}
                  style={delay(i)}
                />
              </>
            )}
          </g>
        ))}
      </g>
      <g className="font-mono">
        {ROWS.map((y, i) => (
          <text key={y} x={56} y={y + 21.5} fontSize="9.5" className="fill-ink">
            {reads[i]}
          </text>
        ))}
        <text
          x={115}
          y={139}
          textAnchor="middle"
          fontSize="9"
          className={`${fade} ${shown ? "fill-accent" : "fill-ink-soft"}`}
        >
          no approval needed
        </text>
      </g>
    </>
  );
}

/* ---------- 5. Approval gate: the proposed change, and your y or n ---------- */

export function GateBody({
  state,
  task,
  denied,
  reached,
}: Base & { task: Task; denied: boolean; reached: boolean }) {
  const run = task.tool === "run_command";
  const pick = reached ? (denied ? "n" : "y") : null;
  const plusY = task.minus ? 50 : 30;

  const status = !reached
    ? "waits for you"
    : denied
    ? run
      ? "denied · nothing ran"
      : "denied · nothing written"
    : "approved";
  const statusCls = !reached
    ? "fill-ink-soft"
    : denied
    ? "fill-alert"
    : "fill-add";
  const locked = !reached || denied;

  const keyBox = (k: "y" | "n", x: number) => {
    const on = pick === k;
    return (
      <g key={k}>
        <rect
          x={x}
          y={76}
          width={22}
          height={18}
          rx={2}
          strokeWidth={1.3}
          className={`${fade} ${
            on
              ? k === "y"
                ? "fill-add stroke-add"
                : "fill-alert stroke-alert"
              : "fill-paper stroke-ink-soft"
          }`}
        />
        <text
          x={x + 11}
          y={88.5}
          textAnchor="middle"
          fontSize="10"
          className={`font-mono ${on ? "fill-paper" : "fill-ink-soft"}`}
        >
          {k}
        </text>
      </g>
    );
  };

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x={14}
          y={6}
          width={202}
          height={92}
          rx={4}
          strokeWidth={1.5}
          className={`fill-paper ${fade} ${edgeOf(state)}`}
        />
        {run && (
          <rect x={22} y={32} width={186} height={24} rx={2} stroke="none" style={{ fill: "#17211e" }} />
        )}
        <rect x={14} y={104} width={0} height={0} stroke="none" />
        <rect
          x={22}
          y={114}
          width={16}
          height={12}
          rx={2}
          strokeWidth={1.4}
          className={`${fade} ${locked ? "stroke-ink fill-paper-deep" : "stroke-add fill-paper"}`}
        />
        <path
          d={locked ? "M25 114V108a5 5 0 0 1 10 0V114" : "M25 114V108a5 5 0 0 1 10 0V111"}
          strokeWidth={1.4}
          className={`${fade} ${locked ? "stroke-ink" : "stroke-add"}`}
        />
      </g>

      {!run && task.minus && (
        <rect x={22} y={30} width={186} height={18} className="fill-alert/10" />
      )}
      {!run && <rect x={22} y={plusY} width={186} height={18} className="fill-add/10" />}

      <g className="font-mono">
        <text x={22} y={21} fontSize="9.5" className="fill-ink">
          {run ? "run_command" : `${task.tool}  ${task.target}`}
        </text>
        {run ? (
          <text x={30} y={48} fontSize="9.5" className="fill-phosphor">
            $ {task.plus}
          </text>
        ) : (
          <>
            {task.minus && (
              <text x={28} y={42.5} fontSize="9.5" className="fill-alert">
                − {task.minus}
              </text>
            )}
            <text x={28} y={plusY + 12.5} fontSize="9.5" className="fill-add">
              + {task.plus}
            </text>
          </>
        )}
        <text x={22} y={88.5} fontSize="9.5" className="fill-ink-soft">
          apply? [y/N]
        </text>
        <text x={46} y={123} fontSize="9.5" className={`${fade} ${statusCls}`}>
          {status}
        </text>
      </g>
      {keyBox("y", 164)}
      {keyBox("n", 192)}
    </>
  );
}

/* ---------- 6. Result: what happened, and the loop back ---------- */

export function ResultBody({
  state,
  tint,
  reduce,
  task,
  denied,
  reached,
  back,
}: Base & { task: Task; denied: boolean; reached: boolean; back: string }) {
  const run = task.tool === "run_command";
  const okText = {
    edit_file: "edit applied",
    write_file: "file written",
    run_command: "command ran",
  }[task.tool];
  const noText = run
    ? "nothing ran"
    : task.tool === "write_file"
    ? "nothing written"
    : "file untouched";
  const line = reached
    ? denied
      ? { x: 46, text: "denied", cls: "fill-alert" }
      : { x: 46, text: okText, cls: "fill-add" }
    : null;

  return (
    <>
      <g className="ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x={14}
          y={6}
          width={202}
          height={74}
          rx={4}
          strokeWidth={1.5}
          className={`${fade} ${edgeOf(state)}`}
          style={{ fill: reached && !denied ? tint : "var(--color-paper)" }}
          fillOpacity={reached && !denied ? 0.35 : 1}
        />
        {!reached &&
          [38, 52, 66].map((y) => (
            <path
              key={y}
              d={`M24 ${y}H${y === 66 ? 120 : 200}`}
              strokeWidth={1.2}
              strokeDasharray="3 4"
              className="stroke-ink-soft/40"
            />
          ))}
        <motion.path
          d={denied ? "M24 36L34 46M34 36L24 46" : "M24 42L29 47L38 36"}
          strokeWidth={2.2}
          className={denied ? "stroke-alert" : "stroke-add"}
          initial={false}
          animate={{ pathLength: reached ? 1 : 0, opacity: reached ? 1 : 0 }}
          transition={{
            duration: reduce ? 0 : reached ? 0.5 : 0.2,
            ease,
            delay: reduce || !reached ? 0 : 0.2,
          }}
        />
        <path
          d="M196 84C196 112 34 112 34 84"
          strokeWidth={1.3}
          strokeDasharray="4 4"
          className={`${fade} ${reached ? "stroke-accent" : "stroke-ink-soft/60"}`}
        />
        <path
          d="M29 90L34 84L39 90"
          strokeWidth={1.4}
          className={`${fade} ${reached ? "stroke-accent" : "stroke-ink-soft/60"}`}
        />
      </g>
      <g className="font-mono">
        <text x={24} y={22} fontSize="9.5" className="fill-ink">
          {run ? `$ ${task.plus}` : task.target}
        </text>
        {line && (
          <text x={line.x} y={45} fontSize="9.5" className={line.cls}>
            {line.text}
          </text>
        )}
        {reached && (
          <text
            x={24}
            y={64}
            fontSize="9.5"
            className={denied ? "fill-ink-soft" : run ? "fill-ink-soft" : "fill-add"}
          >
            {denied ? noText : run ? "output captured" : `+ ${task.plus}`}
          </text>
        )}
        <text x={115} y={128} textAnchor="middle" fontSize="9" className="fill-ink-soft">
          {back}
        </text>
      </g>
    </>
  );
}
"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import CornerFrame from "@/components/ui/CornerFrame";
import { ease } from "@/lib/motion";
import { cards, RATIO, CARD_W, CARD_H, type Card } from "@/content/memory";

type Pos = { x: number; y: number };
type Ranked = { card: Card; s: number };
type Commit = { pos: Pos; top: Ranked };

const VW = 1000;
const VH = VW * RATIO;
const START: Pos = (() => {
  const c = cards.find((k) => k.n === 234)!;
  return { x: c.nx, y: c.ny };
})();

const DRIFT_MS = 20000; // the wall wanders for 20s, then rests until someone touches it

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const fmt = (s: number) => Math.min(0.97, s).toFixed(2);

function rank(p: Pos): Ranked[] {
  return cards
    .map((card) => {
      const d = Math.hypot(p.x - card.nx, (p.y - card.ny) * RATIO);
      return { card, s: Math.max(0, 1 - d * 1.7) };
    })
    .sort((a, b) => b.s - a.s);
}

// a slow wander, used when nobody is touching the wall
const drift = (t: number): Pos => ({
  x: 0.5 + 0.34 * Math.sin(t / 2600),
  y: 0.5 + 0.36 * Math.sin(t / 3400 + 1.3),
});

const FAUX = [
  [80, 95, 60],
  [90, 70, 85],
  [65, 92, 75],
];

function Typed({ text, instant }: { text: string; instant: boolean }) {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 20);
    return () => clearInterval(id);
  }, [text, instant]);

  return (
    <>
      {text.slice(0, n)}
      {n < text.length && (
        <span className="ml-px inline-block h-[1em] w-px translate-y-[2px] bg-accent" />
      )}
    </>
  );
}

type CardProps = {
  c: Card;
  i: number;
  rank: number; // 0 = best match, 1 and 2 = runners-up, 3 = not matched
  label: string; // score tag text, only for matched cards
  strong: boolean; // a loose match: drawn a little brighter than the rest
  reduce: boolean;
  ready: boolean;
};

const WallCard = memo(function WallCard({
  c,
  i,
  rank,
  label,
  strong,
  reduce,
  ready,
}: CardProps) {
  const isTop = rank === 0;
  const near = rank === 1 || rank === 2;
  const lifted = rank < 3;

  const box = isTop
    ? "border-accent bg-accent/10"
    : near
    ? "border-accent/70 bg-paper"
    : "border-ink/45 bg-paper/80";
  const bar = lifted ? "bg-accent/55" : "bg-ink/25";

  return (
    <div
      className="absolute"
      style={{
        left: `${c.nx * 100}%`,
        top: `${c.ny * 100}%`,
        width: `${CARD_W * 100}%`,
        height: `${(CARD_H / RATIO) * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex: lifted ? 10 - rank : 1,
      }}
    >
      <motion.div
        className="relative h-full w-full"
        initial={reduce ? false : { opacity: 0, y: 14, rotate: c.rot }}
        animate={{
          opacity: lifted ? 1 : strong ? 0.9 : 0.5,
          y: isTop ? -10 : near ? -5 : 0,
          scale: isTop ? 1.07 : near ? 1.03 : 1,
          rotate: lifted ? 0 : c.rot,
        }}
        transition={{
          duration: 0.45,
          ease,
          delay: ready || reduce ? 0 : 0.3 + i * 0.035,
        }}
      >
        <div
          className={`h-full w-full border p-[7%] transition-colors duration-[240ms] ${box}`}
        >
          <div className="flex items-baseline justify-between font-mono text-[10px] leading-none sm:text-[11px]">
            <span className={lifted ? "text-accent" : "text-ink-soft"}>
              #{c.n}
            </span>
            <span
              className={
                c.verdict === "rejected" ? "text-alert" : "text-ink-soft"
              }
            >
              {c.verdict === "rejected" ? "✕" : "✓"}
            </span>
          </div>
          <div className="mt-[14%] space-y-[10%]">
            {FAUX[i % 3].map((w, k) => (
              <div
                key={k}
                className={`h-px transition-colors duration-[240ms] ${bar}`}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>

        {lifted && (
          <span className="absolute -right-2 -top-2.5 bg-accent px-1.5 py-0.5 font-mono text-[9px] leading-none tracking-wider text-paper">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
});

export default function MemoryWall() {
  const reduce = useReducedMotion() ?? false;
  const wallRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wallRef);

  const [q, setQ] = useState<Pos>(START);
  const qRef = useRef<Pos>(START);
  const [commit, setCommit] = useState<Commit | null>(null);
  const [ready, setReady] = useState(false);

  const userPos = useRef<Pos>(START);
  const userUntil = useRef(0);
  const committedRef = useRef<Commit | null>(null);
  const driftT0 = useRef(0);

  useEffect(() => {
    qRef.current = q;
  }, [q]);

  useEffect(() => {
    userUntil.current = reduce ? Infinity : performance.now() + 2400;
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  // the query point eases toward its target: the pointer, a committed spot, or the drift
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const tick = (now: number) => {
      const held = committedRef.current;
      const touched = !!held || reduce || now < userUntil.current;

      if (touched) driftT0.current = 0;
      else if (!driftT0.current) driftT0.current = now;
      const resting = !touched && now - driftT0.current > DRIFT_MS;

      const target: Pos = held
        ? held.pos
        : touched
        ? userPos.current
        : resting
        ? qRef.current
        : drift(now);

      setQ((p) => {
        const k = reduce ? 1 : 0.14;
        const nx = p.x + (target.x - p.x) * k;
        const ny = p.y + (target.y - p.y) * k;
        if (Math.abs(nx - p.x) < 0.0004 && Math.abs(ny - p.y) < 0.0004)
          return p;
        return { x: nx, y: ny };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  function toPos(e: { clientX: number; clientY: number }): Pos {
    const r = wallRef.current!.getBoundingClientRect();
    return {
      x: clamp((e.clientX - r.left) / r.width),
      y: clamp((e.clientY - r.top) / r.height),
    };
  }

  function commitAt(pos: Pos) {
    const c: Commit = { pos, top: rank(pos)[0] };
    committedRef.current = c;
    setCommit(c);
  }

  function release(hold = 1500) {
    committedRef.current = null;
    setCommit(null);
    userUntil.current = performance.now() + hold;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType === "touch") return;
    userPos.current = toPos(e);
    userUntil.current = Infinity;
  }
  function onPointerDown(e: React.PointerEvent) {
    userPos.current = toPos(e);
    userUntil.current =
      e.pointerType === "touch" ? performance.now() + 5000 : Infinity;
  }
  function onPointerLeave(e: React.PointerEvent) {
    if (e.pointerType === "touch") return;
    userUntil.current = performance.now() + 1200;
  }
  function onClick(e: React.MouseEvent) {
    commitAt(toPos(e));
  }
  function onFocus() {
    userPos.current = qRef.current;
    userUntil.current = performance.now() + 6000;
  }
  function onKeyDown(e: React.KeyboardEvent) {
    const step = 0.06;
    const p = userPos.current;
    let next: Pos | null = null;
    if (e.key === "ArrowLeft") next = { x: clamp(p.x - step), y: p.y };
    if (e.key === "ArrowRight") next = { x: clamp(p.x + step), y: p.y };
    if (e.key === "ArrowUp") next = { x: p.x, y: clamp(p.y - step) };
    if (e.key === "ArrowDown") next = { x: p.x, y: clamp(p.y + step) };

    if (next) {
      e.preventDefault();
      release();
      userPos.current = next;
      userUntil.current = performance.now() + 6000;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commitAt(userPos.current);
    } else if (e.key === "Escape") {
      release();
    }
  }

  const ranked = rank(q);
  const top3 = ranked.slice(0, 3);
  const order = new Map(ranked.map((r, i) => [r.card.n, i]));
  const scores = new Map(ranked.map((r) => [r.card.n, r.s]));

  const qx = q.x * VW;
  const qy = q.y * VH;

  const comment = commit
    ? `Your team ${commit.top.card.verdict === "rejected" ? "rejected this pattern" : "approved this approach"} in PR #${commit.top.card.n} (similarity ${fmt(commit.top.s)}).`
    : "";

  return (
    <div>
      <CornerFrame className="p-3 sm:p-4">
        <div
          ref={wallRef}
          role="group"
          tabIndex={0}
          aria-label="Interactive demo. Move across the wall of past pull requests to search it. Press Enter to ask for a review, Escape to release."
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          style={{ touchAction: "pan-y" }}
          className="relative aspect-[10/11] w-full cursor-crosshair select-none outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
        >
          {/* the wall of cards */}
          {cards.map((c, i) => {
            const r = order.get(c.n) ?? 99;
            const s = scores.get(c.n) ?? 0;
            const rank = r < 3 ? r : 3;
            return (
              <WallCard
                key={c.n}
                c={c}
                i={i}
                rank={rank}
                label={rank < 3 ? fmt(s) : ""}
                strong={s > 0.4}
                reduce={reduce}
                ready={ready}
              />
            );
          })}

          {/* ink lines, the circle, and the query crosshair */}
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <g fill="none" strokeLinecap="round">
              {top3.map(({ card }, i) => {
                const X = card.nx * VW;
                const Y = card.ny * VH;
                const dx = X - qx;
                const dy = Y - qy;
                const len = Math.hypot(dx, dy);
                if (len < 120) return null;
                const ux = dx / len;
                const uy = dy / len;
                const ex = X - ux * 78;
                const ey = Y - uy * 78;
                const bow = (i === 0 ? 0.1 : 0.16) * len * (i === 2 ? -1 : 1);
                const cx = (qx + ex) / 2 - uy * bow;
                const cy = (qy + ey) / 2 + ux * bow;
                return (
                  <motion.path
                    key={card.n}
                    d={`M${qx} ${qy} Q${cx} ${cy} ${ex} ${ey}`}
                    strokeWidth={i === 0 ? 3.2 : 2}
                    strokeDasharray={i === 0 ? undefined : "7 8"}
                    className="stroke-accent"
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: i === 0 ? 1 : 0.65 }}
                    transition={{ duration: 0.5, ease }}
                  />
                );
              })}

              {commit && (
                <motion.path
                  key={`${commit.top.card.n}-${commit.pos.x.toFixed(2)}`}
                  d={(() => {
                    const cx = commit.top.card.nx * VW;
                    const cy = commit.top.card.ny * VH;
                    const rx = (CARD_W * VW) / 2 + 22;
                    const ry = (CARD_H * VW) / 2 + 20;
                    return `M${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A${rx} ${ry} 0 1 1 ${cx - rx + 14} ${cy - 10}`;
                  })()}
                  strokeWidth={3}
                  className="stroke-accent"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease, delay: 0.1 }}
                />
              )}
            </g>

            <g transform={`translate(${qx} ${qy})`} fill="none">
              <circle
                r={36}
                strokeWidth={1.5}
                strokeDasharray="5 7"
                className="stroke-accent/50"
              />
              <circle r={14} strokeWidth={2.2} className="stroke-accent" />
              <path
                d="M-26 0H-18M18 0H26M0 -26V-18M0 18V26"
                strokeWidth={2.2}
                className="stroke-accent"
              />
              <circle r={3.5} className="fill-accent" stroke="none" />
            </g>
          </svg>
        </div>
      </CornerFrame>

      {/* the readout under the wall */}
      <div className="mt-5 min-h-[10.5rem] border-t border-rule pt-4">
        {commit ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Review comment · posted on the PR
            </p>
            <span className="sr-only" aria-live="polite">
              {comment}
            </span>
            <p
              className="mt-3 font-display text-xl leading-snug"
              aria-hidden="true"
            >
              <Typed key={comment} text={comment} instant={reduce} />
            </p>
            <p className="mt-2 text-sm italic text-ink-soft">
              “{commit.top.card.text}”
            </p>
            <button
              onClick={() => release()}
              className="mt-4 border border-ink/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
            >
              Release
            </button>
          </div>
        ) : (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Closest past decisions
            </p>
            <ul className="mt-3 space-y-2">
              {top3.map(({ card, s }, i) => (
                <li
                  key={card.n}
                  className={`grid grid-cols-[2.6rem_3rem_1fr] items-baseline gap-2 ${
                    i === 0 ? "" : "text-ink-soft"
                  }`}
                >
                  <span className="font-mono text-[11px] tabular-nums text-accent">
                    {fmt(s)}
                  </span>
                  <span className="font-mono text-[11px]">#{card.n}</span>
                  <span className="text-[13px] leading-snug">{card.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-ink-soft">
              <span className="[@media(pointer:coarse)]:hidden">
                Move across the wall. Click to ask for a review.
              </span>
              <span className="hidden [@media(pointer:coarse)]:inline">
                Tap the wall to ask for a review.
              </span>
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-ink-soft">
        Illustrative. PR numbers, decisions and scores are sample values.
      </p>
    </div>
  );
}
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { ease } from "@/lib/motion";
import { projects } from "@/content/projects";
import { skillGroups, links, type Tool } from "@/content/skills";

type Box = { col: number; l: number; r: number; cy: number };

const MIN_WIDTH = 940; // below this the columns stack, so the lines are hidden

function edgePath(a: Box, b: Box) {
  if (a.col === b.col) {
    const bow = 30;
    return `M${a.r} ${a.cy} C${a.r + bow} ${a.cy} ${b.r + bow} ${b.cy} ${b.r} ${b.cy}`;
  }
  const [from, to] = a.col < b.col ? [a, b] : [b, a];
  const k = (to.l - from.r) * 0.5;
  return `M${from.r} ${from.cy} C${from.r + k} ${from.cy} ${to.l - k} ${to.cy} ${to.l} ${to.cy}`;
}

export default function Skills() {
  const reduce = useReducedMotion() ?? false;
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const [geo, setGeo] = useState<Record<string, Box>>({});
  const [width, setWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pointer = useRef("");

  const toolMap = useMemo(() => {
    const m: Record<string, Tool> = {};
    skillGroups.forEach((g) =>
      g.tools.forEach((t) => {
        m[t.name] = t;
      })
    );
    return m;
  }, []);

  const related = useMemo(() => {
    const m: Record<string, Set<string>> = {};
    for (const [a, b] of links) {
      (m[a] ??= new Set()).add(b);
      (m[b] ??= new Set()).add(a);
    }
    return m;
  }, []);

  const inFilter = (name: string) =>
    filter === "all" || !!toolMap[name]?.usedIn.includes(filter);
  const titleOf = (slug: string) =>
    projects.find((p) => p.slug === slug)?.title ?? slug;

    const measure = useCallback(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const wr = wrap.getBoundingClientRect();
        const next: Record<string, Box> = {};
        skillGroups.forEach((g, col) =>
            g.tools.forEach((t) => {
                const el = chipRefs.current[t.name];
                if (!el) return;
                const r = el.getBoundingClientRect();
                next[t.name] = {
                    col,
                    l: r.left - wr.left,
                    r: r.right - wr.left,
                    cy: r.top - wr.top + r.height / 2,
                };
            })
        );
        setGeo(next);
        setWidth(wr.width);
    }, []);

  useEffect(() => {
    measure();
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const lines = width >= MIN_WIDTH;

  function chipClass(t: Tool) {
    const base =
      "relative z-10 border bg-paper px-3 py-1.5 text-left text-sm transition-[color,background-color,border-color,opacity] duration-[240ms]";
    if (active) {
      if (t.name === active) return `${base} border-accent bg-accent text-paper`;
      if (related[active]?.has(t.name)) return `${base} border-accent text-accent`;
      return `${base} border-rule opacity-30`;
    }
    if (!inFilter(t.name)) return `${base} border-rule opacity-30`;
    return filter === "all"
      ? `${base} border-ink/60 hover:border-accent`
      : `${base} border-accent text-accent`;
  }

  const options = [
    { slug: "all", label: "All" },
    ...projects.map((p) => ({ slug: p.slug, label: p.title })),
  ];
  const info = active ? toolMap[active] : null;

    return (
        <section id="skills" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    03 · Skills
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    Tools, tied to what I actually built with them.
                </h2>
            </Reveal>

            <Reveal inView delay={0.08} className="mt-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Show what was used in
                </p>
                <div className="flex flex-wrap gap-2">
                    {options.map((o) => (
                        <button
                            key={o.slug}
                            onClick={() => {
                                setFilter(o.slug);
                                setActive(null);
                            }}
                            aria-pressed={filter === o.slug}
                            className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] ${filter === o.slug
                                ? "border-accent bg-accent text-paper"
                                : "border-ink/70 hover:border-accent hover:text-accent"
                                }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </Reveal>

            <motion.div
                ref={wrapRef}
                className="relative mt-12"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease }}
            >
                {lines && (
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        aria-hidden="true"
                    >
                        <g className="ink" fill="none" strokeLinecap="round">
                            {links.map(([a, b]) => {
                                const A = geo[a];
                                const B = geo[b];
                                if (!A || !B) return null;
                                const on = active
                                    ? a === active || b === active
                                    : filter !== "all" && inFilter(a) && inFilter(b);
                                const dim = active ? !on : filter !== "all" && !on;
                                const d = edgePath(A, B);
                                return (
                                    <g
                                        key={`${a}-${b}`}
                                        style={{ opacity: dim ? 0.18 : 1, transition: "opacity 240ms" }}
                                    >
                                        <path
                                            d={d}
                                            strokeWidth={1.3}
                                            strokeDasharray="4 5"
                                            className="stroke-ink-soft/50"
                                        />
                                        <motion.path
                                            d={d}
                                            strokeWidth={2}
                                            className="stroke-accent"
                                            initial={false}
                                            animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                                            transition={{ duration: reduce ? 0 : 0.5, ease }}
                                        />
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                )}

                <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {skillGroups.map((g) => (
                        <div key={g.label}>
                            <p className="border-b border-rule pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                                {g.label}
                            </p>
                            <ul className="mt-4 flex flex-col items-start gap-2.5">
                                {g.tools.map((t) => (
                                    <li key={t.name}>
                                        <button
                                            ref={(el) => {
                                                chipRefs.current[t.name] = el;
                                            }}
                                            className={chipClass(t)}
                                            aria-label={`${t.name}. Works with ${Array.from(related[t.name] ?? []).join(", ") ||
                                                "nothing listed"
                                                }`}
                                            onPointerDown={(e) => {
                                                pointer.current = e.pointerType;
                                            }}
                                            onPointerEnter={(e) => {
                                                if (e.pointerType === "mouse") setActive(t.name);
                                            }}
                                            onPointerLeave={(e) => {
                                                if (e.pointerType === "mouse") setActive(null);
                                            }}
                                            onFocus={() => setActive(t.name)}
                                            onBlur={() => setActive(null)}
                                            onKeyDown={() => {
                                                pointer.current = "";
                                            }}
                                            onClick={() => {
                                                if (pointer.current === "mouse" || pointer.current === "")
                                                    return;
                                                setActive((a) => (a === t.name ? null : t.name));
                                            }}
                                        >
                                            {t.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>

            <p
                aria-live="polite"
                className="mt-10 min-h-[3rem] font-mono text-[11px] leading-relaxed tracking-[0.1em] text-ink-soft"
            >
                {info ? (
                    <>
                        <span className="text-accent">{info.name}</span> · used in{" "}
                        {info.usedIn.length
                            ? info.usedIn.map(titleOf).join(" and ")
                            : "my work in general"}
                        {Array.from(related[info.name] ?? []).join(", ") || "nothing listed"}
                    </>
                ) : (
                    "Hover or tap a tool to trace what it works with."
                )}
            </p>
        </section>
    );
}
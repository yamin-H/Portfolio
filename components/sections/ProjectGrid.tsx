"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/sections/ProjectCard";
import { ease } from "@/lib/motion";
import { archive, SHOW_GRID } from "@/content/archive";

export default function ProjectGrid() {
  const reduce = useReducedMotion() ?? false;
  const [tag, setTag] = useState("All");

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(archive.flatMap((p) => p.tags)))],
    []
  );
    const shown = archive.filter((p) => tag === "All" || p.tags.includes(tag));
    if (!SHOW_GRID) return null;

    return (
        <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Projects
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    Everything I&apos;ve built.
                </h2>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                    {archive.length} {archive.length === 1 ? "project" : "projects"}
                </p>
            </Reveal>

            <Reveal inView delay={0.08} className="mt-8 flex flex-wrap gap-2">
                {tags.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTag(t)}
                        aria-pressed={tag === t}
                        className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] ${tag === t
                                ? "border-accent bg-accent text-paper"
                                : "border-ink/70 hover:border-accent hover:text-accent"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </Reveal>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {shown.map((p) => (
                        <motion.li
                            key={p.slug}
                            layout
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-8% 0px" }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.45, ease }}
                        >
                            <ProjectCard p={p} n={archive.indexOf(p) + 1} />
                        </motion.li>
                    ))}
                </AnimatePresence>

                {process.env.NODE_ENV !== "production" && (
                    <li className="flex min-h-[18rem] items-center justify-center border border-dashed border-rule p-6 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
                        Dev only
                        <br />
                        Add a project in content/archive.ts
                    </li>
                )}
            </ul>
        </section>
    );
}
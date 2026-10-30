"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

export default function Skills() {
  const [filter, setFilter] = useState<string>("all");

  const options = [
    { slug: "all", label: "All" },
    ...projects.map((p) => ({ slug: p.slug, label: p.title })),
  ];

    return (
        <section id="skills" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    02 · Skills
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
                            onClick={() => setFilter(o.slug)}
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

            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {skillGroups.map((g, gi) => (
                    <Reveal key={g.label} inView delay={0.06 * gi}>
                        <p className="border-b border-rule pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                            {g.label}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {g.tools.map((t) => {
                                const lit = filter === "all" || t.usedIn.includes(filter);
                                return (
                                    <li
                                        key={t.name}
                                        className={`border px-2.5 py-1.5 text-sm transition-all duration-[240ms] ${lit
                                                ? filter === "all"
                                                    ? "border-ink/60 bg-paper/60"
                                                    : "border-accent bg-paper/60 text-accent"
                                                : "border-rule opacity-30"
                                            }`}
                                    >
                                        {t.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
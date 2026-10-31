"use client";

import { useState } from "react";
import TLink from "@/components/ui/TLink";
import { CompactContext } from "@/components/diagrams/iso/BlockFrame";
import { blockMap } from "@/components/diagrams/iso/blocks";
import type { ArchiveProject } from "@/content/archive";

export default function ProjectCard({
  p,
  n,
}: {
  p: ArchiveProject;
  n: number;
}) {
  const [hot, setHot] = useState(false);
  const Block = blockMap[p.block];

  const first = p.links.find((l) => l.href);
  const link = p.featured
    ? {
        href: `/projects/${p.slug}`,
        label: "Read the case study",
        mark: "→",
        internal: true,
      }
    : first
    ? { href: first.href, label: first.label, mark: "↗", internal: false }
    : null;

  const inner = (
    <>
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="text-accent">
          P-{String(n).padStart(2, "0")} · {p.kind}
        </span>
        <span className="text-ink-soft">{p.year}</span>
      </div>

      <div
        aria-hidden="true"
        className={`mat mat-${p.block} mt-4 border border-rule bg-paper-deep/40 px-3 pb-1 pt-3`}
      >
        <CompactContext.Provider value={true}>
          <Block state={hot ? "active" : "idle"} />
        </CompactContext.Provider>
      </div>

      <h3 className="mt-5 font-display text-2xl leading-tight tracking-tight">
        {p.title}
      </h3>
      <p className="mt-2 leading-relaxed text-ink-soft">{p.summary}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {p.stack.slice(0, 4).map((s) => (
          <span
            key={s}
            className="border border-rule px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft"
          >
            {s}
          </span>
        ))}
      </div>

      {link && (
        <p className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          {link.label} {link.mark}
        </p>
      )}
    </>
  );

  const cls =
    "group flex h-full flex-col border border-ink/60 bg-paper/60 p-4 outline-none transition-[transform,border-color] duration-[240ms] hover:-translate-y-0.5 hover:border-accent focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/60";

  const handlers = {
    onMouseEnter: () => setHot(true),
    onMouseLeave: () => setHot(false),
    onFocus: () => setHot(true),
    onBlur: () => setHot(false),
  };

  if (!link) {
      return (
          <div className={cls} {...handlers}>
              {inner}
          </div>
      );
    };

    return link.internal ? (
        <TLink href={link.href} label={p.title} className={cls} {...handlers}>
            {inner}
        </TLink>
    ) : (
        <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={cls}
            {...handlers}
        >
            {inner}
        </a>
    );
}
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/sections/ProjectCard";
import VideoModal, { type VideoItem } from "@/components/ui/VideoModal";
import { ease } from "@/lib/motion";
import { toEmbed } from "@/lib/video";
import { archive, SHOW_GRID, type ArchiveProject } from "@/content/archive";

const canPlay = (p: ArchiveProject) => !!p.video && !!toEmbed(p.video);

export default function ProjectGrid() {
  const reduce = useReducedMotion() ?? false;
  const [tag, setTag] = useState("All");
  const [item, setItem] = useState<VideoItem | null>(null);
  const [nudge, setNudge] = useState(false);
  const [played, setPlayed] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const inView = useInView(listRef, { once: true, margin: "-30% 0px" });

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(archive.flatMap((p) => p.tags)))],
    []
  );
  const playable = useMemo(() => archive.filter(canPlay).length, []);

  // the "press play" hint: once per session, a moment after the grid scrolls into view
  useEffect(() => {
    if (!inView || played || playable === 0) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("play-hint") === "1";
    } catch {
      /* storage blocked: the hint just shows again */
    }
    if (seen) return;

    const on = setTimeout(() => {
      setNudge(true);
      try {
        sessionStorage.setItem("play-hint", "1");
      } catch {
        /* ignore */
      }
    }, 700);
    const off = setTimeout(() => setNudge(false), 9500);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [inView, played, playable]);

  const play = useCallback((p: ArchiveProject, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    trigger.current = el;
    setPlayed(true);
    setNudge(false);
    setItem({
      title: p.title,
      kind: p.kind,
      video: p.video ?? "",
      href: p.featured ? `/projects/${p.slug}` : "",
      dx: r.left + r.width / 2 - window.innerWidth / 2,
      dy: r.top + r.height / 2 - window.innerHeight / 2,
    });
  }, []);

  const close = useCallback(() => {
    setItem(null);
    const el = trigger.current;
    requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  }, []);

  const shown = archive.filter((p) => tag === "All" || p.tags.includes(tag));
  const playableShown = shown.filter(canPlay);

  if (!SHOW_GRID) return null;

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
      <Reveal inView>
        <p className="sec-eyebrow font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Projects
        </p>
        <h2 className="mt-4 max-w-2xl font-display t-h2">
          Everything I&apos;ve built.
        </h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          {archive.length} {archive.length === 1 ? "project" : "projects"}
          {playable > 0 && (
            <>
              <span aria-hidden="true"> · </span>
              <span aria-hidden="true" className="text-accent">
                ▶
              </span>{" "}
              press play on a card to watch the demo
            </>
          )}
        </p>
      </Reveal>

      <Reveal inView delay={0.08} className="mt-8 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            aria-pressed={tag === t}
            className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] ${
              tag === t
                ? "border-accent bg-accent text-paper"
                : "border-ink/70 hover:border-accent hover:text-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </Reveal>

      <ul ref={listRef} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => {
            const idx = playableShown.indexOf(p);
            return (
              <motion.li
                key={p.slug}
                layout
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease }}
              >
                <ProjectCard
                  p={p}
                  n={archive.indexOf(p) + 1}
                  canPlay={idx >= 0}
                  first={idx === 0}
                  nudge={nudge}
                  delay={Math.max(0, idx) * 0.22}
                  onPlay={(el) => play(p, el)}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>

        {process.env.NODE_ENV !== "production" && (
          <li className="flex min-h-[18rem] items-center justify-center border border-dashed border-rule p-6 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
            Dev only
            <br />
            Add a project in content/archive.ts
          </li>
        )}
      </ul>

      <VideoModal item={item} onClose={close} />
    </section>
  );
}
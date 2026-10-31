"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useActiveSection } from "../hooks/useActiveSection";
import { SHOW_GRID } from "@/content/archive";

const marks = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
].filter((m) => m.id !== "projects" || SHOW_GRID);
const ids = marks.map((m) => m.id);

export default function ScrollRail() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });
  const fill = reduce ? scrollYProgress : smooth;
  const active = useActiveSection(ids);
  const [pos, setPos] = useState<number[]>([]);

  const measure = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    setPos(
      marks.map((m) => {
        const el = document.getElementById(m.id);
        if (!el) return 0;
        const y = el.getBoundingClientRect().top + window.scrollY - 64;
        return Math.min(1, Math.max(0, y / max));
      })
    );
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-28 left-5 top-28 z-40 hidden w-px bg-rule min-[1400px]:block"
    >
      <motion.div
        className="absolute inset-0 origin-top bg-accent"
        style={{ scaleY: fill }}
      />
      {marks.map((m, i) => {
        const on = active === m.id;
        return (
          <div
            key={m.id}
            className="absolute left-0"
            style={{ top: `${(pos[i] ?? i / (marks.length - 1)) * 100}%` }}
          >
            <span
              className={`absolute left-0 top-0 block h-px transition-all duration-[240ms] ${
                on ? "w-4 bg-accent" : "w-2 bg-ink-soft/60"
              }`}
            />
            <span
              className={`absolute left-6 top-0 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-accent transition-opacity duration-[240ms] ${
                on ? "opacity-100" : "opacity-0"
              }`}
            >
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
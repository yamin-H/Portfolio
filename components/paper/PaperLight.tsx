"use client";

import { useEffect, useRef } from "react";
import PencilMarks from "@/components/paper/PencilMarks";

export default function PaperLight() {
  const ref = useRef<HTMLDivElement>(null);
  const marksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const marks = marksRef.current;
    if (!el || !marks) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    // the pencil layer is as big as the screen and stays fixed to it
    const fit = () => {
      marks.style.width = `${window.innerWidth}px`;
      marks.style.height = `${window.innerHeight}px`;
    };
    fit();
    window.addEventListener("resize", fit);

    const half = el.offsetWidth / 2;
    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let on = 0;
    let onT = 0;
    let seen = false;
    let raf = 0;
    let running = false;

    const draw = () => {
      // both are rounded, so the pencil layer cancels the light's movement exactly
      const tx = Math.round(pos.x - half);
      const ty = Math.round(pos.y - half);
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      marks.style.transform = `translate3d(${-tx}px, ${-ty}px, 0)`;
      el.style.opacity = String(on);
    };

    const frame = () => {
      pos.x += (target.x - pos.x) * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      on += (onT - on) * 0.08;

      const settled =
        Math.abs(target.x - pos.x) < 0.4 &&
        Math.abs(target.y - pos.y) < 0.4 &&
        Math.abs(onT - on) < 0.004;
      if (settled) {
        pos.x = target.x;
        pos.y = target.y;
        on = onT;
      }

      draw();
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) {
        pos.x = target.x;
        pos.y = target.y;
        seen = true;
      }
      onT = 1;
      kick();
    };
    const onLeave = () => {
      onT = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="paper-cursor">
      <div className="paper-cursor-pool" />
      <div className="paper-cursor-reveal">
        <div ref={marksRef} className="paper-cursor-marks">
          <PencilMarks />
        </div>
      </div>
    </div>
  );
}
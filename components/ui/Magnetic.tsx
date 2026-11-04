"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const MAX = 9;
const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));

export default function Magnetic({
  children,
  strength = 0.25,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function move(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // measure from the un-pulled centre, so the pull doesn't feed back on itself
    const cx = r.left + r.width / 2 - sx.get();
    const cy = r.top + r.height / 2 - sy.get();
    x.set(clamp((e.clientX - cx) * strength));
    y.set(clamp((e.clientY - cy) * strength));
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="-m-2 inline-block p-2"
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.div>
  );
}
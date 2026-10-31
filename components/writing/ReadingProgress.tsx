"use client";

import { useEffect } from "react";
import { motion, useMotionValue } from "motion/react";

export default function ReadingProgress({ targetId }: { targetId: string }) {
  const p = useMotionValue(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const read = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      p.set(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [targetId, p]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[2px] origin-left bg-accent"
      style={{ scaleX: p }}
    />
  );
}
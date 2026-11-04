"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const c = animate(0, value, { duration: 1.4, ease, onUpdate: setN });
    return () => c.stop();
  }, [inView, reduce, value]);

  const final = `${value.toFixed(decimals)}${suffix}`;

  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {n.toFixed(decimals)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
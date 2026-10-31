"use client";

import { useEffect } from "react";

const WARMUP = 700; // ms to wait before measuring, so hydration can finish
const WINDOW = 2200; // ms of frames to measure
const LIMIT = 30; // median frame time (ms) above which the page goes "lite"

export default function PerfGuard() {
  useEffect(() => {
    const root = document.documentElement;
    const flag = new URLSearchParams(window.location.search).get("lite");
    if (flag === "1") {
      root.classList.add("lite");
      return;
    }
    if (flag === "0") return;

    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem("perf-lite");
    } catch {
      /* storage blocked: measure instead */
    }
    if (saved === "1") {
      root.classList.add("lite");
      return;
    }
    if (saved === "0") return;

    const deltas: number[] = [];
    const t0 = performance.now();
    let last = 0;
    let raf = 0;
    let done = false;

    const finish = () => {
      done = true;
      const ok = deltas.filter((d) => d < 250).sort((a, b) => a - b);
      if (ok.length < 20) return; // tab was hidden: not enough to judge
      const median = ok[Math.floor(ok.length / 2)];
      const lite = median > LIMIT;
      if (lite) root.classList.add("lite");
      console.info(
        `[perf] median frame ${median.toFixed(1)}ms → ${lite ? "lite" : "full"}`
      );
      try {
        sessionStorage.setItem("perf-lite", lite ? "1" : "0");
      } catch {
        /* ignore */
      }
    };

    const tick = (now: number) => {
      if (done) return;
      if (last && now - t0 > WARMUP) deltas.push(now - last);
      last = now;
      if (now - t0 < WARMUP + WINDOW) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
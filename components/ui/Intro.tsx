"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/lib/motion";

const HOLD = 950;

export default function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem("intro", "1");
    } catch {
      /* storage blocked: it just plays again next visit */
    }
    const end = () => setShow(false);
    const t = setTimeout(end, HOLD);
    window.addEventListener("pointerdown", end, { once: true });
    window.addEventListener("keydown", end, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", end);
      window.removeEventListener("keydown", end);
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        const root = document.documentElement;
        if (root.dataset.intro === "play") root.dataset.intro = "done";
      }}
    >
      {show && (
        <motion.div
          key="intro"
          aria-hidden="true"
          className="intro fixed inset-0 z-[59] flex-col items-center justify-center bg-paper"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <svg
            viewBox="0 0 120 120"
            width="76"
            height="76"
            className="ink"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <motion.path
              d="M60 10 L103.3 35 V85 L60 110 L16.7 85 V35 Z"
              strokeWidth={4}
              className="stroke-ink"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease }}
            />
            <motion.path
              d="M16.7 35 L60 60 L103.3 35 M60 60 L60 110"
              strokeWidth={5.5}
              className="stroke-accent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.3 }}
            />
          </svg>
          <motion.p
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Yamin Hossain
          </motion.p>
          <span className="mt-5 block h-px w-24 bg-rule">
            <motion.span
              className="block h-px origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, ease }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
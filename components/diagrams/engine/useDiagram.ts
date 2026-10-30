"use client";

import { useCallback, useEffect, useState } from "react";

export function useDiagram(
  total: number,
  stepMs: (step: number, broken: boolean) => number
) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const wait = step < 0 ? 350 : stepMs(step, broken);
    const t = setTimeout(() => {
      if (step >= total - 1) setPlaying(false);
      else setStep(step + 1);
    }, wait);
    return () => clearTimeout(t);
  }, [playing, step, broken, total, stepMs]);

  const run = useCallback(() => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setStep((s) => (s >= total - 1 ? -1 : s));
    setPlaying(true);
  }, [playing, total]);

  const next = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.min(s + 1, total - 1));
  }, [total]);

  const reset = useCallback(() => {
    setPlaying(false);
    setStep(-1);
  }, []);

  const toggleBroken = useCallback(() => setBroken((b) => !b), []);

  return { step, playing, broken, run, next, reset, toggleBroken };
};
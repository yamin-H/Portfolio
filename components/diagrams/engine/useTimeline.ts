"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { ease } from "@/lib/motion";

type Opts = {
  total: number;
  travel: number; // seconds per connector
  dwell: (stop: number, broken: boolean) => number; // ms resting on a stop
  reduce: boolean;
};

const EPS = 0.002;

/**
 * One continuous position drives the whole diagram.
 * 0 = at stop 0, 2.5 = halfway along the connector between stop 2 and 3.
 */
export function useTimeline({ total, travel, dwell, reduce }: Opts) {
  const last = total - 1;
  const progress = useMotionValue(0);
  const [lit, setLit] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  const started = useRef(false);
  const playingRef = useRef(false);
  const token = useRef(0);
  const anim = useRef<{ stop: () => void } | null>(null);
  const brokenRef = useRef(false);

  useEffect(() => {
    brokenRef.current = broken;
  }, [broken]);

  const litFor = useCallback(
    (v: number) => (started.current ? Math.min(last, Math.floor(v + EPS)) : -1),
    [last]
  );

  useMotionValueEvent(progress, "change", (v) => setLit(litFor(v)));

  const stop = useCallback(() => {
    token.current += 1;
    anim.current?.stop();
    anim.current = null;
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const begin = useCallback(() => {
    if (started.current) return;
    started.current = true;
    progress.set(0);
    setLit(0);
  }, [progress]);

  const glide = useCallback(
    (target: number) => {
      const dist = Math.abs(target - progress.get());
      anim.current = animate(progress, target, {
        duration: reduce ? 0 : Math.min(1.8, 0.45 + dist * 0.3),
        ease,
      });
    },
    [progress, reduce]
  );

  /** Jump instantly (used while dragging). */
  const seek = useCallback(
    (v: number) => {
      stop();
      begin();
      const c = Math.max(0, Math.min(last, v));
      progress.set(c);
      setLit(litFor(c));
    },
    [stop, begin, progress, last, litFor]
  );

  /** Glide smoothly to a stop (used for label clicks and arrow keys). */
    const goTo = useCallback(
        (target: number) => {
            stop();
            begin();
            glide(Math.max(0, Math.min(last, target)));
        },
        [stop, begin, glide, last]
    );

    const next = useCallback(() => {
        stop();
        if (!started.current) {
            begin();
            return;
        }
        const cur = Math.floor(progress.get() + EPS);
        if (cur >= last) return;
        anim.current = animate(progress, cur + 1, {
            duration: reduce ? 0 : travel,
            ease,
        });
    }, [stop, begin, progress, last, reduce, travel]);

    const reset = useCallback(() => {
        stop();
        started.current = false;
        progress.set(0);
        setLit(-1);
    }, [stop, progress]);

    const run = useCallback(async () => {
        if (playingRef.current) {
            stop();
            return;
        }
        if (!started.current) begin();
        else if (progress.get() >= last - EPS) {
            progress.set(0);
            setLit(0);
        }

        const me = ++token.current;
        playingRef.current = true;
        setPlaying(true);
        const alive = () => token.current === me;
        const wait = (ms: number) =>
            new Promise<void>((resolve) => setTimeout(resolve, ms));

        // resting exactly on a stop: let it read before moving on
        const at = progress.get();
        if (Math.abs(at - Math.round(at)) < EPS) {
            await wait(dwell(Math.round(at), brokenRef.current));
            if (!alive()) return;
        }

        while (alive()) {
            const cur = progress.get();
            const target = Math.floor(cur + EPS) + 1;
            if (target > last) break;

            const ctrl = animate(progress, target, {
                duration: reduce ? 0 : travel * (target - cur),
                ease,
            });
            anim.current = ctrl;
            await ctrl;
            if (!alive()) return;
            if (target >= last) break;
            await wait(dwell(target, brokenRef.current));
        }

        if (alive()) {
            playingRef.current = false;
            setPlaying(false);
        }
    }, [stop, begin, progress, last, reduce, travel, dwell]);

    const toggleBroken = useCallback(() => setBroken((b) => !b), []);

    useEffect(
        () => () => {
            token.current += 1;
            anim.current?.stop();
        },
        []
    );

    return {
        progress,
        lit,
        playing,
        broken,
        run,
        next,
        reset,
        seek,
        goTo,
        grab: stop,
        toggleBroken,
    };
}
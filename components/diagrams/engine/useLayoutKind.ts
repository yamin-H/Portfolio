"use client";

import { useEffect, useRef, useState } from "react";

/** Picks "wide" or "tall" from the width of the element it is attached to. */
export function useLayoutKind(threshold: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<"wide" | "tall" | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setKind(el.clientWidth >= threshold ? "wide" : "tall");
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [threshold]);

  return [ref, kind] as const;
};
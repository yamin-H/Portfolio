"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** The id of whichever section is crossing the middle of the screen. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const key = ids.join("|");

  useEffect(() => {
    const els = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) {
      setActive(null);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, pathname]);

  return active;
}
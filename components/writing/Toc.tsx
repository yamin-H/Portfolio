"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/posts";

export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let cur: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) cur = el.id;
        else break;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
        On this page
      </p>
      <ul className="mt-4 space-y-1 border-l border-rule">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l py-1 text-[14px] leading-snug transition-colors duration-[240ms] ${
                h.depth === 3 ? "pl-7" : "pl-4"
              } ${
                active === h.id
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
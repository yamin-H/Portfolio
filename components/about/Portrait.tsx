"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import CornerFrame from "@/components/ui/CornerFrame";
import { ease } from "@/lib/motion";

function Monogram() {
  const reduce = useReducedMotion();
  const view = { once: true, margin: "-10% 0px" } as const;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <svg
        viewBox="0 0 120 120"
        className="ink w-36"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M60 60 L103.3 35 V85 L60 110Z" stroke="none" className="fill-ink/10" />
        <motion.path
          d="M60 10 L103.3 35 V85 L60 110 L16.7 85 V35 Z"
          strokeWidth={4}
          className="stroke-ink"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={view}
          transition={{ duration: 1.1, ease }}
        />
        <motion.path
          d="M16.7 35 L60 60 L103.3 35 M60 60 L60 110"
          strokeWidth={5.5}
          className="stroke-accent"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={view}
          transition={{ duration: 0.9, ease, delay: 0.4 }}
        />
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
        Yamin Hossain
      </p>
    </div>
  );
}

export default function Portrait({
  src,
  alt,
  caption,
}: {
  src?: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="max-w-[20rem]">
      <div className="relative">
        {/* an offset ink outline, like a registration shadow */}
        <div
          aria-hidden="true"
          className="ink absolute inset-0 translate-x-2.5 translate-y-2.5 border border-ink/50"
        />
        <CornerFrame className="relative bg-paper p-2">
          <div className="group relative aspect-[4/5] overflow-hidden border border-ink/60 bg-paper-deep">
            {src ? (
              <>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="320px"
                  className="object-cover grayscale contrast-[1.08] sepia-[0.15] transition-[filter] duration-700 group-hover:grayscale-0 group-hover:sepia-0"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(22,23,26,0.1)_0_1px,transparent_1px_4px)] transition-opacity duration-700 group-hover:opacity-0"
                />
              </>
            ) : (
              <Monogram />
            )}
          </div>
        </CornerFrame>
      </div>
      <figcaption className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        <span className="text-accent">Fig_A · </span>
        {caption}
      </figcaption>
    </figure>
  );
}
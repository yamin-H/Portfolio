"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

export default function NameReveal({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  let n = 0;

    return (
        <h1
            aria-label={lines.join(" ")}
            className="font-display text-[3.75rem] leading-[0.98] tracking-tight sm:text-8xl lg:text-[7.5rem]"
        >
            {lines.map((line, li) => {
                const chars = [...line].map((c) => ({ c, accent: false }));
                if (li === lines.length - 1) chars.push({ c: ".", accent: true });

                return (
                    <span key={li} className="block" aria-hidden="true">
                        {chars.map(({ c, accent }) => {
                            const idx = n++;
                            return (
                                <motion.span
                                    key={idx}
                                    className={`inline-block ${accent ? "text-accent" : ""}`}
                                    initial={
                                        reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }
                                    }
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 0.8, ease, delay: 0.1 + idx * 0.04 }}
                                >
                                    {c}
                                </motion.span>
                            );
                        })}
                    </span>
                );
            })}
        </h1>
    );
}
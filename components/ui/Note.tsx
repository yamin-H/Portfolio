"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

export default function Note({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

    return (
        <div className={`flex items-start gap-2 text-accent ${className}`}>
            <svg
                viewBox="0 0 44 28"
                width="40"
                height="26"
                className="ink mt-0.5 shrink-0"
                aria-hidden="true"
            >
                <motion.path
                    d="M40 25 C 26 26, 9 20, 5 6 M5 6 L3 16 M5 6 L14 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.8, ease, delay: 0.3 }}
                />
            </svg>
            <p className="font-display text-[15px] italic leading-snug">{children}</p>
        </div>
    );
}
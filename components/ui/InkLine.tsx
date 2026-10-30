"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";

export default function InkLine({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
    return (
        <svg
            className={`ink ${className}`}
            viewBox="0 0 1000 12"
            preserveAspectRatio="none"
            width="100%"
            height="12"
            aria-hidden="true"
        >
            <motion.path
                d="M2 6 C 150 3, 300 9, 500 6 S 850 4, 998 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.1, ease, delay }}
            />
        </svg>
    );
}
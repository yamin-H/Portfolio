"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { introLead } from "@/lib/intro";

export default function InkUnderline({
  children,
  delay = 0.4,
  inView = false,
}: {
  children: React.ReactNode;
  delay?: number;
  inView?: boolean;
}) {
  const trigger = inView
    ? { whileInView: { pathLength: 1 }, viewport: { once: true } }
    : { animate: { pathLength: 1 } };

  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="ink absolute left-0 -bottom-2 w-full text-accent"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        height="10"
        aria-hidden="true"
      >
        <motion.path
          d="M2 6 C 40 2, 90 9, 140 5 S 190 4, 198 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          {...trigger}
          transition={{
            duration: 0.9,
            ease,
            delay: delay + (inView ? 0 : introLead()),
          }}
        />
      </svg>
    </span>
  );
}
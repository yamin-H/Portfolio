"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease, duration } from "@/lib/motion";
import { introLead } from "@/lib/intro";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  inView = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const to = { opacity: 1, y: 0 };

    return (
        <motion.div
            className={className}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={inView ? undefined : to}
            whileInView={inView ? to : undefined}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: duration.settle, ease, delay: delay + (inView ? 0 : introLead()) }}
        >
            {children}
        </motion.div>
    );
}
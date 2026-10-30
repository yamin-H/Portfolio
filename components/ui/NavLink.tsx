"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";

export default function NavLink({
  href,
  index,
  children,
}: {
  href: string;
  index: string;
  children: React.ReactNode;
}) {
  const [hot, setHot] = useState(false);

    return (
        <a
            href={href}
            onMouseEnter={() => setHot(true)}
            onMouseLeave={() => setHot(false)}
            onFocus={() => setHot(true)}
            onBlur={() => setHot(false)}
            className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-[240ms] hover:text-ink focus-visible:text-ink"
        >
            <span className="mr-1.5 hidden text-accent sm:inline">{index}</span>
            {children}
            <svg
                className="ink absolute left-0 -bottom-1.5 w-full text-accent"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                height="8"
                aria-hidden="true"
            >
                <motion.path
                    d="M1 4 C 20 2, 45 6, 70 3.5 S 92 3, 99 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={false}
                    animate={{ pathLength: hot ? 1 : 0, opacity: hot ? 1 : 0 }}
                    transition={{ duration: 0.4, ease }}
                />
            </svg>
        </a>
    );
}
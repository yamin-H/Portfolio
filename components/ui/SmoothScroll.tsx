"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  // People who ask their system for less motion get normal scrolling
  if (reduce) return <>{children}</>;

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.085,
                wheelMultiplier: 0.9,
                anchors: { offset: -64 },
            }}
        >
            {children}
        </ReactLenis>
    );
}
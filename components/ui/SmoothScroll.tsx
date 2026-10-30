"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

    return (
        <ReactLenis
            root
            options={
                reduce
                    ? {
                        smoothWheel: false,
                        syncTouch: false,
                        anchors: { offset: -64, immediate: true },
                    }
                    : {
                        lerp: 0.085,
                        wheelMultiplier: 0.9,
                        anchors: { offset: -64 },
                    }
            }
        >
            {children}
        </ReactLenis>
    );
}
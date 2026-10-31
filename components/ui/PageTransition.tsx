"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnimate, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { ease } from "@/lib/motion";

type Ctx = { go: (href: string, label?: string) => void };
const TransitionContext = createContext<Ctx>({ go: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const EXIT_EASE: [number, number, number, number] = [0.7, 0, 0.3, 1];
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const frames = () =>
  new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r()))
  );

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduce = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate();
  const [label, setLabel] = useState("");
  const busy = useRef(false);
  const waiting = useRef<{ path: string; resolve: () => void } | null>(null);

  // park the sheet off-screen, to the right
  useEffect(() => {
    if (scope.current) animate(scope.current, { x: "101%" }, { duration: 0 });
  }, [animate, scope]);

  // the new page has mounted
  useEffect(() => {
    if (waiting.current && waiting.current.path === pathname) {
      waiting.current.resolve();
      waiting.current = null;
    }
  }, [pathname]);

  const toTarget = useCallback(
    (url: URL, immediate: boolean) => {
      if (lenis) {
        lenis.scrollTo(url.hash || 0, {
          offset: url.hash ? -64 : 0,
          immediate,
          force: true,
        });
      } else if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    },
    [lenis]
  );

  const go = useCallback(
    async (href: string, text?: string) => {
      if (busy.current) return;
      const url = new URL(href, window.location.href);

      // same page: just glide to the spot
      if (url.pathname === window.location.pathname) {
        toTarget(url, false);
        return;
      }
      if (reduce || !scope.current) {
        router.push(href);
        return;
      }

      busy.current = true;
      const el = scope.current as HTMLElement;
      try {
        setLabel(text ?? "");
        await frames();
        el.style.visibility = "visible";
        el.style.pointerEvents = "auto";
        await animate(el, { x: "0%" }, { duration: 0.65, ease });

        const arrived = new Promise<void>((resolve) => {
          waiting.current = { path: url.pathname, resolve };
        });
        router.push(href);
        await Promise.race([arrived, sleep(2500)]);
        await sleep(260);
        toTarget(url, true);

        await animate(el, { x: "-101%" }, { duration: 0.85, ease: EXIT_EASE });
      } finally {
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
        animate(el, { x: "101%" }, { duration: 0 });
        waiting.current = null;
        busy.current = false;
      }
    },
    [animate, reduce, router, scope, toTarget]
  );

  const value = useMemo(() => ({ go }), [go]);

    return (
        <TransitionContext.Provider value={value}>
            {children}

            {/* the sheet */}
            <div
                ref={scope}
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-[58]"
                style={{ visibility: "hidden" }}
            >
                <div
                    className="absolute inset-0 bg-paper"
                    style={{
                        boxShadow: "-40px 0 70px rgba(70,52,24,0.22)",
                        backgroundImage:
                            "linear-gradient(to right, rgba(47,75,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,75,255,0.055) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                >
                    {/* the curl along the leading edge */}
                    <div
                        className="absolute inset-y-0 left-0 w-20"
                        style={{
                            background:
                                "linear-gradient(to right, rgba(90,66,30,0.2), transparent)",
                        }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                            Next sheet
                        </p>
                        <p className="mt-4 font-display text-5xl tracking-tight sm:text-7xl">
                            {label}
                        </p>
                    </div>
                </div>
            </div>
        </TransitionContext.Provider>
    );
}
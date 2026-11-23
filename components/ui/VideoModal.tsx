"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import TLink from "@/components/ui/TLink";
import { ease } from "@/lib/motion";
import { toEmbed, type Embed } from "@/lib/video";

export type VideoItem = {
  title: string;
  kind: string;
  video: string;
  href: string; // the case-study page, or "" for none
  dx: number; // offset of the pressed button from the screen centre
  dy: number;
};

function Shell({
  item,
  embed,
  reduce,
  onClose,
}: {
  item: VideoItem;
  embed: Embed;
  reduce: boolean;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focus = setTimeout(
      () => closeBtn.current?.focus({ preventScroll: true }),
      80
    );
    // never leave the loading veil up if the player is slow to report
    const veil = setTimeout(() => setLoaded(true), 6000);
    return () => {
      clearTimeout(focus);
      clearTimeout(veil);
    };
  }, []);

  function trap(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !panel.current) return;
    const els = Array.from(
      panel.current.querySelectorAll<HTMLElement>(
        "a[href], button:not(:disabled), iframe, video[controls]"
      )
    );
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const away = reduce
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.18, x: item.dx, y: item.dy };

  return (
    <motion.div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onKeyDown={trap}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} demo video`}
        className="relative border border-ink/70 bg-paper shadow-[0_30px_80px_-20px_rgba(22,23,26,0.45)]"
        style={{ width: "min(100%, 64rem, calc((100dvh - 11rem) * 16 / 9))" }}
        initial={away}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={away}
        transition={{ duration: reduce ? 0.2 : 0.6, ease }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2.5">
          <p className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="text-accent">Demo</span>
            <span className="text-ink-soft">
              {" "}
              · {item.title} · {item.kind}
            </span>
          </p>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="press shrink-0 border border-ink/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] hover:border-accent hover:text-accent"
          >
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="relative aspect-video bg-ink">
          {embed.kind === "iframe" ? (
            <iframe
              src={embed.src}
              title={`${item.title} demo video`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video
              src={embed.src}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onLoadedData={() => setLoaded(true)}
              className="absolute inset-0 h-full w-full bg-ink"
            />
          )}

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-paper-deep transition-opacity duration-500 ${
              loaded ? "opacity-0" : "opacity-100"
            }`}
          >
            <p className="animate-pulse font-mono text-[10px] uppercase tracking-[0.24em] text-ink-soft motion-reduce:animate-none">
              Loading video…
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="text-ink-soft">Esc to close</span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={embed.open}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              Open in a new tab ↗
            </a>
            {item.href && (
              <TLink
                href={item.href}
                label={item.title}
                onClick={onClose}
                className="text-accent underline-offset-4 hover:underline"
              >
                Case study →
              </TLink>
            )}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VideoModal({
  item,
  onClose,
}: {
  item: VideoItem | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const embed = item ? toEmbed(item.video) : null;
  const open = !!item && !!embed;

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && item && embed && (
        <Shell
          key="video"
          item={item}
          embed={embed}
          reduce={reduce}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
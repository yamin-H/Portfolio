"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { usePageTransition } from "@/components/ui/PageTransition";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { ease } from "@/lib/motion";
import { SHOW_GRID } from "@/content/archive";

type Item = {
  id: string;
  group: string;
  label: string;
  hint: string;
  keys: string;
  copy?: boolean;
  run: () => void;
};

const sections = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
].filter((m) => m.id !== "projects" || SHOW_GRID);

export default function CommandPalette() {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const { go } = usePageTransition();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => {
    const copy = (text: string) => () => {
      navigator.clipboard?.writeText(text).catch(() => {});
    };
    const out: Item[] = [
      ...sections.map((s) => ({
        
        id: "s-resume",
        group: "Go to",
        label: "Résumé",
        hint: "Web version",
        keys: "resume cv curriculum",
        run: () => go("/resume", "Résumé"),
      })),
      {
  id: "s-writing",
  group: "Go to",
  label: "Writing",
  hint: "Posts and research",
  keys: "writing blog posts research notes",
  run: () => go("/writing", "Writing"),
},
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: "Case studies",
        label: p.title,
        hint: p.kind,
        keys: `${p.slug} ${p.stack.join(" ")}`,
        run: () => go(`/projects/${p.slug}`, p.title),
      })),
      {
        id: "c-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        keys: "email contact mail",
        copy: true,
        run: copy(profile.email),
      },
      {
        id: "c-pip",
        group: "Actions",
        label: "Copy pip install yamin",
        hint: "Terminal",
        keys: "pip install yamin",
        copy: true,
        run: copy("pip install yamin"),
      },
    ];
    const ext = [
      ["GitHub", profile.github],
      ["LinkedIn", profile.linkedin],
      ["Résumé", profile.resume],
    ] as const;
    for (const [label, href] of ext) {
      if (!href) continue;
      out.push({
        id: `e-${label}`,
        group: "Links",
        label: `Open ${label}`,
        hint: "Opens in a new tab",
        keys: label.toLowerCase(),
        run: () => {
          window.open(href, "_blank", "noopener");
        },
      });
    }
    return out;
  }, [go]);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items;
    return items.filter((i) => {
      const hay = `${i.label} ${i.keys} ${i.group}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    setQ("");
    setIdx(0);
    setFlash(null);
    lenis?.stop();
    const t = setTimeout(() => input.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      lenis?.start();
      returnTo.current?.focus?.();
    };
  }, [open, lenis]);

  useEffect(() => setIdx(0), [q]);

  useEffect(() => {
    list.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  function pick(item: Item | undefined) {
    if (!item) return;
    item.run();
    if (item.copy) {
      setFlash(item.id);
      setTimeout(() => setOpen(false), 650);
    } else {
      setOpen(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[idx]);
    }
  }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="palette"
                    className="fixed inset-0 z-[80]"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    <div
                        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Jump to"
                        className="relative mx-auto mt-[14vh] w-[min(92vw,38rem)] border border-ink/70 bg-paper"
                        initial={reduce ? false : { y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ duration: 0.25, ease }}
                    >
                        <div className="flex items-center gap-3 border-b border-rule px-4">
                            <span aria-hidden="true" className="font-mono text-accent">
                                ›
                            </span>
                            <input
                                ref={input}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Jump to a section, a project, or an action"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="palette-list"
                                aria-activedescendant={results.length ? `opt-${idx}` : undefined}
                                className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-ink-soft/70"
                            />
                            <kbd className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                                Esc
                            </kbd>
                        </div>

                        <ul
                            id="palette-list"
                            role="listbox"
                            ref={list}
                            data-lenis-prevent
                            className="max-h-[50vh] overflow-y-auto py-2"
                        >
                            {results.length === 0 && (
                                <li className="px-4 py-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                                    Nothing matches
                                </li>
                            )}
                            {results.map((it, i) => (
                                <li key={it.id} role="presentation">
                                    {(i === 0 || results[i - 1].group !== it.group) && (
                                        <p className="px-4 pb-1 pt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                                            {it.group}
                                        </p>
                                    )}
                                    <div
                                        id={`opt-${i}`}
                                        role="option"
                                        aria-selected={i === idx}
                                        data-active={i === idx}
                                        onMouseMove={() => setIdx(i)}
                                        onClick={() => pick(it)}
                                        className={`flex cursor-pointer items-baseline justify-between gap-4 border-l-2 px-4 py-2.5 ${i === idx
                                                ? "border-accent bg-paper-deep/60"
                                                : "border-transparent"
                                            }`}
                                    >
                                        <span className="text-[15px]">{it.label}</span>
                                        <span
                                            className={`truncate font-mono text-[10px] uppercase tracking-[0.14em] ${flash === it.id ? "text-accent" : "text-ink-soft"
                                                }`}
                                        >
                                            {flash === it.id ? "Copied" : it.hint}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <p className="border-t border-rule px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                            ↑↓ move · Enter select · Esc close
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
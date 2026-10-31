"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import Logo from "@/components/ui/Logo";
import TLink from "@/components/ui/TLink";
import { usePageTransition } from "@/components/ui/PageTransition";
import { useActiveSection } from "../hooks/useActiveSection";
import { ease } from "@/lib/motion";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { contributions } from "@/content/contributions";


type Item =
  | { kind: "page"; label: string; hint: string; href: string }
  | { kind: "section"; label: string; hint: string; id: string; num?: string }
  | { kind: "external"; label: string; hint: string; href: string; download?: string }
  | { kind: "copy"; label: string; hint: string; text: string };

type Group = {
  id: string;
  label: string;
  section: string; // the section the trigger itself jumps to
  cta: string;
  blurb: string;
  ids: string[]; // sections that count as "inside" this group
  items: Item[];
  href?: string;
};

const prCount = contributions.reduce((n, c) => n + c.prs.length, 0);

const baseGroups: Group[] = [
  {
    id: "work",
    label: "Work",
    section: "work",
    cta: "See all work ↓",
    blurb: "Two systems I designed, built, and shipped, and everything around them.",
    ids: ["work", "projects", "open-source"],
    items: [
      ...projects.map(
        (p): Item => ({
          kind: "page",
          label: p.title,
          hint: `Case study · ${p.kind}`,
          href: `/projects/${p.slug}`,
        })
      ),
      { kind: "section", id: "projects", label: "All projects", hint: "The full grid", num: "02" },
      { kind: "section", id: "open-source", label: "Open source", hint: `${prCount} merged pull requests`, num: "03" },
    ],
  },
  {
    id: "about",
    label: "About",
    section: "skills",
    cta: "Start with skills ↓",
    blurb: "What I work with, and how I think about the work.",
    ids: ["skills", "about"],
    items: [
      { kind: "section", id: "skills", label: "Skills", hint: "Tools, tied to what I built", num: "04" },
      { kind: "section", id: "about", label: "How I work", hint: "Three principles", num: "05" },
      { kind: "section", id: "education", label: "Education", hint: "Varendra University · BEng, EEE" },
      ...(profile.resume
        ? [{ kind: "external", label: "Résumé", hint: "PDF · opens in a new tab", href: profile.resume } as Item]
        : []),
    ],
  },
  {
    id: "contact",
    label: "Contact",
    section: "contact",
    cta: "Open contact ↓",
    blurb: "Open to full-stack and AI engineering work. Tell me what you're building.",
    ids: ["contact"],
    items: [
      { kind: "copy", label: "Copy email", hint: profile.email, text: profile.email },
      ...(profile.github
        ? [{ kind: "external", label: "GitHub", hint: "Code and open source", href: profile.github } as Item]
        : []),
      ...(profile.linkedin
        ? [{ kind: "external", label: "LinkedIn", hint: "Say hello", href: profile.linkedin } as Item]
        : []),
      ...(profile.resume
        ? [
            {
              kind: "external",
              label: "Download résumé",
              hint: "PDF",
              href: profile.resume,
              download: "Yamin_Hossain_Resume.pdf",
            } as Item,
          ]
        : []),
    ],
  },
];

const sectionIds = ["work", "projects", "open-source", "skills", "about", "contact"];

const rowCls =
  "group flex w-full items-baseline gap-4 border-l-2 border-transparent px-4 py-3 text-left transition-[border-color,background-color] duration-[240ms] hover:border-accent hover:bg-paper-deep/60 focus-visible:border-accent focus-visible:bg-paper-deep/60";

function Row({ item, done }: { item: Item; done: () => void }) {
  const [copied, setCopied] = useState(false);

  const num = item.kind === "section" && item.num ? item.num : "";
  const arrow =
    item.kind === "page"
      ? "→"
      : item.kind === "section"
      ? "↓"
      : item.kind === "external"
      ? "↗"
      : copied
      ? "✓"
      : "Copy";
  const hint = item.kind === "copy" && copied ? "Copied to clipboard" : item.hint;

  const inner = (
    <>
      <span className="w-5 shrink-0 font-mono text-[10px] tracking-[0.16em] text-accent">
        {num}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px]">{item.label}</span>
        <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          {hint}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 font-mono text-[11px] text-ink-soft transition-colors duration-[240ms] group-hover:text-accent"
      >
        {arrow}
      </span>
    </>
  );

  if (item.kind === "copy") {
    return (
      <button
        type="button"
        className={rowCls}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(item.text);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
              done();
            }, 900);
          } catch {
            /* clipboard blocked: do nothing */
          }
        }}
      >
        {inner}
      </button>
    );
  }

  if (item.kind === "external") {
    return (
      <a
        href={item.href}
        target={item.download ? undefined : "_blank"}
        rel="noreferrer"
        download={item.download}
        onClick={done}
        className={rowCls}
      >
        {inner}
      </a>
    );
  }

  if (item.kind === "page") {
    return (
      <TLink href={item.href} label={item.label} onClick={done} className={rowCls}>
        {inner}
      </TLink>
    );
  }

  return (
    <TLink href={`/#${item.id}`} label="Home" onClick={done} className={rowCls}>
      {inner}
    </TLink>
  );
}

function Status() {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
      <span className="h-2 w-2 rounded-full bg-accent" />
      Open to work
    </span>
  );
}

export type WritingLink = { slug: string; title: string; type: "post" | "research" };

export default function Navbar({ writing = [] }: { writing?: WritingLink[] }) {
  const pathname = usePathname();
  const home = pathname === "/";
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const { go } = usePageTransition();
  const active = useActiveSection(sectionIds);

  const groups = useMemo<Group[]>(() => {
    if (!writing.length) return baseGroups;
    const writingGroup: Group = {
      id: "writing",
      label: "Writing",
      section: "writing",
      href: "/writing",
      cta: "All writing →",
      blurb: "Notes and research, written down so others can learn from them.",
      ids: [],
      items: [
        ...writing.map(
          (w): Item => ({
            kind: "page",
            label: w.title,
            hint: w.type === "research" ? "Research" : "Post",
            href: `/writing/${w.slug}`,
          })
        ),
        { kind: "page", label: "All writing", hint: "Posts and research", href: "/writing" },
        { kind: "external", label: "RSS feed", hint: "Subscribe", href: "/feed.xml" },
      ],
    };
    return [baseGroups[0], baseGroups[1], writingGroup, baseGroups[2]];
  }, [writing]);

  const [open, setOpen] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [mac, setMac] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointer = useRef("");

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const show = (id: string, delay: number) => {
    clear();
    timer.current = setTimeout(() => setOpen(id), delay);
  };
  const hide = (delay = 180) => {
    clear();
    timer.current = setTimeout(() => setOpen(null), delay);
  };
  const away = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") hide(120);
  };
  const closeAll = () => {
    clear();
    setOpen(null);
    setMenu(false);
  };

  useEffect(() => clear, []);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  // a page change always closes everything
  useEffect(() => {
    setOpen(null);
    setMenu(false);
  }, [pathname]);

  // a tap or click outside the header closes everything
  useEffect(() => {
    if (!open && !menu) return;
    const down = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setOpen(null);
        setMenu(false);
      }
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open, menu]);

  // the phone menu locks page scroll
  useEffect(() => {
    if (!menu) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [menu, lenis]);

  // resizing across the breakpoint resets the menus
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => {
      if (mq.matches) setMenu(false);
      else setOpen(null);
    };
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Escape") return;
    if (open) {
      const id = open;
      setOpen(null);
      document.getElementById(`nav-${id}`)?.focus();
    } else if (menu) {
      setMenu(false);
    }
  }

  function onBlur(e: React.FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && !headerRef.current?.contains(next)) setOpen(null);
  }

  const current = (g: Group) =>
    g.id === "writing"
      ? pathname.startsWith("/writing")
      : home
      ? !!active && g.ids.includes(active)
      : g.id === "work" && pathname.startsWith("/projects/");

  const group = groups.find((g) => g.id === open);

  return (
    <header
      ref={headerRef}
      onPointerEnter={clear}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") hide();
      }}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className="sticky top-0 z-50 border-b border-rule/80 bg-paper/75 backdrop-blur-sm"
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 sm:px-8"
      >
        <div onPointerEnter={away} className="shrink-0">
          <Logo />
        </div>

        {/* desktop: triggers, one shared panel */}
        <div className="hidden items-center gap-7 lg:flex">
          {groups.map((g) => {
            const on = open === g.id || current(g);
            return (
              <button
                key={g.id}
                id={`nav-${g.id}`}
                type="button"
                aria-expanded={open === g.id}
                aria-controls="nav-panel"
                aria-haspopup="true"
                onPointerDown={(e) => {
                  pointer.current = e.pointerType;
                }}
                onKeyDown={() => {
                  pointer.current = "";
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") show(g.id, open ? 0 : 90);
                }}
                onClick={() => {
                  if (pointer.current === "mouse") {
                    clear();
                    setOpen(null);
                    go(g.href ?? `/#${g.section}`, g.href ? "Writing" : "Home");
                    return;
                  }
                  setOpen((o) => (o === g.id ? null : g.id));
                }}
                className={`relative whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-[240ms] hover:text-ink ${
                  on ? "text-ink" : "text-ink-soft"
                }`}
              >
                {g.label}
                <span
                  aria-hidden="true"
                  className={`ml-1.5 inline-block text-accent transition-transform duration-[240ms] ${
                    open === g.id ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
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
                    animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.4, ease }}
                  />
                </svg>
              </button>
            );
          })}

          <AnimatePresence>
            {group && (
              <motion.div
                key="panel"
                id="nav-panel"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="absolute inset-x-0 top-full"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100dvh-4rem)] bg-ink/10"
                />
                <div className="relative border-b border-ink/60 bg-paper">
                  <motion.div
                    key={group.id}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="mx-auto grid max-w-6xl grid-cols-12 gap-10 px-8 py-9"
                  >
                    <div className="col-span-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        {group.label}
                      </p>
                      <p className="mt-3 max-w-xs font-display text-2xl leading-snug">
                        {group.blurb}
                      </p>
                      <TLink
                        href={group.href ?? `/#${group.section}`}
                        label={group.href ? "Writing" : "Home"}
                        onClick={closeAll}
                        className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
                      >
                        {group.cta}
                      </TLink>
                    </div>

                    <ul className="col-span-8 grid grid-cols-2 gap-x-6 gap-y-1 self-start">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <Row item={item} done={closeAll} />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* actions */}
        <div onPointerEnter={away} className="flex shrink-0 items-center gap-3">
          {profile.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="hidden whitespace-nowrap border border-ink/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent lg:inline-block"
            >
              Résumé
            </a>
          )}

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            aria-label="Open the jump menu"
            className="hidden items-center gap-2 whitespace-nowrap border border-rule px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft transition-colors duration-[240ms] hover:border-accent hover:text-accent lg:flex"
          >
            Jump
            <kbd className="whitespace-nowrap text-accent">{mac ? "⌘K" : "Ctrl K"}</kbd>
          </button>

          <div className="hidden xl:block">
            <Status />
          </div>

          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="nav-menu"
            className="flex items-center gap-2.5 whitespace-nowrap border border-ink/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent lg:hidden"
          >
            {menu ? "Close" : "Menu"}
            <span aria-hidden="true" className="relative block h-[10px] w-4">
              <span
                className={`absolute left-0 right-0 block h-px bg-current transition-all duration-[240ms] ${
                  menu ? "top-[5px] rotate-45" : "top-[1px]"
                }`}
              />
              <span
                className={`absolute left-0 right-0 block h-px bg-current transition-all duration-[240ms] ${
                  menu ? "top-[5px] -rotate-45" : "top-[9px]"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* phone and tablet: everything, in one list */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key="menu"
            id="nav-menu"
            data-lenis-prevent
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-ink/60 bg-paper lg:hidden"
          >
            <div className="mx-auto max-w-6xl px-6 pb-8 pt-2 sm:px-8">
              {groups.map((g) => (
                <div key={g.id} className="border-b border-rule py-5">
                  <TLink
                    href={g.href ?? `/#${g.section}`}
                    label={g.href ? "Writing" : "Home"}
                    onClick={closeAll}
                    className="font-display text-3xl tracking-tight"
                  >
                    {g.label}
                  </TLink>
                  <ul className="mt-2">
                    {g.items.map((item) => (
                      <li key={item.label}>
                        <Row item={item} done={closeAll} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-5">
                <Status />
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    window.dispatchEvent(new Event("open-palette"));
                  }}
                  className="whitespace-nowrap border border-ink/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
                >
                  Jump to…
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
"use client";

import { useEffect, useState } from "react";
import CornerFrame from "@/components/ui/CornerFrame";
import IsoGithub from "@/components/diagrams/iso/IsoGithub";
import IsoQueue, { type BlockState } from "@/components/diagrams/iso/IsoQueue";
import IsoWorker from "@/components/diagrams/iso/IsoWorker";
import IsoGraph from "@/components/diagrams/iso/IsoGraph";
import IsoVectors from "@/components/diagrams/iso/IsoVectors";
import IsoReview from "@/components/diagrams/iso/IsoReview";

type Mode = BlockState | "sweep";

const modes: { id: Mode; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "active", label: "Active" },
  { id: "down", label: "Down" },
  { id: "sweep", label: "Sweep" },
];

const blocks = [
  IsoGithub,
  IsoQueue,
  IsoWorker,
  IsoGraph,
  IsoVectors,
  IsoReview,
];

export default function Study() {
  const [mode, setMode] = useState<Mode>("idle");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (mode !== "sweep") return;
    setI(0);
    const t = setInterval(() => setI((v) => (v + 1) % blocks.length), 1600);
    return () => clearInterval(t);
  }, [mode]);

  const stateFor = (k: number): BlockState =>
    mode === "sweep" ? (i === k ? "active" : "idle") : mode;

    return (
        <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Study · Blocks 01–06
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                The full set.
            </h1>

            <div className="mt-8 flex flex-wrap gap-2">
                {modes.map((o) => (
                    <button
                        key={o.id}
                        onClick={() => setMode(o.id)}
                        aria-pressed={mode === o.id}
                        className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] ${mode === o.id
                                ? o.id === "down"
                                    ? "border-alert bg-alert text-paper"
                                    : "border-accent bg-accent text-paper"
                                : "border-ink/70 hover:border-accent hover:text-accent"
                            }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            <CornerFrame className="mt-8 p-4 sm:p-8">
                <div className="grid items-end gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    {blocks.map((Block, k) => (
                        <Block key={k} state={stateFor(k)} />
                    ))}
                </div>
            </CornerFrame>
        </main>
    );
}
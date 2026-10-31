import Reveal from "@/components/ui/Reveal";
import InkLine from "@/components/ui/InkLine";
import CountUp from "@/components/ui/CountUp";
import { stats } from "@/content/stats";

export default function ProofStrip() {
  return (
    <section aria-label="At a glance" className="mx-auto max-w-6xl px-6 sm:px-8">
      <InkLine className="text-ink-soft/50" />
      <Reveal inView>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 lg:grid-cols-4 lg:gap-x-0">
          {stats.map((s, i) => (
            <li
              key={s.label}
              className={i > 0 ? "lg:border-l lg:border-rule lg:pl-8" : ""}
            >
              <p className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {s.label}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-ink-soft">{s.sub}</p>
            </li>
          ))}
        </ul>
      </Reveal>
      <InkLine className="text-ink-soft/50" />
    </section>
  );
}
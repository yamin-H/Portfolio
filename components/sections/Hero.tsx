import Reveal from "@/components/ui/Reveal";
import CopyChip from "@/components/ui/CopyChip";
import InkUnderline from "@/components/ui/InkUnderline";
import NameReveal from "@/components/ui/NameReveal";
import MemoryWall from "@/components/hero/MemoryWall";
import { profile } from "@/content/profile";

export default function Hero() {
    return (
        <section
            id="top"
            className="mx-auto grid max-w-6xl gap-14 px-6 pb-28 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-12"
        >
            <div className="lg:col-span-7">
                <Reveal>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        Fig_000 · Full-stack AI engineer
                    </p>
                </Reveal>

                <div className="mt-6">
                    <NameReveal lines={["Yamin", "Hossain"]} />
                </div>

                <Reveal delay={0.7}>
                    <p className="mt-8 font-display text-3xl leading-snug text-ink-soft sm:text-4xl">
                        I build AI agents that{" "}
                        <InkUnderline delay={1.6}>
                            <em className="text-ink">ship</em>
                        </InkUnderline>
                        .
                    </p>
                </Reveal>

                <Reveal delay={0.8}>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                        A GitHub App that remembers your team&apos;s past review decisions,
                        and a terminal coding agent that works with any model provider.
                        Both in production, both open to inspect.
                    </p>
                </Reveal>

                <Reveal delay={0.9} className="mt-10 flex flex-wrap items-center gap-4">
                    <a
                        href="#work"
                        className="inline-flex items-center gap-2 bg-ink px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors duration-[240ms] hover:bg-accent"
                    >
                        See the work <span aria-hidden="true">→</span>
                    </a>
                    {profile.resume && (
                        <a
                            href={profile.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border border-ink/70 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
                        >
                            Résumé <span aria-hidden="true">↗</span>
                        </a>
                    )}
                    <CopyChip text="pip install yamin" />
                </Reveal>
            </div>

            <Reveal delay={0.5} className="lg:col-span-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Fig_001 · Team memory
                </p>
                <MemoryWall />
            </Reveal>
        </section>
    );
}
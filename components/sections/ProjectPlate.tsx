import Reveal from "@/components/ui/Reveal";
import CornerFrame from "@/components/ui/CornerFrame";
import InkLine from "@/components/ui/InkLine";
import type { Project } from "@/content/projects";

export default function ProjectPlate({
    project,
    flip = false,
    diagram
}: {
  project: Project;
  flip?: boolean;
  diagram?: React.ReactNode;
}) {
  const links = project.links.filter((l) => l.href);

    return (
        <article className="py-16 sm:py-20">
            <InkLine className="mb-14 text-ink-soft/60" />

            <div className="grid gap-12 lg:grid-cols-12">
                <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
                    <Reveal inView>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                            Plate {project.index} · {project.kind}
                        </p>
                        <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                            {project.title}
                        </h3>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                            {project.period}
                        </p>
                    </Reveal>

                    <Reveal inView delay={0.08}>
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
                            {project.summary}
                        </p>

                        <ul className="mt-8 space-y-3">
                            {project.facts.map((f) => (
                                <li key={f} className="flex gap-3 text-[15px] leading-snug">
                                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal inView delay={0.14}>
                        <div className="mt-8 flex flex-wrap gap-2">
                            {project.stack.map((s) => (
                                <span
                                    key={s}
                                    className="border border-rule bg-paper/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                        {links.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                                {links.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
                                    >
                                        {l.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </Reveal>
                </div>

                <Reveal
                    inView
                    delay={0.1}
                    className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}
                >
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                        Fig_0{project.index} · System design
                    </p>
                    <CornerFrame className="p-4 sm:p-6">
                        {diagram ?? (
                            <div className="flex aspect-[4/3] items-center justify-center">
                                <p className="text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-ink-soft/70">
                                    Interactive diagram
                                    <br />
                                    goes here
                                </p>
                            </div>
                        )}
                    </CornerFrame>
                </Reveal>
            </div>
        </article>
    );
}
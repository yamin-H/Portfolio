import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import CornerFrame from "@/components/ui/CornerFrame";
import InkLine from "@/components/ui/InkLine";
import TLink from "@/components/ui/TLink";
import Footer from "@/components/sections/Footer";
import { Facts, StackAndLinks } from "@/components/sections/ProjectPlate";
import { projects } from "@/content/projects";
import { caseStudies } from "@/content/caseStudies";
import PrReviewFlat from "@/components/diagrams/flat/PrReviewFlat";
import YaminFlat from "@/components/diagrams/flat/yamin/YaminFlat";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();

  const project = projects[i];
  const study = caseStudies[slug];
  const next = projects.length > 1 ? projects[(i + 1) % projects.length] : null;
  const diagram =
    slug === "pr-review-agent" ? (
      <PrReviewFlat />
    ) : slug === "yamin" ? (
      <YaminFlat />
    ) : null;

    return (
        <>
            <main id="main" className="mx-auto max-w-6xl px-6 pb-12 pt-12 sm:px-8 sm:pt-16">
                <TLink
                    href="/#work"
                    label="Home"
                    className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-[240ms] hover:text-accent"
                >
                    ← All work
                </TLink>

                <Reveal className="mt-10">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        Plate {project.index} · {project.kind}
                    </p>
                    <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
                        {project.title}
                    </h1>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                        {project.period}
                    </p>
                    <p className="mt-8 max-w-2xl text-xl leading-relaxed text-ink-soft">
                        {project.summary}
                    </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-12 grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <Facts facts={project.facts} />
                    </div>
                    <div className="lg:col-span-5">
                        <StackAndLinks project={project} />
                    </div>
                </Reveal>

                {diagram && (
                    <Reveal inView className="mt-16">
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                            Fig_0{project.index} · System design · Interactive
                        </p>
                        <CornerFrame className="p-4 sm:p-8">{diagram}</CornerFrame>
                    </Reveal>
                )}

                {study && (
                    <>
                        <section className="mt-24">
                            <InkLine className="text-ink-soft/50" />
                            <div className="grid gap-8 py-12 lg:grid-cols-12">
                                <Reveal inView className="lg:col-span-4">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                                        The problem
                                    </p>
                                </Reveal>
                                <Reveal inView delay={0.06} className="space-y-5 lg:col-span-8">
                                    {study.problem.map((t) => (
                                        <p key={t} className="text-lg leading-relaxed text-ink-soft">
                                            {t}
                                        </p>
                                    ))}
                                </Reveal>
                            </div>
                        </section>

                        <section>
                            <InkLine className="text-ink-soft/50" />
                            <div className="grid gap-8 pt-12 lg:grid-cols-12">
                                <Reveal inView className="lg:col-span-4">
                                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                                        Decisions
                                    </p>
                                    <p className="mt-3 max-w-xs text-ink-soft">
                                        The choices that shaped it, and why.
                                    </p>
                                </Reveal>
                                <ol className="lg:col-span-8">
                                    {study.decisions.map((d, k) => (
                                        <Reveal key={d.title} inView delay={0.04}>
                                            <li className="border-t border-rule py-8 first:border-t-0 first:pt-0">
                                                <p className="font-mono text-[11px] tracking-[0.16em] text-accent">
                                                    0{k + 1}
                                                </p>
                                                <h3 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                                                    {d.title}
                                                </h3>
                                                <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                                                    {d.body}
                                                </p>
                                            </li>
                                        </Reveal>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        {study.lessons && study.lessons.length > 0 && (
                            <section className="mt-12">
                                <InkLine className="text-ink-soft/50" />
                                <div className="grid gap-8 py-12 lg:grid-cols-12">
                                    <Reveal inView className="lg:col-span-4">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                                            What I&apos;d change
                                        </p>
                                    </Reveal>
                                    <ul className="space-y-4 lg:col-span-8">
                                        {study.lessons.map((t) => (
                                            <li key={t} className="flex gap-3 leading-relaxed text-ink-soft">
                                                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-accent" />
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}
                    </>
                )}

                {next && (
                    <Reveal inView className="mt-20">
                        <TLink
                            href={`/projects/${next.slug}`}
                            label={next.title}
                            className="group block border border-ink/60 bg-paper/60 p-6 transition-colors duration-[240ms] hover:border-accent sm:p-10"
                        >
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                                Next plate · {next.index}
                            </p>
                            <p className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
                                {next.title}{" "}
                                <span className="inline-block transition-transform duration-[240ms] group-hover:translate-x-1">
                                    →
                                </span>
                            </p>
                            <p className="mt-4 max-w-xl text-ink-soft">{next.summary}</p>
                        </TLink>
                    </Reveal>
                )}
            </main>
            <Footer />
        </>
    );
}
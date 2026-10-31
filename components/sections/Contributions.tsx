import Reveal from "@/components/ui/Reveal";
import InkLine from "@/components/ui/InkLine";
import { contributions } from "@/content/contributions";

const totalPRs = contributions.reduce((n, c) => n + c.prs.length, 0);

function Cell({
  label,
  children,
  span = false,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={`bg-paper px-4 py-3 ${span ? "col-span-2" : ""}`}>
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 leading-snug">{children}</dd>
    </div>
  );
}

export default function Contributions() {
    return (
        <section id="open-source" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    03 · Open source
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    Fixes merged into other people&apos;s projects.
                </h2>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                    {totalPRs} merged pull requests · {contributions.length} repositories
                </p>
            </Reveal>

            <div className="mt-12">
                {contributions.map((c) => (
                    <div key={c.repo}>
                        <InkLine className="text-ink-soft/50" />
                        <div className="grid gap-8 py-10 lg:grid-cols-12">
                            <Reveal inView className="lg:col-span-4">
                                <h3 className="font-display text-3xl tracking-tight">
                                    {c.repo}
                                </h3>
                                <p className="mt-1 text-ink-soft">{c.what}</p>
                                {c.stars && (
                                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                                        {c.stars}
                                    </p>
                                )}
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {c.tech.map((t) => (
                                        <span
                                            key={t}
                                            className="border border-rule px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </Reveal>

                            <div className="lg:col-span-8">
                                {c.prs.map((pr, i) => (
                                    <Reveal key={pr.number} inView delay={0.05 * i}>
                                        <article className="border-t border-rule py-6 first:border-t-0 first:pt-0">
                                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                                                <h4 className="font-display text-xl tracking-tight sm:text-2xl">
                                                    {pr.title}
                                                </h4>
                                                <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                                                    <span className="border border-accent px-1.5 py-0.5 text-accent">
                                                        Merged
                                                    </span>
                                                    {pr.href ? (
                                                        <a
                                                            href={pr.href}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            aria-label={`Open ${c.repo} pull request ${pr.number} on GitHub`}
                                                            className="text-accent underline-offset-4 hover:underline"
                                                        >
                                                            #{pr.number} ↗
                                                        </a>
                                                    ) : (
                                                        <span className="text-ink-soft">#{pr.number}</span>
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
                                                {pr.summary}
                                            </p>
                                        </article>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <InkLine className="text-ink-soft/50" />
            </div>

            {/* education, set as a drawing title block */}
            <div id="education">
                <Reveal inView className="mt-16 grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                            Education
                        </p>
                    </div>
                    <dl className="grid grid-cols-2 gap-px border border-ink/60 bg-ink/40 lg:col-span-8">
                        <Cell label="Degree" span>
                            Bachelor of Engineering, Electrical and Electronic Engineering
                        </Cell>
                        <Cell label="University">Varendra University</Cell>
                        <Cell label="Period">Oct 2022 – Jul 2026</Cell>
                    </dl>
                </Reveal>
            </div>
        </section>
    );
}
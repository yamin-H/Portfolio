import Reveal from "@/components/ui/Reveal";
import TLink from "@/components/ui/TLink";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export default function LatestWriting() {
  const posts = getAllPosts().slice(0, 3);
  if (!posts.length) return null;

    return (
        <section id="writing" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Writing
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    Notes and research.
                </h2>
            </Reveal>

            <ul className="mt-12 grid gap-6 md:grid-cols-3">
                {posts.map((p, i) => (
                    <li key={p.slug}>
                        <Reveal inView delay={0.06 * i} className="h-full">
                            <TLink
                                href={`/writing/${p.slug}`}
                                label="Writing"
                                className="group flex h-full flex-col border border-ink/60 bg-paper/60 p-5 transition-[transform,border-color] duration-[240ms] hover:-translate-y-0.5 hover:border-accent"
                            >
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
                                    <span className="text-accent">
                                        {p.type === "research" ? "Research" : "Post"}
                                    </span>
                                    <span className="text-ink-soft"> · {formatDate(p.date)}</span>
                                </p>
                                <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight">
                                    {p.title}
                                </h3>
                                <p className="mt-3 leading-relaxed text-ink-soft">{p.summary}</p>
                                <p className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                                    {p.minutes} min read →
                                </p>
                            </TLink>
                        </Reveal>
                    </li>
                ))}
            </ul>

            <Reveal inView className="mt-10">
                <TLink
                    href="/writing"
                    label="Writing"
                    className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
                >
                    All writing →
                </TLink>
            </Reveal>
        </section>
    );
}
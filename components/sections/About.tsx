import Reveal from "@/components/ui/Reveal";
import InkLine from "@/components/ui/InkLine";
import Note from "@/components/ui/Note";
import {
  RetryArt,
  ProvidersArt,
  KeysArt,
} from "@/components/about/PrincipleArt";

const principles = [
  {
    title: "Reliability over demos",
    body: "Webhooks answer instantly, queues retry, failures roll back, and every step is logged so incidents can be traced.",
    Art: RetryArt,
    note: "exponential backoff, rollback and structured logging",
  },
  {
    title: "No lock-in",
    body: "Yamin works with Groq, OpenAI, Gemini, Claude, Hugging Face, or any OpenAI-compatible endpoint. Switching providers shouldn't mean rewriting the tool.",
    Art: ProvidersArt,
    note: "Ollama counts too, so it can run fully local",
  },
  {
    title: "Your keys, your machine",
    body: "API keys stay local. A tool that touches your code should earn trust by design, not by promise.",
    Art: KeysArt,
    note: "and it asks before it edits or runs anything",
  },
];

export default function About() {
    return (
        <section id="about" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    About
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    I care about what happens when things go wrong.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                    I&apos;m a full-stack engineer who builds AI systems end to end: the
                    model pipeline, the queue that feeds it, and the interface people
                    actually use. Less interested in a demo that works once, more in what
                    happens when the model is slow, the queue is down, or the input is
                    messy.
                </p>
            </Reveal>

            <ul className="mt-14">
                {principles.map((p, i) => {
                    const Art = p.Art;
                    return (
                        <li key={p.title}>
                            <InkLine className="text-ink-soft/50" />
                            <div className="grid items-center gap-10 py-12 lg:grid-cols-12">
                                <Reveal
                                    inView
                                    className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}
                                >
                                    <p className="font-mono text-[11px] tracking-[0.16em] text-accent">
                                        0{i + 1}
                                    </p>
                                    <h3 className="mt-3 font-display text-3xl tracking-tight">
                                        {p.title}
                                    </h3>
                                    <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
                                        {p.body}
                                    </p>
                                </Reveal>

                                <Reveal
                                    inView
                                    delay={0.08}
                                    className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}
                                >
                                    <div className="border border-rule bg-paper/50 p-4 sm:p-6">
                                        <Art />
                                    </div>
                                    <Note className="mt-4">{p.note}</Note>
                                </Reveal>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
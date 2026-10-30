import Reveal from "@/components/ui/Reveal";

const principles = [
  {
    title: "Reliability over demos",
    body: "Webhooks answer instantly, queues retry with backoff, failures roll back, and every step is logged so incidents can be traced.",
  },
  {
    title: "No lock-in",
    body: "Yamin works with Groq, OpenAI, Gemini, Claude, Hugging Face, or any OpenAI-compatible endpoint. Switching providers shouldn't mean rewriting the tool.",
  },
  {
    title: "Your keys, your machine",
    body: "API keys stay local. A tool that touches your code should earn trust by design, not by promise.",
  },
];

export default function About() {
    return (
        <section id="about" className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
                <Reveal inView className="lg:col-span-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        03 · About
                    </p>
                    <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                        I care about what happens when things go wrong.
                    </h2>
                </Reveal>

                <div className="lg:col-span-7">
                    <Reveal inView delay={0.08}>
                        <p className="text-lg leading-relaxed text-ink-soft">
                            I&apos;m a full-stack engineer who builds AI systems end to end:
                            the model pipeline, the queue that feeds it, and the interface
                            people actually use. Less interested in a demo that works once,
                            more in what happens when the model is slow, the queue is down,
                            or the input is messy.
                        </p>
                    </Reveal>

                    <ul className="mt-10 divide-y divide-rule border-y border-rule">
                        {principles.map((p, i) => (
                            <Reveal key={p.title} inView delay={0.06 * i}>
                                <li className="grid gap-2 py-6 sm:grid-cols-[2.5rem_1fr]">
                                    <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
                                        0{i + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-display text-xl">{p.title}</h3>
                                        <p className="mt-1.5 leading-relaxed text-ink-soft">
                                            {p.body}
                                        </p>
                                    </div>
                                </li>
                            </Reveal>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
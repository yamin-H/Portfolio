import Reveal from "@/components/ui/Reveal";
import ProjectPlate from "@/components/sections/ProjectPlate";
import { projects } from "@/content/projects";
import PrReviewFlat from "@/components/diagrams/flat/PrReviewFlat";
import YaminFlat from "@/components/diagrams/flat/yamin/YaminFlat";

const diagrams: Record<string, React.ReactNode> = {
    "pr-review-agent": <PrReviewFlat />,
    yamin: <YaminFlat />,
};

export default function Projects() {
    return (
        <section id="work" className="mx-auto max-w-6xl px-6 pb-12 sm:px-8 pt-20">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                   Work
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    Two systems I designed, built, and shipped.
                </h2>
            </Reveal>

            <div className="mt-10">
                {projects.map((p, i) => (
                    <ProjectPlate
                        key={p.slug}
                        project={p}
                        flip={i % 2 === 1}
                        diagram={diagrams[p.slug]}
                    />
                ))}
            </div>
        </section>
    );
}
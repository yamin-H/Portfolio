import Reveal from "@/components/ui/Reveal";
import ProjectPlate from "@/components/sections/ProjectPlate";
import PrReviewFlat from "@/components/diagrams/flat/PrReviewFlat";
import YaminFlat from "@/components/diagrams/flat/yamin/YaminFlat";
import { projects } from "@/content/projects";

const diagrams: Record<string, React.ReactNode> = {
  "pr-review-agent": <PrReviewFlat />,
  yamin: <YaminFlat />,
};

export default function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 pb-12 pt-20 sm:px-8">
      <Reveal inView>
        <p className="sec-eyebrow font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Work
        </p>
        <h2 className="mt-4 max-w-2xl font-display t-h2">
          Three projects, in depth.
        </h2>
      </Reveal>

      <div className="mt-10">
        {projects.map((p) => (
          <ProjectPlate
            key={p.slug}
            project={p}
            diagram={diagrams[p.slug]}
          />
        ))}
      </div>
    </section>
  );
}
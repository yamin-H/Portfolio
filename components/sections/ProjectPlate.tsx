import Reveal from "@/components/ui/Reveal";
import CornerFrame from "@/components/ui/CornerFrame";
import InkLine from "@/components/ui/InkLine";
import TLink from "@/components/ui/TLink";
import type { Project } from "@/content/projects";

function Heading({ project }: { project: Project }) {
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Plate {project.index} · {project.kind}
      </p>
      <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
        {project.title}
      </h3>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {project.period}
      </p>
    </>
  );
}

export function Facts({ facts }: { facts: string[] }) {
  return (
    <ul className="space-y-3">
      {facts.map((f) => (
        <li key={f} className="flex gap-3 text-[15px] leading-snug">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent" />
          {f}
        </li>
      ))}
    </ul>
  );
}

export function StackAndLinks({ project }: { project: Project }) {
  const links = project.links.filter((l) => l.href);
  return (
    <>
      <div className="flex flex-wrap gap-2">
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
    </>
  );
}

function CaseLink({ project }: { project: Project }) {
  return (
    <TLink
      href={`/projects/${project.slug}`}
      label={project.title}
      className="press mt-8 inline-flex items-center gap-2 border border-ink/70 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] hover:border-accent hover:text-accent"
    >
      Read the case study <span aria-hidden="true">→</span>
    </TLink>
  );
}

export default function ProjectPlate({
  project,
  diagram,
}: {
  project: Project;
  diagram?: React.ReactNode;
}) {
  return (
    <article className="py-16 sm:py-20">
      <InkLine className="mb-14 text-ink-soft/60" />

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal inView>
            <Heading project={project} />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              {project.summary}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal inView delay={0.08}>
            <Facts facts={project.facts} />
            <div className="mt-8">
              <StackAndLinks project={project} />
              <CaseLink project={project} />
            </div>
          </Reveal>
        </div>
      </div>

      {diagram && (
        <Reveal inView delay={0.1} className="mt-14">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Fig_0{project.index} · System design · Interactive
          </p>
          <CornerFrame className="p-4 sm:p-8">{diagram}</CornerFrame>
        </Reveal>
      )}
    </article>
  );
}
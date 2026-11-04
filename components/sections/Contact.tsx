import Reveal from "@/components/ui/Reveal";
import EmailChip from "@/components/ui/EmailChip";
import InkUnderline from "@/components/ui/InkUnderline";
import Note from "@/components/ui/Note";
import { profile } from "@/content/profile";
import TLink from "@/components/ui/TLink";
import Magnetic from "@/components/ui/Magnetic";

export default function Contact() {
  const links = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
  ].filter((l) => l.href);

  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-6 pb-28 pt-24 sm:px-8"
    >
      <Reveal inView>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Contact
        </p>
        <h2 className="mt-4 max-w-4xl font-display text-5xl leading-[1.03] tracking-tight sm:text-7xl">
          Let&apos;s build something that{" "}
          <InkUnderline inView delay={0.3}>
            <em>ships</em>
          </InkUnderline>
          .
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
          Open to full-stack and AI engineering work. Tell me what you&apos;re
          building.
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          {profile.location} · {profile.utc} · {profile.availability}
        </p>
      </Reveal>

      <Reveal inView delay={0.1} className="mt-12">
        <EmailChip email={profile.email} />
        <Note className="mt-5">the fastest way to reach me</Note>
      </Reveal>

      {profile.resume && (
        <Reveal inView delay={0.12} className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <TLink
              href="/resume"
              label="Résumé"
              className="press inline-flex items-center gap-2 bg-ink px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper hover:bg-accent"
            >
              View résumé <span aria-hidden="true">→</span>
            </TLink>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resume}
              download="Yamin_Hossain_Resume.pdf"
              className="press inline-flex items-center gap-2 border border-ink/70 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] hover:border-accent hover:text-accent"
            >
              Download PDF <span aria-hidden="true">↓</span>
            </a>
          </Magnetic>
        </Reveal>
      )}

      {links.length > 0 && (
        <Reveal
          inView
          delay={0.14}
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
        >
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
        </Reveal>
      )}

      <Reveal inView delay={0.18} className="mt-16">
        <p className="text-ink-soft">
          —{" "}
          <InkUnderline inView delay={0.4}>
            <span className="font-display text-4xl italic text-ink">Yamin</span>
          </InkUnderline>
        </p>
      </Reveal>
    </section>
  );
}
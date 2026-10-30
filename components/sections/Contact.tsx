import Reveal from "@/components/ui/Reveal";
import CopyChip from "@/components/ui/CopyChip";
import InkUnderline from "@/components/ui/InkUnderline";
import { profile } from "@/content/profile";

export default function Contact() {
  const links = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "Resume", href: profile.resume },
  ].filter((l) => l.href);

    return (
        <section id="contact" className="mx-auto max-w-6xl px-6 pb-28 pt-24 sm:px-8">
            <Reveal inView>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    04 · Contact
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                    Let&apos;s build something that{" "}
                    <InkUnderline delay={0.3}>
                        <em>ships</em>
                    </InkUnderline>
                    .
                </h2>
            </Reveal>

            <Reveal inView delay={0.1} className="mt-10 flex flex-wrap items-center gap-6">
                <CopyChip text={profile.email} prompt="" />
                <div className="flex flex-wrap gap-x-6 gap-y-2">
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
            </Reveal>
        </section>
    );
}
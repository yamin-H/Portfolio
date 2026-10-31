import type { Metadata } from "next";
import TLink from "@/components/ui/TLink";
import Footer from "@/components/sections/Footer";
import PrintButton from "@/components/resume/PrintButton";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { contributions } from "@/content/contributions";
import { resume } from "@/content/resume";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Résumé of Yamin Hossain, full-stack AI engineer.",
};

const strip = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const prHref = (n: number) =>
  contributions.flatMap((c) => c.prs).find((p) => p.number === n)?.href ?? "";

const h2 =
  "border-b border-ink/60 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent";
const list =
  "mt-3 space-y-2 text-[15px] leading-relaxed [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.65em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:bg-accent [&>li]:before:content-['']";
const tech = "mt-3 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-ink-soft";
const link =
  "text-accent underline-offset-4 hover:underline";

export default function ResumePage() {
  const contact: { label: string; href?: string }[] = [
    { label: profile.location },
    { label: profile.email, href: `mailto:${profile.email}` },
    ...(profile.linkedin ? [{ label: strip(profile.linkedin), href: profile.linkedin }] : []),
    ...(profile.github ? [{ label: strip(profile.github), href: profile.github }] : []),
  ];

    return (
        <>
            <main id="main" className="mx-auto max-w-4xl px-6 pb-12 pt-12 sm:px-8 sm:pt-16 print:p-0">
                <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
                    <TLink
                        href="/"
                        label="Home"
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-[240ms] hover:text-accent"
                    >
                        ← Home
                    </TLink>
                    <div className="flex flex-wrap gap-3">
                        <PrintButton />
                        {profile.resume && (
                            <a
                                href={profile.resume}
                                download="Yamin_Hossain_Resume.pdf"
                                className="bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors duration-[240ms] hover:bg-accent"
                            >
                                Download PDF ↓
                            </a>
                        )}
                    </div>
                </div>

                <article className="mt-8 border border-ink/60 bg-paper/70 p-6 sm:p-12 print:mt-0 print:border-0 print:bg-transparent print:p-0">
                    <h1 className="font-display text-5xl tracking-tight sm:text-6xl print:text-5xl">
                        Yamin Hossain<span className="text-accent">.</span>
                    </h1>
                    <p className="mt-2 font-display text-xl italic text-ink-soft">
                        {resume.headline}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.06em]">
                        {contact.map((c) => (
                            <li key={c.label}>
                                {c.href ? (
                                    <a href={c.href} className={link}>
                                        {c.label}
                                    </a>
                                ) : (
                                    c.label
                                )}
                            </li>
                        ))}
                    </ul>

                    <section className="mt-10">
                        <h2 className={h2}>Summary</h2>
                        <p className="mt-4 leading-relaxed">{resume.summary}</p>
                    </section>

                    <section className="mt-10 break-inside-avoid">
                        <h2 className={h2}>Skills</h2>
                        <ul className="mt-4 space-y-2">
                            {resume.skills.map((s) => (
                                <li key={s.label} className="grid gap-x-4 sm:grid-cols-[8.5rem_1fr]">
                                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                                        {s.label}
                                    </span>
                                    <span className="text-[15px]">{s.items.join(" · ")}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="mt-10">
                        <h2 className={h2}>Projects</h2>
                        <div className="mt-6 space-y-8">
                            {resume.projects.map((p) => {
                                const ext =
                                    projects.find((x) => x.slug === p.slug)?.links.filter((l) => l.href) ?? [];
                                return (
                                    <div key={p.slug} className="break-inside-avoid">
                                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                            <h3 className="font-display text-2xl tracking-tight">
                                                {p.title}{" "}
                                                <span className="text-lg italic text-ink-soft">{p.kind}</span>
                                            </h3>
                                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                                                {p.period}
                                            </p>
                                        </div>
                                        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.04em]">
                                            {p.note && <span className="text-ink-soft">{p.note}</span>}
                                            {ext.map((l) => (
                                                <a key={l.label} href={l.href} className={link}>
                                                    {l.label}
                                                </a>
                                            ))}
                                            <TLink href={`/projects/${p.slug}`} label={p.title} className={link}>
                                                Case study
                                            </TLink>
                                        </p>
                                        <ul className={list}>
                                            {p.bullets.map((b) => (
                                                <li key={b}>{b}</li>
                                            ))}
                                        </ul>
                                        <p className={tech}>
                                            <span className="text-ink">Tech: </span>
                                            {p.tech}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-10">
                        <h2 className={h2}>Open-source contributions</h2>
                        <ul className={list}>
                            {resume.contributions.map((c) => {
                                const href = prHref(c.pr);
                                return (
                                    <li key={c.pr} className="break-inside-avoid">
                                        <span className="font-medium">{c.repo}</span>
                                        <span className="text-ink-soft"> · </span>
                                        {href ? (
                                            <a href={href} className={link}>
                                                PR #{c.pr}
                                            </a>
                                        ) : (
                                            <span>PR #{c.pr}</span>
                                        )}
                                        <span className="text-ink-soft"> · merged · </span>
                                        {c.text}
                                    </li>
                                );
                            })}
                        </ul>
                        <p className={tech}>
                            <span className="text-ink">Tech: </span>
                            {resume.contributionTech}
                        </p>
                    </section>

                    <section className="mt-10 break-inside-avoid">
                        <h2 className={h2}>Education</h2>
                        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                            <p className="font-display text-xl">{resume.education.school}</p>
                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                                {resume.education.period}
                            </p>
                        </div>
                        <p className="mt-1 text-[15px]">{resume.education.degree}</p>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
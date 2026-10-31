import InkLine from "@/components/ui/InkLine";
import Logo from "@/components/ui/Logo";
import { profile } from "@/content/profile";
import TLink from "@/components/ui/TLink";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  { label: "Writing", href: "/writing" },
];

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
    <div className={`bg-paper px-3 py-2.5 ${span ? "col-span-2" : ""}`}>
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-snug">{children}</dd>
    </div>
  );
}

export default function Footer() {
  const social = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
      { label: "Email", href: `mailto:${profile.email}` },
    { label: "Résumé", href: profile.resume },
  ].filter((l) => l.href);

    return (
        <footer className="mx-auto max-w-6xl px-6 pb-14 sm:px-8">
            <InkLine className="text-ink-soft/60" />

            <div className="mt-12 grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-6">
                    <Logo />
                    <p className="mt-5 max-w-sm font-display text-2xl leading-snug text-ink-soft">
                        Full-stack AI engineer. I build agents that ship.
                    </p>

                    <div className="mt-8 grid max-w-sm grid-cols-2 gap-x-8 gap-y-2">
                        <ul className="space-y-2">
                            {nav.map((n) => (
                                <li key={n.href}>
                                    <TLink
                                        href={`n.href.startsWith("#") ? /${n.href} : n.href`}
                                        label="Home"
                                        className="font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-[240ms] hover:text-accent"
                                    >
                                        {n.label}
                                    </TLink>
                                </li>
                            ))}
                        </ul>
                        <ul className="space-y-2">
                            {social.map((n) => (
                                <li key={n.label}>
                                    <a
                                        href={n.href}
                                        target={n.href.startsWith("mailto") ? undefined : "_blank"}
                                        rel="noreferrer"
                                        className="font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-[240ms] hover:text-accent"
                                    >
                                        {n.label} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <a
                        href="#top"
                        className="mt-8 inline-block border border-ink/70 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-[240ms] hover:border-accent hover:text-accent"
                    >
                        Back to top ↑
                    </a>
                </div>

                {/* the drawing's title block */}
                <dl className="ml-auto grid w-full max-w-md grid-cols-2 gap-px self-end border border-ink/60 bg-ink/40 lg:col-span-6">
                    <Cell label="Title" span>
                        Portfolio · Full-stack AI engineer
                    </Cell>
                    <Cell label="Drawn by">Yamin Hossain</Cell>
                    <Cell label="Sheet">1 of 1</Cell>
                    <Cell label="Date">2026</Cell>
                    <Cell label="Scale">1 : 1</Cell>
                    <Cell label="Set in" span>
                        Fraunces · Instrument Sans · IBM Plex Mono
                    </Cell>
                    <Cell label="Built with" span>
                        Next.js · Motion · Lenis · WebGL · Vercel
                    </Cell>
                </dl>
            </div>

            <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                © 2026 Yamin Hossain
            </p>
        </footer>
    );
}
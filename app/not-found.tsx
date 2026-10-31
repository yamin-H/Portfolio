import Reveal from "@/components/ui/Reveal";
import InkUnderline from "@/components/ui/InkUnderline";
import TLink from "@/components/ui/TLink";

export default function NotFound() {
    return (
        <main id="main" className="mx-auto max-w-6xl px-6 py-32 sm:px-8">
            <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Fig_404 · Sheet not found
                </p>
                <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.03] tracking-tight sm:text-7xl">
                    This sheet isn&apos;t in the{" "}
                    <InkUnderline delay={0.5}>
                        <em>set</em>
                    </InkUnderline>
                    .
                </h1>
                <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
                    The page you asked for doesn&apos;t exist, or it moved.
                </p>
                <TLink
                    href="/"
                    label="Home"
                    className="mt-10 inline-flex items-center gap-2 bg-ink px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors duration-[240ms] hover:bg-accent"
                >
                    Back to the index <span aria-hidden="true">→</span>
                </TLink>
            </Reveal>
        </main>
    );
}
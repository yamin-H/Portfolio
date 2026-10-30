import InkLine from "@/components/ui/InkLine";

export default function Footer() {
    return (
        <footer className="mx-auto max-w-6xl px-6 pb-12 sm:px-8">
            <InkLine className="text-ink-soft/60" />
            <div className="mt-6 flex flex-col gap-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft sm:flex-row sm:justify-between">
                <p>© 2026 Yamin Hossain</p>
                <p>
                    Colophon · Set in Fraunces, Instrument Sans and IBM Plex Mono · Built
                    with Next.js · Deployed on Vercel
                </p>
            </div>
        </footer>
    );
}
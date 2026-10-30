import CornerFrame from "@/components/ui/CornerFrame";
import PrReviewSystem from "@/components/diagrams/pr-review/PrReviewSystem";

export default function SystemStudy() {
    return (
        <main className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Study · System
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                One pull request, end to end.
            </h1>

            <CornerFrame className="mt-10 p-4 sm:p-8">
                <PrReviewSystem />
            </CornerFrame>
        </main>
    );
}
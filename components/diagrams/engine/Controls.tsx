type Props = {
  step: number;
  total: number;
  playing: boolean;
  broken: boolean;
  breakLabel: string;
  onRun: () => void;
  onNext: () => void;
  onReset: () => void;
  onBreak: () => void;
};

const btn =
  "border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms]";

export default function Controls(p: Props) {
  const runLabel = p.playing
    ? "Pause"
    : p.step >= p.total - 1
    ? "Replay"
    : p.step >= 0
    ? "Resume"
    : "Run";

    return (
        <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
                onClick={p.onRun}
                className={`${btn} border-ink bg-ink text-paper hover:border-accent hover:bg-accent`}
            >
                {runLabel}
            </button>
            <button
                onClick={p.onNext}
                disabled={p.step >= p.total - 1}
                className={`${btn} border-ink/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-ink/70 disabled:hover:text-ink`}
            >
                Step
            </button>
            <button
                onClick={p.onReset}
                className={`${btn} border-ink/70 hover:border-accent hover:text-accent`}
            >
                Reset
            </button>
            <button
                onClick={p.onBreak}
                aria-pressed={p.broken}
                className={`${btn} ${p.broken
                        ? "border-alert text-alert"
                        : "border-ink/70 hover:border-alert hover:text-alert"
                    }`}
            >
                {p.broken ? "Repair" : p.breakLabel}
            </button>

            <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
                {Array.from({ length: p.total }).map((_, i) => (
                    <span
                        key={i}
                        className={`h-1.5 w-1.5 transition-colors duration-[240ms] ${i <= p.step ? "bg-accent" : "bg-rule"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
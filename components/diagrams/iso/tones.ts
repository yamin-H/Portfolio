export type BlockState = "idle" | "active" | "down";

export const tones = {
  idle: {
    edge: "stroke-ink",
    hatch: "stroke-ink/45",
    tint: "fill-transparent",
    pill: "fill-paper stroke-ink",
    pillText: "fill-ink",
    leader: "stroke-ink-soft/60",
  },
  active: {
    edge: "stroke-accent",
    hatch: "stroke-accent/55",
    tint: "fill-accent/15",
    pill: "fill-accent stroke-accent",
    pillText: "fill-paper",
    leader: "stroke-accent",
  },
  down: {
    edge: "stroke-alert",
    hatch: "stroke-alert/55",
    tint: "fill-alert/15",
    pill: "fill-alert stroke-alert",
    pillText: "fill-paper",
    leader: "stroke-alert",
  },
} as const;

export type Tone = (typeof tones)[BlockState];

export const fade = "transition-[stroke,fill] duration-[240ms]";
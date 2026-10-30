export type LayoutKind = "wide" | "tall";

export const TRAVEL = 0.9; // seconds the packet takes per connector
export const DWELL = 2200; // ms resting on each stage
export const DWELL_QUEUE_DOWN = 5200; // long enough for 3 retries and recovery

type Edge = { d: string; arrow: string };
export type Layout = {
  w: number;
  h: number;
  slots: { x: number; y: number }[];
  edges: Edge[];
};

function curve(x1: number, y1: number, x2: number, y2: number, dir: 1 | -1) {
  const k = 32 * dir;
  return {
    d: `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`,
    arrow: `M${x2 - 7 * dir} ${y2 - 4.5} L${x2} ${y2} L${x2 - 7 * dir} ${y2 + 4.5}`,
  };
}

/** Desktop: GitHub, Queue, Worker across the top, then back along the bottom. */
function buildWide(): Layout {
  const P = 290;
  const RP = 260;
  const OX = 110;
  const OY = 225;
  const at = (c: number, r: number) => ({ x: OX + c * P, y: OY + r * RP });
  const s = [at(0, 0), at(1, 0), at(2, 0), at(2, 1), at(1, 1), at(0, 1)];

  // the hook that carries the path from the top row down to the bottom row
  const hx = s[2].x + 138;
  const hy1 = s[2].y - 78;
  const hy2 = s[3].y - 72;

  const edges: Edge[] = [
    curve(s[0].x + 138, s[0].y - 78, s[1].x - 98, s[1].y - 58, 1),
    curve(s[1].x + 138, s[1].y - 78, s[2].x - 98, s[2].y - 58, 1),
    {
      d: `M${hx} ${hy1} C${hx + 80} ${hy1} ${hx + 80} ${hy2} ${hx} ${hy2}`,
      arrow: `M${hx + 7} ${hy2 - 4.5} L${hx} ${hy2} L${hx + 7} ${hy2 + 4.5}`,
    },
    curve(s[3].x - 98, s[3].y - 58, s[4].x + 86, s[4].y - 38, -1),
    curve(s[4].x - 46, s[4].y - 38, s[5].x + 138, s[5].y - 78, -1),
  ];

  return { w: 920, h: 520, slots: s, edges };
}

/** Phone: one column, the packet travels straight down. */
function buildTall(): Layout {
  const RPT = 290;
  const OXT = 110;
  const OYT = 225;
  const cx = OXT + 20; // the pill sits 20 units right of each block origin

  const slots = Array.from({ length: 6 }, (_, r) => ({
    x: OXT,
    y: OYT + r * RPT,
  }));

  const edges: Edge[] = slots.slice(0, -1).map((s, k) => {
    const y1 = s.y + 18;
    const y2 = slots[k + 1].y - 204;
    const m = (y2 - y1) * 0.4;
    return {
      d: `M${cx} ${y1} C${cx + 14} ${y1 + m} ${cx - 14} ${y2 - m} ${cx} ${y2}`,
      arrow: `M${cx - 4.5} ${y2 - 7} L${cx} ${y2} L${cx + 4.5} ${y2 - 7}`,
    };
  });

  return { w: 260, h: OYT + 5 * RPT + 30, slots, edges };
}

export const layouts: Record<LayoutKind, Layout> = {
  wide: buildWide(),
  tall: buildTall(),
};

export const idleCaption =
  "Press Run to follow one pull request through the system.";

export const steps = [
  "A pull request opens. GitHub sends a webhook to the app.",
  "The job goes into a Redis queue, so the webhook answers instantly even when the model is slow.",
  "A FastAPI worker picks the job up and splits the diff into chunks.",
  "A LangGraph pipeline turns each chunk into a 384-dimensional embedding.",
  "pgvector compares each chunk against six months of merged PRs. Here, PR #234 matches at 0.87.",
  "The review is posted inline, citing a real decision: “Your team rejected this pattern in PR #234.”",
];

export const brokenCaption =
  "The queue is down. The webhook still answers instantly, and the job retries with backoff. Nothing is lost.";

export const recoveredCaption =
  "The queue is back. The retry goes through, the job continues, and no event was dropped.";

// when each retry badge appears after the queue lights up (ms)
export const RETRY_AT = [500, 1500, 2900, 3700];
export const BACKOFF = [1, 2, 4];
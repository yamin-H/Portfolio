export const NODE_W = 220;
export const NODE_H = 80;

export type DiagramNode = {
  n: string;
  title: string;
  sub: string;
  x: number;
  y: number;
};

export const nodes: DiagramNode[] = [
  { n: "01", title: "GitHub", sub: "pull request opened", x: 30, y: 30 },
  { n: "02", title: "Queue", sub: "BullMQ · Redis", x: 310, y: 30 },
  { n: "03", title: "Worker", sub: "FastAPI · chunk the diff", x: 310, y: 170 },
  { n: "04", title: "LangGraph", sub: "6 nodes · embed chunks", x: 30, y: 170 },
  { n: "05", title: "pgvector", sub: "cosine search · 384-dim", x: 30, y: 310 },
  { n: "06", title: "Review", sub: "inline comment on the PR", x: 310, y: 310 },
];

// edge k connects node k to node k+1
export const edges = [
  "M250 70 L310 70",
  "M420 110 L420 170",
  "M310 210 L250 210",
  "M140 250 L140 310",
  "M250 350 L310 350",
];

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
  "The queue is down. The webhook still answers instantly, and the job retries with backoff until the queue is back. Nothing is lost.";

export function stepDuration(step: number, broken: boolean) {
  return broken && step === 1 ? 4200 : 2600;
}
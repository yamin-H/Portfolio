import { cards, RATIO, type Card } from "@/content/memory";
import type { Level, Stage } from "@/components/diagrams/engine/types";
import {
  stages as baseStages,
  simpleBroken,
  simpleRecovered,
} from "@/components/diagrams/pr-review/inspect";
import {
  idleCaption,
  brokenCaption,
  recoveredCaption,
} from "@/components/diagrams/pr-review/system";

/* ---------- scenarios: what the visitor sends ---------- */

export type Scenario = {
  id: string;
  label: Record<Level, string>;
  pr: number;
  title: string;
  file: string;
  minus: string;
  plus: string;
  target: number; // the past PR it should resemble
  off: [number, number]; // where it lands, relative to that PR
};

export const scenarios: Scenario[] = [
  {
    id: "sql",
    label: { engineer: "Raw SQL", simple: "Risky query" },
    pr: 412,
    title: "Fix user lookup",
    file: "db/query.ts",
    minus: "db.get(id)",
    plus: 'query("…"+id)',
    target: 234,
    off: [0.03, 0.03],
  },
  {
    id: "key",
    label: { engineer: "Hard-coded key", simple: "Secret in code" },
    pr: 418,
    title: "Add payments client",
    file: "config/env.ts",
    minus: "KEY = env.KEY",
    plus: 'KEY = "sk-live"',
    target: 98,
    off: [-0.06, 0.04],
  },
  {
    id: "catch",
    label: { engineer: "Swallowed error", simple: "Hidden error" },
    pr: 425,
    title: "Sync orders job",
    file: "jobs/sync.ts",
    minus: "await sync()",
    plus: "catch (e) {}",
    target: 156,
    off: [0.05, -0.07],
  },
];

/* ---------- vector search (same sample memory as the hero wall) ---------- */

export type Match = { card: Card; s: number };

const clamp = (v: number) => Math.min(0.98, Math.max(0.02, v));

export function queryOf(sc: Scenario) {
  const c = cards.find((k) => k.n === sc.target) ?? cards[0];
  return { x: clamp(c.nx + sc.off[0]), y: clamp(c.ny + sc.off[1]) };
}

export function rankFor(q: { x: number; y: number }): Match[] {
  return cards
    .map((card) => {
      const d = Math.hypot(q.x - card.nx, (q.y - card.ny) * RATIO);
      return { card, s: Math.max(0, 1 - d * 1.7) };
    })
    .sort((a, b) => b.s - a.s);
}

export const fmt = (s: number) => Math.min(0.97, s).toFixed(2);

export function commentFor(m: Match) {
  return `Your team ${
    m.card.verdict === "rejected" ? "rejected this pattern" : "approved this approach"
  } in PR #${m.card.n} (similarity ${fmt(m.s)}).`;
}

export function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max && line) {
      out.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) out.push(line);
  return out;
}

/* ---------- labels and tints ---------- */

export const tints = [
  "#d3d6da",
  "#f3dc9e",
  "#a8d5b2",
  "#dcd2f0",
  "#a7dcd9",
  "#f3d3ca",
];

export const edgeLabels: Record<Level, string[]> = {
  engineer: [
    "POST /webhook",
    "dequeue()",
    "run_graph()",
    "knn_search()",
    "post_review()",
  ],
  simple: [
    "tells the app",
    "picks up job",
    "analyses",
    "looks up",
    "writes comment",
  ],
};

export function payloadFor(
  edge: number,
  sc: Scenario,
  top: Match,
  level: Level
): { a: string; b: string } {
  const n = top.card.n;
  if (level === "simple") {
    return [
      { a: "NEW PR", b: `#${sc.pr}` },
      { a: "A JOB", b: `review #${sc.pr}` },
      { a: "PIECES", b: "3 parts" },
      { a: "NUMBERS", b: "3 lists" },
      { a: "BEST MATCH", b: `#${n}` },
    ][edge];
  }
  return [
    { a: "pull_request", b: `#${sc.pr} opened` },
    { a: "job", b: `{ pr: ${sc.pr} }` },
    { a: "chunks", b: "3 × diff" },
    { a: "embeddings", b: "3 × vec[384]" },
    { a: "match", b: `#${n} · ${fmt(top.s)}` },
  ][edge];
}

/* ---------- captions and inspector ---------- */

export function captionFor(
  level: Level,
  lit: number,
  broken: boolean,
  retry: number,
  sc: Scenario,
  top: Match,
  comment: string
) {
  const simple = level === "simple";
  if (lit < 0) return idleCaption;
  if (broken && lit === 1) {
    if (retry >= 4) return simple ? simpleRecovered : recoveredCaption;
    return simple ? simpleBroken : brokenCaption;
  }
  const n = top.card.n;
  const score = fmt(top.s);

  if (simple) {
    return [
      `Someone opens pull request #${sc.pr}, a proposed change to the code. GitHub tells the app, which replies right away.`,
      "The job waits on a list, so the app can reply instantly even if the review takes a while.",
      "A worker takes the job and cuts the change into small pieces.",
      "Each piece becomes a list of numbers that captures its meaning.",
      `Those numbers are compared with your team's past pull requests. The closest is #${n}.`,
      `The app posts a comment pointing to what your team decided before: “${comment}”`,
    ][lit];
  }
  return [
    `Pull request #${sc.pr} opens. GitHub sends a webhook, and the app answers 200 right away.`,
    "The job goes into a Redis-backed queue, so the webhook never waits on a slow model.",
    "A FastAPI worker takes the job and splits the diff into 3 chunks.",
    "A LangGraph pipeline turns each chunk into a 384-dimensional embedding.",
    `pgvector compares them against six months of merged PRs. The closest is PR #${n}, at ${score}.`,
    `The review is posted inline: “${comment}”`,
  ][lit];
}

export function stagesFor(
  sc: Scenario,
  matches: Match[],
  comment: string
): Stage[] {
  const top = matches[0];
  const list = matches
    .slice(0, 3)
    .map(
      (m) =>
        `PR #${String(m.card.n).padEnd(4)} ${fmt(m.s)}  ${m.card.verdict}`
    )
    .join("\n");

  return baseStages.map((s, i) => {
    if (i === 0)
      return {
        ...s,
        input: {
          ...s.input,
          engineer: `POST /webhooks/github\nX-GitHub-Event: pull_request\n\n{ "action": "opened",\n  "number": ${sc.pr},\n  "repository": "acme/api" }`,
        },
        output: {
          ...s.output,
          engineer: `200 OK   (acknowledged)\nenqueue({ pr: ${sc.pr} })`,
        },
      };
    if (i === 1)
      return {
        ...s,
        input: {
          simple: `One job: review pull request ${sc.pr}.`,
          engineer: `{ "pr": ${sc.pr},\n  "repo": "acme/api",\n  "attempt": 1 }`,
        },
      };
    if (i === 2)
      return {
        ...s,
        input: {
          ...s.input,
          engineer: `{ "pr": ${sc.pr},\n  "repo": "acme/api" }`,
        },
      };
    if (i === 4)
      return {
        ...s,
        output: {
          simple: `The closest past decisions, ranked by how similar they are. Here, #${top.card.n} is the closest.`,
          engineer: list,
        },
      };
    if (i === 5)
      return {
        ...s,
        input: {
          ...s.input,
          engineer: `match: PR #${top.card.n} (${fmt(top.s)})\nfile:  ${sc.file}`,
        },
        output: {
          ...s.output,
          engineer: comment.replace(" in PR", "\nin PR"),
        },
      };
    return s;
  });
}

/* ---------- trace waterfall ---------- */

export type Span = {
  row: number;
  label: string;
  start: number;
  dur: number;
  kind: "ok" | "err" | "wait";
  stop: number; // which diagram stop this span belongs to
  needs?: number; // retries needed before it shows (broken mode)
};
export type TraceData = { total: number; spans: Span[]; knots: number[] };

export const traceRows: Record<Level, string[]> = {
  engineer: [
    "github.webhook",
    "bullmq.queue",
    "fastapi.worker",
    "langgraph.graph",
    "pgvector.search",
    "github.comment",
  ],
  simple: ["GitHub", "Waiting list", "Worker", "Pipeline", "Team memory", "Comment"],
};

// all durations here are sample values (ms), not measurements
export function buildTrace(broken: boolean): TraceData {
  const spans: Span[] = [];
  let t = 0;
  const add = (
    row: number,
    label: string,
    dur: number,
    kind: Span["kind"],
    stop: number,
    needs?: number
  ) => {
    spans.push({ row, label, start: t, dur, kind, stop, needs });
    t += dur;
  };

  add(0, "POST /webhook", 14, "ok", 0);
  if (!broken) {
    add(1, "queue.wait", 38, "ok", 1);
  } else {
    [1000, 2000, 4000].forEach((w, i) => {
      add(1, `attempt ${i + 1} · ECONNREFUSED`, 6, "err", 1, i + 1);
      add(1, `${w / 1000}s`, w, "wait", 1, i + 1);
    });
    add(1, "enqueue ok", 6, "ok", 1, 4);
    add(1, "queue.wait", 38, "ok", 1, 4);
  }
  add(2, "chunk_diff", 138, "ok", 2);
  add(3, "graph.run", 622, "ok", 3);
  add(4, "knn_search", 85, "ok", 4);
  add(5, "post_review", 206, "ok", 5);

  const knots = [0, 1, 2, 3, 4, 5].map((k) => {
    const ss = spans.filter((s) => s.stop === k);
    const a = Math.min(...ss.map((s) => s.start));
    const b = Math.max(...ss.map((s) => s.start + s.dur));
    return (a + b) / 2;
  });

  return { total: t, spans, knots };
}

/** While the queue is retrying, the playhead follows the last revealed span. */
export function knotsFor(tr: TraceData, broken: boolean, retry: number) {
  if (!broken) return tr.knots;
  const q = tr.spans.filter((s) => s.row === 1 && (s.needs ?? 0) <= retry);
  const k = [...tr.knots];
  k[1] = q.length ? Math.max(...q.map((s) => s.start + s.dur)) : 14;
  return k;
}

export function timeAt(v: number, knots: number[]) {
  const last = knots.length - 1;
  const c = Math.max(0, Math.min(last, v));
  const i = Math.min(last - 1, Math.floor(c));
  return knots[i] + (knots[i + 1] - knots[i]) * (c - i);
}

export function ticksFor(total: number) {
  const step =
    [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000].find(
      (s) => total / s <= 5
    ) ?? 5000;
  const out: number[] = [];
  for (let t = 0; t <= total; t += step) out.push(t);
  return out;
}

export const fmtMs = (ms: number) =>
  ms >= 1000
    ? `${(ms / 1000).toFixed(ms >= 10000 ? 0 : 1)}s`
    : `${Math.round(ms)}ms`;
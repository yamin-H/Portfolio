import type { Level, Stage } from "@/components/diagrams/engine/types";
import {
  buildStages,
  idleCaption,
  type Provider,
} from "@/components/diagrams/yamin/data";
import { NW, NH, type FlatLayout } from "../layout";
import type { Span, TraceData } from "../data";

/* ---------- tasks: what the visitor asks Yamin to do ---------- */

export type Task = {
  id: string;
  label: Record<Level, string>;
  prompt: string;
  dir: string;
  reads: [string, string, string];
  tool: "edit_file" | "write_file" | "run_command";
  target: string;
  minus?: string;
  plus: string;
  applied: string;
};

export const tasks: Task[] = [
  {
    id: "fix",
    label: { engineer: "Fix a test", simple: "Fix a bug" },
    prompt: "fix the failing test in auth",
    dir: "~/shop-api",
    reads: [
      'list_directory("src/")',
      'read_file("auth.test.ts")',
      'search_code("verifyToken")',
    ],
    tool: "edit_file",
    target: "auth.test.ts",
    minus: "expect(user).toBe(null)",
    plus: "expect(user).toBeUndefined()",
    applied: "edit applied to auth.test.ts",
  },
  {
    id: "readme",
    label: { engineer: "Write a file", simple: "Create a file" },
    prompt: "add a README",
    dir: "~/shop-api",
    reads: [
      'list_directory(".")',
      'read_file("package.json")',
      'search_code("export")',
    ],
    tool: "write_file",
    target: "README.md",
    plus: "# shop-api",
    applied: "README.md written",
  },
  {
    id: "test",
    label: { engineer: "Run a command", simple: "Run the tests" },
    prompt: "run the tests",
    dir: "~/shop-api",
    reads: [
      'list_directory(".")',
      'read_file("package.json")',
      'search_code("describe")',
    ],
    tool: "run_command",
    target: "npm test",
    plus: "npm test",
    applied: "npm test ran",
  },
];

/* ---------- looks ---------- */

export const yTints = [
  "#d3d6da",
  "#dcd2f0",
  "#f5cfa6",
  "#a7dcd9",
  "#f3e08a",
  "#bfe0c4",
];

// model latency per provider, in ms. These are sample values, not measurements.
export const MODEL_MS: Record<string, number> = {
  groq: 420,
  openai: 900,
  gemini: 780,
  claude: 1100,
  hf: 1300,
  ollama: 2100,
};

export const yRows: Record<Level, string[]> = {
  engineer: [
    "cli.terminal",
    "agent.loop",
    "llm.provider",
    "tools.read",
    "approval.gate",
    "tools.apply",
  ],
  simple: ["Terminal", "Agent", "Model", "Looking", "Approval", "Result"],
};

export function edgeLabelsFor(level: Level, task: Task, denied: boolean) {
  return level === "simple"
    ? [
        "your request",
        "asks the model",
        "wants to look",
        "wants a change",
        denied ? "you say no" : "you say yes",
      ]
    : [
        "task",
        "messages + tools",
        "tool_call",
        `${task.tool}()`,
        denied ? "n · denied" : "y · apply",
      ];
}

export function payloadFor(
  edge: number,
  task: Task,
  denied: boolean,
  level: Level
): { a: string; b: string } {
  const short =
    task.prompt.length > 14 ? `${task.prompt.slice(0, 13)}…` : task.prompt;
  if (level === "simple") {
    return [
      { a: "YOUR REQUEST", b: "in plain words" },
      { a: "ASKS THE MODEL", b: "+ tool list" },
      { a: "MODEL WANTS", b: "to look" },
      {
        a: "MODEL WANTS",
        b: task.tool === "run_command" ? "to run it" : "a change",
      },
      { a: "YOUR ANSWER", b: denied ? "no" : "yes" },
    ][edge];
  }
  return [
    { a: "task", b: `"${short}"` },
    { a: "request", b: "msgs + 6 tools" },
    { a: "tool_call", b: task.reads[1] },
    { a: "proposal", b: `${task.tool}()` },
    { a: denied ? "denied" : "approved", b: denied ? "n" : "y" },
  ][edge];
}

/* ---------- captions ---------- */

export function captionFor(
  level: Level,
  lit: number,
  p: Provider,
  denied: boolean,
  task: Task
): string {
  if (lit < 0) return idleCaption[level];
  const run = task.tool === "run_command";

  if (level === "engineer") {
    return [
      `You type a task in your terminal: “${task.prompt}”.`,
      "The agent loop builds the request: your task, project context, and the six tool definitions. Your API key is read from your machine.",
      p.local
        ? `The request goes to your local endpoint (${p.name}) and never leaves your machine. The model replies with a tool call, not an answer.`
        : `The request goes to ${p.name}. The model replies with a tool call, not an answer. Your key is used only to call the provider you chose.`,
      "The model looks around first. list_directory, read_file and search_code run immediately, because they only read.",
      (task.tool === "edit_file"
        ? `The model proposes edit_file on ${task.target}. Yamin shows the diff and waits.`
        : task.tool === "write_file"
        ? `The model proposes write_file for ${task.target}. Yamin shows the new contents and waits.`
        : `The model proposes run_command: ${task.plus}. Yamin shows the command and waits.`) +
        (denied
          ? ` You press n, so nothing ${run ? "runs" : "is written"}.`
          : " Nothing happens until you approve."),
      denied
        ? `Denied. Nothing ${run ? "ran" : "was changed"}. “User denied” goes back to the model as the tool result, so it can propose something else or stop.`
        : `Approved. The result (${task.applied}) goes back to the model, and the loop repeats until the task is done. Each destructive step asks again.`,
    ][lit];
  }

  const what = {
    edit_file: "change a file",
    write_file: "create a file",
    run_command: "run a command",
  }[task.tool];
  const shows = {
    edit_file: "what would change",
    write_file: "what would be written",
    run_command: "what would run",
  }[task.tool];

  return [
    "You tell Yamin what you want, in plain words, right in your terminal.",
    "Yamin packages your request with a list of the things it is allowed to do. Your API key stays on your computer.",
    p.local
      ? "The request goes to a model running on your own computer. Nothing leaves it. It answers with what it wants to do next."
      : `The request goes to ${p.name}, the AI service you picked. It answers with what it wants to do next.`,
    "First it looks around: listing folders, reading files, searching the code. Looking is harmless, so it doesn't ask.",
    `Now it wants to ${what}. Yamin shows exactly ${shows}${
      denied ? ". You say no." : " and waits for your yes or no."
    }`,
    denied
      ? `Nothing was ${run ? "run" : "changed"}. The model is told you said no, and it can try something else.`
      : "You said yes, so it's done. The result goes back to the model, and it keeps going until the job is finished.",
  ][lit];
}

/* ---------- inspector ---------- */

export function stagesFor(task: Task, p: Provider, denied: boolean): Stage[] {
  const gate =
    task.tool === "run_command"
      ? `run_command\n$ ${task.plus}\napply? [y/N]`
      : task.tool === "write_file"
      ? `write_file  ${task.target}\n+ ${task.plus}\napply? [y/N]`
      : `edit_file  ${task.target}\n- ${task.minus}\n+ ${task.plus}\napply? [y/N]`;

  return buildStages(p, denied).map((s, i) => {
    if (i === 0)
      return {
        ...s,
        input: { ...s.input, engineer: `$ yamin\n> ${task.prompt}` },
        output: { ...s.output, engineer: `task: "${task.prompt}"` },
      };
    if (i === 2)
      return {
        ...s,
        output: { ...s.output, engineer: `tool_call: ${task.reads[1]}` },
      };
    if (i === 3)
      return {
        ...s,
        input: { ...s.input, engineer: task.reads.join("\n") },
      };
    if (i === 4) return { ...s, input: { ...s.input, engineer: gate } };
    if (i === 5 && !denied)
      return { ...s, input: { ...s.input, engineer: task.applied } };
    return s;
  });
}

/* ---------- trace waterfall (sample values, in ms) ---------- */

export function buildYaminTrace(
  task: Task,
  p: Provider,
  denied: boolean
): TraceData {
  const spans: Span[] = [];
  let t = 0;
  const add = (
    row: number,
    label: string,
    dur: number,
    kind: Span["kind"],
    stop: number
  ) => {
    spans.push({ row, label, start: t, dur, kind, stop });
    t += dur;
  };

  const llm = MODEL_MS[p.id] ?? 800;
  add(0, "read_task", 9, "ok", 0);
  add(1, "build_request", 21, "ok", 1);
  add(2, `llm · ${p.name}`, llm, "ok", 2);
  add(3, "list_directory", 4, "ok", 3);
  add(3, "read_file", 6, "ok", 3);
  add(3, "search_code", 17, "ok", 3);
  add(2, "llm · propose", Math.round(llm * 0.8), "ok", 4);
  add(4, "await_approval", 1500, "wait", 4);
  add(4, denied ? "denied · n" : "approved · y", 3, denied ? "err" : "ok", 4);
  if (denied) {
    add(5, "denied → model", 4, "err", 5);
  } else {
    add(
      5,
      `${task.tool} · apply`,
      task.tool === "run_command" ? 900 : 11,
      "ok",
      5
    );
    add(5, "tool_result", 3, "ok", 5);
  }

  const knots = [0, 1, 2, 3, 4, 5].map((k) => {
    const ss = spans.filter((s) => s.stop === k);
    const a = Math.min(...ss.map((s) => s.start));
    const b = Math.max(...ss.map((s) => s.start + s.dur));
    return (a + b) / 2;
  });

  return { total: t, spans, knots };
}

/* ---------- the dashed "your machine" boundary ---------- */

type BLabel = {
  x: number;
  y: number;
  anchor: "start" | "end";
  cloud: string;
  local: string;
  cloudOnly?: boolean;
};

/** Cloud model: a notch around the model node. Local model: one whole rectangle. */
export function boundaryFlat(layout: FlatLayout, tall: boolean) {
  const n = layout.nodes;

  if (!tall) {
    const left = 10;
    const top = 14;
    const right = layout.w - 10;
    const bottom = layout.h - 12;
    const nx = (n[1].x + NW + n[2].x) / 2;
    const ny = (n[2].y + NH + n[3].y) / 2;
    return {
      cloud: `M${left} ${top}H${nx}V${ny}H${right}V${bottom}H${left}Z`,
      local: `M${left} ${top}H${right}V${bottom}H${left}Z`,
      labels: [
        {
          x: left + 14,
          y: top,
          anchor: "start",
          cloud: "YOUR MACHINE · KEYS STAY HERE",
          local: "ALL ON YOUR MACHINE",
        },
      ] as BLabel[],
    };
  }

  const left = 10;
  const right = layout.w - 10;
  const aTop = n[0].y - 12;
  const aBottom = n[1].y + NH + 14;
  const bTop = n[3].y - 12;
  const bBottom = layout.h - 8;
  return {
    cloud:
      `M${left} ${aTop}H${right}V${aBottom}H${left}Z` +
      `M${left} ${bTop}H${right}V${bBottom}H${left}Z`,
    local: `M${left} ${aTop}H${right}V${bBottom}H${left}Z`,
    labels: [
      {
        x: right - 12,
        y: aTop,
        anchor: "end",
        cloud: "YOUR MACHINE",
        local: "YOUR MACHINE",
      },
      {
        x: right - 12,
        y: bTop,
        anchor: "end",
        cloud: "YOUR MACHINE",
        local: "YOUR MACHINE",
        cloudOnly: true,
      },
    ] as BLabel[],
  };
}
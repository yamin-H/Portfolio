import type { Both, Level, Stage } from "@/components/diagrams/engine/types";
import type { Layout } from "@/components/diagrams/pr-review/system";

export type Provider = {
  id: string;
  name: string;
  tag: string;
  local: boolean;
};

export const providers: Provider[] = [
  { id: "groq", name: "Groq", tag: "GROQ", local: false },
  { id: "openai", name: "OpenAI", tag: "OPENAI", local: false },
  { id: "gemini", name: "Gemini", tag: "GEMINI", local: false },
  { id: "claude", name: "Claude", tag: "CLAUDE", local: false },
  { id: "hf", name: "Hugging Face", tag: "HUGGING FACE", local: false },
  { id: "ollama", name: "Ollama", tag: "OLLAMA", local: true },
];

export const DWELL = 2400;
export const DWELL_DENIED = 3400;

export const stops = {
  engineer: ["Terminal", "Agent", "Model", "Read tools", "Approval", "Result"],
  simple: ["Task", "Agent", "Model", "Looking", "Approval", "Result"],
};

export function labelsFor(
  level: Level,
  p: Provider,
  denied: boolean,
  lit: number
): string[] {
  const gateDenied = denied && lit >= 4;
  const resultDenied = denied && lit >= 5;

  if (level === "engineer") {
    return [
      "TERMINAL · CLI",
      "AGENT · LOOP",
      `PROVIDER · ${p.tag}${p.local ? " · LOCAL" : ""}`,
      "READ-ONLY TOOLS",
      gateDenied ? "APPROVAL · DENIED" : "APPROVAL · Y/N",
      resultDenied ? "RESULT · NO CHANGE" : "RESULT · LOOPS BACK",
    ];
  }
  return [
    "YOUR TERMINAL",
    "AGENT LOOP",
    p.local ? "LOCAL MODEL" : "AI MODEL",
    "LOOKING AROUND",
    gateDenied ? "YOU SAID NO" : "YOUR APPROVAL",
    resultDenied ? "NO CHANGE" : "RESULT",
  ];
}

export const idleCaption: Record<Level, string> = {
  engineer: "Press Run to follow one task through Yamin.",
  simple: "Press Run to watch Yamin work on one task.",
};

export function captionFor(
  level: Level,
  lit: number,
  p: Provider,
  denied: boolean
): string {
  if (lit < 0) return idleCaption[level];

  if (level === "engineer") {
    return [
      "You type a task in your terminal: “fix the failing test in auth”.",
      "The agent loop builds the request: your task, project context, and the six tool definitions. Your API key is read from your machine.",
      p.local
        ? `The request goes to your local endpoint (${p.name}) and never leaves your machine. The model replies with a tool call, not an answer.`
        : `The request goes to ${p.name}. The model replies with a tool call, not an answer. Your key is used only to call the provider you chose.`,
      "The model looks around first. list_directory, read_file and search_code run immediately, because they only read.",
      denied
        ? "The model proposes edit_file on auth.test.ts. Yamin shows the diff and waits. You press n, so nothing is written."
        : "The model proposes edit_file on auth.test.ts. Yamin shows the diff and waits. Nothing is written until you approve.",
      denied
        ? "The file is untouched. “User denied” goes back to the model as the tool result, so it can propose something else or stop."
        : "Approved. The edit is applied and the result goes back to the model. The loop repeats until the task is done, and run_command asks again.",
    ][lit];
  }

  return [
    "You tell Yamin what you want, in plain words, right in your terminal.",
    "Yamin packages your request with a list of the things it is allowed to do. Your API key stays on your computer.",
    p.local
      ? "The request goes to a model running on your own computer. Nothing leaves it. It answers with what it wants to do next."
      : `The request goes to ${p.name}, the AI service you picked. It answers with what it wants to do next.`,
    "First it looks around: listing folders, reading files, searching the code. Looking is harmless, so it doesn't ask.",
    denied
      ? "Now it wants to change a file. Yamin shows exactly what would change. You say no."
      : "Now it wants to change a file. Yamin shows exactly what would change and waits for your yes or no.",
    denied
      ? "Nothing was changed. The model is told you said no, and it can try something else."
      : "You said yes, so the change is made. The result goes back to the model, and it keeps going until the job is done.",
  ][lit];
}

const b = (simple: string, engineer: string): Both => ({ simple, engineer });

export function buildStages(p: Provider, denied: boolean): Stage[] {
    return [
        {
            name: b("Your terminal", "CLI"),
            role: b(
                "Where you tell Yamin what to do.",
                "A command-line agent you run from any project folder."
            ),
            input: b(
                "A request in plain words.",
                `$ yamin\n> fix the failing test in auth`
            ),
            output: b(
                "The request, handed to the agent.",
                `task: "fix the failing test in auth"`
            ),
            why: b(
                "It works where you already work, in the folder of your own project.",
                "It runs from the project folder you are already in, so it works on your real files."
            ),
        },
        {
            name: b("The agent loop", "Agent loop"),
            role: b(
                "Decides what to ask the model, and carries out what it answers.",
                "Sends messages and tool definitions to the model, runs the tool calls it returns, and feeds results back."
            ),
            input: b(
                "Your request, plus the list of six things Yamin can do.",
                `messages: [ your task ]\ntools:    6 definitions\nkey:      read from your machine`
            ),
            output: b("A request to the model.", `provider request\n(messages + tools)`),
            why: b(
                "The model can only talk. This loop is what lets it act, one careful step at a time.",
                "A model only returns text or tool calls. The loop turns a tool call into an action, and the result back into context."
            ),
        },
        {
            name: b(
                p.local ? "A model on your computer" : `The AI model (${p.name})`,
                p.local ? `${p.name} (local endpoint)` : `${p.name} API`
            ),
            role: b(
                "Reads the request and decides the next step.",
                "Any supported provider, or any OpenAI-compatible endpoint."
            ),
            input: b(
                "Your request and the list of tools.",
                `messages + 6 tool schemas`
            ),
            output: b(
                "A tool it wants to use.",
                `tool_call: read_file("auth.test.ts")`
            ),
            why: b(
                "Yamin isn't tied to one company, so you can switch the model without changing anything else.",
                "Provider-agnostic: Groq, OpenAI, Gemini, Claude, Hugging Face, or any OpenAI-compatible endpoint such as Ollama. Models are fetched from the provider you choose."
            ),
        },
        {
            name: b("Looking around", "Read-only tools"),
            role: b(
                "Three tools that only look, and never change anything.",
                "list_directory, read_file and search_code."
            ),
            input: b(
                "A request like “show me this file”.",
                `list_directory("src/")\nread_file("auth.test.ts")\nsearch_code("verifyToken")`
            ),
            output: b(
                "What it found, sent back to the model.",
                `directory listing\nfile contents\nmatching lines`
            ),
            why: b(
                "Looking can't break anything, so it doesn't need to ask.",
                "They have no side effects, so they run without a prompt. Approval is kept for actions that can change something."
            ),
        },
        {
            name: b("Your approval", "Approval gate"),
            role: b(
                "Stops before anything is changed and asks you.",
                "edit_file, write_file and run_command wait for an interactive yes or no."
            ),
            input: b(
                "A change the model wants to make.",
                `edit_file  auth.test.ts\n- expect(user).toBe(null)\n+ expect(user).toBeUndefined()\napply? [y/N]`
            ),
            output: denied
                ? b("Your no. Nothing is changed.", `n → denied\nresult: "user denied"`)
                : b("Your yes, and the change goes through.", `y → applied`),
            why: b(
                "A tool that can change your files should never do it behind your back.",
                "Potentially destructive actions need approval by default. edit_file shows a diff first, so you see exactly what changes."
            ),
        },
        {
            name: b("The result", "Tool result"),
            role: b(
                "Reports back what happened.",
                "The tool output returns to the model as the next message."
            ),
            input: denied
                ? b("Nothing, because you said no.", `denied`)
                : b("The approved change.", `edit applied to auth.test.ts`),
            output: b(
                "The model sees the result and decides what comes next.",
                `result → messages\nloop continues until the task is done`
            ),
            why: b(
                "It's a loop: look, propose, ask, apply, check, until the job is done.",
                "The loop repeats until the model stops calling tools. Every destructive step asks again."
            ),
        },
    ];
}

type BoundaryLabel = {
  x: number;
  y: number;
  anchor: "start" | "end";
  cloud: string;
  local: string;
  cloudOnly?: boolean;
};

/** The dashed "your machine" boundary: a notch around the model in cloud mode, whole in local mode. */
export function boundaryFor(layout: Layout, tall: boolean) {
  const s = layout.slots;

  if (!tall) {
    const left = s[0].x - 106;
    const top = s[0].y - 211;
    const bottom = layout.h - 4;
    const midX = (s[1].x + 140 + s[2].x - 100) / 2;
    const notchY = (s[0].y + 27 + s[3].y - 205) / 2;
    const right = s[3].x + 146;
    const rightLocal = layout.w - 20;
    return {
      cloud: `M${left} ${top} H${midX} V${notchY} H${right} V${bottom} H${left} Z`,
      local: `M${left} ${top} H${rightLocal} V${bottom} H${left} Z`,
      labels: [
        {
          x: left + 14,
          y: top,
          anchor: "start",
          cloud: "YOUR MACHINE · KEYS STAY HERE",
          local: "ALL ON YOUR MACHINE",
        },
      ] as BoundaryLabel[],
    };
  }

  const left = 4;
  const right = layout.w - 4;
  const aTop = s[0].y - 211;
  const aBottom = s[1].y + 33;
  const bTop = s[3].y - 211;
  const bBottom = layout.h - 4;
    return {
        cloud:
            `M${left} ${aTop} H${right} V${aBottom} H${left} Z ` +
            `M${left} ${bTop} H${right} V${bBottom} H${left} Z`,
        local: `M${left} ${aTop} H${right} V${bBottom} H${left} Z`,
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
        ] as BoundaryLabel[],
    };
};
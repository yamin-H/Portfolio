export type Tool = { name: string; usedIn: string[] };
export type SkillGroup = { label: string; tools: Tool[] };

const PR = "pr-review-agent";
const YA = "yamin";
const JV = "jarvis-lite";

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    tools: [
      { name: "Next.js", usedIn: [PR] },
      { name: "React.js", usedIn: [] },
      { name: "TypeScript", usedIn: [PR] },
      { name: "Tailwind CSS", usedIn: [] },
    ],
  },
  {
    label: "Backend",
    tools: [
      { name: "Python", usedIn: [PR, YA, JV] },
      { name: "FastAPI", usedIn: [PR, JV] },
      { name: "Node.js", usedIn: [PR] },
      { name: "Express.js", usedIn: [PR] },
      { name: "REST APIs", usedIn: [] },
      { name: "WebSocket", usedIn: [JV] },
      { name: "SSE", usedIn: [] },
      { name: "BullMQ", usedIn: [PR] },
      { name: "Win32 API", usedIn: [JV] },
    ],
  },
  {
    label: "AI",
    tools: [
      { name: "LangGraph", usedIn: [PR] },
      { name: "LangChain", usedIn: [PR] },
      { name: "RAG", usedIn: [PR] },
      { name: "Embeddings", usedIn: [PR] },
      { name: "pgvector", usedIn: [PR] },
      { name: "Multi-provider LLM APIs", usedIn: [YA] },
      { name: "Ollama", usedIn: [YA, JV] },
      { name: "YOLO · ONNX", usedIn: [JV] },
    ],
  },
  {
    label: "Data & shipping",
    tools: [
      { name: "PostgreSQL", usedIn: [PR] },
      { name: "Prisma ORM", usedIn: [PR] },
      { name: "Redis", usedIn: [PR] },
      { name: "Neon", usedIn: [] },
      { name: "Docker", usedIn: [PR] },
      { name: "Git & GitHub", usedIn: [] },
      { name: "CI/CD", usedIn: [] },
      { name: "PyPI packaging", usedIn: [YA] },
      { name: "CLI tooling", usedIn: [YA] },
    ],
  },
];

// Pairs of tools that work together. Edit freely: names must match exactly.
export const links: [string, string][] = [
  ["Next.js", "React.js"],
  ["Next.js", "TypeScript"],
  ["Next.js", "Tailwind CSS"],
  ["Node.js", "Express.js"],
  ["Express.js", "REST APIs"],
  ["Express.js", "BullMQ"],
  ["Node.js", "WebSocket"],
  ["Node.js", "SSE"],
  ["BullMQ", "Redis"],
  ["Node.js", "Prisma ORM"],
  ["Prisma ORM", "PostgreSQL"],
  ["PostgreSQL", "Neon"],
  ["Python", "FastAPI"],
  ["FastAPI", "LangGraph"],
  ["FastAPI", "WebSocket"],
  ["LangGraph", "LangChain"],
  ["LangChain", "RAG"],
  ["RAG", "Embeddings"],
  ["Embeddings", "pgvector"],
  ["pgvector", "PostgreSQL"],
  ["Python", "Multi-provider LLM APIs"],
  ["Python", "PyPI packaging"],
  ["Python", "CLI tooling"],
  ["Python", "Win32 API"],
  ["Python", "YOLO · ONNX"],
  ["Python", "Ollama"],
  ["Git & GitHub", "CI/CD"],
  ["Docker", "CI/CD"],
];
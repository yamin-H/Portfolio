export type Tool = { name: string; usedIn: string[] };
export type SkillGroup = { label: string; tools: Tool[] };

const PR = "pr-review-agent";
const YA = "yamin";

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    tools: [
      { name: "Next.js", usedIn: [PR] },
      { name: "TypeScript", usedIn: [PR] },
    ],
  },
  {
    label: "Backend",
    tools: [
      { name: "Python", usedIn: [PR, YA] },
      { name: "FastAPI", usedIn: [PR] },
      { name: "Node.js", usedIn: [PR] },
      { name: "Express.js", usedIn: [PR] },
      { name: "Prisma", usedIn: [PR] },
      { name: "BullMQ", usedIn: [PR] },
    ],
  },
  {
    label: "AI",
    tools: [
      { name: "LangGraph", usedIn: [PR] },
      { name: "LangChain", usedIn: [PR] },
      { name: "Embeddings", usedIn: [PR] },
      { name: "pgvector", usedIn: [PR] },
      { name: "Multi-provider LLM APIs", usedIn: [YA] },
    ],
  },
  {
    label: "Data & shipping",
    tools: [
      { name: "PostgreSQL", usedIn: [PR] },
      { name: "Redis", usedIn: [PR] },
      { name: "Docker", usedIn: [PR] },
      { name: "PyPI packaging", usedIn: [YA] },
      { name: "CLI tooling", usedIn: [YA] },
    ],
  },
];
import type { BlockKind } from "@/components/diagrams/iso/blocks";

export type ArchiveProject = {
  slug: string;
  title: string;
  year: string;
  kind: string;
  summary: string;
  tags: string[]; // these become the filter buttons
  stack: string[];
  block: BlockKind; // which isometric block is the card's picture
  featured?: boolean; // true = links up to its case study in the Work section
  links: { label: string; href: string }[];
};

export const archive: ArchiveProject[] = [
  {
    slug: "pr-review-agent",
    title: "PR Review Agent",
    year: "2026",
    kind: "GitHub App",
    summary:
      "Reviews pull requests using your team's own history, and cites the past decision.",
    tags: ["AI", "Full-stack"],
    stack: ["Next.js", "FastAPI", "LangGraph", "pgvector"],
    block: "vectors",
    featured: true,
    links: [],
  },
  {
    slug: "yamin",
    title: "Yamin",
    year: "2026",
    kind: "CLI coding agent",
    summary:
      "A terminal coding agent for any model provider. It asks before it changes anything.",
    tags: ["AI", "Tooling"],
    stack: ["Python", "PyPI", "CLI"],
    block: "terminal",
    featured: true,
    links: [],
  },
{
  slug: "jarvis-lite",
  title: "Jarvis Lite",
  year: "2026",
  kind: "Voice assistant",
  summary:
    "A privacy-first voice assistant and desktop agent for Windows. Wake word, speech recognition and vision run locally.",
  tags: ["AI", "Desktop"],
  stack: ["Python", "FastAPI", "ONNX", "Win32"],
  block: "agent",
  featured: true,
  links: [],
},
];

// The grid appears once there are enough projects to fill it. With two it only repeats Work.
export const MIN_GRID = 1;
export const SHOW_GRID = archive.length >= MIN_GRID;
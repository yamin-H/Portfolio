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
  // Add more like this:
  // {
  //   slug: "my-project",
  //   title: "My Project",
  //   year: "2025",
  //   kind: "Web app",
  //   summary: "One sentence on what it does and why it matters.",
  //   tags: ["Full-stack"],
  //   stack: ["Next.js", "Postgres"],
  //   block: "queue",
  //   links: [{ label: "GitHub", href: "https://github.com/..." }],
  // },
];
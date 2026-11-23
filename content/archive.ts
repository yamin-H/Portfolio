import type { BlockKind } from "@/components/diagrams/iso/blocks";

export type ArchiveProject = {
  slug: string;
  title: string;
  year: string;
    kind: string;
  video?: string; // Drive, YouTube or a direct .mp4 link: adds a Play button to the card
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
        video: "https://drive.google.com/file/d/1PmL870cSDw-eZ0LfdkjvHifHRF1iSomc/view",
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
        tags: ["AI", "Desktop", "Voice"],
        stack: ["Python", "FastAPI", "ONNX", "Win32"],
        block: "agent",
        featured: true,
        video: "https://drive.google.com/file/d/1V_JS8mJ6gHhXFBcHd8DJo4bcwaYyN2LS/view",
        links: [],
    },
    {
        slug: "tara",
        title: "Tara",
        year: "2026",
        kind: "Voice agent · prototype",
        summary:
            "A prototype telecom customer-care voice agent that talks with callers in English and Bangla over a browser call. Runs on synthetic data.",
        tags: ["AI", "Voice"],
        stack: ["Python", "FastAPI", "WebSocket", "Groq"],
        block: "gate",
        featured: true,
        video: "https://drive.google.com/file/d/1-iIN58QL2b2qWu2lvm6jVAknKhjyHUss/view",
        links: [],
    },
    {
        slug: "dwarpal",
        title: "Dwarpal",
        year: "2026",
        kind: "AI gateway",
        summary:
            "A gateway between apps and AI providers like OpenAI, Gemini and Groq. One endpoint per app, with caching, fallbacks and budgets.",
        tags: ["AI", "Backend"],
        stack: ["Python", "FastAPI", "Redis", "Qdrant", "Kong", "LiteLLM"],
        block: "provider",
        featured: true,
        video: "https://drive.google.com/file/d/1UnZ8LJ_FAif37n-2lRXOlJ8mrKdCgixB/view?usp=sharing", // check this is Dwarpal's video
        links: [],
    },
];

// The grid appears once there are enough projects to fill it. With two it only repeats Work.
export const MIN_GRID = 1;
export const SHOW_GRID = archive.length >= MIN_GRID;
export type Project = {
  slug: string;
  index: string;
  title: string;
  kind: string;
  period: string;
  summary: string;
  facts: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
    {
        slug: "pr-review-agent",
        index: "01",
        title: "PR Review Agent",
        kind: "Full-stack web application",
        period: "June 2026 – Present",
        summary:
            "A GitHub App that reviews pull requests using your team's own history, so comments cite real past decisions instead of generic rules.",
        facts: [
            "Ingests 6 months of merged PR history",
            "6-node LangGraph pipeline with chunked diff processing",
            "pgvector cosine search over 384-dimensional embeddings",
            "Webhook → BullMQ/Redis → FastAPI → Next.js, with backoff and rollback",
        ],
        stack: [
            "Next.js",
            "TypeScript",
            "Node.js",
            "FastAPI",
            "LangGraph",
            "pgvector",
            "PostgreSQL",
            "BullMQ",
            "Redis",
            "Docker",
        ],
        // Fill in your real links. Empty hrefs are hidden automatically.
        links: [
            { label: "Live demo", href: "" },
            { label: "GitHub", href: "" },
            { label: "Video", href: "" },
        ],
    },
    {
        slug: "yamin",
        index: "02",
        title: "Yamin",
        kind: "Terminal AI coding agent",
        period: "February 2026 – Present",
        summary:
            "A CLI coding agent that reads and searches a codebase, edits files, and runs commands from any project folder. Works with any model provider.",
        facts: [
            "Published on PyPI: pip install yamin",
            "Groq, OpenAI, Gemini, Claude, Hugging Face, or any OpenAI-compatible endpoint such as Ollama",
            "Models fetched live from the chosen provider",
            "API keys stay on your machine",
        ],
        stack: ["Python", "PyPI", "Packaging", "CLI"],
        links: [
            { label: "PyPI", href: "" },
            { label: "GitHub", href: "" },
        ],
    },
];
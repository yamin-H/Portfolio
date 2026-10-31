export const resume = {
  headline: "Full-Stack AI Engineer | Next.js · Node.js · Python",
  summary:
    "Full-stack engineer who builds and ships complete products, from Next.js dashboards to Node and FastAPI backends, with Docker and CI/CD. Published a PyPI developer tool and contributed to open-source projects including Remotion and n8n.",
  skills: [
    { label: "Frontend", items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS"] },
    { label: "Backend", items: ["Python", "FastAPI", "Node.js", "Express.js", "TypeScript", "REST APIs", "WebSocket", "SSE"] },
    { label: "Databases", items: ["PostgreSQL", "Prisma ORM", "Redis", "Neon"] },
    { label: "Infrastructure", items: ["Docker", "Git & GitHub", "CI/CD pipelines"] },
    { label: "AI", items: ["LangGraph", "LangChain", "RAG"] },
  ],
  projects: [
    {
      slug: "pr-review-agent",
      title: "PR Review Agent",
      kind: "Full Stack Web Application",
      period: "June 2026 – Present",
      note: "Personal Project",
      bullets: [
        "Built a GitHub App (Marketplace-installable) that ingests 6 months of merged PR history and posts inline review comments referencing specific past decisions, not generic rules, making team knowledge searchable and persistent.",
        "Designed a 6-node LangGraph pipeline with chunked diff processing and pgvector cosine similarity search across 384-dimensional embeddings, surfacing decisions like “your team rejected this pattern in PR #234” with similarity scores.",
        "Architected webhook → BullMQ/Redis queue → FastAPI inference layer → Next.js dashboard with exponential backoff, rollback handling, and structured logging for incident traceability.",
      ],
      tech: "Next.js · TypeScript · Node.js · Express.js · Python · FastAPI · LangGraph · LangChain · pgvector · PostgreSQL · Prisma · BullMQ · Redis · Docker",
    },
    {
      slug: "yamin",
      title: "Yamin",
      kind: "Terminal AI Coding Agent",
      period: "February 2026 – Present",
      note: "",
      bullets: [
        "Published a CLI coding agent on PyPI (pip install yamin) that reads and searches a codebase, edits files and runs commands from any project folder.",
        "Added provider-agnostic support for Groq, OpenAI, Gemini, Claude, Hugging Face and any OpenAI-compatible endpoint such as Ollama, with models fetched from the chosen provider. API keys stay on the user’s machine.",
      ],
      tech: "Python · PyPI · packaging · CLI",
    },
  ],
  contributions: [
    { repo: "n8n", pr: 35894, text: "Fixed MCP settings page counters showing 0 before async loads finished; added loading placeholder." },
    { repo: "inkbox", pr: 128, text: "Fixed Windows crash in the Python SDK by making the POSIX-only O_NOFOLLOW flag conditional." },
    { repo: "Remotion (52.6k+ stars)", pr: 7074, text: "Added preserveSilence to renderMediaOnWeb() so silent head/tail frames are kept, with a regression test." },
    { repo: "Remotion (52.6k+ stars)", pr: 7107, text: "Extended playbackRate validation in @remotion/player from ±4 to ±10 to match modern browsers; updated docs and tests." },
  ],
  contributionTech: "TypeScript · React · Web Audio API · Bun · Python",
  education: {
    school: "Varendra University",
    period: "Oct 2022 – July 2026",
    degree: "Bachelor of Engineering in Electrical and Electronic Engineering",
  },
};
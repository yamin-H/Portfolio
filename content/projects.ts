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
            { label: "Live demo", href: "https://ai-pr-reviewer-yamin.vercel.app/" },
            { label: "Video", href: "https://drive.google.com/file/d/1PmL870cSDw-eZ0LfdkjvHifHRF1iSomc/view" },
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
            "Six tools: list, read, search, edit, write, and run commands",
            "Asks for your approval before any edit, write, or shell command",
            "Groq, OpenAI, Gemini, Claude, Hugging Face, or any OpenAI-compatible endpoint such as Ollama",
            "Models fetched live from the chosen provider; API keys stay on your machine",
        ],
        stack: ["Python", "PyPI", "Packaging", "CLI"],
        links: [
            { label: "PyPI", href: "" },
            { label: "GitHub", href: "" },
            { label: "PyPI", href: "https://pypi.org/project/yamin/#description" },
        ],
    },
    {
        slug: "jarvis-lite",
        index: "03",
        title: "Jarvis Lite",
        kind: "Voice assistant for Windows",
        period: "November 2026",
        summary:
            "An open-source, privacy-first voice assistant and desktop agent for Windows. Wake word, speech recognition and vision run locally on the CPU, and actions go through confirmation gates.",
        facts: [
            "Wake word (openWakeWord), speech recognition (Moonshine) and real-time vision (YOLO, ONNX) all run locally on the CPU",
            "Microphone audio and webcam streams never leave the machine",
            "Replies from Groq for sub-500ms voice responses, or fully offline with local Ollama models",
            "Native Win32 API integration: manages windows, runs multi-step desktop tasks, dictates text, keeps persistent local memory",
            "Human-in-the-loop confirmation gates, and a live dashboard over a local FastAPI WebSocket hub",
        ],
        stack: [
            "Python",
            "FastAPI",
            "WebSocket",
            "openWakeWord",
            "Moonshine",
            "YOLO · ONNX",
            "Groq",
            "Ollama",
            "Win32 API",
        ],
        links: [
            { label: "GitHub", href: "https://github.com/yamin-H/voice-assistant-jarvis" },
            { label: "Demo video", href: "https://drive.google.com/file/d/1V_JS8mJ6gHhXFBcHd8DJo4bcwaYyN2LS/view?usp=sharing" },
        ],
    },
    {
        slug: "tara",
        index: "04",
        title: "Tara",
        kind: "Voice agent prototype",
        period: "2026", // put the real month
        summary:
            "A prototype telecom customer-care voice agent that talks with callers in English and Bangla over a browser call. It runs on synthetic data and is not a production system.",
        facts: [
            "The browser streams the microphone over a WebSocket, and Silero VAD detects when you start and stop speaking",
            "Moonshine transcribes the speech, and a Groq-hosted LLM decides what to do, calling tools against a mock billing/CRM API (FastAPI + SQLite)",
            "Kokoro speaks each reply sentence by sentence, and you can interrupt mid-sentence (barge-in)",
            "The PIN is captured by the server and never reaches the LLM",
            "Purchases and SIM blocks need a spoken “yes” on the next turn",
            "Every turn is timed per stage (endpointing, ASR, LLM, TTS) and shown in the UI",
        ],
        stack: [
            "Python",
            "FastAPI",
            "WebSocket",
            "Silero VAD",
            "Moonshine",
            "Kokoro",
            "Groq",
            "SQLite",
            "httpx",
            "pytest",
            "ruff",
            "Web Audio",
        ],
        links: [
            { label: "GitHub", href: "https://github.com/yamin-H/telecom-call-agent" },
            { label: "Demo video", href: "https://drive.google.com/file/d/1-iIN58QL2b2qWu2lvm6jVAknKhjyHUss/view" },
        ],
    },
    {
        slug: "dwarpal",
        index: "05",
        title: "Dwarpal",
        kind: "AI gateway",
        period: "2026", // put the real month
        summary:
            "A gateway that sits between apps and AI providers like OpenAI, Gemini and Groq. Apps talk to it, and it handles the rest. It's a portfolio project, not production software.",
        facts: [
            "One OpenAI-compatible endpoint per app, each with its own API key, model list, budget and settings",
            "Two-layer cache: Redis for repeated questions, and Qdrant for questions with the same meaning, across Bangla, English and Banglish",
            "Personal data and time-sensitive questions are never cached, and one tenant never sees another tenant's cached answers",
            "If a provider fails it switches to a fallback model, and a circuit breaker stops it from hammering the broken one",
            "Monthly token and cost budgets return a 429 when exceeded, and tenants can be disabled or keys rotated and revoked instantly",
            "Answers stream word by word, and the time to the first word is measured",
            "A web console, Prometheus and Grafana dashboards, JSON logs, and a request ID on every response",
        ],
        stack: [
            "Python",
            "FastAPI",
            "Kong",
            "LiteLLM",
            "PostgreSQL",
            "Redis",
            "Qdrant",
            "multilingual-e5",
            "Prometheus",
            "Grafana",
            "Docker Compose",
        ],
        links: [
            { label: "GitHub", href: "https://github.com/yamin-H/desktop-pilot" }, // check this is the Dwarpal repo
            { label: "Demo video", href: "https://drive.google.com/file/d/1UnZ8LJ_FAif37n-2lRXOlJ8mrKdCgixB/view?usp=sharing" }, // and this
        ],
    },
];
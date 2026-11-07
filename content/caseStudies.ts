export type Decision = { title: string; body: string };
export type CaseStudy = {
  problem: string[];
  decisions: Decision[];
  lessons?: string[]; // add "what I'd change" notes here and they appear automatically
};

export const caseStudies: Record<string, CaseStudy> = {
    "pr-review-agent": {
        problem: [
            "Most automated code review applies the same generic rules to every repository. It can't know that your team rejected a pattern a few months ago, or why.",
            "That knowledge exists, but it's buried in old pull requests where nobody will find it. This project makes it searchable, so a review can point to what your team actually decided.",
        ],
        decisions: [
            {
                title: "Answer the webhook first, work later",
                body: "A webhook has to be acknowledged quickly, and a model is slow. So the request goes onto a BullMQ queue backed by Redis, and a FastAPI inference layer does the heavy work afterwards. Failed jobs retry with exponential backoff and roll back cleanly instead of being dropped.",
            },
            {
                title: "Search the team's history, not a rulebook",
                body: "Six months of merged PRs are embedded as 384-dimensional vectors and searched with cosine similarity in pgvector. A comment can cite the closest past decision, for example that your team rejected a pattern in PR #234, along with how similar it was.",
            },
            {
                title: "A graph, not one big prompt",
                body: "A 6-node LangGraph pipeline processes the diff in chunks. Each step is explicit, so when something goes wrong it traces back to one node instead of one opaque model call.",
            },
            {
                title: "Make every incident traceable",
                body: "Structured logging runs through the whole path, from webhook to inline comment, so a bad review can be followed back to the job that produced it.",
            },
            {
                title: "Meet the team where they work",
                body: "It ships as a Marketplace-installable GitHub App, and the review lands inline on the pull request. A Next.js dashboard sits alongside it.",
            },
        ],
    },

    yamin: {
        problem: [
            "Coding agents tend to tie you to one model provider, and to run commands on your machine without much ceremony.",
            "Yamin is a terminal agent built the other way around: it works with whichever provider you choose, and it asks before it changes anything.",
        ],
        decisions: [
            {
                title: "Any provider, same tool",
                body: "Groq, OpenAI, Gemini, Claude, Hugging Face, or any OpenAI-compatible endpoint such as Ollama. The model list is fetched from the provider you pick, so switching never means rewriting anything.",
            },
            {
                title: "Ask before changing anything",
                body: "Potentially destructive actions need interactive approval by default. edit_file shows a diff first, so you see exactly what would change. Inspecting a directory with list_directory runs without a prompt.",
            },
            {
                title: "A small, legible toolset",
                body: "Six tools: read_file, search_code, edit_file, write_file, run_command and list_directory. A small surface is easier to trust, and easier to reason about when something goes wrong.",
            },
            {
                title: "Your keys stay on your machine",
                body: "API keys are kept locally and used only to call the provider you chose. A tool that works on your code should earn trust by design.",
            },
            {
                title: "Ship it like a real tool",
                body: "It's published on PyPI, so it installs with pip install yamin and runs from any project folder.",
            },
        ],
    },
    "jarvis-lite": {
        problem: [
            "A voice assistant listens all the time, so where that audio goes matters. One that can act on your computer also has to be careful about what it does.",
            "Jarvis Lite is built around both ideas: the always-on parts run on your machine, and actions on your desktop go through confirmation gates.",
        ],
        decisions: [
            {
                title: "Keep the always-on parts local",
                body: "Wake word detection (openWakeWord), speech recognition (Moonshine) and real-time vision (a YOLO model in ONNX) all run on the CPU. Continuous microphone audio and webcam streams stay on the machine.",
            },
            {
                title: "Fast when online, usable offline",
                body: "Replies can come from Groq, for voice responses under 500ms, or the whole assistant can run offline with local Ollama models.",
            },
            {
                title: "Connect the model to Windows directly",
                body: "Native Win32 API integration lets the assistant manage application windows, carry out multi-step desktop tasks, dictate text, and keep persistent local memory.",
            },
            {
                title: "Ask before acting",
                body: "Actions go through strict human-in-the-loop confirmation gates, added for safety.",
            },
            {
                title: "Make it visible",
                body: "A glassmorphism web dashboard, powered by a local FastAPI WebSocket hub, shows what the assistant is doing, live.",
            },
        ],
    },
};
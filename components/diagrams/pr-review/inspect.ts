import type { Stage } from "@/components/diagrams/engine/types";

export const stages: Stage[] = [
    {
        name: { simple: "Pull request", engineer: "GitHub webhook" },
        role: {
            simple: "Someone proposes a change to the code, and GitHub tells the app.",
            engineer: "GitHub sends a pull_request event to the app's webhook endpoint.",
        },
        input: {
            simple: "A newly opened pull request.",
            engineer: `POST /webhooks/github
X-GitHub-Event: pull_request

{ "action": "opened",
  "number": 412,
  "repository": "acme/api" }`,
        },
        output: {
            simple: "A quick “got it” sent straight back to GitHub.",
            engineer: `200 OK   (acknowledged)
enqueue({ pr: 412 })`,
        },
        why: {
            simple:
                "GitHub gives up on slow replies, so the app answers immediately and does the real work afterwards.",
            engineer:
                "Webhook handlers have to answer fast. This one validates the event and enqueues it, and nothing heavy runs inside the request.",
        },
    },
    {
        name: { simple: "Waiting list", engineer: "BullMQ queue" },
        role: {
            simple: "Holds each job until a worker is ready for it.",
            engineer: "A Redis-backed BullMQ queue with exponential backoff.",
        },
        input: {
            simple: "One job: review pull request 412.",
            engineer: `{ "pr": 412,
  "repo": "acme/api",
  "attempt": 1 }`,
        },
        output: {
            simple: "The same job, stored safely until it succeeds.",
            engineer: `stored in Redis
on failure: retry 1s → 2s → 4s`,
        },
        why: {
            simple:
                "If something breaks, the job waits and tries again instead of being lost.",
            engineer:
                "It decouples the webhook from slow inference. A failure delays a review but doesn't drop it.",
        },
    },
    {
        name: { simple: "Worker", engineer: "FastAPI worker" },
        role: {
            simple: "Picks up the job and prepares the change for analysis.",
            engineer: "Fetches the diff and splits it into chunks.",
        },
        input: {
            simple: "The job from the waiting list.",
            engineer: `{ "pr": 412,
  "repo": "acme/api" }`,
        },
        output: {
            simple: "The change, cut into small readable pieces.",
            engineer: `diff → 3 chunks`,
        },
        why: {
            simple:
                "A long change is hard to analyse all at once, so it's handled piece by piece.",
            engineer:
                "Long diffs don't fit a model or a similarity search in one piece, so they're processed in chunks.",
        },
    },
    {
        name: { simple: "Review pipeline", engineer: "LangGraph pipeline" },
        role: {
            simple: "A step-by-step process that analyses each piece.",
            engineer: "A 6-node graph that turns each chunk into an embedding.",
        },
        input: {
            simple: "The pieces of the change.",
            engineer: `3 chunks`,
        },
        output: {
            simple: "Each piece turned into a list of numbers that captures its meaning.",
            engineer: `3 × vector[384]`,
        },
        why: {
            simple:
                "Numbers let a computer compare meaning, not just matching words.",
            engineer:
                "Embeddings make “similar code” searchable. A graph keeps each step explicit, so a failure traces back to one node.",
        },
    },
    {
        name: { simple: "Team memory", engineer: "pgvector search" },
        role: {
            simple: "Finds past pull requests that look like this one.",
            engineer: "Cosine similarity over six months of merged PRs.",
        },
        input: {
            simple: "The numbers for each piece.",
            engineer: `vector[384]`,
        },
        output: {
            simple: "The closest past decisions, ranked by how similar they are.",
            engineer: `PR #234   0.87   rejected
PR #118   0.61   approved
PR #77    0.43   approved`,
        },
        why: {
            simple:
                "This is what makes the review specific: it points to what your team actually decided before.",
            engineer:
                "Retrieval grounds the comment in the team's own history instead of generic rules.",
        },
    },
    {
        name: { simple: "Review", engineer: "Inline comment" },
        role: {
            simple: "Writes the comment on the pull request.",
            engineer: "Posts an inline review comment through the GitHub API.",
        },
        input: {
            simple: "The best match, and the code it applies to.",
            engineer: `match: PR #234 (0.87)
file:  db/query.ts`,
        },
        output: {
            simple: "A comment that cites a real past decision.",
            engineer: `Your team rejected this pattern
in PR #234 (similarity 0.87).`,
        },
        why: {
            simple:
                "A comment you can check against a real decision beats a generic rule.",
            engineer:
                "Citing the source PR lets the author verify the claim and judge it instead of trusting a rule.",
        },
    },
];

export const simpleSteps = [
    "Someone opens a pull request, a proposed change to the code. GitHub tells the app right away.",
    "The app puts the job on a waiting list, so it can answer GitHub instantly even if the review takes a while.",
    "A worker takes the job and cuts the change into small, readable pieces.",
    "Each piece is turned into a list of numbers that captures its meaning.",
    "Those numbers are compared with the team's past pull requests to find similar decisions. Here, PR #234 is a close match.",
    "The app posts a review comment on the pull request, pointing to what the team decided before.",
];

export const simpleBroken =
  "The waiting list is down. The app still answers GitHub, and keeps trying again with longer pauses until it's back. Nothing is lost.";

export const simpleRecovered =
  "The waiting list is back, the retry works, and the job moves on.";

export const labels = {
    engineer: [
        "GITHUB · WEBHOOK",
        "QUEUE · BULLMQ",
        "WORKER · FASTAPI",
        "LANGGRAPH · 6 NODES",
        "PGVECTOR · 384-DIM",
        "REVIEW · INLINE COMMENT",
    ],
    simple: [
        "PULL REQUEST",
        "WAITING LIST",
        "WORKER",
        "REVIEW PIPELINE",
        "TEAM MEMORY",
        "REVIEW COMMENT",
    ],
};

export const stops = {
  engineer: ["GitHub", "Queue", "Worker", "LangGraph", "pgvector", "Review"],
  simple: ["Request", "Waiting list", "Worker", "Pipeline", "Memory", "Comment"],
};
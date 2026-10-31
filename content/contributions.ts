export type PR = {
  number: number;
  title: string;
  summary: string;
  href: string; // empty = shown as plain text, no link
};

export type Contribution = {
  repo: string;
  what: string;
  stars?: string; // from your CV; update it or delete the line when it goes stale
  tech: string[];
  prs: PR[];
};

export const contributions: Contribution[] = [
    {
        repo: "n8n",
        what: "Workflow automation",
        tech: ["TypeScript"],
        prs: [
            {
                number: 35894,
                title: "MCP settings counters no longer flash 0",
                summary:
                    "The counters on the MCP settings page showed 0 until the async loads finished. They now show a loading placeholder instead.",
                href: "https://github.com/n8n-io/n8n/pull/35894",
            },
        ],
    },
    {
        repo: "inkbox",
        what: "Python SDK",
        tech: ["Python"],
        prs: [
            {
                number: 128,
                title: "Fix a Windows crash in the Python SDK",
                summary:
                    "O_NOFOLLOW exists only on POSIX systems, so the SDK crashed on Windows. The flag is now applied conditionally.",
                href: "", // paste the inkbox PR URL here
            },
        ],
    },
    {
        repo: "Remotion",
        what: "Programmatic video in React",
        stars: "52.6k+ GitHub stars",
        tech: ["TypeScript", "React", "Web Audio API"],
        prs: [
            {
                number: 7074,
                title: "preserveSilence for renderMediaOnWeb()",
                summary:
                    "Added an option to keep silent head and tail frames when rendering. It ships with a regression test.",
                href: "https://github.com/remotion-dev/remotion/pull/7074",
            },
            {
                number: 7107,
                title: "Wider playbackRate range in @remotion/player",
                summary:
                    "Validation now accepts ±10 instead of ±4, matching modern browsers. Docs and tests are updated.",
                href: "https://github.com/remotion-dev/remotion/pull/7107",
            },
        ],
    },
];
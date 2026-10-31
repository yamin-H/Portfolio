import { contributions } from "@/content/contributions";

export type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  sub: string;
};

const prs = contributions.reduce((n, c) => n + c.prs.length, 0);

export const stats: Stat[] = [
  { value: prs, label: "Merged pull requests", sub: "into projects I don’t own" },
  {
    value: contributions.length,
    label: "Open-source repos",
    sub: contributions.map((c) => c.repo).join(" · "),
  },
  { value: 1, label: "Package on PyPI", sub: "pip install yamin" },
  // from your CV: update it when it changes
  { value: 52.6, decimals: 1, suffix: "k+", label: "Stars on Remotion", sub: "a repo I contributed to" },
];
"use client";

import { useMemo, useState } from "react";
import TLink from "@/components/ui/TLink";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/posts";

const types = [
  { id: "all", label: "All" },
  { id: "post", label: "Posts" },
  { id: "research", label: "Research" },
];

const chip = (on: boolean) =>
  `border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-[240ms] ${
    on
      ? "border-accent bg-accent text-paper"
      : "border-ink/70 hover:border-accent hover:text-accent"
  }`;

export default function WritingList({ posts }: { posts: PostMeta[] }) {
  const [type, setType] = useState("all");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );
  const shown = posts.filter(
    (p) =>
      (type === "all" || p.type === type) && (!tag || p.tags.includes(tag))
  );

  if (posts.length === 0) {
    return (
      <p className="border border-dashed border-rule px-6 py-12 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
        Nothing published yet
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            aria-pressed={type === t.id}
            className={chip(type === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Topic
          </span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              aria-pressed={tag === t}
              className={chip(tag === t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-10 border-b border-rule">
        {shown.map((p) => (
          <li key={p.slug}>
            <TLink
              href={`/writing/${p.slug}`}
              label="Writing"
              className="group grid gap-x-10 gap-y-2 border-t border-rule py-8 transition-colors duration-[240ms] hover:bg-paper/50 sm:grid-cols-[9rem_1fr]"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
                <p className="text-accent">
                  {p.type === "research" ? "Research" : "Post"}
                  {p.draft ? " · Draft" : ""}
                </p>
                <p className="mt-1 text-ink-soft">{formatDate(p.date)}</p>
              </div>
              <div>
                <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                  {p.title}{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block text-accent transition-transform duration-[240ms] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </h2>
                {p.summary && (
                  <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                    {p.summary}
                  </p>
                )}
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  {p.minutes} min read
                  {p.tags.length > 0 && ` · ${p.tags.join(" · ")}`}
                </p>
              </div>
            </TLink>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="border-t border-rule py-12 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            Nothing matches
          </li>
        )}
      </ul>
    </div>
  );
}
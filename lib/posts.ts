import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const DIR = path.join(process.cwd(), "content", "posts");

export type Heading = { depth: 2 | 3; text: string; id: string };

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  type: "post" | "research";
  tags: string[];
  draft: boolean;
  cover?: string;
  minutes: number;
};

export type Post = PostMeta & { content: string; headings: Heading[] };

const day = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10);

/** Same ids that rehype-slug puts on the headings, so the sidebar links match. */
function headingsOf(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let fence = false;
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*]/g, "")
      .trim();
    out.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return out;
}

function load(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  const posts: Post[] = [];

  for (const file of fs.readdirSync(DIR)) {
    if (!file.endsWith(".mdx")) continue;
    const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
    if (!data.title || !data.date) {
      console.warn(`[posts] ${file}: needs a title and a date, skipped`);
      continue;
    }
    posts.push({
      slug: file.replace(/\.mdx$/, ""),
      title: String(data.title),
      summary: String(data.summary ?? ""),
      date: day(data.date),
      updated: data.updated ? day(data.updated) : undefined,
      type: data.type === "research" ? "research" : "post",
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: data.draft === true,
      cover: data.cover ? String(data.cover) : undefined,
      minutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
      content,
      headings: headingsOf(content),
    });
  }

  return posts
    .filter((p) => !(p.draft && process.env.NODE_ENV === "production"))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const meta = (p: Post): PostMeta => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  date: p.date,
  updated: p.updated,
  type: p.type,
  tags: p.tags,
  draft: p.draft,
  cover: p.cover,
  minutes: p.minutes,
});

export const getAllPosts = (): PostMeta[] => load().map(meta);
export const getPost = (slug: string): Post | undefined =>
  load().find((p) => p.slug === slug);
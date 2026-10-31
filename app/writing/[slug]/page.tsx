import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Reveal from "@/components/ui/Reveal";
import InkLine from "@/components/ui/InkLine";
import TLink from "@/components/ui/TLink";
import Footer from "@/components/sections/Footer";
import Toc from "@/components/writing/Toc";
import ReadingProgress from "@/components/writing/ReadingProgress";
import { Figure, mdxComponents } from "@/components/writing/mdx";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

// export const dynamicParams = false;

export function generateStaticParams() {
    const posts = getAllPosts();
    return posts.length > 0 ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <ReadingProgress targetId="article-body" />
      <main
        id="main"
        className="mx-auto max-w-6xl px-6 pb-12 pt-12 sm:px-8 sm:pt-16"
      >
        <TLink
          href="/writing"
          label="Writing"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-[240ms] hover:text-accent"
        >
          ← All writing
        </TLink>

        <Reveal className="mt-10 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {post.type === "research" ? "Research" : "Post"}
            {post.draft ? " · Draft, visible only in development" : ""}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              {post.summary}
            </p>
          )}
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            {formatDate(post.date)}
            {post.updated ? ` · Updated ${formatDate(post.updated)}` : ""} ·{" "}
            {post.minutes} min read
          </p>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="border border-rule px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Reveal>

        {post.cover && (
          <div className="mt-10 max-w-3xl">
            <Figure src={post.cover} alt={post.title} />
          </div>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <article id="article-body" className="min-w-0 lg:col-span-8">
            <div className="max-w-[42rem]">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </div>
          </article>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <Toc headings={post.headings} />
            </div>
          </aside>
        </div>

        {more.length > 0 && (
          <section className="mt-24">
            <InkLine className="text-ink-soft/50" />
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Keep reading
            </p>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {more.map((p) => (
                <li key={p.slug}>
                  <TLink
                    href={`/writing/${p.slug}`}
                    label="Writing"
                    className="group block h-full border border-ink/60 bg-paper/60 p-6 transition-colors duration-[240ms] hover:border-accent"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                      {p.type === "research" ? "Research" : "Post"} ·{" "}
                      {formatDate(p.date)}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight">
                      {p.title}{" "}
                      <span className="inline-block text-accent transition-transform duration-[240ms] group-hover:translate-x-1">
                        →
                      </span>
                    </h3>
                    <p className="mt-2 text-ink-soft">{p.summary}</p>
                  </TLink>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
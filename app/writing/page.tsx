import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import Footer from "@/components/sections/Footer";
import WritingList from "@/components/writing/WritingList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes and research on the systems I build, written down so others can learn from them.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <>
      <main
        id="main"
        className="mx-auto max-w-6xl px-6 pb-12 pt-12 sm:px-8 sm:pt-16"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Fig_W · Writing
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.03] tracking-tight sm:text-7xl">
            Notes and research.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            How I think about the systems I build, written down so others can
            learn from it.
          </p>
          <a
            href="/feed.xml"
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
          >
            RSS ↗
          </a>
        </Reveal>

        <div className="mt-14">
          <WritingList posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
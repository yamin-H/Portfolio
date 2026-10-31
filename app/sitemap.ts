import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/content/projects";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base },
    { url: `${base}/writing` },
    ...getAllPosts().map((p) => ({
      url: `${base}/writing/${p.slug}`,
      lastModified: p.updated ?? p.date,
    })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
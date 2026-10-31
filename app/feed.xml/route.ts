import { getAllPosts } from "@/lib/posts";

// export const dynamic = "force-static";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllPosts()
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${base}/writing/${p.slug}</link>
<guid>${base}/writing/${p.slug}</guid>
<pubDate>${new Date(p.date).toUTCString()}</pubDate>
<description>${esc(p.summary)}</description>
</item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Yamin Hossain · Writing</title>
<link>${base}/writing</link>
<description>Notes and research.</description>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
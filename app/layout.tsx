import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import InkFilter from "@/components/paper/InkFilter";
import PaperLayer from "@/components/paper/PaperLayer";
import PaperLight from "@/components/paper/PaperLight";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PageTransition from "@/components/ui/PageTransition";
import CommandPalette from "@/components/ui/CommandPalette";
import Navbar from "@/components/sections/Navbar";
import PerfGuard from "@/components/ui/PerfGuard";
import { getAllPosts } from "@/lib/posts";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-src",
  axes: ["opsz"],
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body-src",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-src",
});

const description =
  "Full-stack AI engineer. I build agents that ship: a GitHub App that remembers your team's review decisions, and a terminal coding agent for any model provider.";

export const metadata: Metadata = {
  // set NEXT_PUBLIC_SITE_URL in Vercel once you have your domain
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Yamin Hossain — Full-Stack AI Engineer",
    template: "%s · Yamin Hossain",
  },
  description,
  openGraph: {
    title: "Yamin Hossain — Full-Stack AI Engineer",
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const writing = getAllPosts()
    .slice(0, 3)
    .map(({ slug, title, type }) => ({ slug, title, type }));

    return (
        <html
            lang="en"
            className={`${display.variable} ${body.variable} ${mono.variable}`}
        >
            <body>
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-paper"
                >
                    Skip to content
                </a>
                <InkFilter />
                <PaperLayer />
                <PaperLight />
                <PerfGuard />
                <SmoothScroll>
                    <PageTransition>
                        <Navbar writing={writing} />
                        {children}
                        <CommandPalette />
                    </PageTransition>
                </SmoothScroll>
            </body>
        </html>
    );
}
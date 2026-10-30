import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import PaperLayer from "@/components/paper/PaperLayer";
import InkFilter from "@/components/paper/InkFilter";
import Navbar from "@/components/sections/Navbar";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Yamin Hossain — Full-Stack AI Engineer",
  description: "Portfolio of Yamin Hossain, full-stack AI engineer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${display.variable} ${body.variable} ${mono.variable}`}
        >
            
            <body>
                <InkFilter />
                <PaperLayer />
                <SmoothScroll>
                    <Navbar />
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}
import Link from "next/link";
import NavLink from "@/components/ui/NavLink";

const links = [
  { href: "#work", index: "01", label: "Work" },
  { href: "#skills", index: "02", label: "Skills" },
  { href: "#about", index: "03", label: "About" },
  { href: "#contact", index: "04", label: "Contact" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-rule/80 bg-paper/75 backdrop-blur-sm">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
                <Link href="/" className="font-display text-xl tracking-tight">
                    Yamin<span className="hidden sm:inline"> Hossain</span>
                    <span className="text-accent">.</span>
                </Link>

                <div className="flex items-center gap-5 sm:gap-8">
                    {links.map((l) => (
                        <NavLink key={l.href} href={l.href} index={l.index}>
                            {l.label}
                        </NavLink>
                    ))}

                    <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft md:flex">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        Open to work
                    </span>
                </div>
            </nav>
        </header>
    );
}
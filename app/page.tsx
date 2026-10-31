import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import ProjectGrid from "@/components/sections/ProjectGrid";
import Skills from "@/components/sections/Skills";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ScrollRail from "@/components/ui/ScrollRail";
import Contributions from "@/components/sections/Contributions";
import LatestWriting from "@/components/sections/LatestWriting"

export default function Home() {
    return (
        <>
            <ScrollRail />
            <main id="main">
                <Hero />
                <Projects />
                <ProjectGrid />
                <Contributions />
                <Skills />
                <About />
                <LatestWriting />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
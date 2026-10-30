import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
    return (
        <>
            <main>
                <Hero />
                <Projects />
                <Skills />
                <About />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
import Hero from "@/components/sections/Hero";
import ProofStrip from "@/components/sections/ProofStrip";
import Projects from "@/components/sections/Projects";
import ProjectGrid from "@/components/sections/ProjectGrid";
import Contributions from "@/components/sections/Contributions";
import Skills from "@/components/sections/Skills";
import About from "@/components/sections/About";
import LatestWriting from "@/components/sections/LatestWriting";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ScrollRail from "@/components/ui/ScrollRail";

export default function Home() {
  return (
    <>
      <ScrollRail />
      <main id="main">
        <Hero />
        <ProofStrip />
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
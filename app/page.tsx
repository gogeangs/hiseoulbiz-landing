import CountdownBanner from "@/components/CountdownBanner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import InternshipInfo from "@/components/InternshipInfo";
import ProgramOverview from "@/components/ProgramOverview";
import Curriculum from "@/components/Curriculum";
import Eligibility from "@/components/Eligibility";
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      <CountdownBanner />
      <Header />
      <main>
        <Hero />
        <Benefits />
        <InternshipInfo />
        <ProgramOverview />
        <Curriculum />
        <Eligibility />
        <Timeline />
        <FAQ />
      </main>
      <Contact />
      <FloatingCTA />
    </>
  );
}

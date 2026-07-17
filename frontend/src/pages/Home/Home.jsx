import { useEffect, useRef, useState } from "react";
import HeroLace from "../../components/sections/HeroLace";
import AboutSection from "../../components/sections/AboutSection";
import FeaturedEventSection from "../../components/sections/FeaturedEventSection";
import TeamSection from "../../components/sections/TeamSection";
import SupportersSection from "../../components/sections/SupportersSection";
import ContactSection from "../../components/sections/ContactSection";

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const shouldScrollToAbout = useRef(false);

  function openAbout() {
    shouldScrollToAbout.current = true;
    setIsAboutOpen(true);
  }

  useEffect(() => {
    if (!isAboutOpen || !shouldScrollToAbout.current) return;

    shouldScrollToAbout.current = false;
    requestAnimationFrame(() => {
      document.getElementById("apresentacao-lace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [isAboutOpen]);

  return (
    <>
      <HeroLace onOpenAbout={openAbout} />
      <AboutSection isOpen={isAboutOpen} onToggle={() => setIsAboutOpen((open) => !open)} />
      <FeaturedEventSection />
      <ContactSection />
      <SupportersSection />
      <TeamSection />
    </>
  );
}

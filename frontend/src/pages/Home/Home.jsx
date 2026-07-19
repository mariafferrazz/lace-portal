import { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeroLace from "../../components/sections/HeroLace";
import AboutSection from "../../components/sections/AboutSection";

const FeaturedEventSection = lazy(() => import("../../components/sections/FeaturedEventSection"));
const ContactSection = lazy(() => import("../../components/sections/ContactSection"));
const SupportersSection = lazy(() => import("../../components/sections/SupportersSection"));
const TeamSection = lazy(() => import("../../components/sections/TeamSection"));

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showBelowFold, setShowBelowFold] = useState(false);
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

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setShowBelowFold(true), { timeout: 900 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(() => setShowBelowFold(true), 350);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <HeroLace onOpenAbout={openAbout} />
      <AboutSection isOpen={isAboutOpen} onToggle={() => setIsAboutOpen((open) => !open)} />
      {showBelowFold && (
        <Suspense fallback={null}>
          <FeaturedEventSection />
          <ContactSection />
          <SupportersSection />
          <TeamSection />
        </Suspense>
      )}
    </>
  );
}

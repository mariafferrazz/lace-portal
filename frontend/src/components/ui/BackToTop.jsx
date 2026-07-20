import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > 500);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Voltar ao início da página"
          title="Voltar ao início"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="fixed bottom-6 left-1/2 z-40 grid size-12 -translate-x-1/2 place-items-center rounded-full border border-white/30 bg-black/70 text-white shadow-xl backdrop-blur transition hover:-translate-x-1/2 hover:-translate-y-1 hover:border-primary hover:bg-primary-fill hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:bottom-8"
        >
          <ArrowUp aria-hidden="true" size={21} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

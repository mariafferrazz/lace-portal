import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function shouldHideOnSamsungMobile() {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent || "";
  const isSamsungInternet = /SamsungBrowser/i.test(userAgent);
  const isTouchDevice =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

  return isSamsungInternet && isTouchDevice;
}

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function updateVisibility() {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 500);
        ticking = false;
      });
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (!isVisible || shouldHideOnSamsungMobile()) return null;

  return (
    <button
      type="button"
      aria-label="Voltar ao início da página"
      title="Voltar ao início"
      onClick={scrollToTop}
      className="fixed bottom-6 left-1/2 z-40 grid size-12 -translate-x-1/2 place-items-center rounded-full border border-white/30 bg-black/70 text-white shadow-xl backdrop-blur transition hover:-translate-x-1/2 hover:-translate-y-1 hover:border-primary hover:bg-primary-fill hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:bottom-8"
    >
      <ArrowUp aria-hidden="true" size={21} />
    </button>
  );
}

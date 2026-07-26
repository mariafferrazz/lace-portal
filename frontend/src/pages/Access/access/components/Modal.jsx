import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ children, onClose, size = "max-w-6xl" }) {
  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`relative max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-border bg-background p-5 shadow-2xl md:p-8 ${size}`}>
        <button
          type="button"
          className="absolute right-4 top-4 z-10 rounded-full border border-border bg-card p-3 text-text transition hover:border-primary hover:text-primary"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={22} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function TeamCard({ name, role, bio }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <article className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/60">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full cursor-pointer items-center justify-between gap-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span>
          <span className="block font-title text-2xl md:text-3xl">{name}</span>
          <span className="mt-1 block text-primary">{role}</span>
        </span>
        <ChevronDown aria-hidden="true" className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="overflow-hidden"
          >
            <p className="mt-6 border-t border-border pt-5 leading-7 text-muted">{bio}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

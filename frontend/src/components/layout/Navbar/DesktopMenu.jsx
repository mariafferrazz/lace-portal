import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { menu } from "../../../data/menu";
import HomeLink from "./HomeLink";

export default function DesktopMenu() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-8 text-sm font-medium uppercase tracking-wide text-text">
        {menu.map((item, index) => (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            {/* ITEM PRINCIPAL */}
            {item.children ? (
              <div className="flex cursor-pointer items-center gap-1 transition hover:text-primary">
                {item.title}
                <ChevronDown size={14} />
              </div>
            ) : item.path === "/" ? (
              <HomeLink className="transition hover:text-primary">
                {item.title}
              </HomeLink>
            ) : (
              <Link
                to={item.path}
                className="transition hover:text-primary"
              >
                {item.title}
              </Link>
            )}

            {/* DROPDOWN */}
            <AnimatePresence>
              {item.children && openIndex === index && (
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-6 z-50 mt-3 w-64 rounded-md border border-border bg-card p-3 shadow-lg"
                >
                  {item.children.map((sub, i) => (
                    <li key={i}>
                      <Link
                        to={sub.path}
                        className="flex items-center justify-between gap-3 rounded px-3 py-2 text-sm text-text transition hover:bg-surface hover:text-primary"
                      >
                        <span>{sub.title}</span>
                        {sub.children && <ChevronDown size={12} aria-hidden="true" />}
                      </Link>

                      {sub.children && (
                        <ul className="mt-1 border-l border-border pl-3">
                          {sub.children.map((nested) => (
                            <li key={nested.path}>
                              <Link
                                to={nested.path}
                                className="block rounded px-3 py-2 text-sm normal-case tracking-normal text-muted transition hover:bg-surface hover:text-primary"
                              >
                                {nested.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </nav>
  );
}

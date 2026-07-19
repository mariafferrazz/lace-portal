import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { menu } from "../../../data/menu";
import HomeLink from "./HomeLink";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  function toggleMenu() {
    setIsOpen(!isOpen);
    setOpenSubmenu(null);
  }

  function toggleSubmenu(index) {
    setOpenSubmenu(openSubmenu === index ? null : index);
  }

  function closeMenu() {
    setIsOpen(false);
    setOpenSubmenu(null);
  }

  return (
    <div className="lg:hidden">
      {/* BOTÃO HAMBÚRGUER */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        className="grid size-11 place-items-center rounded-md border border-border bg-card text-text shadow-lg shadow-black/20 transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {isOpen ? <X size={24} strokeWidth={2.4} /> : <Menu size={24} strokeWidth={2.4} />}
      </button>

      {/* OVERLAY + MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* FUNDO ESCURO */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* MENU */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{ backgroundColor: "var(--app-background)" }}
              className="mobile-menu-panel fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto border-l border-border p-6 text-text shadow-2xl"
            >
              {/* HEADER */}
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-wide text-primary">
                  Menu
                </h2>

                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Fechar menu"
                  className="grid size-10 place-items-center rounded-md border border-border bg-background text-text transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X size={24} />
                </button>
              </div>

              {/* MENU ITEMS */}
              <ul className="mobile-menu-list flex flex-col gap-2 uppercase tracking-wide">
                {menu.map((item, index) => (
                  <li key={index}>
                    {/* ITEM COM SUBMENU */}
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(index)}
                          className="flex min-h-12 w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-left font-semibold text-text transition hover:border-primary hover:text-primary"
                        >
                          {item.title}
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              openSubmenu === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* SUBMENU */}
                        <AnimatePresence>
                          {openSubmenu === index && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-2 flex flex-col gap-2 overflow-hidden rounded-md border border-border bg-card p-2"
                            >
                              {item.children.map((sub, i) => (
                                <li key={i}>
                                  <Link
                                    to={sub.path}
                                    onClick={closeMenu}
                                    className="flex items-center justify-between gap-3 rounded-md bg-background px-4 py-3 text-sm font-medium text-text transition hover:text-primary"
                                  >
                                    <span>{sub.title}</span>
                                    {sub.children && <ChevronDown size={14} aria-hidden="true" />}
                                  </Link>

                                  {sub.children && (
                                    <ul className="mt-2 flex flex-col gap-1 border-l border-border pl-3">
                                      {sub.children.map((nested) => (
                                        <li key={nested.path}>
                                          <Link
                                            to={nested.path}
                                            onClick={closeMenu}
                                            className="block rounded-md bg-background/70 px-4 py-2 text-sm font-medium normal-case tracking-normal text-muted transition hover:text-primary"
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
                      </>
                    ) : item.path === "/" ? (
                      <HomeLink
                        onClick={closeMenu}
                        className="block min-h-12 rounded-md border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:text-primary"
                      >
                        {item.title}
                      </HomeLink>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className="block min-h-12 rounded-md border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

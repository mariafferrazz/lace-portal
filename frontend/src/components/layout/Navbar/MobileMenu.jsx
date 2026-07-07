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
        onClick={toggleMenu}
        className="text-text transition hover:text-primary"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
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
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-border bg-card p-6 text-text shadow-2xl"
            >
              {/* HEADER */}
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-wide text-primary">
                  Menu
                </h2>

                <button onClick={closeMenu}>
                  <X size={24} />
                </button>
              </div>

              {/* MENU ITEMS */}
              <ul className="flex flex-col gap-4 uppercase tracking-wide">
                {menu.map((item, index) => (
                  <li key={index}>
                    {/* ITEM COM SUBMENU */}
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(index)}
                          className="flex w-full items-center justify-between text-left text-text hover:text-primary"
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
                              className="ml-4 mt-2 flex flex-col gap-2 overflow-hidden border-l border-border pl-4"
                            >
                              {item.children.map((sub, i) => (
                                <li key={i}>
                                  <Link
                                    to={sub.path}
                                    onClick={closeMenu}
                                    className="text-sm text-muted hover:text-primary"
                                  >
                                    {sub.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : item.path === "/" ? (
                      <HomeLink
                        onClick={closeMenu}
                        className="block text-text hover:text-primary"
                      >
                        {item.title}
                      </HomeLink>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className="block text-text hover:text-primary"
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

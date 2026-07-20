import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { menu } from "../../../data/menu";
import HomeLink from "./HomeLink";

function menuLabel(label) {
  return label.toLocaleUpperCase("pt-BR");
}

export default function DesktopMenu() {
  const navRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [openNestedIndex, setOpenNestedIndex] = useState(null);
  const [lockedIndex, setLockedIndex] = useState(null);

  function toggleDropdown(index) {
    const isLocked = lockedIndex === index;
    setOpenIndex(isLocked ? null : index);
    setLockedIndex(isLocked ? null : index);
    setOpenNestedIndex(null);
  }

  function openDropdown(index) {
    if (lockedIndex !== null && lockedIndex !== index) setLockedIndex(null);
    if (openIndex !== index) setOpenNestedIndex(null);
    setOpenIndex(index);
  }

  function leaveDropdown(index) {
    if (lockedIndex === index) return;
    setOpenIndex(null);
    setOpenNestedIndex(null);
  }

  function closeDropdown() {
    setOpenIndex(null);
    setOpenNestedIndex(null);
    setLockedIndex(null);
  }

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!navRef.current?.contains(event.target)) closeDropdown();
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <nav ref={navRef} className="hidden lg:block">
      <ul className="flex items-center gap-8 text-sm font-medium uppercase tracking-wide text-text">
        {menu.map((item, index) => (
          <li
            key={index}
            className="relative -my-4 flex items-center py-4"
            onMouseEnter={() => item.children && openDropdown(index)}
            onMouseLeave={() => item.children && leaveDropdown(index)}
          >
            {/* ITEM PRINCIPAL */}
            {item.children ? (
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => toggleDropdown(index)}
                aria-expanded={openIndex === index}
              >
                {menuLabel(item.title)}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            ) : item.path === "/" ? (
              <HomeLink className="transition hover:text-primary">
                {menuLabel(item.title)}
              </HomeLink>
            ) : (
              <Link
                to={item.path}
                className="transition hover:text-primary"
              >
                {menuLabel(item.title)}
              </Link>
            )}

            {/* DROPDOWN */}
            {item.children && openIndex === index && (
                <ul className="absolute left-0 top-full z-50 w-64 rounded-md border border-border bg-card p-3 shadow-lg">
                  {item.children.map((sub, i) => (
                    <li key={i} onMouseEnter={() => sub.children && setOpenNestedIndex(i)}>
                      {sub.children ? (
                        <button
                          type="button"
                          onClick={() => setOpenNestedIndex(openNestedIndex === i ? null : i)}
                          className="flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm uppercase tracking-wide text-text transition hover:bg-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-expanded={openNestedIndex === i}
                        >
                          <span>{menuLabel(sub.title)}</span>
                          <ChevronDown
                            size={12}
                            className={`transition-transform ${openNestedIndex === i ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <Link
                          to={sub.path}
                          className="flex items-center justify-between gap-3 rounded px-3 py-2 text-sm uppercase tracking-wide text-text transition hover:bg-surface hover:text-primary"
                          onClick={closeDropdown}
                        >
                          <span>{menuLabel(sub.title)}</span>
                        </Link>
                      )}

                      {sub.children && openNestedIndex === i && (
                          <ul className="mt-1 overflow-hidden border-l border-border pl-3">
                            {sub.children.map((nested) => (
                              <li key={nested.path}>
                                <Link
                                  to={nested.path}
                                  className="block rounded px-3 py-2 text-sm uppercase tracking-wide text-muted transition hover:bg-surface hover:text-primary"
                                  onClick={closeDropdown}
                                >
                                  {menuLabel(nested.title)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

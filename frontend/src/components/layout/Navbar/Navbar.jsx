import { useEffect, useState } from "react";
import Container from "../../ui/Container";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../../ui/ThemeToggle";
import { menu } from "../../../data/menu";
import api from "../../../services/api";
import { eventYear, eventYearPath, isKnownEventYear, isKnownShowSlug, showLabel, showPath } from "../../../utils/contentRoutes";

function mergeDynamicMenu(contents = []) {
  const nextMenu = menu.map((item) => ({
    ...item,
    children: item.children ? item.children.map((child) => ({ ...child, children: child.children ? [...child.children] : child.children })) : item.children,
  }));
  const cinemaMenu = nextMenu.find((item) => item.title === "Cinema e Ditadura");
  const eventMenu = nextMenu.find((item) => item.title === "Eventos e Atividades");
  const dynamicShows = contents
    .filter((content) => content.type === "CINEMA_SHOW")
    .map((content) => ({ title: showLabel(content), path: showPath(content), year: eventYear(content) }))
    .filter((item) => item.path && !isKnownShowSlug(item.path.split("/").pop()))
    .sort((a, b) => String(b.year).localeCompare(String(a.year)));
  const dynamicYears = [...new Set(contents
    .filter((content) => ["EVENT", "CINEMA_SHOW"].includes(content.type))
    .map(eventYear)
    .filter((year) => year && !isKnownEventYear(year)))]
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ title: `Eventos ${year}`, path: eventYearPath(year) }));

  if (cinemaMenu?.children && dynamicShows.length) {
    const [films, glossaries, ...shows] = cinemaMenu.children;
    cinemaMenu.children = [films, glossaries, ...dynamicShows, ...shows];
  }

  if (eventMenu?.children && dynamicYears.length) {
    eventMenu.children = [...dynamicYears, ...eventMenu.children];
  }

  return nextMenu;
}

export default function Navbar() {
  const [items, setItems] = useState(menu);

  useEffect(() => {
    let active = true;
    api
      .get("/contents")
      .then(({ data }) => {
        if (active) setItems(mergeDynamicMenu(data.contents || []));
      })
      .catch(() => {
        if (active) setItems(menu);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-text backdrop-blur">
      <Container>
        <div className="flex h-24 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <DesktopMenu items={items} />
            <ThemeToggle />
            <MobileMenu items={items} />
          </div>
        </div>
      </Container>
    </header>
  );
}

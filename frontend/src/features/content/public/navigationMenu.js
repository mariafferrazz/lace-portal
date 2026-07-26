import { menu } from "../../../data/menu.js";
import {
  eventYear,
  eventYearPath,
  isKnownEventYear,
  isKnownShowSlug,
  showLabel,
  showPath,
} from "../../../utils/contentRoutes.js";

export function mergeDynamicMenu(contents = []) {
  const nextMenu = menu.map((item) => ({
    ...item,
    children: item.children
      ? item.children.map((child) => ({
        ...child,
        children: child.children ? [...child.children] : child.children,
      }))
      : item.children,
  }));
  const cinemaMenu = nextMenu.find((item) => item.title === "Cinema e Ditadura");
  const eventMenu = nextMenu.find((item) => item.title === "Eventos e Atividades");
  const dynamicShows = contents
    .filter((content) => (
      content.type === "CINEMA_SHOW"
      && content.metadata?.createCinemaPage !== false
      && content.metadata?.cinemaPath
    ))
    .map((content) => ({
      title: showLabel(content),
      path: showPath(content),
      year: eventYear(content),
    }))
    .filter((item) => item.path && !isKnownShowSlug(item.path.split("/").pop()))
    .sort((left, right) => String(right.year).localeCompare(String(left.year)));
  const dynamicYears = [...new Set(contents
    .filter((content) => ["EVENT", "CINEMA_SHOW"].includes(content.type))
    .map(eventYear)
    .filter((year) => year && !isKnownEventYear(year)))]
    .sort((left, right) => Number(right) - Number(left))
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

import { menu } from "../../../data/menu.js";
import {
  eventYear,
  eventYearPath,
  isKnownEventYear,
  isKnownShowSlug,
  normalizeSlug,
  showLabel,
  showPath,
} from "../../../utils/contentRoutes.js";

function mergeUniqueMenuItems(staticItems = [], dynamicItems = []) {
  const itemsByPath = new Map();

  [...staticItems, ...dynamicItems].forEach((item) => {
    if (!item?.title || !item?.path) return;
    itemsByPath.set(item.path, item);
  });

  return [...itemsByPath.values()].sort((left, right) => (
    left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" })
  ));
}

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
  const academicMenu = nextMenu.find((item) => item.title === "Produção Acadêmica");
  const articlesMenu = academicMenu?.children?.find((item) => item.title === "Artigos");
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
  const dynamicArticleAuthors = contents
    .filter((content) => content.type === "ARTICLE_AUTHOR" && content.title)
    .map((content) => ({
      title: content.title,
      path: `/producao-academica/artigos#${normalizeSlug(content.title)}`,
    }));

  if (cinemaMenu?.children && dynamicShows.length) {
    const [films, glossaries, ...shows] = cinemaMenu.children;
    cinemaMenu.children = [films, glossaries, ...dynamicShows, ...shows];
  }
  if (eventMenu?.children && dynamicYears.length) {
    eventMenu.children = [...dynamicYears, ...eventMenu.children];
  }
  if (articlesMenu && dynamicArticleAuthors.length) {
    articlesMenu.children = mergeUniqueMenuItems(articlesMenu.children, dynamicArticleAuthors);
  }

  return nextMenu;
}

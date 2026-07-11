import staticContent from "./staticContent.json";

export function getStaticContents(type) {
  return staticContent.contents.filter((content) => content.type === type);
}

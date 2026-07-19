export async function getStaticContents(type) {
  const { default: staticContent } = await import("./staticContent.json");
  return staticContent.contents.filter((content) => content.type === type);
}

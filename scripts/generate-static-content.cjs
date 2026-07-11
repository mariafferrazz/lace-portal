const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const filmsDir = path.join(root, "backend", "prisma", "imports", "cinema-e-ditadura", "filmes");
const glossaryDir = path.join(root, "backend", "prisma", "imports", "cinema-e-ditadura", "verbetes");
const outputPath = path.join(root, "frontend", "src", "data", "staticContent.json");

const normalize = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function evaluateExpression(expression, filename) {
  try {
    return vm.runInNewContext(`(${expression})`, {}, { filename, timeout: 1000 });
  } catch (error) {
    throw new Error(`Nao foi possivel ler ${filename}: ${error.message}`);
  }
}

function extractAssignedExpression(source, name, opener, closer) {
  const assignment = source.match(new RegExp(`const\\s+${name}\\s*=`));
  if (!assignment) return null;

  const start = source.indexOf(opener, assignment.index + assignment[0].length);
  if (start < 0) return null;

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote && !(quote === "`" && previous === "$")) {
        quote = null;
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === opener) depth += 1;
    if (char === closer) depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  return null;
}

function extractArray(source, name, filename) {
  const expression = extractAssignedExpression(source, name, "[", "]");
  if (!expression) return null;
  return evaluateExpression(expression, filename);
}

function extractObject(source, name, filename) {
  const expression = extractAssignedExpression(source, name, "{", "}");
  if (!expression) return null;
  return evaluateExpression(expression, filename);
}

function tupleToGlossaryEntry(tuple) {
  const [title, researcherName, authorBio, relatedTitles, description] = tuple;
  return { title, researcherName, authorBio, relatedTitles, description };
}

function readImportFiles(directory, prefix) {
  return fs
    .readdirSync(directory)
    .filter((file) => file.startsWith(prefix) && file.endsWith(".js"))
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((file) => {
      const filename = path.join(directory, file);
      return { file, filename, source: fs.readFileSync(filename, "utf8") };
    });
}

const rawFilms = readImportFiles(filmsDir, "import-films-").flatMap(({ file, filename, source }) => {
  const films = extractArray(source, "films", filename);
  if (!films) throw new Error(`Lista de filmes nao encontrada em ${file}.`);
  return films;
});

const films = rawFilms.map((film, index) => {
  const id = `film-${normalize(film.title) || index}`;
  const externalUrl = film.externalUrl || (film.youtubeId ? `https://www.youtube.com/watch?v=${film.youtubeId}` : null);
  return {
    id,
    title: film.title,
    description: film.description || "",
    type: "FILM",
    researcherName: film.researcherName || "Equipe LACE",
    externalUrl,
    published: true,
    metadata: {
      youtubeId: film.youtubeId || null,
      vimeoId: film.vimeoId || null,
      videoProvider: film.vimeoId ? "vimeo" : film.youtubeId ? "youtube" : null,
      imageUrl: film.imageUrl || (film.youtubeId ? `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg` : null),
      director: film.director || null,
      genre: film.genre || null,
      country: film.country || null,
      year: film.year || null,
      duration: film.duration || null,
      website: film.website || null,
    },
  };
});

const filmByTitle = new Map(films.map((film) => [normalize(film.title), { id: film.id, title: film.title }]));

const rawEntries = readImportFiles(glossaryDir, "import-glossary-").flatMap(({ file, filename, source }) => {
  const entries = extractArray(source, "entries", filename);
  if (entries) return entries;
  const entry = extractObject(source, "entry", filename);
  if (entry) return [entry];
  const compactEntries = extractArray(source, "e", filename);
  if (compactEntries) return compactEntries.map(tupleToGlossaryEntry);
  throw new Error(`Lista de verbetes nao encontrada em ${file}.`);
});

const glossary = rawEntries.map((entry, index) => {
  const relatedFilms = (entry.relatedTitles || [])
    .map((title) => filmByTitle.get(normalize(title)))
    .filter(Boolean);

  return {
    id: `glossary-${normalize(entry.title) || index}`,
    title: entry.title,
    description: entry.description || "",
    type: "GLOSSARY",
    researcherName: entry.researcherName || "Equipe LACE",
    published: true,
    metadata: {
      authorBio: entry.authorBio || null,
      sourceUrl: entry.sourceUrl || null,
      sourceLabel: entry.sourceLabel || null,
      references: entry.references || null,
      inlineImages: entry.inlineImages || [],
      relatedFilms,
      relatedExternalLinks: entry.relatedExternalLinks || [],
    },
  };
});

const contents = [...films, ...glossary];
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ contents }, null, 2)}\n`, "utf8");

console.log(`Conteudo estatico gerado: ${films.length} filmes, ${glossary.length} verbetes.`);

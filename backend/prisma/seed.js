require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("../src/db");
const contentSeeds = require("./static-content-seeds.json");
const teamSeeds = require("./team-seeds.json");

const accounts = [
  { prefix: "COORDINATOR_1", role: "COORDINATOR", required: true, displayName: "Joana" },
  { prefix: "COORDINATOR_2", role: "COORDINATOR", required: false },
  { prefix: "CONTRIBUTOR", role: "CONTRIBUTOR", required: false, displayName: "Pesquisadores" },
];

function metadataObject(value) {
  if (!value) return {};
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function articleAuthorNames(content) {
  const metadata = metadataObject(content.metadata);
  if (Array.isArray(metadata.authors)) return metadata.authors.filter(Boolean);

  return [metadata.authorName || metadata.authors || content.researcherName]
    .map((name) => String(name || "").trim())
    .filter(Boolean);
}

function profileLinkName(url = "") {
  if (url.includes("lattes.cnpq.br")) return "Lattes";
  if (url.includes("linkedin.com")) return "LinkedIn";
  return "Site";
}

function memberLinks(member) {
  if (Array.isArray(member.links)) {
    return member.links
      .map((link) => ({ name: String(link.name || "").trim(), url: String(link.url || "").trim() }))
      .filter((link) => link.name && link.url);
  }
  return member.profileUrl ? [{ name: profileLinkName(member.profileUrl), url: member.profileUrl }] : [];
}

async function main() {
  let seedUserEmail = null;

  for (const { prefix, role, required, displayName } of accounts) {
    const configuredName = process.env[`${prefix}_NAME`]?.trim();
    const name = displayName || configuredName;
    const email = process.env[`${prefix}_EMAIL`]?.trim().toLowerCase();
    const password = process.env[`${prefix}_PASSWORD`];

    if (!required && !configuredName && !email && !password) continue;
    if (!name || !email || !password) {
      throw new Error(`Configure ${prefix}_NAME, ${prefix}_EMAIL e ${prefix}_PASSWORD.`);
    }
    if (password.length < 8) {
      throw new Error(`${prefix}_PASSWORD deve ter pelo menos 8 caracteres.`);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash, role, active: true },
      create: { name, email, passwordHash, role },
    });
    if (!seedUserEmail && role === "COORDINATOR") seedUserEmail = email;
  }

  console.log("Contas iniciais configuradas.");

  let teamCount = 0;
  const teamSeedNames = teamSeeds.map((member) => member.name);

  await prisma.teamMember.deleteMany({
    where: {
      name: { notIn: teamSeedNames },
    },
  });

  for (const member of teamSeeds) {
    await prisma.teamMember.upsert({
      where: { name: member.name },
      update: {
        role: member.role,
        bio: member.bio,
        profileUrl: member.profileUrl || null,
        links: memberLinks(member),
        group: member.group,
        sortOrder: member.sortOrder,
        active: true,
      },
      create: {
        name: member.name,
        role: member.role,
        bio: member.bio,
        profileUrl: member.profileUrl || null,
        links: memberLinks(member),
        group: member.group,
        sortOrder: member.sortOrder,
      },
    });
    teamCount += 1;
  }

  console.log(`Equipe configurada. Membros: ${teamCount}.`);

  const seedUser = seedUserEmail
    ? await prisma.user.findUnique({ where: { email: seedUserEmail } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!seedUser) throw new Error("Nenhum usuário disponível para vincular conteúdos iniciais.");

  const legacyArticleSeedKey = "legacy-article-library-v1";
  const legacyArticleLibrary = await prisma.seedState.findUnique({
    where: { key: legacyArticleSeedKey },
  });
  let created = 0;
  let updated = 0;
  for (const seed of contentSeeds) {
    if (seed.type === "ARTICLE" && legacyArticleLibrary) continue;

    const existing = await prisma.content.findFirst({
      where: {
        title: seed.title,
        type: seed.type,
        researcherName: seed.researcherName || "LACE",
      },
    });
    const data = {
      title: seed.title,
      description: seed.description || null,
      type: seed.type,
      researcherName: seed.researcherName || "LACE",
      externalUrl: seed.externalUrl || null,
      fileUrl: seed.fileUrl || null,
      metadata: seed.metadata || {},
      published: seed.published !== false,
      createdById: existing?.createdById || seedUser.id,
    };

    if (existing) {
      await prisma.content.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await prisma.content.create({ data });
      created += 1;
    }
  }

  let configuredAuthors = 0;
  let linkedArticles = 0;
  if (!legacyArticleLibrary) {
    const legacyArticleAuthorNames = [...new Set(
      contentSeeds
        .filter((seed) => seed.type === "ARTICLE")
        .flatMap(articleAuthorNames),
    )];
    const articleAuthorsByName = new Map();

    for (const authorName of legacyArticleAuthorNames) {
      const existingAuthor = await prisma.content.findFirst({
        where: { type: "ARTICLE_AUTHOR", title: authorName },
      });
      const authorMetadata = {
        ...metadataObject(existingAuthor?.metadata),
        editorialArea: "PRODUCAO_ACADEMICA",
        pageKind: "ARTICLE_AUTHOR",
      };
      const author = existingAuthor
        ? await prisma.content.update({
          where: { id: existingAuthor.id },
          data: { published: true, metadata: authorMetadata },
        })
        : await prisma.content.create({
          data: {
            title: authorName,
            type: "ARTICLE_AUTHOR",
            researcherName: "Equipe LACE",
            published: true,
            metadata: authorMetadata,
            createdById: seedUser.id,
          },
        });

      articleAuthorsByName.set(authorName, author.id);
    }

    const legacyArticles = await prisma.content.findMany({ where: { type: "ARTICLE" } });
    for (const article of legacyArticles) {
      const metadata = metadataObject(article.metadata);
      if (Array.isArray(metadata.authorIds) && metadata.authorIds.length > 0) continue;

      const authorIds = articleAuthorNames(article)
        .map((name) => articleAuthorsByName.get(name))
        .filter(Boolean);
      if (authorIds.length === 0) continue;

      await prisma.content.update({
        where: { id: article.id },
        data: { metadata: { ...metadata, authorIds } },
      });
      linkedArticles += 1;
    }

    configuredAuthors = articleAuthorsByName.size;
    await prisma.seedState.upsert({
      where: { key: legacyArticleSeedKey },
      update: {},
      create: { key: legacyArticleSeedKey },
    });
  }

  console.log(`Conteúdos iniciais configurados. Criados: ${created}. Atualizados: ${updated}.`);
  if (configuredAuthors > 0) {
    console.log(`Autores de artigos configurados: ${configuredAuthors}. Artigos vinculados: ${linkedArticles}.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

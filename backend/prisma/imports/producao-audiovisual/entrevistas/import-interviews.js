require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("../../../../src/db");

const interviews = [
  {
    title: "Cecília Coimbra e Joana D'Arc (Grupo Tortura Nunca Mais RJ) - Núcleo de Educação e Cultura",
    externalUrl: "https://www.youtube.com/watch?v=KwEtO_vb3yg",
    youtubeId: "KwEtO_vb3yg",
  },
  {
    title: "Conversa sobre Gabriel Tarde com a Professora Joana D'Arc e Diego Monteiro",
    externalUrl: "https://www.youtube.com/watch?v=Jw-Gob3ziug",
    youtubeId: "Jw-Gob3ziug",
  },
  {
    title: "9º Bate papo sobre a pandemia: edição especial dia internacional de luta contra a tortura",
    externalUrl: "https://www.youtube.com/watch?v=7v2FhOGzZYg",
    youtubeId: "7v2FhOGzZYg",
  },
];

async function main() {
  const importer = await prisma.user.upsert({
    where: { email: "importacao-acervo@lace.local" },
    update: { name: "Importação Acervo LACE", role: "COORDINATOR", active: true },
    create: {
      name: "Importação Acervo LACE",
      email: "importacao-acervo@lace.local",
      passwordHash: await bcrypt.hash(`import-${Date.now()}`, 12),
      role: "COORDINATOR",
      active: true,
    },
  });

  for (const interview of interviews) {
    const data = {
      title: interview.title,
      description: "Entrevista disponível no canal do LACE no YouTube.",
      type: "INTERVIEW",
      researcherName: "Equipe LACE",
      externalUrl: interview.externalUrl,
      metadata: {
        platform: "YouTube",
        youtubeId: interview.youtubeId,
        thumbnail: `https://i.ytimg.com/vi/${interview.youtubeId}/hqdefault.jpg`,
      },
      published: true,
      createdById: importer.id,
    };

    const existing = await prisma.content.findFirst({
      where: { type: "INTERVIEW", title: interview.title },
    });

    if (existing) {
      await prisma.content.update({ where: { id: existing.id }, data });
    } else {
      await prisma.content.create({ data });
    }
  }

  console.log(`${interviews.length} entrevistas importadas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

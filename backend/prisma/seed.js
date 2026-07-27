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
        group: member.group,
        sortOrder: member.sortOrder,
        active: true,
      },
      create: {
        name: member.name,
        role: member.role,
        bio: member.bio,
        profileUrl: member.profileUrl || null,
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

  let created = 0;
  let updated = 0;
  for (const seed of contentSeeds) {
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

  console.log(`Conteúdos iniciais configurados. Criados: ${created}. Atualizados: ${updated}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

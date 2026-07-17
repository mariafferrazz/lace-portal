require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("../src/db");

const accounts = [
  { prefix: "COORDINATOR_1", role: "COORDINATOR", required: true },
  { prefix: "COORDINATOR_2", role: "COORDINATOR", required: false },
  { prefix: "CONTRIBUTOR", role: "CONTRIBUTOR", required: false },
];

async function main() {
  for (const { prefix, role, required } of accounts) {
    const name = process.env[`${prefix}_NAME`];
    const email = process.env[`${prefix}_EMAIL`]?.trim().toLowerCase();
    const password = process.env[`${prefix}_PASSWORD`];

    if (!name || !email || !password) {
      if (!required && !name && !email && !password) continue;
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
  }

  console.log("Contas iniciais configuradas.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

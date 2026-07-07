require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("../src/db");

const accounts = [
  { prefix: "COORDINATOR_1", role: "COORDINATOR" },
  { prefix: "COORDINATOR_2", role: "COORDINATOR" },
  { prefix: "CONTRIBUTOR", role: "CONTRIBUTOR" },
];

async function main() {
  for (const { prefix, role } of accounts) {
    const name = process.env[`${prefix}_NAME`];
    const email = process.env[`${prefix}_EMAIL`]?.trim().toLowerCase();
    const password = process.env[`${prefix}_PASSWORD`];

    if (!name || !email || !password) {
      throw new Error(`Configure ${prefix}_NAME, ${prefix}_EMAIL e ${prefix}_PASSWORD.`);
    }
    if (password.length < 12) {
      throw new Error(`${prefix}_PASSWORD deve ter pelo menos 12 caracteres.`);
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

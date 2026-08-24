require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const databaseUrl = new URL(process.env.DATABASE_URL || process.env.MYSQL_URL);
const localDatabaseHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function booleanSetting(value, fallback) {
  if (value === undefined || value.trim() === "") return fallback;

  const normalizedValue = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalizedValue)) return true;
  if (["0", "false", "no", "off"].includes(normalizedValue)) return false;

  throw new Error("DATABASE_ALLOW_PUBLIC_KEY_RETRIEVAL precisa ser true ou false.");
}

const allowPublicKeyRetrieval = booleanSetting(
  process.env.DATABASE_ALLOW_PUBLIC_KEY_RETRIEVAL,
  localDatabaseHosts.has(databaseUrl.hostname.toLowerCase()),
);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port) || 3306,
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
  allowPublicKeyRetrieval,
  connectTimeout: 10_000,
  acquireTimeout: 15_000,
  keepAliveDelay: 30_000,
  minDelayValidation: 1_000,
  minimumIdle: 1,
  idleTimeout: 300,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;

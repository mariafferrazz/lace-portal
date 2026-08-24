require("dotenv").config();

if ((!process.env.DATABASE_URL && !process.env.MYSQL_URL) || !process.env.JWT_SECRET) {
  throw new Error("DATABASE_URL ou MYSQL_URL e JWT_SECRET precisam estar configurados.");
}

const app = require("./app");
const prisma = require("./db");
const port = Number(process.env.PORT) || 3000;

function positiveIntegerSetting(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") return fallback;

  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} precisa ser um número inteiro positivo.`);
  }

  return parsedValue;
}

const databaseCheckIntervalMs = positiveIntegerSetting("DATABASE_HEALTH_INTERVAL_MS", 60_000);
const databaseFailureThreshold = positiveIntegerSetting("DATABASE_HEALTH_FAILURE_THRESHOLD", 3);
const shutdownTimeoutMs = 10_000;

let server;
let databaseMonitor;
let consecutiveDatabaseFailures = 0;
let checkingDatabase = false;
let shuttingDown = false;

async function shutdown(reason, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.info(`Encerrando API LACE: ${reason}.`);
  if (databaseMonitor) clearInterval(databaseMonitor);

  const forceShutdown = setTimeout(() => {
    console.error("Encerramento excedeu o limite de tempo.");
    process.exit(1);
  }, shutdownTimeoutMs);
  forceShutdown.unref();

  if (server) {
    await new Promise((resolve) => {
      server.close((error) => {
        if (error) console.error("Falha ao encerrar o servidor HTTP:", error);
        resolve();
      });
    });
  }

  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Falha ao encerrar a conexão com o banco:", error);
    exitCode = 1;
  }

  clearTimeout(forceShutdown);
  process.exit(exitCode);
}

async function checkDatabase() {
  if (checkingDatabase || shuttingDown) return;
  checkingDatabase = true;

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    if (consecutiveDatabaseFailures > 0) console.info("Conexão com o banco restabelecida.");
    consecutiveDatabaseFailures = 0;
  } catch (error) {
    consecutiveDatabaseFailures += 1;
    console.error(
      `Falha ${consecutiveDatabaseFailures}/${databaseFailureThreshold} no monitor do banco:`,
      error,
    );

    if (consecutiveDatabaseFailures >= databaseFailureThreshold) {
      await shutdown("banco indisponível por verificações consecutivas", 1);
    }
  } finally {
    checkingDatabase = false;
  }
}

async function start() {
  await prisma.$queryRawUnsafe("SELECT 1");

  server = app.listen(port, () => {
    console.log(`API LACE disponível na porta ${port}.`);
  });

  databaseMonitor = setInterval(checkDatabase, databaseCheckIntervalMs);
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("uncaughtException", (error) => {
  console.error("Erro não tratado:", error);
  shutdown("erro não tratado", 1);
});
process.once("unhandledRejection", (error) => {
  console.error("Promise rejeitada sem tratamento:", error);
  shutdown("promise rejeitada sem tratamento", 1);
});

start().catch((error) => {
  console.error("Não foi possível iniciar a API LACE:", error);
  shutdown("falha na inicialização", 1);
});

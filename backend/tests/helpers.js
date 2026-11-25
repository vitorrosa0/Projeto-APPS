const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const dbFile = path.join(os.tmpdir(), `sjpa-test-${process.pid}.db`);
process.env.DB_PATH = dbFile;
execSync("npx prisma migrate deploy", {
  cwd: path.resolve(__dirname, ".."),
  env: { ...process.env, DATABASE_URL: `file:${dbFile}` },
  stdio: "pipe",
});

const prisma = require("../src/prisma");
const app = require("../src/app");

async function limpar() {
  await prisma.doacaoItem.deleteMany();
  await prisma.doacao.deleteMany();
  await prisma.despesa.deleteMany();
  await prisma.contribuicao.deleteMany();
  await prisma.colaborador.deleteMany();
}

module.exports = { app, prisma, limpar };

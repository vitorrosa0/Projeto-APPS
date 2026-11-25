const prisma = require("../src/prisma");
const { migrar } = require("../src/lib/migrarContribuicoes");

migrar(prisma)
  .then((r) => console.log(`Convertidas: ${r.convertidas}. Mantidas em Contribuicao: ${r.mantidas}.`))
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

const prisma = require('../../src/prisma');

// Dados válidos por padrão; cada teste sobrescreve só o campo que importa.
function dadosAnimal(extra = {}) {
  return { nome: 'Rex', tipo: 'cao', ...extra };
}

function criarNoBanco(extra = {}) {
  return prisma.animal.create({ data: dadosAnimal(extra) });
}

async function limparAnimais() {
  await prisma.animal.deleteMany();
}

module.exports = { prisma, dadosAnimal, criarNoBanco, limparAnimais };

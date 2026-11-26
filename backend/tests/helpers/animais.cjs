const prisma = require('../../src/prisma');

// Dados válidos por padrão; cada teste sobrescreve só o campo que importa.
function dadosAnimal(extra = {}) {
  return { nome: 'Rex', tipo: 'cao', ...extra };
}

function criarNoBanco(extra = {}) {
  return prisma.animal.create({ data: dadosAnimal(extra) });
}

async function limparAnimais() {
  // Movimentações primeiro: a relação impede apagar animais com histórico.
  await prisma.movimentacao.deleteMany();
  await prisma.animal.deleteMany();
}

function registrarNoBanco(animalId, extra = {}) {
  return prisma.movimentacao.create({ data: { animalId, tipo: 'entrada', motivo: 'Resgate', data: '2026-01-10', ...extra } });
}

module.exports = { prisma, dadosAnimal, criarNoBanco, limparAnimais, registrarNoBanco };

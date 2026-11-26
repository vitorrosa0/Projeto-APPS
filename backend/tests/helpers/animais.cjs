const jwt = require('jsonwebtoken');
const prisma = require('../../src/prisma');
const { JWT_SECRET } = require('../../src/auth');

// Token de um usuário fictício, aceito pelo middleware exigirLogin.
const token = jwt.sign({ id: 1, email: 'teste@sjpa.com' }, JWT_SECRET, { expiresIn: '1h' });
const autorizacao = { Authorization: `Bearer ${token}` };

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

module.exports = { token, autorizacao, prisma, dadosAnimal, criarNoBanco, limparAnimais, registrarNoBanco };

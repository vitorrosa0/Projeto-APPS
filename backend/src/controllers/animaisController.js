const prisma = require("../prisma");

async function listar(req, res, next) {
  try {
    const { tipo } = req.query;
    const where = tipo ? { tipo } : {};
    const animais = await prisma.animal.findMany({ where, orderBy: { nome: "asc" } });
    res.json(animais);
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const animal = await prisma.animal.findUnique({ where: { id: Number(req.params.id) } });
    if (!animal) return res.status(404).json({ erro: "Animal não encontrado" });
    res.json(animal);
  } catch (e) { next(e); }
}

const CAMPOS_ANIMAL = [
  "nome", "tipo", "raca", "idade", "sexo", "setor",
  "canil", "cor", "temperamento", "vacinacao", "dataVacinacao", "foto", "outros",
];

function extrairDados(body) {
  const data = {};
  for (const campo of CAMPOS_ANIMAL) {
    if (body[campo] !== undefined) data[campo] = body[campo];
  }
  return data;
}

async function criar(req, res, next) {
  try {
    const { nome, tipo } = req.body;
    if (!nome || !tipo) {
      return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
    }
    if (!["cao", "gato"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'cao' ou 'gato'" });
    }
    const animal = await prisma.animal.create({ data: extrairDados(req.body) });
    res.status(201).json(animal);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.animal.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Animal não encontrado" });
    const { tipo } = req.body;
    if (tipo && !["cao", "gato"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'cao' ou 'gato'" });
    }
    const animal = await prisma.animal.update({ where: { id }, data: extrairDados(req.body) });
    res.json(animal);
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.animal.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Animal não encontrado" });
    await prisma.animal.delete({ where: { id } });
    res.json({ mensagem: "Animal removido com sucesso" });
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };

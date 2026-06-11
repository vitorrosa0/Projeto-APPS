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

async function criar(req, res, next) {
  try {
    const { nome, tipo, raca, idade, setor, canil } = req.body;
    if (!nome || !tipo || !raca || !idade || !setor || !canil) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }
    if (!["cao", "gato"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'cao' ou 'gato'" });
    }
    const animal = await prisma.animal.create({ data: { nome, tipo, raca, idade, setor, canil } });
    res.status(201).json(animal);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.animal.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Animal não encontrado" });
    const { nome, tipo, raca, idade, setor, canil } = req.body;
    if (tipo && !["cao", "gato"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'cao' ou 'gato'" });
    }
    const animal = await prisma.animal.update({ where: { id }, data: { nome, tipo, raca, idade, setor, canil } });
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

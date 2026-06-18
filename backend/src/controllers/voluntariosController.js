const prisma = require("../prisma");

const CAMPOS_VOLUNTARIO = ["nome", "email", "telefone", "informacoesAdicionais"];

function extrairDados(body) {
  const data = {};
  for (const campo of CAMPOS_VOLUNTARIO) {
    if (body[campo] !== undefined) data[campo] = body[campo];
  }
  return data;
}

async function listar(req, res, next) {
  try {
    const voluntarios = await prisma.voluntario.findMany({ orderBy: { nome: "asc" } });
    res.json(voluntarios);
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const voluntario = await prisma.voluntario.findUnique({ where: { id: Number(req.params.id) } });
    if (!voluntario) return res.status(404).json({ erro: "Voluntário não encontrado" });
    res.json(voluntario);
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: "Nome é obrigatório" });
    }
    const voluntario = await prisma.voluntario.create({ data: extrairDados(req.body) });
    res.status(201).json(voluntario);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.voluntario.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Voluntário não encontrado" });
    const voluntario = await prisma.voluntario.update({ where: { id }, data: extrairDados(req.body) });
    res.json(voluntario);
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.voluntario.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Voluntário não encontrado" });
    await prisma.voluntario.delete({ where: { id } });
    res.json({ mensagem: "Voluntário removido com sucesso" });
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };

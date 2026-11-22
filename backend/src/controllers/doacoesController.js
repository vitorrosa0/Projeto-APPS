const prisma = require("../prisma");

const TIPOS_VALIDOS = ["dinheiro", "item"];

function extrairDados(body) {
  const { tipo, valor, descricao, doador, data } = body;
  return { tipo, valor, descricao, doador, data };
}

async function listar(req, res, next) {
  try {
    const { mes, ano } = req.query;
    let where = {};

    if (mes || ano) {
      const doacoes = await prisma.doacao.findMany({ orderBy: { data: "desc" } });
      const filtradas = doacoes.filter((d) => {
        const dt = new Date(d.data);
        if (mes && String(dt.getMonth() + 1).padStart(2, "0") !== String(mes).padStart(2, "0")) return false;
        if (ano && String(dt.getFullYear()) !== String(ano)) return false;
        return true;
      });
      return res.json(filtradas);
    }

    const doacoes = await prisma.doacao.findMany({ where, orderBy: { data: "desc" } });
    res.json(doacoes);
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const doacao = await prisma.doacao.findUnique({ where: { id: Number(req.params.id) } });
    if (!doacao) return res.status(404).json({ erro: "Doação não encontrada" });
    res.json(doacao);
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const { tipo, data } = req.body;
    if (!tipo || !data) {
      return res.status(400).json({ erro: "Tipo e data são obrigatórios" });
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'dinheiro' ou 'item'" });
    }
    if (tipo === "dinheiro" && !req.body.valor) {
      return res.status(400).json({ erro: "Valor é obrigatório para doações em dinheiro" });
    }
    if (tipo === "item" && !req.body.descricao) {
      return res.status(400).json({ erro: "Descrição é obrigatória para doações de itens" });
    }
    const doacao = await prisma.doacao.create({ data: extrairDados(req.body) });
    res.status(201).json(doacao);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.doacao.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Doação não encontrada" });
    const { tipo } = req.body;
    if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'dinheiro' ou 'item'" });
    }
    const doacao = await prisma.doacao.update({ where: { id }, data: extrairDados(req.body) });
    res.json(doacao);
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.doacao.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Doação não encontrada" });
    await prisma.doacao.delete({ where: { id } });
    res.json({ mensagem: "Doação removida com sucesso" });
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };

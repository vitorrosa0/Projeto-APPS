const prisma = require("../prisma");

function extrairDados(body) {
  const { categoria, valor, descricao, data } = body;
  return { categoria, valor, descricao, data };
}

async function listar(req, res, next) {
  try {
    const { mes, ano } = req.query;

    if (mes || ano) {
      const despesas = await prisma.despesa.findMany({ orderBy: { data: "desc" } });
      const filtradas = despesas.filter((d) => {
        const dt = new Date(d.data);
        if (mes && String(dt.getMonth() + 1).padStart(2, "0") !== String(mes).padStart(2, "0")) return false;
        if (ano && String(dt.getFullYear()) !== String(ano)) return false;
        return true;
      });
      return res.json(filtradas);
    }

    const despesas = await prisma.despesa.findMany({ orderBy: { data: "desc" } });
    res.json(despesas);
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const despesa = await prisma.despesa.findUnique({ where: { id: Number(req.params.id) } });
    if (!despesa) return res.status(404).json({ erro: "Despesa não encontrada" });
    res.json(despesa);
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const { categoria, valor, data } = req.body;
    if (!categoria || !valor || !data) {
      return res.status(400).json({ erro: "Categoria, valor e data são obrigatórios" });
    }
    const despesa = await prisma.despesa.create({ data: extrairDados(req.body) });
    res.status(201).json(despesa);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.despesa.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Despesa não encontrada" });
    const { categoria } = req.body;
    const despesa = await prisma.despesa.update({ where: { id }, data: extrairDados(req.body) });
    res.json(despesa);
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.despesa.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Despesa não encontrada" });
    await prisma.despesa.delete({ where: { id } });
    res.json({ mensagem: "Despesa removida com sucesso" });
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };

const prisma = require("../prisma");
const { dataValida, intervalo } = require("../lib/periodo");

async function listar(req, res, next) {
  try {
    const p = intervalo(req.query.ano, req.query.mes);
    if (!p) return res.status(400).json({ erro: "Período inválido" });
    const doacoes = await prisma.doacao.findMany({
      where: { data: p },
      include: { itens: true },
      orderBy: [{ data: "desc" }, { id: "desc" }],
    });
    res.json(doacoes);
  } catch (e) { next(e); }
}

async function totais(req, res, next) {
  try {
    const p = intervalo(req.query.ano, req.query.mes);
    if (!p) return res.status(400).json({ erro: "Período inválido" });
    const dinheiro = await prisma.doacao.aggregate({
      where: { tipo: "Dinheiro", data: p },
      _sum: { valorCentavos: true },
    });
    const itens = await prisma.doacaoItem.groupBy({
      by: ["nome"],
      where: { doacao: { data: p } },
      _sum: { quantidade: true },
      orderBy: { nome: "asc" },
    });
    res.json({
      totalDinheiroCentavos: dinheiro._sum.valorCentavos ?? 0,
      itens: itens.map((i) => ({ nome: i.nome, quantidade: i._sum.quantidade })),
    });
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ erro: "Id inválido" });
    const doacao = await prisma.doacao.findUnique({
      where: { id },
      include: { itens: true },
    });
    if (!doacao) return res.status(404).json({ erro: "Doação não encontrada" });
    res.json(doacao);
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const { tipo, valorCentavos, data, colaboradorId, doadorNome, observacoes, itens } = req.body ?? {};
    if (tipo !== "Dinheiro" && tipo !== "Item") {
      return res.status(400).json({ erro: "Tipo deve ser 'Dinheiro' ou 'Item'" });
    }
    if (!dataValida(data)) {
      return res.status(400).json({ erro: "Data deve estar no formato AAAA-MM-DD" });
    }
    if (colaboradorId !== undefined && colaboradorId !== null && !Number.isInteger(colaboradorId)) {
      return res.status(400).json({ erro: "colaboradorId deve ser um inteiro" });
    }
    for (const [campo, v] of [["doadorNome", doadorNome], ["observacoes", observacoes]]) {
      if (v !== undefined && v !== null && typeof v !== "string") {
        return res.status(400).json({ erro: `${campo} deve ser texto` });
      }
    }
    const temItens = Array.isArray(itens) && itens.length > 0;
    if (tipo === "Dinheiro") {
      if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
        return res.status(400).json({ erro: "Valor deve ser um inteiro positivo em centavos" });
      }
      if (temItens) {
        return res.status(400).json({ erro: "Doação em dinheiro não pode ter itens" });
      }
    } else {
      if (valorCentavos !== undefined && valorCentavos !== null) {
        return res.status(400).json({ erro: "Doação de itens não pode ter valor em dinheiro" });
      }
      const itensValidos =
        temItens &&
        itens.every(
          (i) => i && typeof i === "object" && typeof i.nome === "string" && i.nome.trim() && Number.isInteger(i.quantidade) && i.quantidade > 0
        );
      if (!itensValidos) {
        return res.status(400).json({ erro: "Informe ao menos um item com nome e quantidade positiva" });
      }
    }
    if (colaboradorId !== undefined && colaboradorId !== null) {
      const colaborador = await prisma.colaborador.findUnique({ where: { id: colaboradorId } });
      if (!colaborador) return res.status(404).json({ erro: "Colaborador não encontrado" });
    }
    const doacao = await prisma.doacao.create({
      data: {
        tipo,
        valorCentavos: tipo === "Dinheiro" ? valorCentavos : null,
        data,
        colaboradorId: colaboradorId ?? null,
        doadorNome: doadorNome || null,
        observacoes: observacoes || null,
        itens: tipo === "Item"
          ? { create: itens.map((i) => ({ nome: i.nome.trim(), quantidade: i.quantidade })) }
          : undefined,
      },
      include: { itens: true },
    });
    res.status(201).json(doacao);
  } catch (e) { next(e); }
}

module.exports = { listar, totais, buscarPorId, criar };

const prisma = require("../prisma");
const CATEGORIAS = require("../lib/categoriasDespesa");
const { dataValida, intervalo } = require("../lib/periodo");

async function listar(req, res, next) {
  try {
    const p = intervalo(req.query.ano, req.query.mes);
    if (!p) return res.status(400).json({ erro: "Período inválido" });
    const despesas = await prisma.despesa.findMany({
      where: { data: p },
      orderBy: [{ data: "desc" }, { id: "desc" }],
    });
    res.json(despesas);
  } catch (e) { next(e); }
}

async function totais(req, res, next) {
  try {
    const p = intervalo(req.query.ano, req.query.mes);
    if (!p) return res.status(400).json({ erro: "Período inválido" });
    const grupos = await prisma.despesa.groupBy({
      by: ["categoria"],
      where: { data: p },
      _sum: { valorCentavos: true },
      orderBy: { categoria: "asc" },
    });
    const porCategoria = grupos.map((g) => ({
      categoria: g.categoria,
      totalCentavos: g._sum.valorCentavos,
    }));
    const totalCentavos = porCategoria.reduce((acc, g) => acc + g.totalCentavos, 0);
    res.json({ totalCentavos, porCategoria });
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const { categoria, valorCentavos, data, descricao } = req.body ?? {};
    if (!CATEGORIAS.includes(categoria)) {
      return res.status(400).json({ erro: "Categoria inválida" });
    }
    if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
      return res.status(400).json({ erro: "Valor deve ser um inteiro positivo em centavos" });
    }
    if (!dataValida(data)) {
      return res.status(400).json({ erro: "Data deve estar no formato AAAA-MM-DD" });
    }
    if (descricao !== undefined && descricao !== null && typeof descricao !== "string") {
      return res.status(400).json({ erro: "Descrição deve ser texto" });
    }
    const despesa = await prisma.despesa.create({
      data: { categoria, valorCentavos, data, descricao: descricao || null },
    });
    res.status(201).json(despesa);
  } catch (e) { next(e); }
}

module.exports = { listar, totais, criar };

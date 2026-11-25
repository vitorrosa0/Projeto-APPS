const prisma = require("../prisma");
const { intervalo } = require("../lib/periodo");

const soma = (registros) => registros.reduce((acc, r) => acc + r.valorCentavos, 0);

async function resumo(req, res, next) {
  try {
    const { ano, mes } = req.query;
    const p = intervalo(ano, mes);
    if (!p) return res.status(400).json({ erro: "Período inválido" });
    const ordem = [{ data: "desc" }, { id: "desc" }];
    const colaborador = { select: { nome: true } };

    const [doacoesDinheiro, itensDoados, despesas] = await Promise.all([
      prisma.doacao.findMany({ where: { tipo: "Dinheiro", data: p }, include: { colaborador }, orderBy: ordem }),
      prisma.doacao.findMany({ where: { tipo: "Item", data: p }, include: { itens: true, colaborador }, orderBy: ordem }),
      prisma.despesa.findMany({ where: { data: p }, orderBy: ordem }),
    ]);

    const receitasCentavos = soma(doacoesDinheiro);
    const despesasCentavos = soma(despesas);

    res.json({
      periodo: {
        ano: ano === undefined ? new Date().getFullYear() : Number(ano),
        mes: mes === undefined ? null : Number(mes),
      },
      receitas: { totalCentavos: receitasCentavos, doacoesDinheiro },
      itensDoados,
      despesas: { totalCentavos: despesasCentavos, registros: despesas },
      saldoCentavos: receitasCentavos - despesasCentavos,
    });
  } catch (e) { next(e); }
}

module.exports = { resumo };

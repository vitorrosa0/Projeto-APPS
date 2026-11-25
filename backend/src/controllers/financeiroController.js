const prisma = require("../prisma");

function filtrarPorPeriodo(registros, mes, ano) {
  return registros.filter((r) => {
    const dt = new Date(r.data);
    if (mes && String(dt.getMonth() + 1).padStart(2, "0") !== String(mes).padStart(2, "0")) return false;
    if (ano && String(dt.getFullYear()) !== String(ano)) return false;
    return true;
  });
}

function somarValores(registros) {
  return registros.reduce((acc, r) => acc + (parseFloat(r.valor) || 0), 0);
}

async function resumo(req, res, next) {
  try {
    const { mes, ano } = req.query;

    const [todasDoacoes, todasDespesas, todasContribuicoes] = await Promise.all([
      prisma.doacao.findMany({ orderBy: { data: "desc" } }),
      prisma.despesa.findMany({ orderBy: { data: "desc" } }),
      prisma.contribuicao.findMany({
        where: { tipo: "Financeiro" },
        include: { colaborador: { select: { nome: true } } },
        orderBy: { data: "desc" },
      }),
    ]);

    const doacoesFiltradas = filtrarPorPeriodo(todasDoacoes, mes, ano);
    const despesasFiltradas = filtrarPorPeriodo(todasDespesas, mes, ano);
    const contribuicoesFiltradas = filtrarPorPeriodo(todasContribuicoes, mes, ano);

    // Doações em dinheiro (avulsas)
    const doacoesDinheiro = doacoesFiltradas.filter((d) => d.tipo === "dinheiro");
    // Doações de itens (não entram no total financeiro)
    const doacoesItens = doacoesFiltradas.filter((d) => d.tipo === "item");

    const totalDoacoesDinheiro = somarValores(doacoesDinheiro);
    const totalContribuicoesFinanceiras = somarValores(contribuicoesFiltradas);
    const totalReceitas = totalDoacoesDinheiro + totalContribuicoesFinanceiras;
    const totalDespesas = somarValores(despesasFiltradas);
    const saldo = totalReceitas - totalDespesas;

    res.json({
      periodo: { mes: mes || null, ano: ano || null },
      receitas: {
        total: parseFloat(totalReceitas.toFixed(2)),
        doacoesDinheiro: {
          total: parseFloat(totalDoacoesDinheiro.toFixed(2)),
          registros: doacoesDinheiro,
        },
        contribuicoesColaboradores: {
          total: parseFloat(totalContribuicoesFinanceiras.toFixed(2)),
          registros: contribuicoesFiltradas,
        },
      },
      itensDoados: doacoesItens,
      despesas: {
        total: parseFloat(totalDespesas.toFixed(2)),
        registros: despesasFiltradas,
      },
      saldo: parseFloat(saldo.toFixed(2)),
    });
  } catch (e) { next(e); }
}

module.exports = { resumo };

const { parseReais, parseItem } = require("./dinheiro");
const { dataValida } = require("./periodo");

async function migrar(prisma) {
  const pendentes = await prisma.contribuicao.findMany({
    where: { tipo: { in: ["Financeiro", "Produto"] } },
  });
  let convertidas = 0;
  let mantidas = 0;

  for (const c of pendentes) {
    const dados = { data: c.data, colaboradorId: c.colaboradorId };
    let doacao = null;
    if (dataValida(c.data)) {
      if (c.tipo === "Financeiro") {
        const valorCentavos = parseReais(c.valor);
        if (valorCentavos) doacao = { ...dados, tipo: "Dinheiro", valorCentavos };
      } else {
        const item = parseItem(c.valor);
        if (item) doacao = { ...dados, tipo: "Item", itens: { create: [item] } };
      }
    }
    if (!doacao) {
      console.warn(`Contribuição ${c.id} mantida (valor ou data ilegível): ${c.valor} / ${c.data}`);
      mantidas++;
      continue;
    }
    await prisma.$transaction([
      prisma.doacao.create({ data: doacao }),
      prisma.contribuicao.delete({ where: { id: c.id } }),
    ]);
    convertidas++;
  }

  const servicos = await prisma.contribuicao.count({ where: { tipo: "Servico" } });
  return { convertidas, mantidas: mantidas + servicos };
}

module.exports = { migrar };

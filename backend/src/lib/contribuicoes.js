const { formatarReais } = require("./dinheiro");

function doacaoParaContribuicao(d) {
  const financeiro = d.tipo === "Dinheiro";
  return {
    id: `d${d.id}`,
    tipo: financeiro ? "Financeiro" : "Produto",
    valor: financeiro
      ? formatarReais(d.valorCentavos)
      : d.itens.map((i) => `${i.quantidade} ${i.nome}`).join(", "),
    data: d.data,
  };
}

function unificar(doacoes, contribuicoes) {
  const lista = [
    ...doacoes.map(doacaoParaContribuicao),
    ...contribuicoes.map((c) => ({ id: `c${c.id}`, tipo: c.tipo, valor: c.valor, data: c.data })),
  ];
  return lista.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

module.exports = { unificar };

function parseReais(texto) {
  if (typeof texto !== "string") return null;
  const t = texto.replace(/R\$/g, "").replace(/\s/g, "");
  let centavos;
  if (t.includes(",")) {
    const m = t.match(/^(\d{1,3}(?:\.\d{3})+|\d+),(\d{1,2})$/);
    if (!m) return null;
    centavos = Number(m[1].replace(/\./g, "")) * 100 + Number(m[2].padEnd(2, "0"));
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    centavos = Number(t.replace(/\./g, "")) * 100;
  } else if (/^\d+\.\d{1,2}$/.test(t)) {
    const [i, d] = t.split(".");
    centavos = Number(i) * 100 + Number(d.padEnd(2, "0"));
  } else if (/^\d+$/.test(t)) {
    centavos = Number(t) * 100;
  } else {
    return null;
  }
  return centavos > 0 ? centavos : null;
}

function parseItem(texto) {
  const t = String(texto ?? "").trim();
  if (!t) return null;
  const m = t.match(/^(\d+)\s+(.+)$/);
  if (m && Number(m[1]) > 0) return { quantidade: Number(m[1]), nome: m[2] };
  return { quantidade: 1, nome: t };
}

function formatarReais(centavos) {
  const valor = (centavos / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${valor}`;
}

module.exports = { parseReais, parseItem, formatarReais };

function parseReais(texto) {
  if (typeof texto !== "string") return null;
  const m = texto.trim().match(/^(?:R\$\s*)?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?$/);
  if (!m) return null;
  const inteiro = Number(m[1].replace(/\./g, ""));
  const decimal = Number((m[2] ?? "0").padEnd(2, "0"));
  const centavos = inteiro * 100 + decimal;
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

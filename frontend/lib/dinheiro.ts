export function reaisParaCentavos(texto: string): number | null {
  const t = texto.replace(/R\$/g, "").replace(/\s/g, "");
  let centavos: number;
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

export function centavosParaReais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

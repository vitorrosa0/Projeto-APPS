function dataValida(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function intervalo(ano, mes) {
  const a = ano === undefined ? new Date().getFullYear() : Number(ano);
  if (!Number.isInteger(a) || a < 1900 || a > 9000) return null;
  const p = (n) => String(n).padStart(2, "0");
  if (mes === undefined) return { gte: `${a}-01-01`, lt: `${a + 1}-01-01` };
  const m = Number(mes);
  if (!Number.isInteger(m) || m < 1 || m > 12) return null;
  return {
    gte: `${a}-${p(m)}-01`,
    lt: m === 12 ? `${a + 1}-01-01` : `${a}-${p(m + 1)}-01`,
  };
}

module.exports = { dataValida, intervalo };

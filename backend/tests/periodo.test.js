const test = require("node:test");
const assert = require("node:assert");
const { dataValida, intervalo } = require("../src/lib/periodo");

test("dataValida", () => {
  assert.strictEqual(dataValida("2026-02-28"), true);
  assert.strictEqual(dataValida("2026-02-30"), false);
  assert.strictEqual(dataValida("28/02/2026"), false);
});

test("intervalo mensal inclui o início e exclui o início do mês seguinte", () => {
  assert.deepStrictEqual(intervalo("2026", "11"), { gte: "2026-11-01", lt: "2026-12-01" });
  assert.deepStrictEqual(intervalo("2026", "12"), { gte: "2026-12-01", lt: "2027-01-01" });
});

test("intervalo anual e inválidos", () => {
  assert.deepStrictEqual(intervalo("2026"), { gte: "2026-01-01", lt: "2027-01-01" });
  assert.strictEqual(intervalo("2026", "13"), null);
  assert.strictEqual(intervalo("abc"), null);
});

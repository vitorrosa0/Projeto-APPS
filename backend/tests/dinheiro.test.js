const test = require("node:test");
const assert = require("node:assert");
const { parseReais, parseItem, formatarReais } = require("../src/lib/dinheiro");

test("parseReais converte formatos comuns para centavos", () => {
  assert.strictEqual(parseReais("R$ 150,00"), 15000);
  assert.strictEqual(parseReais("1.500,5"), 150050);
  assert.strictEqual(parseReais("150"), 15000);
  assert.strictEqual(parseReais("1.500"), 150000);
  assert.strictEqual(parseReais("1.000"), 100000);
  assert.strictEqual(parseReais("50.5"), 5050);
  assert.strictEqual(parseReais("100.50"), 10050);
});

test("parseReais rejeita texto inválido e zero", () => {
  assert.strictEqual(parseReais("abc"), null);
  assert.strictEqual(parseReais("0"), null);
  assert.strictEqual(parseReais(undefined), null);
});

test("parseItem separa quantidade e nome", () => {
  assert.deepStrictEqual(parseItem("15 Kg de Ração"), { quantidade: 15, nome: "Kg de Ração" });
  assert.deepStrictEqual(parseItem("Cobertores"), { quantidade: 1, nome: "Cobertores" });
  assert.strictEqual(parseItem("  "), null);
});

test("formatarReais", () => {
  assert.strictEqual(formatarReais(150000), "R$ 1.500,00");
});

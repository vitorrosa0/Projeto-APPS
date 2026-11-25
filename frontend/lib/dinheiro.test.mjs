import test from "node:test";
import assert from "node:assert";
import { reaisParaCentavos, centavosParaReais } from "./dinheiro.ts";

test("reaisParaCentavos", () => {
  assert.strictEqual(reaisParaCentavos("R$ 150,00"), 15000);
  assert.strictEqual(reaisParaCentavos("1.500,50"), 150050);
  assert.strictEqual(reaisParaCentavos("50.5"), 5050);
  assert.strictEqual(reaisParaCentavos("0,10"), 10);
});

test("reaisParaCentavos rejeita vazio, texto e não positivos", () => {
  assert.strictEqual(reaisParaCentavos(""), null);
  assert.strictEqual(reaisParaCentavos("abc"), null);
  assert.strictEqual(reaisParaCentavos("0"), null);
  assert.strictEqual(reaisParaCentavos("-5"), null);
});

test("centavosParaReais", () => {
  assert.strictEqual(centavosParaReais(150000).replace(/ /g, " "), "R$ 1.500,00");
});

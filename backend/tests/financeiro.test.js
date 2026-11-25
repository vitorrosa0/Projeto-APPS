const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const { app, prisma, limpar } = require("./helpers");

test.beforeEach(limpar);
test.after(() => prisma.$disconnect());

const doacao = (extra = {}) =>
  request(app).post("/doacoes").send({ tipo: "Dinheiro", valorCentavos: 20000, data: "2026-11-10", ...extra });
const despesa = (extra = {}) =>
  request(app).post("/despesas").send({ categoria: "Outros", valorCentavos: 15000, data: "2026-11-12", ...extra });

test("resumo calcula receitas, despesas e saldo em centavos", async () => {
  await doacao({ doadorNome: "João" });
  await doacao({ valorCentavos: 5050 });
  await despesa();
  const res = await request(app).get("/financeiro/resumo?ano=2026&mes=11");
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.periodo, { ano: 2026, mes: 11 });
  assert.strictEqual(res.body.receitas.totalCentavos, 25050);
  assert.strictEqual(res.body.receitas.doacoesDinheiro.length, 2);
  assert.strictEqual(res.body.despesas.totalCentavos, 15000);
  assert.strictEqual(res.body.despesas.registros.length, 1);
  assert.strictEqual(res.body.saldoCentavos, 10050);
});

test("doação de colaborador conta uma única vez e traz o nome", async () => {
  const c = await prisma.colaborador.create({
    data: { nome: "Ana", email: "ana@x.com", telefone: "1", dataAdesao: "2026-01-01" },
  });
  await request(app)
    .post(`/colaboradores/${c.id}/contribuicoes`)
    .send({ tipo: "Financeiro", valor: "R$ 100,00", data: "2026-11-05" });
  const res = await request(app).get("/financeiro/resumo?ano=2026&mes=11");
  assert.strictEqual(res.body.receitas.totalCentavos, 10000);
  assert.strictEqual(res.body.receitas.doacoesDinheiro.length, 1);
  assert.strictEqual(res.body.receitas.doacoesDinheiro[0].colaborador.nome, "Ana");
});

test("doação de item não soma ao dinheiro e aparece em itensDoados", async () => {
  await doacao();
  await request(app).post("/doacoes").send({ tipo: "Item", data: "2026-11-10", itens: [{ nome: "Ração", quantidade: 10 }] });
  const res = await request(app).get("/financeiro/resumo?ano=2026&mes=11");
  assert.strictEqual(res.body.receitas.totalCentavos, 20000);
  assert.strictEqual(res.body.receitas.doacoesDinheiro.length, 1);
  assert.strictEqual(res.body.itensDoados.length, 1);
  assert.deepStrictEqual(res.body.itensDoados[0].itens.map((i) => [i.nome, i.quantidade]), [["Ração", 10]]);
});

test("período inválido retorna 400", async () => {
  const a = await request(app).get("/financeiro/resumo?ano=2026&mes=13");
  const b = await request(app).get("/financeiro/resumo?ano=abc");
  assert.deepStrictEqual([a.status, b.status], [400, 400]);
});

test("filtro inclui as bordas do mês", async () => {
  for (const data of ["2026-10-31", "2026-11-01", "2026-11-30", "2026-12-01"]) {
    await doacao({ valorCentavos: 100, data });
    await despesa({ valorCentavos: 10, data });
  }
  const res = await request(app).get("/financeiro/resumo?ano=2026&mes=11");
  assert.strictEqual(res.body.receitas.totalCentavos, 200);
  assert.strictEqual(res.body.despesas.totalCentavos, 20);
  assert.strictEqual(res.body.saldoCentavos, 180);
});

test("sem parâmetros usa o ano corrente", async () => {
  const ano = new Date().getFullYear();
  await doacao({ data: `${ano}-03-01` });
  await doacao({ data: `${ano - 1}-03-01` });
  const res = await request(app).get("/financeiro/resumo");
  assert.deepStrictEqual(res.body.periodo, { ano, mes: null });
  assert.strictEqual(res.body.receitas.totalCentavos, 20000);
});

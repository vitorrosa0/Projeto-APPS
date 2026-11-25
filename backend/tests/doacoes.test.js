const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const { app, prisma, limpar } = require("./helpers");

test.beforeEach(limpar);
test.after(() => prisma.$disconnect());

const dinheiro = { tipo: "Dinheiro", valorCentavos: 50000, data: "2026-11-10" };
const item = (extra = {}) => ({
  tipo: "Item",
  data: "2026-11-10",
  itens: [{ nome: "Ração", quantidade: 10 }],
  ...extra,
});

test("cria doação em dinheiro", async () => {
  const res = await request(app).post("/doacoes").send(dinheiro);
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.valorCentavos, 50000);
});

test("rejeita Dinheiro com itens", async () => {
  const res = await request(app).post("/doacoes").send({ ...dinheiro, itens: [{ nome: "Ração", quantidade: 1 }] });
  assert.strictEqual(res.status, 400);
});

test("rejeita Dinheiro sem valor positivo", async () => {
  const res = await request(app).post("/doacoes").send({ ...dinheiro, valorCentavos: 0 });
  assert.strictEqual(res.status, 400);
});

test("rejeita Item sem itens ou com valor em dinheiro", async () => {
  const a = await request(app).post("/doacoes").send(item({ itens: [] }));
  const b = await request(app).post("/doacoes").send(item({ valorCentavos: 100 }));
  const c = await request(app).post("/doacoes").send(item({ itens: [{ nome: "", quantidade: 1 }] }));
  const d = await request(app).post("/doacoes").send(item({ itens: [{ nome: "Ração", quantidade: 0 }] }));
  assert.deepStrictEqual([a.status, b.status, c.status, d.status], [400, 400, 400, 400]);
});

test("rejeita tipo desconhecido, data inválida e colaborador inexistente", async () => {
  const a = await request(app).post("/doacoes").send({ ...dinheiro, tipo: "Produtos" });
  const b = await request(app).post("/doacoes").send({ ...dinheiro, data: "x" });
  const c = await request(app).post("/doacoes").send({ ...dinheiro, colaboradorId: 9999 });
  assert.deepStrictEqual([a.status, b.status, c.status], [400, 400, 404]);
});

test("itens nunca entram no total em dinheiro", async () => {
  await request(app).post("/doacoes").send(dinheiro);
  await request(app).post("/doacoes").send(item());
  await request(app).post("/doacoes").send(item({ itens: [{ nome: "Ração", quantidade: 5 }, { nome: "Cama", quantidade: 2 }] }));
  const res = await request(app).get("/doacoes/totais?ano=2026&mes=11");
  assert.strictEqual(res.body.totalDinheiroCentavos, 50000);
  assert.deepStrictEqual(res.body.itens, [
    { nome: "Cama", quantidade: 2 },
    { nome: "Ração", quantidade: 15 },
  ]);
});

test("totais vazios retornam zero", async () => {
  const res = await request(app).get("/doacoes/totais?ano=2026&mes=11");
  assert.deepStrictEqual(res.body, { totalDinheiroCentavos: 0, itens: [] });
});

test("lista filtra o período incluindo as bordas e traz itens", async () => {
  for (const data of ["2026-10-31", "2026-11-01", "2026-11-30", "2026-12-01"]) {
    await request(app).post("/doacoes").send(item({ data }));
  }
  const res = await request(app).get("/doacoes?ano=2026&mes=11");
  assert.deepStrictEqual(res.body.map((d) => d.data).sort(), ["2026-11-01", "2026-11-30"]);
  assert.strictEqual(res.body[0].itens.length, 1);
});

test("GET /doacoes/:id retorna 404 quando não existe", async () => {
  const res = await request(app).get("/doacoes/9999");
  assert.strictEqual(res.status, 404);
});

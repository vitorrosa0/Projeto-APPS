const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const { app, prisma, limpar } = require("./helpers");

test.beforeEach(limpar);
test.after(() => prisma.$disconnect());

const base = { categoria: "Ração para cães", valorCentavos: 50000, data: "2026-11-10" };

test("POST /despesas cria despesa válida", async () => {
  const res = await request(app).post("/despesas").send(base);
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.valorCentavos, 50000);
});

test("POST /despesas rejeita categoria inválida", async () => {
  const res = await request(app).post("/despesas").send({ ...base, categoria: "Viagem" });
  assert.strictEqual(res.status, 400);
});

test("POST /despesas rejeita valor não inteiro positivo e data inválida", async () => {
  const a = await request(app).post("/despesas").send({ ...base, valorCentavos: 10.5 });
  const b = await request(app).post("/despesas").send({ ...base, valorCentavos: 0 });
  const c = await request(app).post("/despesas").send({ ...base, data: "10/11/2026" });
  assert.deepStrictEqual([a.status, b.status, c.status], [400, 400, 400]);
});

test("GET /despesas filtra o período incluindo as bordas do mês", async () => {
  for (const data of ["2026-10-31", "2026-11-01", "2026-11-30", "2026-12-01"]) {
    await request(app).post("/despesas").send({ ...base, data });
  }
  const res = await request(app).get("/despesas?ano=2026&mes=11");
  assert.deepStrictEqual(res.body.map((d) => d.data).sort(), ["2026-11-01", "2026-11-30"]);
});

test("GET /despesas/totais soma por categoria", async () => {
  await request(app).post("/despesas").send(base);
  await request(app).post("/despesas").send({ ...base, valorCentavos: 25000 });
  await request(app).post("/despesas").send({ ...base, categoria: "Outros", valorCentavos: 1000 });
  const res = await request(app).get("/despesas/totais?ano=2026&mes=11");
  assert.strictEqual(res.body.totalCentavos, 76000);
  assert.deepStrictEqual(res.body.porCategoria, [
    { categoria: "Outros", totalCentavos: 1000 },
    { categoria: "Ração para cães", totalCentavos: 75000 },
  ]);
});

test("GET /despesas com período inválido retorna 400", async () => {
  const res = await request(app).get("/despesas?ano=2026&mes=13");
  assert.strictEqual(res.status, 400);
});

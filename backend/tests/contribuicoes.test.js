const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const { app, prisma, limpar } = require("./helpers");

test.beforeEach(limpar);
test.after(() => prisma.$disconnect());

async function novoColaborador() {
  return prisma.colaborador.create({
    data: { nome: "Ana", email: "ana@x.com", telefone: "1", dataAdesao: "2026-01-01" },
  });
}

test("contribuição Financeira vira Doacao em dinheiro com colaboradorId", async () => {
  const c = await novoColaborador();
  const res = await request(app)
    .post(`/colaboradores/${c.id}/contribuicoes`)
    .send({ tipo: "Financeiro", valor: "R$ 150,00", data: "2026-11-10" });
  assert.strictEqual(res.status, 201);
  const doacoes = await prisma.doacao.findMany();
  assert.strictEqual(doacoes.length, 1);
  assert.strictEqual(doacoes[0].tipo, "Dinheiro");
  assert.strictEqual(doacoes[0].valorCentavos, 15000);
  assert.strictEqual(doacoes[0].colaboradorId, c.id);
  assert.strictEqual(await prisma.contribuicao.count(), 0);
});

test("contribuição Produto vira Doacao de item sem valor em dinheiro", async () => {
  const c = await novoColaborador();
  await request(app)
    .post(`/colaboradores/${c.id}/contribuicoes`)
    .send({ tipo: "Produto", valor: "15 Kg de Ração", data: "2026-11-10" });
  const [d] = await prisma.doacao.findMany({ include: { itens: true } });
  assert.strictEqual(d.tipo, "Item");
  assert.strictEqual(d.valorCentavos, null);
  assert.deepStrictEqual(d.itens.map((i) => [i.nome, i.quantidade]), [["Kg de Ração", 15]]);
});

test("contribuição Servico continua em Contribuicao e não gera receita", async () => {
  const c = await novoColaborador();
  await request(app)
    .post(`/colaboradores/${c.id}/contribuicoes`)
    .send({ tipo: "Servico", valor: "Banho", data: "2026-11-10" });
  assert.strictEqual(await prisma.contribuicao.count(), 1);
  assert.strictEqual(await prisma.doacao.count(), 0);
});

test("Financeiro com valor ilegível retorna 400 e não grava nada", async () => {
  const c = await novoColaborador();
  const res = await request(app)
    .post(`/colaboradores/${c.id}/contribuicoes`)
    .send({ tipo: "Financeiro", valor: "muito", data: "2026-11-10" });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(await prisma.doacao.count(), 0);
});

test("detalhe do colaborador unifica doações e serviços no formato antigo", async () => {
  const c = await novoColaborador();
  const post = (body) => request(app).post(`/colaboradores/${c.id}/contribuicoes`).send(body);
  await post({ tipo: "Financeiro", valor: "R$ 150,00", data: "2026-11-10" });
  await post({ tipo: "Servico", valor: "Banho", data: "2026-11-12" });
  const res = await request(app).get(`/colaboradores/${c.id}`);
  assert.deepStrictEqual(
    res.body.contribuicoes.map((x) => [x.tipo, x.valor, x.data]),
    [["Servico", "Banho", "2026-11-12"], ["Financeiro", "R$ 150,00", "2026-11-10"]]
  );
  const lista = await request(app).get("/colaboradores");
  assert.strictEqual(lista.body[0].contribuicoes.length, 1);
  assert.strictEqual(lista.body[0].contribuicoes[0].tipo, "Servico");
});

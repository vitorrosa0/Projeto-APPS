const test = require("node:test");
const assert = require("node:assert");
const { prisma, limpar } = require("./helpers");
const { migrar } = require("../src/lib/migrarContribuicoes");

test.beforeEach(limpar);
test.after(() => prisma.$disconnect());

test("converte Financeiro e Produto, mantém Servico e ilegíveis, e é idempotente", async () => {
  const c = await prisma.colaborador.create({
    data: { nome: "Ana", email: "ana@x.com", telefone: "1", dataAdesao: "2026-01-01" },
  });
  const mk = (tipo, valor, data = "2026-11-10") =>
    prisma.contribuicao.create({ data: { colaboradorId: c.id, tipo, valor, data } });
  await mk("Financeiro", "R$ 150,00");
  await mk("Produto", "15 Kg de Ração");
  await mk("Servico", "Banho");
  await mk("Financeiro", "muito");
  await mk("Financeiro", "R$ 10,00", "10/11/2026");

  const r1 = await migrar(prisma);
  assert.deepStrictEqual(r1, { convertidas: 2, mantidas: 3 });
  assert.strictEqual(await prisma.doacao.count(), 2);
  assert.strictEqual(await prisma.contribuicao.count(), 3);

  const r2 = await migrar(prisma);
  assert.strictEqual(r2.convertidas, 0);
  assert.strictEqual(await prisma.doacao.count(), 2);
});

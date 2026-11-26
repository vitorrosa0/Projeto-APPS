const { describe, test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../../src/app');
const { prisma, criarNoBanco, limparAnimais, registrarNoBanco } = require('../helpers/animais.cjs');

beforeEach(limparAnimais);
after(async () => {
  await limparAnimais();
  await prisma.$disconnect();
});

const url = (animal, mov) => `/animais/${animal.id}/movimentacoes${mov ? '/' + mov.id : ''}`;

describe('GET /animais/:id/movimentacoes', () => {
  test('lista o histórico em ordem cronológica', async () => {
    const animal = await criarNoBanco();
    await registrarNoBanco(animal.id, { data: '2026-01-10' });
    await registrarNoBanco(animal.id, { tipo: 'saida', motivo: 'Adoção', data: '2026-02-01' });

    const res = await request(app).get(url(animal));

    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((m) => m.tipo), ['entrada', 'saida']);
  });

  test('responde 404 para animal inexistente', async () => {
    const res = await request(app).get('/animais/999999/movimentacoes');

    assert.equal(res.status, 404);
  });
});

describe('POST /animais/:id/movimentacoes', () => {
  test('registra a entrada e grava no banco', async () => {
    const animal = await criarNoBanco();

    const res = await request(app).post(url(animal)).send({ tipo: 'entrada', motivo: 'Resgate', data: '2026-01-10', observacao: ' Encontrado na praça ' });

    assert.equal(res.status, 201);
    const gravada = await prisma.movimentacao.findUnique({ where: { id: res.body.id } });
    assert.equal(gravada.animalId, animal.id);
    assert.equal(gravada.observacao, 'Encontrado na praça');
  });

  test('rejeita entrada de animal que já está no abrigo, sem gravar', async () => {
    const animal = await criarNoBanco();
    await registrarNoBanco(animal.id);

    const res = await request(app).post(url(animal)).send({ tipo: 'entrada', motivo: 'Resgate', data: '2026-02-01' });

    assert.equal(res.status, 400);
    assert.equal(res.body.campos.tipo, 'O animal já está no abrigo.');
    assert.equal(await prisma.movimentacao.count(), 1);
  });

  test('rejeita motivo fora da lista', async () => {
    const animal = await criarNoBanco();

    const res = await request(app).post(url(animal)).send({ tipo: 'saida', motivo: 'Sumiu', data: '2026-02-01' });

    assert.equal(res.status, 400);
    assert.ok(res.body.campos.motivo);
  });

  test('responde 404 para animal inexistente', async () => {
    const res = await request(app).post('/animais/999999/movimentacoes').send({ tipo: 'entrada', motivo: 'Resgate', data: '2026-01-10' });

    assert.equal(res.status, 404);
  });
});

describe('status do animal', () => {
  test('a lista mostra o status calculado pela última movimentação', async () => {
    const adotado = await criarNoBanco({ nome: 'Bidu' });
    await registrarNoBanco(adotado.id);
    await registrarNoBanco(adotado.id, { tipo: 'saida', motivo: 'Adoção', data: '2026-02-01' });
    await criarNoBanco({ nome: 'Tom' });

    const res = await request(app).get('/animais');

    assert.deepEqual(res.body.map((a) => [a.nome, a.status]), [['Bidu', 'Adotado'], ['Tom', 'No abrigo']]);
    assert.equal(res.body[0].movimentacoes, undefined);
  });

  test('a busca por ID também traz o status', async () => {
    const animal = await criarNoBanco();
    await registrarNoBanco(animal.id, { tipo: 'saida', motivo: 'Óbito', data: '2026-02-01' });

    const res = await request(app).get(`/animais/${animal.id}`);

    assert.equal(res.body.status, 'Falecido');
  });
});

describe('PUT e DELETE /animais/:id/movimentacoes/:movId', () => {
  test('corrige a última movimentação', async () => {
    const animal = await criarNoBanco();
    const mov = await registrarNoBanco(animal.id);

    const res = await request(app).put(url(animal, mov)).send({ motivo: 'Transferência recebida' });

    assert.equal(res.status, 200);
    assert.equal((await prisma.movimentacao.findUnique({ where: { id: mov.id } })).motivo, 'Transferência recebida');
  });

  test('não deixa trocar o tipo na correção', async () => {
    const animal = await criarNoBanco();
    const mov = await registrarNoBanco(animal.id);

    const res = await request(app).put(url(animal, mov)).send({ tipo: 'saida', motivo: 'Adoção' });

    assert.equal(res.status, 400);
    assert.equal((await prisma.movimentacao.findUnique({ where: { id: mov.id } })).tipo, 'entrada');
  });

  test('recusa corrigir uma movimentação que não é a última', async () => {
    const animal = await criarNoBanco();
    const primeira = await registrarNoBanco(animal.id);
    await registrarNoBanco(animal.id, { tipo: 'saida', motivo: 'Adoção', data: '2026-02-01' });

    const res = await request(app).put(url(animal, primeira)).send({ motivo: 'Nascimento no abrigo' });

    assert.equal(res.status, 409);
    assert.equal((await prisma.movimentacao.findUnique({ where: { id: primeira.id } })).motivo, 'Resgate');
  });

  test('exclui a última movimentação', async () => {
    const animal = await criarNoBanco();
    const mov = await registrarNoBanco(animal.id);

    const res = await request(app).delete(url(animal, mov));

    assert.equal(res.status, 200);
    assert.equal(await prisma.movimentacao.count(), 0);
  });

  test('recusa excluir uma movimentação que não é a última', async () => {
    const animal = await criarNoBanco();
    const primeira = await registrarNoBanco(animal.id);
    await registrarNoBanco(animal.id, { tipo: 'saida', motivo: 'Adoção', data: '2026-02-01' });

    const res = await request(app).delete(url(animal, primeira));

    assert.equal(res.status, 409);
    assert.equal(await prisma.movimentacao.count(), 2);
  });

  test('responde 404 para movimentação de outro animal', async () => {
    const animal = await criarNoBanco();
    const outro = await criarNoBanco({ nome: 'Outro' });
    const mov = await registrarNoBanco(outro.id);

    const res = await request(app).delete(url(animal, mov));

    assert.equal(res.status, 404);
  });
});

describe('DELETE /animais/:id com histórico', () => {
  test('recusa excluir animal que tem movimentações', async () => {
    const animal = await criarNoBanco();
    await registrarNoBanco(animal.id);

    const res = await request(app).delete(`/animais/${animal.id}`);

    assert.equal(res.status, 409);
    assert.notEqual(await prisma.animal.findUnique({ where: { id: animal.id } }), null);
  });
});

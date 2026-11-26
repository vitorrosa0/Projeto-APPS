const { describe, test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../../src/app');
const { autorizacao } = require('../helpers/animais.cjs');
// Todas as requisições destes testes vão autenticadas; o acesso sem login
// é coberto em auth.test.cjs.
const api = () => request.agent(app).set(autorizacao);
const { prisma, dadosAnimal, criarNoBanco, limparAnimais } = require('../helpers/animais.cjs');

beforeEach(limparAnimais);
after(async () => {
  await limparAnimais();
  await prisma.$disconnect();
});

describe('GET /animais', () => {
  test('lista todos os animais em ordem alfabética', async () => {
    await criarNoBanco({ nome: 'Tom', tipo: 'gato' });
    await criarNoBanco({ nome: 'Bidu', tipo: 'cao' });

    const res = await api().get('/animais');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((a) => a.nome), ['Bidu', 'Tom']);
  });

  test('filtra por tipo', async () => {
    await criarNoBanco({ nome: 'Tom', tipo: 'gato' });
    await criarNoBanco({ nome: 'Bidu', tipo: 'cao' });

    const res = await api().get('/animais?tipo=gato');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((a) => a.nome), ['Tom']);
  });

  test('devolve lista vazia quando não há animais', async () => {
    const res = await api().get('/animais');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });
});

describe('GET /animais/:id', () => {
  test('devolve o animal pelo ID', async () => {
    const animal = await criarNoBanco({ nome: 'Mel', raca: 'SRD' });

    const res = await api().get(`/animais/${animal.id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.nome, 'Mel');
    assert.equal(res.body.raca, 'SRD');
  });

  test('responde 404 para ID inexistente', async () => {
    const res = await api().get('/animais/999999');

    assert.equal(res.status, 404);
  });

  for (const id of ['abc', '0', '-1', '1.5']) {
    test(`responde 400 para ID inválido "${id}"`, async () => {
      const res = await api().get(`/animais/${id}`);

      assert.equal(res.status, 400);
      assert.equal(res.body.erro, 'ID inválido');
    });
  }
});

describe('POST /animais', () => {
  test('cadastra o animal e grava no banco', async () => {
    const dados = dadosAnimal({ nome: 'Luna', tipo: 'gato', sexo: 'Feminino', setor: 'C', canil: 'Baia 2' });

    const res = await api().post('/animais').send(dados);

    assert.equal(res.status, 201);
    const gravado = await prisma.animal.findUnique({ where: { id: res.body.id } });
    assert.equal(gravado.nome, 'Luna');
    assert.equal(gravado.canil, 'Baia 2');
  });

  const invalidos = {
    'nome ausente': { nome: undefined },
    'nome vazio': { nome: '   ' },
    'tipo vazio': { tipo: '' },
    'tipo fora da lista': { tipo: 'ave' },
    'sexo fora da lista': { sexo: 'M' },
    'setor fora da lista': { setor: 'Z' },
    'canil de outro setor': { setor: 'I', canil: 'Baia 2' },
    'canil sem setor': { canil: 'Baia 1' },
    'nome acima de 100 caracteres': { nome: 'a'.repeat(101) },
    'temperamento acima de 1000 caracteres': { temperamento: 'a'.repeat(1001) },
  };
  for (const [caso, extra] of Object.entries(invalidos)) {
    test(`rejeita com 400 e não grava: ${caso}`, async () => {
      const res = await api().post('/animais').send(dadosAnimal(extra));

      assert.equal(res.status, 400);
      assert.equal(typeof res.body.erro, 'string');
      assert.equal(await prisma.animal.count(), 0);
    });
  }
});

describe('PUT /animais/:id', () => {
  test('edita os campos enviados e mantém os demais', async () => {
    const animal = await criarNoBanco({ nome: 'Bob', raca: 'SRD' });

    const res = await api().put(`/animais/${animal.id}`).send({ setor: 'A', canil: 'Canil 1' });

    assert.equal(res.status, 200);
    const gravado = await prisma.animal.findUnique({ where: { id: animal.id } });
    assert.equal(gravado.canil, 'Canil 1');
    assert.equal(gravado.raca, 'SRD');
  });

  for (const [caso, extra] of Object.entries({ 'nome vazio': { nome: '' }, 'tipo vazio': { tipo: '' }, 'canil de outro setor': { setor: 'E', canil: 'Baia 3' } })) {
    test(`rejeita com 400 e não altera: ${caso}`, async () => {
      const animal = await criarNoBanco({ nome: 'Bob' });

      const res = await api().put(`/animais/${animal.id}`).send(extra);

      assert.equal(res.status, 400);
      const gravado = await prisma.animal.findUnique({ where: { id: animal.id } });
      assert.equal(gravado.nome, 'Bob');
      assert.equal(gravado.tipo, 'cao');
    });
  }

  test('responde 404 para ID inexistente', async () => {
    const res = await api().put('/animais/999999').send({ nome: 'Ninguém' });

    assert.equal(res.status, 404);
  });
});

describe('DELETE /animais/:id', () => {
  test('remove o animal do banco', async () => {
    const animal = await criarNoBanco();

    const res = await api().delete(`/animais/${animal.id}`);

    assert.equal(res.status, 200);
    assert.equal(await prisma.animal.findUnique({ where: { id: animal.id } }), null);
  });

  test('responde 404 para ID inexistente', async () => {
    const res = await api().delete('/animais/999999');

    assert.equal(res.status, 404);
  });
});

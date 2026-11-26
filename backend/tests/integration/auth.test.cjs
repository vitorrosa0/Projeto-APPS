const { describe, test, after } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../src/app');
const { JWT_SECRET } = require('../../src/auth');
const { prisma, autorizacao, limparAnimais } = require('../helpers/animais.cjs');

after(async () => {
  await limparAnimais();
  await prisma.$disconnect();
});

describe('login obrigatório em /animais', () => {
  const rotas = [
    ['get', '/animais'],
    ['get', '/animais/1'],
    ['post', '/animais'],
    ['put', '/animais/1'],
    ['delete', '/animais/1'],
    ['get', '/animais/1/movimentacoes'],
    ['post', '/animais/1/movimentacoes'],
  ];
  for (const [metodo, url] of rotas) {
    test(`${metodo.toUpperCase()} ${url} sem token responde 401`, async () => {
      const res = await request(app)[metodo](url).send({});

      assert.equal(res.status, 401);
      assert.equal(res.body.erro, 'Faça login para continuar.');
    });
  }

  test('recusa token assinado com outro segredo', async () => {
    const falso = jwt.sign({ id: 1, email: 'x@y.com' }, 'outro-segredo');

    const res = await request(app).get('/animais').set('Authorization', `Bearer ${falso}`);

    assert.equal(res.status, 401);
  });

  test('recusa token expirado', async () => {
    const expirado = jwt.sign({ id: 1, email: 'x@y.com', exp: Math.floor(Date.now() / 1000) - 60 }, JWT_SECRET);

    const res = await request(app).get('/animais').set('Authorization', `Bearer ${expirado}`);

    assert.equal(res.status, 401);
  });

  test('recusa cabeçalho sem o esquema Bearer', async () => {
    const res = await request(app).get('/animais').set('Authorization', autorizacao.Authorization.replace('Bearer ', ''));

    assert.equal(res.status, 401);
  });

  test('aceita token válido', async () => {
    const res = await request(app).get('/animais').set(autorizacao);

    assert.equal(res.status, 200);
  });

  test('não protege as outras áreas (decisão só para /animais)', async () => {
    const res = await request(app).get('/');

    assert.equal(res.status, 200);
  });
});

describe('tratamento de erros', () => {
  test('erro interno devolve mensagem genérica, sem detalhes', async () => {
    const original = prisma.animal.findMany;
    prisma.animal.findMany = async () => { throw new Error('detalhe interno do Prisma'); };
    const log = console.error;
    console.error = () => {};
    try {
      const res = await request(app).get('/animais').set(autorizacao);

      assert.equal(res.status, 500);
      assert.equal(res.body.erro, 'Erro interno no servidor. Tente novamente.');
      assert.doesNotMatch(JSON.stringify(res.body), /Prisma/);
    } finally {
      prisma.animal.findMany = original;
      console.error = log;
    }
  });

  test('foto inexistente responde 404 sem login e sem detalhes do disco', async () => {
    const res = await request(app).get('/animais/fotos/00000000-0000-0000-0000-000000000000.png');

    assert.equal(res.status, 404);
    assert.equal(res.body.erro, 'Não encontrado.');
  });

  test('JSON malformado continua respondendo 400', async () => {
    const res = await request(app).post('/animais').set(autorizacao).set('Content-Type', 'application/json').send('{"nome":');

    assert.equal(res.status, 400);
  });
});

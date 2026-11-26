const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const prisma = require('../../src/prisma');
const { decodePhoto } = require('../../src/animalPhotos');
const { validarAnimal } = require('../../src/animalValidation');
const { autorizacao } = require('../helpers/animais.cjs');
let server, base;
const ids = new Set();
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0YQAAAAASUVORK5CYII=';
before(async () => {
  const app = express();
  app.use(express.json({ limit: '8mb' }));
  app.use('/animais', require('../../src/routes/animais'));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ erro: err.message }));
  server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  base = 'http://127.0.0.1:' + server.address().port;
});
async function request(method, url, data) {
  const response = await fetch(base + url, { method, headers: { 'Content-Type': 'application/json', ...autorizacao }, ...(data !== undefined ? {body: JSON.stringify(data)} : {}) });
  return { status: response.status, data: await response.json() };
}
async function create(data) { const r = await request('POST', '/animais', data); if (r.status === 201) ids.add(r.data.id); return r; }
after(async () => { for (const id of ids) await request('DELETE', '/animais/' + id); await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); });
test('cadastro, raça, listagem, edição, fotos e persistência em novas consultas', async () => {
  const created = await create({ nome: 'Teste ANI cão', tipo: 'cao', raca: 'Sem raça definida', foto: png });
  assert.equal(created.status, 201);
  const id = created.data.id;
  const foto = created.data.foto;
  assert.match(foto, /^\/animais\/fotos\//);
  const image = await fetch(base + foto);
  assert.equal(image.status, 200); assert.equal(image.headers.get('content-type'), 'image/png');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), Buffer.from(png.split(',')[1], 'base64'));
  const recovered = await request('GET', '/animais/' + id);
  assert.equal(recovered.data.foto, foto); assert.equal(recovered.data.raca, 'Sem raça definida');
  assert.ok((await request('GET', '/animais?tipo=cao')).data.some(a => a.id === id && a.foto === foto));
  assert.ok(!(await request('GET', '/animais?tipo=gato')).data.some(a => a.id === id));
  assert.equal((await request('PUT', '/animais/' + id, { foto: 'data:text/plain;base64,YWJj', nome: 'Não deve salvar' })).status, 400);
  assert.equal((await request('GET', '/animais/' + id)).data.foto, foto);
  assert.equal((await request('GET', '/animais/' + id)).data.nome, created.data.nome);
  const oversized = 'data:image/png;base64,' + Buffer.alloc(5 * 1024 * 1024 + 1).toString('base64');
  assert.equal((await request('PUT', '/animais/' + id, { foto: oversized })).status, 413);
  assert.equal((await request('GET', '/animais/' + id)).data.foto, foto);
  const replaced = await request('PUT', '/animais/' + id, { foto: png, raca: 'SRD' });
  assert.equal(replaced.status, 200); assert.notEqual(replaced.data.foto, foto);
  assert.equal((await fetch(base + replaced.data.foto)).status, 200);
  assert.equal((await request('GET', '/animais/' + id)).data.raca, 'SRD');
  assert.equal((await fetch(base + foto)).status, 404);
  assert.equal((await request('PUT', '/animais/' + id, { foto: null })).status, 200);
  assert.equal((await request('GET', '/animais/' + id)).data.foto, null);
  assert.equal((await fetch(base + replaced.data.foto)).status, 404);
  assert.equal((await request('DELETE', '/animais/' + id)).status, 200); ids.delete(id);
  assert.equal((await request('GET', '/animais/' + id)).status, 404);
});
test('registros sem raça e foto continuam editáveis; validação em POST e PUT', async () => {
  const created = await create({nome: 'Teste ANI gato', tipo:'gato'}); assert.equal(created.status,201);
  assert.equal(created.data.foto, null); assert.equal(created.data.raca, null);
  const url='/animais/'+created.data.id;
  for (const body of [{nome:'   '}, {tipo:''}, {nome:42}, {raca:42}, {dataVacinacao:'2999-01-01',vacinacao:'Completa'}, {dataVacinacao:'2026-02-30',vacinacao:'Completa'}, {dataVacinacao:'2026-01-01',vacinacao:'Não vacinado'}, {dataVacinacao:'2026-01-01',vacinacao:''}]) assert.equal((await request('PUT',url,body)).status,400,JSON.stringify(body));
  assert.equal((await request('PUT',url,{nome:' Nome editado ', vacinacao:'Completa',dataVacinacao:'2026-01-01'})).data.nome,'Nome editado');
  for (const body of [{}, {nome:'  ',tipo:'cao'}, {nome:'Nome',tipo:'outro'}]) assert.equal((await create(body)).status,400);
  assert.equal((await request('GET','/animais/abc')).status,400);
  assert.equal((await request('PUT','/animais/99999999',{nome:'Não existe'})).status,404);
});
test('rejeita MIME falso e SVG; aceita assinaturas JPEG, PNG e WebP', () => {
  for (const value of ['blob:preview','data:image/svg+xml;base64,PHN2Zz4=', 'data:image/png;base64,YWJj', '/arquivo/qualquer']) assert.throws(()=>decodePhoto(value));
  assert.equal(decodePhoto(png).ext,'png');
  assert.equal(decodePhoto('data:image/jpeg;base64,'+Buffer.from([255,216,255,217]).toString('base64')).ext,'jpg');
  assert.equal(decodePhoto('data:image/webp;base64,'+Buffer.from('RIFF1234WEBP').toString('base64')).ext,'webp');
  assert.deepEqual(validarAnimal({nome:'Antigo',tipo:'cao',raca:null,foto:null,vacinacao:'Completa'}),{});
});

test('falha ao atualizar o banco preserva foto anterior e limpa o novo arquivo', async () => {
  const fs = require('node:fs/promises');
  const { directory } = require('../../src/animalPhotos');
  const created = await create({nome:'Teste ANI rollback',tipo:'cao',foto:png});
  assert.equal(created.status,201);
  const before = (await fs.readdir(directory)).sort();
  const originalUpdate = prisma.animal.update;
  try {
    prisma.animal.update = async () => { throw new Error('Falha de banco simulada'); };
    assert.equal((await request('PUT','/animais/'+created.data.id,{foto:png,nome:'Não gravar'})).status,500);
  } finally { prisma.animal.update = originalUpdate; }
  const recovered = await request('GET','/animais/'+created.data.id);
  assert.equal(recovered.data.foto,created.data.foto);
  assert.equal(recovered.data.nome,created.data.nome);
  assert.equal((await fetch(base+created.data.foto)).status,200);
  assert.deepEqual((await fs.readdir(directory)).sort(),before);
});

const prisma = require('../prisma');
const { validarMovimentacao } = require('../movimentacoes');

// Mais recente primeiro. Como a data nunca é anterior à da movimentação
// anterior, o id desempata registros do mesmo dia.
const MAIS_RECENTE = [{ data: 'desc' }, { id: 'desc' }];
const CAMPOS = ['tipo', 'motivo', 'data', 'observacao'];

function extrairDados(body = {}) {
  const data = {};
  for (const campo of CAMPOS) if (body[campo] !== undefined) data[campo] = body[campo];
  if (typeof data.observacao === 'string') data.observacao = data.observacao.trim() || null;
  return data;
}

function erroValidacao(res, erros) {
  return res.status(400).json({ erro: Object.values(erros)[0], campos: erros });
}

async function animalExiste(id) {
  return (await prisma.animal.count({ where: { id } })) > 0;
}

function ultimaDoAnimal(animalId, exceto) {
  return prisma.movimentacao.findFirst({
    where: { animalId, ...(exceto ? { id: { not: exceto } } : {}) },
    orderBy: MAIS_RECENTE,
  });
}

// Carrega a movimentação e garante que é a última do animal.
async function carregarUltima(req, res) {
  const animalId = Number(req.params.id);
  const movId = Number(req.params.movId);
  const mov = await prisma.movimentacao.findFirst({ where: { id: movId, animalId } });
  if (!mov) { res.status(404).json({ erro: 'Movimentação não encontrada' }); return null; }
  const ultima = await ultimaDoAnimal(animalId);
  if (ultima.id !== mov.id) { res.status(409).json({ erro: 'Só a última movimentação pode ser corrigida ou excluída.' }); return null; }
  return mov;
}

async function listar(req, res, next) {
  try {
    const animalId = Number(req.params.id);
    if (!(await animalExiste(animalId))) return res.status(404).json({ erro: 'Animal não encontrado' });
    const movimentacoes = await prisma.movimentacao.findMany({ where: { animalId }, orderBy: [{ data: 'asc' }, { id: 'asc' }] });
    res.json(movimentacoes);
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const animalId = Number(req.params.id);
    if (!(await animalExiste(animalId))) return res.status(404).json({ erro: 'Animal não encontrado' });
    const data = extrairDados(req.body);
    const erros = validarMovimentacao(data, await ultimaDoAnimal(animalId));
    if (Object.keys(erros).length) return erroValidacao(res, erros);
    const mov = await prisma.movimentacao.create({ data: { ...data, animalId } });
    res.status(201).json(mov);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const mov = await carregarUltima(req, res);
    if (!mov) return;
    const data = extrairDados(req.body);
    if (data.tipo !== undefined && data.tipo !== mov.tipo) {
      return erroValidacao(res, { tipo: 'O tipo não pode ser alterado. Exclua a movimentação e registre outra.' });
    }
    const anterior = await ultimaDoAnimal(mov.animalId, mov.id);
    const erros = validarMovimentacao({ ...mov, ...data }, anterior);
    if (Object.keys(erros).length) return erroValidacao(res, erros);
    res.json(await prisma.movimentacao.update({ where: { id: mov.id }, data }));
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    const mov = await carregarUltima(req, res);
    if (!mov) return;
    await prisma.movimentacao.delete({ where: { id: mov.id } });
    res.json({ mensagem: 'Movimentação removida com sucesso' });
  } catch (e) { next(e); }
}

module.exports = { listar, criar, atualizar, remover, MAIS_RECENTE };

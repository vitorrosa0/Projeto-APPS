const prisma = require("../prisma");
const { validarAnimal } = require('../animalValidation');
const { savePhoto, removePhoto } = require('../animalPhotos');
const { statusAtual } = require('../movimentacoes');

// Inclui só a movimentação mais recente, usada para calcular o status.
const COM_ULTIMA_MOVIMENTACAO = {
  movimentacoes: { orderBy: [{ data: 'desc' }, { id: 'desc' }], take: 1 },
};

function comStatus({ movimentacoes, ...animal }) {
  return { ...animal, status: statusAtual(movimentacoes[0]) };
}

async function listar(req, res, next) {
  try {
    const { tipo } = req.query;
    const where = tipo ? { tipo } : {};
    const animais = await prisma.animal.findMany({ where, orderBy: { nome: "asc" }, include: COM_ULTIMA_MOVIMENTACAO });
    res.json(animais.map(comStatus));
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const animal = await prisma.animal.findUnique({ where: { id: Number(req.params.id) }, include: COM_ULTIMA_MOVIMENTACAO });
    if (!animal) return res.status(404).json({ erro: "Animal não encontrado" });
    res.json(comStatus(animal));
  } catch (e) { next(e); }
}

const CAMPOS_ANIMAL = [
  "nome", "tipo", "raca", "idade", "sexo", "setor",
  "canil", "cor", "temperamento", "vacinacao", "dataVacinacao", "foto", "outros",
];

function extrairDados(body) {
  const data = {};
  for (const campo of CAMPOS_ANIMAL) {
    if (body[campo] !== undefined) data[campo] = body[campo];
  }
  return data;
}

async function salvar(req, res, next, criarNovo) {
  let novaFoto;
  try {
    const id = Number(req.params.id);
    const anterior = criarNovo ? null : await prisma.animal.findUnique({ where: { id } });
    if (!criarNovo && !anterior) return res.status(404).json({ erro: 'Animal não encontrado' });
    const data = extrairDados(req.body || {});
    const erros = validarAnimal({ ...anterior, ...data });
    if (Object.keys(erros).length) return res.status(400).json({ erro: Object.values(erros)[0], campos: erros });
    data.nome = (data.nome ?? anterior.nome).trim();
    if (data.foto !== undefined && data.foto !== null && data.foto !== anterior?.foto) {
      novaFoto = await savePhoto(data.foto);
      data.foto = novaFoto;
    }
    const animal = criarNovo ? await prisma.animal.create({ data }) : await prisma.animal.update({ where: { id }, data });
    if (anterior?.foto && anterior.foto !== animal.foto) await removePhoto(anterior.foto);
    res.status(criarNovo ? 201 : 200).json(animal);
  } catch (e) {
    if (novaFoto) await removePhoto(novaFoto);
    if (e.status) return res.status(e.status).json({ erro: e.message });
    next(e);
  }
}
const criar = (req, res, next) => salvar(req, res, next, true);
const atualizar = (req, res, next) => salvar(req, res, next, false);

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.animal.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Animal não encontrado" });
    if (await prisma.movimentacao.count({ where: { animalId: id } })) {
      return res.status(409).json({ erro: "Este animal tem histórico de entradas e saídas e não pode ser excluído. Registre uma saída." });
    }
    await prisma.animal.delete({ where: { id } });
    await removePhoto(existe.foto);
    res.json({ mensagem: "Animal removido com sucesso" });
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };

const prisma = require("../prisma");
const { unificar } = require("../lib/contribuicoes");
const { parseReais, parseItem } = require("../lib/dinheiro");
const { dataValida } = require("../lib/periodo");

async function listar(req, res, next) {
  try {
    const colaboradores = await prisma.colaborador.findMany({
      include: {
        contribuicoes: { orderBy: { data: "desc" }, take: 1 },
        doacoes: { orderBy: { data: "desc" }, take: 1, include: { itens: true } },
      },
      orderBy: { nome: "asc" },
    });
    res.json(
      colaboradores.map(({ doacoes, contribuicoes, ...c }) => ({
        ...c,
        contribuicoes: unificar(doacoes, contribuicoes).slice(0, 1),
      }))
    );
  } catch (e) { next(e); }
}

async function buscarPorId(req, res, next) {
  try {
    const colaborador = await prisma.colaborador.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        contribuicoes: { orderBy: { data: "desc" } },
        doacoes: { include: { itens: true } },
      },
    });
    if (!colaborador) return res.status(404).json({ erro: "Colaborador não encontrado" });
    const { doacoes, contribuicoes, ...resto } = colaborador;
    res.json({ ...resto, contribuicoes: unificar(doacoes, contribuicoes) });
  } catch (e) { next(e); }
}

async function criar(req, res, next) {
  try {
    const { nome, email, telefone, dataAdesao, status, informacoesAdicionais } = req.body;
    if (!nome || !email || !telefone || !dataAdesao) {
      return res.status(400).json({ erro: "Nome, email, telefone e data de adesão são obrigatórios" });
    }
    const statusValidos = ["Ativo", "Inativo", "Pausado"];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ erro: "Status deve ser 'Ativo', 'Inativo' ou 'Pausado'" });
    }
    const emailExiste = await prisma.colaborador.findUnique({ where: { email } });
    if (emailExiste) return res.status(409).json({ erro: "Email já cadastrado" });
    const colaborador = await prisma.colaborador.create({
      data: { nome, email, telefone, dataAdesao, status: status || "Ativo", informacoesAdicionais },
    });
    res.status(201).json(colaborador);
  } catch (e) { next(e); }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.colaborador.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Colaborador não encontrado" });
    const { nome, email, telefone, dataAdesao, status, informacoesAdicionais } = req.body;
    const statusValidos = ["Ativo", "Inativo", "Pausado"];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ erro: "Status deve ser 'Ativo', 'Inativo' ou 'Pausado'" });
    }
    const colaborador = await prisma.colaborador.update({
      where: { id },
      data: { nome, email, telefone, dataAdesao, status, informacoesAdicionais },
    });
    res.json(colaborador);
  } catch (e) { next(e); }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existe = await prisma.colaborador.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ erro: "Colaborador não encontrado" });
    await prisma.colaborador.delete({ where: { id } });
    res.json({ mensagem: "Colaborador removido com sucesso" });
  } catch (e) { next(e); }
}

async function listarContribuicoes(req, res, next) {
  try {
    const colaboradorId = Number(req.params.id);
    const existe = await prisma.colaborador.findUnique({ where: { id: colaboradorId } });
    if (!existe) return res.status(404).json({ erro: "Colaborador não encontrado" });
    const [doacoes, contribuicoes] = await Promise.all([
      prisma.doacao.findMany({ where: { colaboradorId }, include: { itens: true } }),
      prisma.contribuicao.findMany({ where: { colaboradorId } }),
    ]);
    res.json(unificar(doacoes, contribuicoes));
  } catch (e) { next(e); }
}

async function adicionarContribuicao(req, res, next) {
  try {
    const colaboradorId = Number(req.params.id);
    const existe = await prisma.colaborador.findUnique({ where: { id: colaboradorId } });
    if (!existe) return res.status(404).json({ erro: "Colaborador não encontrado" });
    const { tipo, valor, data } = req.body;
    if (!tipo || !valor || !data) {
      return res.status(400).json({ erro: "Tipo, valor e data são obrigatórios" });
    }
    const tiposValidos = ["Financeiro", "Produto", "Servico"];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'Financeiro', 'Produto' ou 'Servico'" });
    }
    if (!dataValida(data)) {
      return res.status(400).json({ erro: "Data deve estar no formato AAAA-MM-DD" });
    }
    if (tipo === "Servico") {
      const contribuicao = await prisma.contribuicao.create({ data: { colaboradorId, tipo, valor, data } });
      return res.status(201).json(contribuicao);
    }
    if (tipo === "Financeiro") {
      const valorCentavos = parseReais(valor);
      if (!valorCentavos) return res.status(400).json({ erro: "Valor financeiro inválido" });
      const doacao = await prisma.doacao.create({
        data: { tipo: "Dinheiro", valorCentavos, data, colaboradorId },
      });
      return res.status(201).json(doacao);
    }
    const item = parseItem(valor);
    if (!item) return res.status(400).json({ erro: "Informe o produto e a quantidade" });
    const doacao = await prisma.doacao.create({
      data: { tipo: "Item", data, colaboradorId, itens: { create: [item] } },
      include: { itens: true },
    });
    res.status(201).json(doacao);
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover, listarContribuicoes, adicionarContribuicao };

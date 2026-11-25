const prisma = require("../prisma");

const STATUS_VALIDOS = new Set(["Ativo", "Inativo", "Pausado"]);
const TIPOS_CONTRIBUICAO_VALIDOS = new Set(["Financeiro", "Produto", "Servico"]);
const CAMPOS_COLABORADOR = new Set([
  "nome",
  "email",
  "telefone",
  "dataAdesao",
  "status",
  "informacoesAdicionais",
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseId(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function optionalText(value, field, errors, lowercase = false) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    errors.push(`${field} deve ser um texto`);
    return null;
  }
  const normalized = value.trim();
  return normalized ? (lowercase ? normalized.toLowerCase() : normalized) : null;
}

function validateEmail(email, errors) {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email inválido");
  }
}

function parseCreateInput(body) {
  const errors = [];
  if (!isObject(body)) {
    return { errors: ["O corpo da requisição deve ser um objeto"] };
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  if (!nome) errors.push("Nome é obrigatório");
  if (body.nome !== undefined && typeof body.nome !== "string") {
    errors.push("Nome deve ser um texto");
  }

  const email = optionalText(body.email, "Email", errors, true);
  validateEmail(email, errors);
  const telefone = optionalText(body.telefone, "Telefone", errors);
  const informacoesAdicionais = optionalText(
    body.informacoesAdicionais,
    "Informações adicionais",
    errors
  );

  const dataAdesao = body.dataAdesao;
  if (!isValidDate(dataAdesao)) {
    errors.push("Data de adesão deve ser uma data válida no formato AAAA-MM-DD");
  }

  const status = body.status === undefined ? "Ativo" : body.status;
  if (typeof status !== "string" || !STATUS_VALIDOS.has(status)) {
    errors.push("Status deve ser 'Ativo', 'Inativo' ou 'Pausado'");
  }

  const ultimaContribuicao = optionalText(
    body.ultimaContribuicao,
    "Última contribuição",
    errors
  );

  return {
    errors,
    value: {
      nome,
      email,
      telefone,
      dataAdesao,
      status,
      informacoesAdicionais,
      ultimaContribuicao,
    },
  };
}

function parseUpdateInput(body) {
  const errors = [];
  if (!isObject(body)) {
    return { errors: ["O corpo da requisição deve ser um objeto"] };
  }

  const data = {};
  const fields = Object.keys(body).filter((field) => CAMPOS_COLABORADOR.has(field));
  if (fields.length === 0) {
    errors.push("Informe ao menos um campo válido para atualizar");
  }

  if (Object.hasOwn(body, "nome")) {
    if (typeof body.nome !== "string" || !body.nome.trim()) {
      errors.push("Nome não pode ficar vazio");
    } else {
      data.nome = body.nome.trim();
    }
  }

  if (Object.hasOwn(body, "email")) {
    data.email = optionalText(body.email, "Email", errors, true);
    validateEmail(data.email, errors);
  }

  if (Object.hasOwn(body, "telefone")) {
    data.telefone = optionalText(body.telefone, "Telefone", errors);
  }

  if (Object.hasOwn(body, "dataAdesao")) {
    if (!isValidDate(body.dataAdesao)) {
      errors.push("Data de adesão deve ser uma data válida no formato AAAA-MM-DD");
    } else {
      data.dataAdesao = body.dataAdesao;
    }
  }

  if (Object.hasOwn(body, "status")) {
    if (typeof body.status !== "string" || !STATUS_VALIDOS.has(body.status)) {
      errors.push("Status deve ser 'Ativo', 'Inativo' ou 'Pausado'");
    } else {
      data.status = body.status;
    }
  }

  if (Object.hasOwn(body, "informacoesAdicionais")) {
    data.informacoesAdicionais = optionalText(
      body.informacoesAdicionais,
      "Informações adicionais",
      errors
    );
  }

  return { errors, value: data };
}

function writeError(error, res, next) {
  if (error?.code === "P2002") {
    return res.status(409).json({ erro: "Email já cadastrado" });
  }
  if (error?.code === "P2025" || error?.code === "P2003") {
    return res.status(404).json({ erro: "Colaborador não encontrado" });
  }
  return next(error);
}

function createColaboradoresController(database = prisma) {
  async function listar(req, res, next) {
    try {
      const colaboradores = await database.colaborador.findMany({
        include: {
          contribuicoes: {
            orderBy: [{ data: "desc" }, { createdAt: "desc" }, { id: "desc" }],
            take: 1,
          },
        },
        orderBy: { nome: "asc" },
      });
      res.json(colaboradores);
    } catch (error) {
      next(error);
    }
  }

  async function buscarPorId(req, res, next) {
    const id = parseId(req.params?.id);
    if (!id) return res.status(400).json({ erro: "ID de colaborador inválido" });

    try {
      const colaborador = await database.colaborador.findUnique({
        where: { id },
        include: {
          contribuicoes: {
            orderBy: [{ data: "desc" }, { createdAt: "desc" }, { id: "desc" }],
          },
        },
      });
      if (!colaborador) {
        return res.status(404).json({ erro: "Colaborador não encontrado" });
      }
      res.json(colaborador);
    } catch (error) {
      next(error);
    }
  }

  async function criar(req, res, next) {
    const { errors, value } = parseCreateInput(req.body);
    if (errors.length) return res.status(400).json({ erro: errors.join(". ") });

    const data = {
      nome: value.nome,
      email: value.email,
      telefone: value.telefone,
      dataAdesao: value.dataAdesao,
      status: value.status,
      informacoesAdicionais: value.informacoesAdicionais,
    };
    if (value.ultimaContribuicao) {
      data.contribuicoes = {
        create: {
          tipo: "Financeiro",
          valor: value.ultimaContribuicao,
          data: value.dataAdesao,
        },
      };
    }

    try {
      const colaborador = await database.colaborador.create({
        data,
        include: {
          contribuicoes: {
            orderBy: [{ data: "desc" }, { createdAt: "desc" }, { id: "desc" }],
            take: 1,
          },
        },
      });
      res.status(201).json(colaborador);
    } catch (error) {
      writeError(error, res, next);
    }
  }

  async function atualizar(req, res, next) {
    const id = parseId(req.params?.id);
    if (!id) return res.status(400).json({ erro: "ID de colaborador inválido" });

    const { errors, value } = parseUpdateInput(req.body);
    if (errors.length) return res.status(400).json({ erro: errors.join(". ") });

    try {
      const colaborador = await database.colaborador.update({
        where: { id },
        data: value,
      });
      res.json(colaborador);
    } catch (error) {
      writeError(error, res, next);
    }
  }

  async function remover(req, res, next) {
    const id = parseId(req.params?.id);
    if (!id) return res.status(400).json({ erro: "ID de colaborador inválido" });

    try {
      await database.colaborador.delete({ where: { id } });
      res.json({ mensagem: "Colaborador removido com sucesso" });
    } catch (error) {
      writeError(error, res, next);
    }
  }

  async function listarContribuicoes(req, res, next) {
    const colaboradorId = parseId(req.params?.id);
    if (!colaboradorId) {
      return res.status(400).json({ erro: "ID de colaborador inválido" });
    }

    try {
      const colaborador = await database.colaborador.findUnique({
        where: { id: colaboradorId },
        select: { id: true },
      });
      if (!colaborador) {
        return res.status(404).json({ erro: "Colaborador não encontrado" });
      }
      const contribuicoes = await database.contribuicao.findMany({
        where: { colaboradorId },
        orderBy: [{ data: "desc" }, { createdAt: "desc" }, { id: "desc" }],
      });
      res.json(contribuicoes);
    } catch (error) {
      next(error);
    }
  }

  async function adicionarContribuicao(req, res, next) {
    const colaboradorId = parseId(req.params?.id);
    if (!colaboradorId) {
      return res.status(400).json({ erro: "ID de colaborador inválido" });
    }
    if (!isObject(req.body)) {
      return res.status(400).json({ erro: "O corpo da requisição deve ser um objeto" });
    }

    const errors = [];
    const tipoInformado =
      typeof req.body.tipo === "string" ? req.body.tipo.trim() : "";
    const tipo = tipoInformado === "Serviço" ? "Servico" : tipoInformado;
    if (!TIPOS_CONTRIBUICAO_VALIDOS.has(tipo)) {
      errors.push("Tipo deve ser 'Financeiro', 'Produto' ou 'Serviço'");
    }
    const valor = optionalText(req.body.valor, "Valor", errors);
    if (!valor) errors.push("Valor é obrigatório");
    const data = req.body.data;
    if (!isValidDate(data)) {
      errors.push("Data deve ser uma data válida no formato AAAA-MM-DD");
    }
    if (errors.length) return res.status(400).json({ erro: errors.join(". ") });

    try {
      const contribuicao = await database.contribuicao.create({
        data: { colaboradorId, tipo, valor, data },
      });
      res.status(201).json(contribuicao);
    } catch (error) {
      writeError(error, res, next);
    }
  }

  return {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    listarContribuicoes,
    adicionarContribuicao,
  };
}

module.exports = {
  ...createColaboradoresController(),
  createColaboradoresController,
};

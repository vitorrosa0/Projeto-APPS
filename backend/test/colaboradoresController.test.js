const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createColaboradoresController,
} = require("../src/controllers/colaboradoresController");

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function createDatabase(overrides = {}) {
  return {
    colaborador: {
      findMany: async () => [],
      findUnique: async () => ({ id: 1 }),
      create: async ({ data }) => ({ id: 1, ...data }),
      update: async ({ where, data }) => ({ id: where.id, ...data }),
      delete: async () => ({ id: 1 }),
      ...overrides.colaborador,
    },
    contribuicao: {
      findMany: async () => [],
      create: async ({ data }) => ({ id: 1, ...data }),
      ...overrides.contribuicao,
    },
  };
}

async function invoke(handler, { params = {}, body = {} } = {}) {
  const response = createResponse();
  let nextError;
  await handler({ params, body }, response, (error) => {
    nextError = error;
  });
  assert.equal(nextError, undefined);
  return response;
}

test("cria colaborador sem contatos e registra contribuição inicial", async () => {
  let received;
  const database = createDatabase({
    colaborador: {
      create: async (args) => {
        received = args;
        return { id: 7, ...args.data };
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.criar, {
    body: {
      nome: "  Ana Silva ",
      email: "",
      telefone: "   ",
      dataAdesao: "2024-02-29",
      ultimaContribuicao: " R$ 150,00 ",
    },
  });

  assert.equal(response.statusCode, 201);
  assert.equal(received.data.nome, "Ana Silva");
  assert.equal(received.data.email, null);
  assert.equal(received.data.telefone, null);
  assert.equal(received.data.status, "Ativo");
  assert.deepEqual(received.data.contribuicoes.create, {
    tipo: "Financeiro",
    valor: "R$ 150,00",
    data: "2024-02-29",
  });
});

test("rejeita data de adesão inválida sem chamar o banco", async () => {
  const database = createDatabase({
    colaborador: {
      create: async () => {
        assert.fail("Não deveria persistir dados inválidos");
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.criar, {
    body: { nome: "Ana", dataAdesao: "2024-02-30" },
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.body.erro, /Data de adesão/);
});

test("valida IDs antes de consultar o banco", async () => {
  const database = createDatabase({
    colaborador: {
      findUnique: async () => {
        assert.fail("Não deveria consultar com ID inválido");
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.buscarPorId, {
    params: { id: "1.5" },
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.body.erro, /ID de colaborador inválido/);
});

test("mapeia e-mail duplicado para conflito HTTP 409", async () => {
  const database = createDatabase({
    colaborador: {
      create: async () => {
        throw { code: "P2002" };
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.criar, {
    body: {
      nome: "Ana",
      email: "ANA@EXEMPLO.COM",
      dataAdesao: "2024-05-10",
    },
  });

  assert.equal(response.statusCode, 409);
  assert.equal(response.body.erro, "Email já cadastrado");
});

test("normaliza o tipo Serviço ao registrar contribuição", async () => {
  let received;
  const database = createDatabase({
    contribuicao: {
      create: async ({ data }) => {
        received = data;
        return { id: 9, ...data };
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.adicionarContribuicao, {
    params: { id: "3" },
    body: { tipo: "Serviço", valor: "Banho", data: "2024-05-10" },
  });

  assert.equal(response.statusCode, 201);
  assert.deepEqual(received, {
    colaboradorId: 3,
    tipo: "Servico",
    valor: "Banho",
    data: "2024-05-10",
  });
});

test("rejeita atualização vazia", async () => {
  const database = createDatabase({
    colaborador: {
      update: async () => {
        assert.fail("Não deveria atualizar com corpo vazio");
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.atualizar, {
    params: { id: "1" },
    body: {},
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.body.erro, /ao menos um campo/);
});

test("lista colaboradores com as contribuições incluídas", async () => {
  const expected = [{ id: 4, nome: "Ana", contribuicoes: [] }];
  let query;
  const database = createDatabase({
    colaborador: {
      findMany: async (args) => {
        query = args;
        return expected;
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.listar);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, expected);
  assert.deepEqual(query.include, {
    contribuicoes: {
      orderBy: [{ data: "desc" }, { createdAt: "desc" }, { id: "desc" }],
      take: 1,
    },
  });
});

test("retorna 404 ao buscar colaborador inexistente", async () => {
  const database = createDatabase({
    colaborador: { findUnique: async () => null },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.buscarPorId, {
    params: { id: "42" },
  });

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.erro, "Colaborador não encontrado");
});

test("normaliza os campos antes de atualizar colaborador", async () => {
  let received;
  const database = createDatabase({
    colaborador: {
      update: async (args) => {
        received = args;
        return { id: args.where.id, ...args.data };
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.atualizar, {
    params: { id: "8" },
    body: {
      nome: "  Ana Silva  ",
      email: "  ANA@EXEMPLO.COM ",
      telefone: "   ",
      status: "Pausado",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(received, {
    where: { id: 8 },
    data: {
      nome: "Ana Silva",
      email: "ana@exemplo.com",
      telefone: null,
      status: "Pausado",
    },
  });
});

test("mapeia remoção de colaborador inexistente para HTTP 404", async () => {
  const database = createDatabase({
    colaborador: {
      delete: async () => {
        throw { code: "P2025" };
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.remover, {
    params: { id: "9" },
  });

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.erro, "Colaborador não encontrado");
});

test("não consulta contribuições quando o colaborador não existe", async () => {
  const database = createDatabase({
    colaborador: { findUnique: async () => null },
    contribuicao: {
      findMany: async () => {
        assert.fail("Não deveria consultar contribuições sem colaborador");
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.listarContribuicoes, {
    params: { id: "11" },
  });

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.erro, "Colaborador não encontrado");
});

test("rejeita contribuição com tipo e data inválidos sem persistir", async () => {
  const database = createDatabase({
    contribuicao: {
      create: async () => {
        assert.fail("Não deveria persistir contribuição inválida");
      },
    },
  });
  const controller = createColaboradoresController(database);

  const response = await invoke(controller.adicionarContribuicao, {
    params: { id: "3" },
    body: { tipo: "Outro", valor: "Doação", data: "2024-02-30" },
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.body.erro, /Tipo deve ser/);
  assert.match(response.body.erro, /Data deve ser/);
});

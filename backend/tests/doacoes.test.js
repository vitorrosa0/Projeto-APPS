jest.mock("../src/prisma", () => ({
  doacao: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require("../src/prisma");
const ctrl = require("../src/controllers/doacoesController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();

beforeEach(() => jest.clearAllMocks());

// ── listar ──────────────────────────────────────────────────────────────────

describe("listar", () => {
  test("retorna todas as doações sem filtro", async () => {
    const doacoes = [{ id: 1, tipo: "dinheiro", valor: "100", data: "2026-11-01" }];
    prisma.doacao.findMany.mockResolvedValue(doacoes);

    const req = { query: {} };
    const res = mockRes();
    await ctrl.listar(req, res, next);

    expect(prisma.doacao.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(doacoes);
  });

  test("filtra por mês e ano", async () => {
    const doacoes = [
      { id: 1, tipo: "dinheiro", valor: "100", data: "2026-11-05" },
      { id: 2, tipo: "item", descricao: "Ração", data: "2026-10-10" },
    ];
    prisma.doacao.findMany.mockResolvedValue(doacoes);

    const req = { query: { mes: "11", ano: "2026" } };
    const res = mockRes();
    await ctrl.listar(req, res, next);

    const retornadas = res.json.mock.calls[0][0];
    expect(retornadas).toHaveLength(1);
    expect(retornadas[0].id).toBe(1);
  });
});

// ── buscarPorId ──────────────────────────────────────────────────────────────

describe("buscarPorId", () => {
  test("retorna a doação encontrada", async () => {
    const doacao = { id: 1, tipo: "dinheiro", valor: "200", data: "2026-11-01" };
    prisma.doacao.findUnique.mockResolvedValue(doacao);

    const req = { params: { id: "1" } };
    const res = mockRes();
    await ctrl.buscarPorId(req, res, next);

    expect(res.json).toHaveBeenCalledWith(doacao);
  });

  test("retorna 404 quando não encontrada", async () => {
    prisma.doacao.findUnique.mockResolvedValue(null);

    const req = { params: { id: "99" } };
    const res = mockRes();
    await ctrl.buscarPorId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ erro: "Doação não encontrada" });
  });
});

// ── criar ────────────────────────────────────────────────────────────────────

describe("criar", () => {
  test("cria doação em dinheiro com sucesso", async () => {
    const nova = { id: 1, tipo: "dinheiro", valor: "150", data: "2026-11-21" };
    prisma.doacao.create.mockResolvedValue(nova);

    const req = { body: { tipo: "dinheiro", valor: "150", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nova);
  });

  test("cria doação de item com sucesso", async () => {
    const nova = { id: 2, tipo: "item", descricao: "Ração 10kg", data: "2026-11-21" };
    prisma.doacao.create.mockResolvedValue(nova);

    const req = { body: { tipo: "item", descricao: "Ração 10kg", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("retorna 400 quando tipo está ausente", async () => {
    const req = { body: { data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 400 para tipo inválido", async () => {
    const req = { body: { tipo: "invalido", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: "Tipo deve ser 'dinheiro' ou 'item'" });
  });

  test("retorna 400 quando dinheiro sem valor", async () => {
    const req = { body: { tipo: "dinheiro", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 400 quando item sem descrição", async () => {
    const req = { body: { tipo: "item", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ── atualizar ────────────────────────────────────────────────────────────────

describe("atualizar", () => {
  test("atualiza doação existente", async () => {
    const existente = { id: 1, tipo: "dinheiro", valor: "100", data: "2026-11-01" };
    const atualizada = { ...existente, valor: "200" };
    prisma.doacao.findUnique.mockResolvedValue(existente);
    prisma.doacao.update.mockResolvedValue(atualizada);

    const req = { params: { id: "1" }, body: { tipo: "dinheiro", valor: "200", data: "2026-11-01" } };
    const res = mockRes();
    await ctrl.atualizar(req, res, next);

    expect(res.json).toHaveBeenCalledWith(atualizada);
  });

  test("retorna 404 quando não encontrada", async () => {
    prisma.doacao.findUnique.mockResolvedValue(null);

    const req = { params: { id: "99" }, body: {} };
    const res = mockRes();
    await ctrl.atualizar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ── remover ──────────────────────────────────────────────────────────────────

describe("remover", () => {
  test("remove doação existente", async () => {
    prisma.doacao.findUnique.mockResolvedValue({ id: 1 });
    prisma.doacao.delete.mockResolvedValue({});

    const req = { params: { id: "1" } };
    const res = mockRes();
    await ctrl.remover(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ mensagem: "Doação removida com sucesso" });
  });

  test("retorna 404 quando não encontrada", async () => {
    prisma.doacao.findUnique.mockResolvedValue(null);

    const req = { params: { id: "99" } };
    const res = mockRes();
    await ctrl.remover(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

jest.mock("../src/prisma", () => ({
  despesa: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require("../src/prisma");
const ctrl = require("../src/controllers/despesasController");

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
  test("retorna todas as despesas sem filtro", async () => {
    const despesas = [{ id: 1, categoria: "Veterinario", valor: "320", data: "2026-11-01" }];
    prisma.despesa.findMany.mockResolvedValue(despesas);

    const req = { query: {} };
    const res = mockRes();
    await ctrl.listar(req, res, next);

    expect(prisma.despesa.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(despesas);
  });

  test("filtra por mês e ano", async () => {
    const despesas = [
      { id: 1, categoria: "Veterinario", valor: "320", data: "2026-11-15" },
      { id: 2, categoria: "Alimentacao", valor: "200", data: "2026-10-15" },
    ];
    prisma.despesa.findMany.mockResolvedValue(despesas);

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
  test("retorna a despesa encontrada", async () => {
    const despesa = { id: 1, categoria: "Veterinario", valor: "320", data: "2026-11-01" };
    prisma.despesa.findUnique.mockResolvedValue(despesa);

    const req = { params: { id: "1" } };
    const res = mockRes();
    await ctrl.buscarPorId(req, res, next);

    expect(res.json).toHaveBeenCalledWith(despesa);
  });

  test("retorna 404 quando não encontrada", async () => {
    prisma.despesa.findUnique.mockResolvedValue(null);

    const req = { params: { id: "99" } };
    const res = mockRes();
    await ctrl.buscarPorId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ erro: "Despesa não encontrada" });
  });
});

// ── criar ────────────────────────────────────────────────────────────────────

describe("criar", () => {
  test("cria despesa com sucesso", async () => {
    const nova = { id: 1, categoria: "Ração para cães", valor: "450", data: "2026-11-21" };
    prisma.despesa.create.mockResolvedValue(nova);

    const req = { body: { categoria: "Ração para cães", valor: "450", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nova);
  });

  test("retorna 400 quando categoria está ausente", async () => {
    const req = { body: { valor: "100", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 400 quando valor está ausente", async () => {
    const req = { body: { categoria: "Veterinario", data: "2026-11-21" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 400 quando data está ausente", async () => {
    const req = { body: { categoria: "Veterinario", valor: "100" } };
    const res = mockRes();
    await ctrl.criar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ── atualizar ────────────────────────────────────────────────────────────────

describe("atualizar", () => {
  test("atualiza despesa existente", async () => {
    const existente = { id: 1, categoria: "Veterinario", valor: "320", data: "2026-11-01" };
    const atualizada = { ...existente, valor: "400" };
    prisma.despesa.findUnique.mockResolvedValue(existente);
    prisma.despesa.update.mockResolvedValue(atualizada);

    const req = { params: { id: "1" }, body: { categoria: "Veterinario", valor: "400", data: "2026-11-01" } };
    const res = mockRes();
    await ctrl.atualizar(req, res, next);

    expect(res.json).toHaveBeenCalledWith(atualizada);
  });

  test("retorna 404 quando não encontrada", async () => {
    prisma.despesa.findUnique.mockResolvedValue(null);

    const req = { params: { id: "99" }, body: {} };
    const res = mockRes();
    await ctrl.atualizar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ── remover ──────────────────────────────────────────────────────────────────

describe("remover", () => {
  test("remove despesa existente", async () => {
    prisma.despesa.findUnique.mockResolvedValue({ id: 1 });
    prisma.despesa.delete.mockResolvedValue({});

    const req = { params: { id: "1" } };
    const res = mockRes();
    await ctrl.remover(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ mensagem: "Despesa removida com sucesso" });
  });

  test("retorna 404 quando não encontrada", async () => {
    prisma.despesa.findUnique.mockResolvedValue(null);

    const req = { params: { id: "99" } };
    const res = mockRes();
    await ctrl.remover(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

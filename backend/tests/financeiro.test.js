jest.mock("../src/prisma", () => ({
  doacao: { findMany: jest.fn() },
  despesa: { findMany: jest.fn() },
  contribuicao: { findMany: jest.fn() },
}));

const prisma = require("../src/prisma");
const { resumo } = require("../src/controllers/financeiroController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();

beforeEach(() => jest.clearAllMocks());

// ── resumo ───────────────────────────────────────────────────────────────────

describe("resumo", () => {
  test("retorna resumo financeiro agregado sem filtro", async () => {
    prisma.doacao.findMany.mockResolvedValue([
      { id: 1, tipo: "dinheiro", valor: "200", data: "2026-11-01" },
      { id: 2, tipo: "item", descricao: "Ração", data: "2026-11-02" },
    ]);
    prisma.despesa.findMany.mockResolvedValue([
      { id: 1, categoria: "Veterinario", valor: "150", data: "2026-11-05" },
    ]);
    prisma.contribuicao.findMany.mockResolvedValue([
      { id: 1, tipo: "Financeiro", valor: "100", data: "2026-11-10", colaborador: { nome: "João" } },
    ]);

    const req = { query: {} };
    const res = mockRes();
    await resumo(req, res, next);

    const retorno = res.json.mock.calls[0][0];
    expect(retorno.receitas.total).toBe(300); // 200 + 100
    expect(retorno.despesas.total).toBe(150);
    expect(retorno.saldo).toBe(150);
    expect(retorno.itensDoados).toHaveLength(1);
    expect(retorno.periodo.mes).toBeNull();
    expect(retorno.periodo.ano).toBeNull();
  });

  test("filtra receitas, itens e despesas pelo período informado", async () => {
    prisma.doacao.findMany.mockResolvedValue([
      { id: 1, tipo: "dinheiro", valor: "200", data: "2026-11-15" },
      { id: 2, tipo: "dinheiro", valor: "500", data: "2026-10-15" }, // fora do período
    ]);
    prisma.despesa.findMany.mockResolvedValue([
      { id: 1, categoria: "Alimentacao", valor: "80", data: "2026-11-20" },
      { id: 2, categoria: "Transporte",  valor: "50", data: "2026-09-20" }, // fora do período
    ]);
    prisma.contribuicao.findMany.mockResolvedValue([]);

    const req = { query: { mes: "11", ano: "2026" } };
    const res = mockRes();
    await resumo(req, res, next);

    const retorno = res.json.mock.calls[0][0];
    expect(retorno.receitas.doacoesDinheiro.total).toBe(200);
    expect(retorno.despesas.total).toBe(80);
    expect(retorno.saldo).toBe(120);
    expect(retorno.periodo.mes).toBe("11");
    expect(retorno.periodo.ano).toBe("2026");
  });

  test("saldo negativo quando despesas superam receitas", async () => {
    prisma.doacao.findMany.mockResolvedValue([
      { id: 1, tipo: "dinheiro", valor: "50", data: "2026-11-01" },
    ]);
    prisma.despesa.findMany.mockResolvedValue([
      { id: 1, categoria: "Veterinario", valor: "300", data: "2026-11-05" },
    ]);
    prisma.contribuicao.findMany.mockResolvedValue([]);

    const req = { query: {} };
    const res = mockRes();
    await resumo(req, res, next);

    const retorno = res.json.mock.calls[0][0];
    expect(retorno.saldo).toBe(-250);
  });

  test("retorna zeros quando não há registros", async () => {
    prisma.doacao.findMany.mockResolvedValue([]);
    prisma.despesa.findMany.mockResolvedValue([]);
    prisma.contribuicao.findMany.mockResolvedValue([]);

    const req = { query: {} };
    const res = mockRes();
    await resumo(req, res, next);

    const retorno = res.json.mock.calls[0][0];
    expect(retorno.receitas.total).toBe(0);
    expect(retorno.despesas.total).toBe(0);
    expect(retorno.saldo).toBe(0);
    expect(retorno.itensDoados).toHaveLength(0);
  });

  test("itens doados não entram no total de receitas", async () => {
    prisma.doacao.findMany.mockResolvedValue([
      { id: 1, tipo: "item", descricao: "Coleira", data: "2026-11-01" },
      { id: 2, tipo: "item", descricao: "Brinquedo", data: "2026-11-02" },
    ]);
    prisma.despesa.findMany.mockResolvedValue([]);
    prisma.contribuicao.findMany.mockResolvedValue([]);

    const req = { query: {} };
    const res = mockRes();
    await resumo(req, res, next);

    const retorno = res.json.mock.calls[0][0];
    expect(retorno.receitas.total).toBe(0);
    expect(retorno.itensDoados).toHaveLength(2);
  });

  test("chama next em caso de erro", async () => {
    const erro = new Error("DB error");
    prisma.doacao.findMany.mockRejectedValue(erro);
    prisma.despesa.findMany.mockResolvedValue([]);
    prisma.contribuicao.findMany.mockResolvedValue([]);

    const req = { query: {} };
    const res = mockRes();
    await resumo(req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
  });
});

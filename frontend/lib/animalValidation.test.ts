import { describe, expect, it } from "vitest";
import { CANIS_POR_SETOR, validarFormulario, validarOpcoes } from "./animalValidation";

const base = { nome: "Nome", tipo: "cao", vacinacao: "", dataVacinacao: "" };

describe("validarFormulario", () => {
  it("aceita nome e tipo preenchidos sem dados de vacinação", () => {
    expect(validarFormulario(base)).toEqual({});
  });

  it("exige o nome, mesmo quando ele só tem espaços", () => {
    expect(validarFormulario({ ...base, nome: "  " }).nome).toBeDefined();
  });

  it("exige o tipo", () => {
    expect(validarFormulario({ ...base, tipo: "" }).tipo).toBeDefined();
  });

  it.each([
    ["data futura", { vacinacao: "Completa", dataVacinacao: "2999-01-01" }],
    ["data impossível", { vacinacao: "Completa", dataVacinacao: "2026-02-30" }],
    ["data com 'Não vacinado'", { vacinacao: "Não vacinado", dataVacinacao: "2026-01-01" }],
    ["data sem status de vacinação", { vacinacao: "", dataVacinacao: "2026-01-01" }],
  ])("recusa %s", (_caso, vacina) => {
    expect(validarFormulario({ ...base, ...vacina }).dataVacinacao).toBeDefined();
  });

  it("aceita data passada com vacinação completa", () => {
    expect(validarFormulario({ ...base, vacinacao: "Completa", dataVacinacao: "2026-01-01" })).toEqual({});
  });
});

describe("validarOpcoes", () => {
  it("aceita campos vazios e opções da lista", () => {
    expect(validarOpcoes({})).toEqual({});
    expect(validarOpcoes({ sexo: "Feminino", setor: "C", canil: "Baia 4" })).toEqual({});
  });

  it.each([
    ["sexo fora da lista", { sexo: "Macho" }, "sexo"],
    ["setor fora da lista", { setor: "Setor 3" }, "setor"],
    ["canil sem setor", { canil: "Baia 1" }, "canil"],
    ["canil de outro setor", { setor: "I", canil: "Baia 2" }, "canil"],
  ])("aponta %s", (_caso, dados, campo) => {
    expect(Object.keys(validarOpcoes(dados))).toEqual([campo]);
  });

  it("com setor fora da lista, aponta só o setor", () => {
    expect(validarOpcoes({ setor: "Setor 3", canil: "Canil velho" })).toEqual({ setor: "Escolha um setor da lista." });
  });

  it("usa a mesma tabela de canis do backend", async () => {
    const backend = await import("../../backend/src/animalValidation.js");
    expect(CANIS_POR_SETOR).toEqual(backend.CANIS_POR_SETOR);
  });

  it("faz parte da validação do formulário", () => {
    expect(validarFormulario({ ...base, setor: "Z" }).setor).toBe("Escolha um setor da lista.");
  });
});

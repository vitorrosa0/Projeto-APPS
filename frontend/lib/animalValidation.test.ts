import { describe, expect, it } from "vitest";
import { validarFormulario } from "./animalValidation";

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

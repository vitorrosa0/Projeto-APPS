import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimalListPage from "./AnimalListPage";
import { api } from "@/lib/api";
import { criarAnimal } from "@/tests/helpers/animais";

vi.mock("@/lib/api", () => ({ api: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/animais/caes",
}));

const apiMock = vi.mocked(api);

const rex = criarAnimal({ id: 1, nome: "Rex", idade: "2 anos", raca: "Vira-lata", setor: "A", canil: "Baia 1" });
const bolinha = criarAnimal({ id: 2, nome: "Bolinha" });
const thor = criarAnimal({ id: 3, nome: "Thor", raca: "Labrador", setor: "C" });

function renderizarLista() {
  return render(<AnimalListPage titulo="Relação de Cães" tipo="cao" />);
}

describe("AnimalListPage", () => {
  it("mostra o carregamento e depois os animais retornados pela API", async () => {
    apiMock.mockResolvedValue([rex, bolinha, thor]);

    renderizarLista();

    expect(screen.getByText("Carregando…")).toBeDefined();
    expect(await screen.findByText("Rex")).toBeDefined();
    expect(screen.getByText("Bolinha")).toBeDefined();
    expect(screen.getByText("Thor")).toBeDefined();
    expect(screen.getByText("3 animais encontrados")).toBeDefined();
    expect(apiMock).toHaveBeenCalledWith("/animais?tipo=cao");
  });

  it("filtra a lista pelo termo digitado na busca, mesmo com campos vazios", async () => {
    apiMock.mockResolvedValue([rex, bolinha, thor]);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Rex");

    await usuario.type(screen.getByRole("searchbox"), "labr");

    expect(screen.getByText("Thor")).toBeDefined();
    expect(screen.queryByText("Rex")).toBeNull();
    expect(screen.queryByText("Bolinha")).toBeNull();
    expect(screen.getByText("1 animal encontrado")).toBeDefined();
  });

  it("mostra a mensagem de lista vazia quando nenhum animal corresponde à busca", async () => {
    apiMock.mockResolvedValue([rex, bolinha]);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Rex");

    await usuario.type(screen.getByRole("searchbox"), "zzz");

    expect(screen.getByText("Nenhum animal encontrado.")).toBeDefined();
    expect(screen.getByText("0 animais encontrados")).toBeDefined();
  });

  it("mostra a mensagem de lista vazia quando a API não retorna animais", async () => {
    apiMock.mockResolvedValue([]);

    renderizarLista();

    expect(await screen.findByText("Nenhum animal encontrado.")).toBeDefined();
  });

  it("mostra erro com opção de tentar de novo quando a API falha", async () => {
    apiMock.mockRejectedValueOnce(new TypeError("Failed to fetch")).mockResolvedValueOnce([rex]);
    const usuario = userEvent.setup();
    renderizarLista();

    expect(await screen.findByText("Não foi possível carregar os animais.")).toBeDefined();
    expect(screen.queryByText("Nenhum animal encontrado.")).toBeNull();
    await usuario.click(screen.getByRole("button", { name: "Tentar de novo" }));

    expect(await screen.findByText("Rex")).toBeDefined();
    expect(screen.queryByText("Não foi possível carregar os animais.")).toBeNull();
  });

  it("confirma na tela quando o animal é excluído", async () => {
    apiMock.mockResolvedValueOnce([rex, bolinha]).mockResolvedValueOnce(undefined);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Rex");

    await usuario.click(screen.getByRole("button", { name: "Excluir Rex" }));
    await usuario.click(screen.getByRole("button", { name: "Excluir" }));

    expect(await screen.findByRole("status")).toHaveProperty("textContent", "Animal excluído: Rex");
    expect(screen.queryByText("Rex")).toBeNull();
    expect(apiMock).toHaveBeenLastCalledWith("/animais/1", { method: "DELETE" });
  });

  it("mostra o erro na tela, sem alert, quando a exclusão falha", async () => {
    apiMock.mockResolvedValueOnce([rex]).mockRejectedValueOnce(new Error("Erro 500 na requisição"));
    const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Rex");

    await usuario.click(screen.getByRole("button", { name: "Excluir Rex" }));
    await usuario.click(screen.getByRole("button", { name: "Excluir" }));

    expect(await screen.findByText("Não foi possível excluir Rex. Tente de novo.")).toBeDefined();
    expect(screen.getByText("Rex")).toBeDefined();
    expect(alerta).not.toHaveBeenCalled();
  });

  it("não mostra separadores nem o prefixo Setor para animal sem campos opcionais", async () => {
    apiMock.mockResolvedValue([bolinha]);

    renderizarLista();

    const item = (await screen.findByText("Bolinha")).closest("li");
    expect(item?.textContent).toBe("Bolinha — Ver ficha");
  });
});

describe("AnimalListPage com filtros e ordenação", () => {
  const luna = criarAnimal({ id: 10, nome: "Luna", setor: "A", sexo: "Feminino", cor: "Caramelo", createdAt: "2026-11-20T10:00:00.000Z" });
  const max = criarAnimal({ id: 11, nome: "Max", setor: "A", sexo: "Masculino", cor: "Preto", createdAt: "2026-11-25T10:00:00.000Z" });
  const nina = criarAnimal({ id: 12, nome: "Nina", setor: "B", sexo: "Feminino", cor: "Caramelo", createdAt: "2026-11-22T10:00:00.000Z" });

  function nomesNaLista() {
    return screen.getAllByRole("link", { name: /Ver ficha/ }).map((link) => link.textContent?.replace(" — Ver ficha", ""));
  }

  afterEach(() => {
    Reflect.deleteProperty(URL, "createObjectURL");
    Reflect.deleteProperty(URL, "revokeObjectURL");
  });

  it("combina o filtro de setor com a busca por cor", async () => {
    apiMock.mockResolvedValue([luna, max, nina]);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Luna");

    await usuario.selectOptions(screen.getByRole("combobox", { name: "Setor" }), "A");
    await usuario.type(screen.getByRole("searchbox"), "caramelo");

    expect(nomesNaLista()).toEqual(["Luna"]);
  });

  it("oferece só os valores existentes e limpa os filtros", async () => {
    apiMock.mockResolvedValue([luna, max, nina]);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Luna");

    const sexo = screen.getByRole("combobox", { name: "Sexo" });
    expect([...(sexo as HTMLSelectElement).options].map((o) => o.text)).toEqual(["Todos", "Feminino", "Masculino"]);
    await usuario.selectOptions(sexo, "Masculino");
    expect(nomesNaLista()).toEqual(["Max"]);

    await usuario.click(screen.getByRole("button", { name: "Limpar filtros" }));

    expect(nomesNaLista()).toEqual(["Luna", "Max", "Nina"]);
  });

  it("filtra pela situação calculada pelo histórico", async () => {
    apiMock.mockResolvedValue([
      { ...luna, status: "No abrigo" },
      { ...max, status: "Adotado" },
      { ...nina, status: "Adotado" },
    ]);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Luna");

    const situacao = screen.getByRole("combobox", { name: "Situação" });
    expect([...(situacao as HTMLSelectElement).options].map((o) => o.text)).toEqual(["Todas", "Adotado", "No abrigo"]);
    await usuario.selectOptions(situacao, "Adotado");
    await usuario.selectOptions(screen.getByRole("combobox", { name: "Sexo" }), "Feminino");

    expect(nomesNaLista()).toEqual(["Nina"]);
  });

  it("ordena pelo cadastro mais recente", async () => {
    apiMock.mockResolvedValue([luna, max, nina]);
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Luna");

    await usuario.selectOptions(screen.getByRole("combobox", { name: "Ordenar por" }), "recentes");

    expect(nomesNaLista()).toEqual(["Max", "Nina", "Luna"]);
  });

  it("exporta no CSV só os animais que passaram pelos filtros", async () => {
    apiMock.mockResolvedValue([luna, max, nina]);
    const criarUrl = vi.fn<(blob: Blob) => string>(() => "blob:teste");
    Object.assign(URL, { createObjectURL: criarUrl, revokeObjectURL: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const usuario = userEvent.setup();
    renderizarLista();
    await screen.findByText("Luna");

    await usuario.selectOptions(screen.getByRole("combobox", { name: "Sexo" }), "Feminino");
    await usuario.click(screen.getByRole("button", { name: /CSV/ }));

    const csv = await criarUrl.mock.calls[0][0].text();
    const linhas = csv.replace("﻿", "").split("\r\n");
    expect(linhas).toHaveLength(3);
    expect(linhas[1]).toContain('"Luna"');
    expect(linhas[2]).toContain('"Nina"');
  });
});

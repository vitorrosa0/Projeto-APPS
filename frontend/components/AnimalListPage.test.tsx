import { describe, expect, it, vi } from "vitest";
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
    expect(item?.textContent).toBe("Bolinha");
  });
});

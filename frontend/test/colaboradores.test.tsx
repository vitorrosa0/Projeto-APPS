import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CadastrarColaboradorPage from "../app/(etapas)/colaboradores/cadastrar/page";
import ColaboradoresPage from "../app/(etapas)/colaboradores/page";

const mocks = vi.hoisted(() => ({
  api: vi.fn(),
  routerPush: vi.fn(),
}));

vi.mock("@/lib/api", () => ({ api: mocks.api }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
  usePathname: () => "/colaboradores",
}));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/BottomNav", () => ({ default: () => null }));
vi.mock("@/components/PawBackground", () => ({ default: () => null }));

const colaborador = {
  id: 21,
  nome: "Ana Backend",
  email: null,
  telefone: null,
  status: "Ativo" as const,
  dataAdesao: "2026-11-25",
  contribuicoes: [],
};

const apiMock = mocks.api;

beforeEach(() => {
  apiMock.mockReset();
  mocks.routerPush.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("lista de colaboradores", () => {
  it("exibe os colaboradores carregados do backend, sem dados de demonstração", async () => {
    apiMock.mockResolvedValueOnce([colaborador]);

    render(<ColaboradoresPage />);

    expect(await screen.findByText("Ana Backend")).toBeTruthy();
    expect(apiMock).toHaveBeenCalledWith("/colaboradores");
    expect(screen.queryByText("Lucas Silva")).toBeNull();
    expect(screen.queryByText("Maria Clara")).toBeNull();
    expect(screen.queryByText("Julio César")).toBeNull();
  });

  it("exibe estado vazio quando o backend não possui colaboradores", async () => {
    apiMock.mockResolvedValueOnce([]);

    render(<ColaboradoresPage />);

    expect(await screen.findByText("Nenhum colaborador encontrado.")).toBeTruthy();
    expect(screen.queryByText("Lucas Silva")).toBeNull();
  });

  it("informa falha de carregamento e permite tentar novamente", async () => {
    apiMock
      .mockRejectedValueOnce(new Error("Backend indisponível"))
      .mockResolvedValueOnce([colaborador]);

    render(<ColaboradoresPage />);

    expect(await screen.findByText("Backend indisponível")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Ana Backend")).toBeTruthy();
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it("mantém o colaborador na lista se a exclusão na API falhar", async () => {
    apiMock
      .mockResolvedValueOnce([colaborador])
      .mockRejectedValueOnce(new Error("Falha ao excluir"));

    render(<ColaboradoresPage />);

    await screen.findByText("Ana Backend");
    fireEvent.click(screen.getByRole("button", { name: "Excluir Ana Backend" }));
    fireEvent.click(screen.getByRole("button", { name: /^Excluir$/ }));

    expect(await screen.findByText("Falha ao excluir")).toBeTruthy();
    expect(screen.getByText("Ana Backend")).toBeTruthy();
  });
});

describe("cadastro de colaborador", () => {
  it("envia os dados à API e exibe sucesso somente após a resposta", async () => {
    apiMock.mockResolvedValueOnce({ ...colaborador, id: 22 });

    render(<CadastrarColaboradorPage />);

    fireEvent.change(screen.getByLabelText("Nome Completo"), {
      target: { value: "Novo Colaborador" },
    });
    fireEvent.change(screen.getByLabelText("Última contribuição (opcional)"), {
      target: { value: "R$ 200,00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText("Colaborador Cadastrado com Sucesso")
    ).toBeTruthy();
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(apiMock).toHaveBeenCalledWith(
      "/colaboradores",
      expect.objectContaining({ method: "POST" })
    );

    const request = apiMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(request[1].body)) as {
      nome: string;
      ultimaContribuicao: string;
    };
    expect(body).toMatchObject({
      nome: "Novo Colaborador",
      ultimaContribuicao: "R$ 200,00",
    });
  });

  it("exibe o erro da API e não mostra sucesso quando o cadastro falha", async () => {
    apiMock.mockRejectedValueOnce(new Error("Email já cadastrado"));

    render(<CadastrarColaboradorPage />);

    fireEvent.change(screen.getByLabelText("Nome Completo"), {
      target: { value: "Novo Colaborador" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "Email já cadastrado"
    );
    expect(screen.queryByText("Colaborador Cadastrado com Sucesso")).toBeNull();
  });
});

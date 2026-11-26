import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimalForm from "./AnimalForm";
import { api, ApiError } from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api")>()),
  api: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/animais/cadastrar",
}));

const apiMock = vi.mocked(api);

describe("AnimalForm", () => {
  it("mostra no próprio campo que nome e tipo são obrigatórios e não envia", async () => {
    render(<AnimalForm />);

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getByText("Informe o nome do animal.")).toBeDefined();
    expect(screen.getByText("Selecione cão ou gato.")).toBeDefined();
    expect(screen.getByLabelText("Nome do animal").getAttribute("aria-describedby")).toBe("nome-error");
    expect(apiMock).not.toHaveBeenCalled();
  });

  it("recusa data de vacinação no futuro", async () => {
    render(<AnimalForm tipoInicial="cao" />);
    await userEvent.type(screen.getByLabelText("Nome do animal"), "Rex");
    await userEvent.selectOptions(screen.getByLabelText("Vacinação"), "Completa");
    await userEvent.type(screen.getByLabelText("Data de vacinação"), "2999-01-01");

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getByText("A vacinação não pode ter data futura.")).toBeDefined();
    expect(apiMock).not.toHaveBeenCalled();
  });

  it("mantém o tipo pré-selecionado ao escolher Cadastrar outro", async () => {
    apiMock.mockResolvedValue({});
    render(<AnimalForm tipoInicial="gato" />);
    await userEvent.type(screen.getByLabelText("Nome do animal"), "Mingau");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await userEvent.click(await screen.findByRole("button", { name: "Cadastrar outro" }));

    expect((screen.getByLabelText("Nome do animal") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Tipo do animal") as HTMLSelectElement).value).toBe("Gato");
  });

  it("oferece voltar à lista do tipo depois de salvar", async () => {
    apiMock.mockResolvedValue({});
    render(<AnimalForm tipoInicial="cao" />);
    await userEvent.type(screen.getByLabelText("Nome do animal"), "Rex");

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect((await screen.findByRole("link", { name: "Voltar à lista" })).getAttribute("href")).toBe("/animais/caes");
  });

  it("mostra no campo o erro de validação devolvido pela API", async () => {
    apiMock.mockRejectedValue(new ApiError("Informe o nome do animal.", 400, { nome: "Informe o nome do animal." }));
    render(<AnimalForm tipoInicial="cao" />);
    await userEvent.type(screen.getByLabelText("Nome do animal"), "Rex");

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByLabelText("Nome do animal")).toHaveProperty("ariaInvalid", "true");
  });

  it("limita o tamanho dos textos como o backend", () => {
    render(<AnimalForm />);

    expect(screen.getByLabelText("Nome do animal").getAttribute("maxlength")).toBe("100");
    expect(screen.getByLabelText("Outros:").getAttribute("maxlength")).toBe("1000");
  });
});

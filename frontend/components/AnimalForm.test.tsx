import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimalForm from "./AnimalForm";
import { api, ApiError } from "@/lib/api";
import { criarAnimal } from "@/tests/helpers/animais";

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

describe("AnimalForm com valores fora das opções", () => {
  // Cadastro anterior ao ANI-04, com setor e canil que não existem mais.
  const antigo = criarAnimal({ id: 5, nome: "Bidu", sexo: "Masculino", setor: "Setor 3", canil: "Canil velho" });

  beforeEach(() => apiMock.mockReset());

  it("abre apontando o campo e o valor salvo", () => {
    render(<AnimalForm animal={antigo} />);

    expect(screen.getByRole("status").textContent).toContain("valores que não existem mais");
    expect(screen.getByText('Escolha um setor da lista. Valor salvo: "Setor 3".')).toBeDefined();
    expect(screen.getByLabelText("Setor").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByLabelText("Sexo").getAttribute("aria-invalid")).toBe("false");
    // O seletor mostra o valor salvo, e não a primeira opção da lista.
    expect((screen.getByLabelText("Setor") as HTMLSelectElement).selectedOptions[0].text).toBe("Setor 3");
  });

  it("não envia enquanto o setor continuar fora da lista", async () => {
    render(<AnimalForm animal={antigo} />);

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(apiMock).not.toHaveBeenCalled();
  });

  it("salva depois de escolher setor e canil da lista", async () => {
    apiMock.mockResolvedValue({});
    render(<AnimalForm animal={antigo} />);

    await userEvent.selectOptions(screen.getByLabelText("Setor"), "C");
    await userEvent.selectOptions(screen.getByLabelText("Canil"), "Baia 2");
    expect(screen.queryByText(/Escolha um setor da lista/)).toBeNull();
    expect(screen.queryByText(/valores que não existem mais/)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    const [url, opcoes] = apiMock.mock.calls[0];
    expect(url).toBe("/animais/5");
    expect(JSON.parse(String(opcoes?.body))).toMatchObject({ setor: "C", canil: "Baia 2" });
  });

  it("mostra junto do campo o erro de qualquer campo devolvido pela API", async () => {
    apiMock.mockRejectedValueOnce(new ApiError("Use no máximo 100 caracteres.", 400, { raca: "Use no máximo 100 caracteres." }));
    render(<AnimalForm animal={criarAnimal({ id: 6, nome: "Mel" })} />);

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    const mensagens = await screen.findAllByText("Use no máximo 100 caracteres.");
    expect(mensagens.map((m) => m.id)).toEqual(["", "raca-error"]);
    expect(screen.getByLabelText("Raça").getAttribute("aria-describedby")).toBe("raca-error");
  });
});

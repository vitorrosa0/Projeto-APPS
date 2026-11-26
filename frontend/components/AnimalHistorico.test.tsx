import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimalHistorico from "./AnimalHistorico";
import { api } from "@/lib/api";
import type { Movimentacao } from "@/lib/movimentacoes";

vi.mock("@/lib/api", () => ({ api: vi.fn() }));

const apiMock = vi.mocked(api);

beforeEach(() => apiMock.mockReset());

function mov(dados: Partial<Movimentacao>): Movimentacao {
  return { id: 1, animalId: 7, tipo: "entrada", motivo: "Resgate", data: "2026-01-10", observacao: null, ...dados };
}

describe("AnimalHistorico", () => {
  it("mostra o histórico e avisa o status calculado", async () => {
    apiMock.mockResolvedValueOnce([mov({ id: 1 }), mov({ id: 2, tipo: "saida", motivo: "Adoção", data: "2026-02-01" })]);
    const onStatusChange = vi.fn();

    render(<AnimalHistorico animalId={7} onStatusChange={onStatusChange} />);

    const itens = await screen.findAllByRole("listitem");
    expect(itens.map((li) => li.textContent)).toEqual([
      expect.stringContaining("Entrada · Resgate · 10/01/2026"),
      expect.stringContaining("Saída · Adoção · 01/02/2026"),
    ]);
    expect(onStatusChange).toHaveBeenCalledWith("Adotado");
    expect(apiMock).toHaveBeenCalledWith("/animais/7/movimentacoes", expect.anything());
  });

  it("depois de uma saída, só oferece registrar entrada com os motivos de entrada", async () => {
    apiMock.mockResolvedValueOnce([mov({ tipo: "saida", motivo: "Fuga" })]);

    render(<AnimalHistorico animalId={7} />);

    expect(await screen.findByRole("heading", { name: "Registrar entrada" })).toBeDefined();
    expect(screen.queryByLabelText("Tipo")).toBeNull();
    const motivos = within(screen.getByLabelText("Motivo")).getAllByRole("option").map((o) => o.textContent);
    expect(motivos).toEqual(["Selecione", "Resgate", "Devolução de adoção", "Nascimento no abrigo", "Transferência recebida"]);
  });

  it("sem histórico, deixa escolher entrada ou saída", async () => {
    apiMock.mockResolvedValueOnce([]);

    render(<AnimalHistorico animalId={7} />);

    expect(await screen.findByText("Nenhuma movimentação registrada.")).toBeDefined();
    expect(within(screen.getByLabelText("Tipo")).getAllByRole("option").map((o) => o.textContent)).toEqual(["Selecione", "Entrada", "Saída"]);
  });

  it("registra uma saída e recarrega o histórico", async () => {
    apiMock
      .mockResolvedValueOnce([mov({ id: 1 })])
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce([mov({ id: 1 }), mov({ id: 2, tipo: "saida", motivo: "Adoção", data: "2026-02-01" })]);
    const onStatusChange = vi.fn();
    render(<AnimalHistorico animalId={7} onStatusChange={onStatusChange} />);
    await userEvent.selectOptions(await screen.findByLabelText("Motivo"), "Adoção");
    await userEvent.clear(screen.getByLabelText("Data"));
    await userEvent.type(screen.getByLabelText("Data"), "2026-02-01");

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    const [url, opcoes] = apiMock.mock.calls[1];
    expect(url).toBe("/animais/7/movimentacoes");
    expect(opcoes?.method).toBe("POST");
    expect(JSON.parse(String(opcoes?.body))).toEqual({ tipo: "saida", motivo: "Adoção", data: "2026-02-01", observacao: null });
    expect(await screen.findByText("Saída registrada.")).toBeDefined();
    expect(onStatusChange).toHaveBeenLastCalledWith("Adotado");
  });

  it("só oferece corrigir e excluir na última movimentação", async () => {
    apiMock.mockResolvedValueOnce([mov({ id: 1 }), mov({ id: 2, tipo: "saida", motivo: "Adoção", data: "2026-02-01" })]);

    render(<AnimalHistorico animalId={7} />);

    const [primeira, ultima] = await screen.findAllByRole("listitem");
    expect(within(primeira).queryByRole("button")).toBeNull();
    expect(within(ultima).getByRole("button", { name: "Corrigir" })).toBeDefined();
    expect(within(ultima).getByRole("button", { name: "Excluir" })).toBeDefined();
  });

  it("corrige a última movimentação com PUT", async () => {
    apiMock
      .mockResolvedValueOnce([mov({ id: 3 })])
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce([mov({ id: 3, motivo: "Transferência recebida" })]);
    render(<AnimalHistorico animalId={7} />);
    await userEvent.click(await screen.findByRole("button", { name: "Corrigir" }));
    await userEvent.selectOptions(screen.getByLabelText("Motivo"), "Transferência recebida");

    await userEvent.click(screen.getByRole("button", { name: "Salvar correção" }));

    expect(apiMock.mock.calls[1][0]).toBe("/animais/7/movimentacoes/3");
    expect(apiMock.mock.calls[1][1]?.method).toBe("PUT");
    expect(await screen.findByText("Movimentação corrigida.")).toBeDefined();
  });

  it("mostra o erro devolvido pela API", async () => {
    apiMock.mockResolvedValueOnce([]).mockRejectedValueOnce(new Error("A data não pode ser futura."));
    render(<AnimalHistorico animalId={7} />);
    await userEvent.selectOptions(await screen.findByLabelText("Tipo"), "entrada");
    await userEvent.selectOptions(screen.getByLabelText("Motivo"), "Resgate");

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect((await screen.findByRole("alert")).textContent).toBe("A data não pode ser futura.");
  });
});

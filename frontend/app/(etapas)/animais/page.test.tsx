import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Animais from "./page";
import { api } from "@/lib/api";
import { criarAnimal } from "@/tests/helpers/animais";

vi.mock("@/lib/api", () => ({ api: vi.fn(), API_URL: "http://localhost:3001" }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/animais",
}));

const apiMock = vi.mocked(api);

describe("Tela inicial de Animais", () => {
  it("mostra quantos cães e gatos estão cadastrados", async () => {
    apiMock.mockResolvedValue([
      criarAnimal({ id: 1, tipo: "cao" }),
      criarAnimal({ id: 2, tipo: "cao" }),
      criarAnimal({ id: 3, tipo: "gato" }),
    ]);

    render(<Animais />);

    expect(await screen.findByRole("link", { name: "Cães: 2 cadastrados" })).toHaveProperty(
      "href",
      "http://localhost:3000/animais/caes"
    );
    expect(screen.getByRole("link", { name: "Gatos: 1 cadastrado" })).toHaveProperty(
      "href",
      "http://localhost:3000/animais/gatos"
    );
    expect(apiMock).toHaveBeenCalledWith("/animais");
  });

  it("oferece o atalho para cadastrar animal", () => {
    apiMock.mockResolvedValue([]);

    render(<Animais />);

    expect(screen.getByRole("link", { name: "Cadastrar animal" })).toHaveProperty(
      "href",
      "http://localhost:3000/animais/cadastrar"
    );
  });

  it("avisa na tela e mantém os atalhos quando os totais não carregam", async () => {
    apiMock.mockRejectedValue(new TypeError("Failed to fetch"));

    render(<Animais />);

    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "Não foi possível carregar os totais de animais."
    );
    expect(screen.getByRole("link", { name: "Cães" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Gatos" })).toBeDefined();
  });
});

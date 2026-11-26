import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "./ConfirmModal";

function renderizar(onCancel = vi.fn()) {
  render(
    <>
      <button type="button">Fora do modal</button>
      <ConfirmModal acessivel titulo="Excluir animal" mensagem="Tem certeza?" labelConfirmar="Excluir" onConfirm={vi.fn()} onCancel={onCancel} />
    </>
  );
  return onCancel;
}

describe("ConfirmModal acessível", () => {
  it("é anunciado como diálogo com título e descrição", () => {
    renderizar();

    const dialogo = screen.getByRole("dialog", { name: "Excluir animal" });
    expect(dialogo.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("Tem certeza?").id).toBe(dialogo.getAttribute("aria-describedby"));
  });

  it("fecha com Esc", async () => {
    const onCancel = renderizar();

    await userEvent.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("mantém o foco dentro do modal ao navegar com Tab", async () => {
    renderizar();
    const dialogo = screen.getByRole("dialog");

    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      expect(dialogo.contains(document.activeElement)).toBe(true);
    }
    await userEvent.tab({ shift: true });
    expect(dialogo.contains(document.activeElement)).toBe(true);
  });
});

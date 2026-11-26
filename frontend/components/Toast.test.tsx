import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import Toast, { useToast } from "./Toast";

describe("Toast", () => {
  it("mostra a mensagem de sucesso como status", () => {
    render(<Toast mensagem="Pet cadastrado com sucesso!" tipo="sucesso" visivel />);

    expect(screen.getByRole("status").textContent).toBe("Pet cadastrado com sucesso!");
  });

  it("mostra a mensagem de erro como alerta", () => {
    render(<Toast mensagem="Não foi possível salvar." tipo="erro" visivel />);

    expect(screen.getByRole("alert").textContent).toBe("Não foi possível salvar.");
  });

  it("fica oculto para leitores de tela quando não está visível", () => {
    render(<Toast mensagem="Pet cadastrado com sucesso!" tipo="sucesso" visivel={false} />);

    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("useToast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("mostra o toast e o esconde depois do tempo definido", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(1000));

    act(() => result.current.mostrarToast("Salvo", "sucesso"));
    expect(result.current.toast).toEqual({ mensagem: "Salvo", tipo: "sucesso", visivel: true });

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.toast.visivel).toBe(false);
  });

  it("reinicia o tempo quando um novo toast aparece antes do anterior sumir", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(1000));

    act(() => result.current.mostrarToast("Primeiro"));
    act(() => vi.advanceTimersByTime(800));
    act(() => result.current.mostrarToast("Segundo", "erro"));
    act(() => vi.advanceTimersByTime(800));

    expect(result.current.toast).toEqual({ mensagem: "Segundo", tipo: "erro", visivel: true });
  });
});

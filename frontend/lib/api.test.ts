import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, API_URL } from "./api";

const fetchMock = vi.fn();
const assign = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("location", { ...window.location, assign });
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
  assign.mockReset();
});

const resposta = (status: number, corpo: unknown = {}) =>
  new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json" } });

describe("api", () => {
  it("envia o token salvo no login", async () => {
    localStorage.setItem("token", "abc");
    fetchMock.mockResolvedValue(resposta(200, []));

    await api("/animais");

    const [url, opcoes] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_URL}/animais`);
    expect(opcoes.headers).toMatchObject({ Authorization: "Bearer abc", "Content-Type": "application/json" });
  });

  it("não envia Authorization sem login", async () => {
    fetchMock.mockResolvedValue(resposta(200, []));

    await api("/animais");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("preserva o método e o corpo das opções", async () => {
    fetchMock.mockResolvedValue(resposta(201, { id: 1 }));

    await api("/animais", { method: "POST", body: "{}" });

    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "POST", body: "{}" });
  });

  it("com 401, descarta a sessão e leva ao login", async () => {
    localStorage.setItem("token", "expirado");
    localStorage.setItem("usuario", "{}");
    fetchMock.mockResolvedValue(resposta(401, { erro: "Sessão expirada ou inválida. Faça login novamente." }));

    await expect(api("/animais")).rejects.toThrow("Sessão expirada ou inválida. Faça login novamente.");

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("usuario")).toBeNull();
    expect(assign).toHaveBeenCalledWith("/login");
  });

  it("não redireciona no 401 do próprio login (senha errada)", async () => {
    fetchMock.mockResolvedValue(resposta(401, { erro: "Credenciais inválidas" }));

    await expect(api("/auth/login", { method: "POST", body: "{}" })).rejects.toThrow("Credenciais inválidas");

    expect(assign).not.toHaveBeenCalled();
  });
});

// Base da API do backend. Em produção, defina NEXT_PUBLIC_API_URL no ambiente.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Wrapper simples de fetch que já aponta pra API e trata erros HTTP. */
export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || `Erro ${res.status} na requisição`);
  }

  // DELETE pode não retornar corpo útil
  return res.status === 204 ? (undefined as T) : res.json();
}

// Base da API do backend. Em produção, defina NEXT_PUBLIC_API_URL no ambiente.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Erro HTTP da API; `campos` traz os erros por campo quando o backend os envia (400). */
export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly campos: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
  }
}

function tokenSalvo(): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem("token");
  } catch {
    return null;
  }
}

/**
 * Wrapper simples de fetch que já aponta pra API e trata erros HTTP.
 * Envia o token do login (localStorage "token") quando houver. Se a API
 * responder 401 fora de /auth, a sessão é descartada e a pessoa vai ao login.
 */
export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = tokenSalvo();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401 && !path.startsWith("/auth")) {
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("usuario");
    } catch {}
    window.location.assign("/login");
  }

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new ApiError(erro.erro || `Erro ${res.status} na requisição`, res.status, erro.campos ?? {});
  }

  // DELETE pode não retornar corpo útil
  return res.status === 204 ? (undefined as T) : res.json();
}

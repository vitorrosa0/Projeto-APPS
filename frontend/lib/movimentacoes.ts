// Mesmas regras de backend/src/movimentacoes.js (ANI-11).
export type TipoMovimentacao = "entrada" | "saida";

export interface Movimentacao {
  id: number;
  animalId: number;
  tipo: TipoMovimentacao;
  motivo: string;
  data: string;
  observacao: string | null;
}

export const MOTIVOS: Record<TipoMovimentacao, string[]> = {
  entrada: ["Resgate", "Devolução de adoção", "Nascimento no abrigo", "Transferência recebida"],
  saida: ["Adoção", "Óbito", "Fuga", "Transferência enviada"],
};

export const ROTULO_TIPO: Record<TipoMovimentacao, string> = { entrada: "Entrada", saida: "Saída" };

const STATUS_POR_SAIDA: Record<string, string> = {
  "Adoção": "Adotado",
  "Óbito": "Falecido",
  "Fuga": "Desaparecido",
  "Transferência enviada": "Transferido",
};

export const NO_ABRIGO = "No abrigo";
export const LIMITE_OBSERVACAO = 1000;

/** Status pelo histórico; sem movimentações, o animal é considerado no abrigo. */
export function statusAtual(ultima?: Pick<Movimentacao, "tipo" | "motivo"> | null): string {
  return ultima?.tipo === "saida" ? STATUS_POR_SAIDA[ultima.motivo] ?? "Fora do abrigo" : NO_ABRIGO;
}

/** Tipos permitidos para a próxima movimentação: o oposto da última, ou ambos sem histórico. */
export function proximosTipos(ultima?: Pick<Movimentacao, "tipo"> | null): TipoMovimentacao[] {
  if (!ultima) return ["entrada", "saida"];
  return [ultima.tipo === "entrada" ? "saida" : "entrada"];
}

export function hoje(): string {
  return new Date().toLocaleDateString("sv-SE");
}

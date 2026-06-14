export interface Agendamento {
  id: number;
  data: string; // "YYYY-MM-DD"
  voluntario: string;
  motivo: MotivoAgendamento;
  horario: string;
}

export interface Lembrete {
  data: string; // "YYYY-MM-DD"
  texto: string;
}

export type MotivoAgendamento =
  | "Cuidados diários"
  | "Banho"
  | "Socialização"
  | "Manutenção"
  | "Ajuda em eventos";

export const MOTIVOS: MotivoAgendamento[] = [
  "Cuidados diários",
  "Banho",
  "Socialização",
  "Manutenção",
  "Ajuda em eventos",
];

export function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatarHorario(horario: string): string {
  return horario.padStart(5, "0");
}
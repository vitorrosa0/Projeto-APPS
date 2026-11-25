import { api } from "@/lib/api";
import { reaisParaCentavos } from "@/lib/dinheiro";

export interface DadosDespesa {
  tipo: string;
  valor: string;
  data: string;
  descricao?: string;
}

export async function criarDespesa(d: DadosDespesa) {
  const valorCentavos = reaisParaCentavos(d.valor);
  if (!valorCentavos) throw new Error("Informe um valor válido para a despesa.");
  await api("/despesas", {
    method: "POST",
    body: JSON.stringify({
      categoria: d.tipo,
      valorCentavos,
      data: d.data,
      descricao: d.descricao,
    }),
  });
}

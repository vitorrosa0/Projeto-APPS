"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import DoacaoRow from "@/components/DoacaoRow";
import TotalDoacoes from "@/components/TotalDoacoes";
import { api } from "@/lib/api";
import { centavosParaReais } from "@/lib/dinheiro";

interface Doacao {
  id: number;
  tipo: "Dinheiro" | "Item";
  valorCentavos: number | null;
  itens: { id: number; nome: string; quantidade: number }[];
}

interface Totais {
  totalDinheiroCentavos: number;
  itens: { nome: string; quantidade: number }[];
}

export default function DetalhesDoacoesPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mes = searchParams.get("mes") ?? "Mês";

  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [totais, setTotais] = useState<Totais | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const periodo = `ano=${new Date().getFullYear()}&mes=${id}`;
    Promise.all([
      api<Doacao[]>(`/doacoes?${periodo}`),
      api<Totais>(`/doacoes/totais?${periodo}`),
    ])
      .then(([lista, t]) => {
        setDoacoes(lista);
        setTotais(t);
      })
      .catch((e: Error) => setErro(e.message));
  }, [id]);

  const totalItens = totais?.itens.reduce((acc, i) => acc + i.quantidade, 0) ?? 0;

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 text-center">
              Doações do mês de {mes}
            </h2>
          </div>

          {erro && <p className="px-4 py-3 text-sm text-red-600">{erro}</p>}
          {!erro && doacoes.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-500 text-center">Nenhuma doação neste mês.</p>
          )}

          {doacoes.map((doacao) => (
            <DoacaoRow
              key={doacao.id}
              tipo={doacao.tipo}
              valorCentavos={doacao.valorCentavos}
              itens={doacao.itens}
            />
          ))}

          <div className="px-4 pb-4">
            <TotalDoacoes
              totalFinanceiro={centavosParaReais(totais?.totalDinheiroCentavos ?? 0)}
              totalProdutos={totalItens}
            />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

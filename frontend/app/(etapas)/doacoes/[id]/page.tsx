"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import DoacaoRow from "@/components/DoacaoRow";
import TotalDoacoes from "@/components/TotalDoacoes";
import { api } from "@/lib/api";

interface DoacaoApi {
  id: number;
  tipo: "dinheiro" | "item";
  valor?: string | null;
  descricao?: string | null;
  doador?: string | null;
  data: string;
}

interface Doacao {
  id: number;
  tipo: "Financeira" | "Produtos" | "Alimentos";
  valor?: string;
  quantidade?: number;
  itens?: { nome: string; quantidade: number }[];
}

function mapearDoacao(d: DoacaoApi): Doacao {
  if (d.tipo === "dinheiro") {
    const num = parseFloat(d.valor ?? "0");
    return {
      id: d.id,
      tipo: "Financeira",
      valor: num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    };
  }
  return {
    id: d.id,
    tipo: "Produtos",
    quantidade: 1,
    itens: [{ nome: d.descricao ?? "Item doado", quantidade: 1 }],
  };
}

function calcularTotalFinanceiro(doacoes: Doacao[]): string {
  const total = doacoes
    .filter((d) => d.tipo === "Financeira")
    .reduce((acc, d) => {
      const num = parseFloat(
        d.valor?.replace("R$ ", "").replace("R$ ", "").replace(/\./g, "").replace(",", ".") ?? "0"
      );
      return acc + num;
    }, 0);
  return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularTotalProdutos(doacoes: Doacao[]): number {
  return doacoes
    .filter((d) => d.tipo === "Produtos" || d.tipo === "Alimentos")
    .reduce((acc, d) => acc + (d.quantidade ?? 0), 0);
}

export default function DetalhesDoacoesPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const mes = searchParams.get("mes") ?? "Mês";
  const mesNum = params.id as string;

  const [doacoes, setDoacoes] = useState<Doacao[]>([]);

  useEffect(() => {
    const ano = new Date().getFullYear();
    api<DoacaoApi[]>(`/doacoes?mes=${mesNum}&ano=${ano}`)
      .then((data) => setDoacoes(data.map(mapearDoacao)))
      .catch((e) => console.error("Erro ao carregar doações:", e));
  }, [mesNum]);

  const totalFinanceiro = calcularTotalFinanceiro(doacoes);
  const totalProdutos = calcularTotalProdutos(doacoes);

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

          {doacoes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Nenhuma doação registrada neste mês.
            </p>
          ) : (
            doacoes.map((doacao) => (
              <DoacaoRow
                key={doacao.id}
                tipo={doacao.tipo}
                valor={doacao.valor}
                quantidade={doacao.quantidade}
                itens={doacao.itens}
              />
            ))
          )}

          <div className="px-4 pb-4">
            <TotalDoacoes
              totalFinanceiro={totalFinanceiro}
              totalProdutos={totalProdutos}
            />
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import DoacaoRow from "@/components/DoacaoRow";
import TotalDoacoes from "@/components/TotalDoacoes";

interface Item {
  nome: string;
  quantidade: number;
}

interface Doacao {
  id: number;
  tipo: "Financeira" | "Produtos" | "Alimentos";
  valor?: string;
  quantidade?: number;
  itens?: Item[];
}

const DOACOES_MOCK: Doacao[] = [
  { id: 1, tipo: "Financeira", valor: "R$ 500,00" },
  { id: 2, tipo: "Financeira", valor: "R$ 700,00" },
  {
    id: 3,
    tipo: "Produtos",
    quantidade: 30,
    itens: [
      { nome: "Sabonete",      quantidade: 10 },
      { nome: "Shampoo",       quantidade: 2  },
      { nome: "Condicionador", quantidade: 3  },
      { nome: "Lâmpada",       quantidade: 5  },
      { nome: "Cama",          quantidade: 10 },
    ],
  },
];

function calcularTotalFinanceiro(doacoes: Doacao[]): string {
  const total = doacoes
    .filter((d) => d.tipo === "Financeira")
    .reduce((acc, d) => {
      const numero = parseFloat(d.valor?.replace("R$ ", "").replace(",", ".") ?? "0");
      return acc + numero;
    }, 0);

  return `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function calcularTotalProdutos(doacoes: Doacao[]): number {
  return doacoes
    .filter((d) => d.tipo === "Produtos" || d.tipo === "Alimentos")
    .reduce((acc, d) => acc + (d.quantidade ?? 0), 0);
}

export default function DetalhesDoacoesPage() {
  const searchParams = useSearchParams();
  const mes = searchParams.get("mes") ?? "Mês";

  // TODO: buscar doacoes da API filtrando pelo mês
  const doacoes = DOACOES_MOCK;

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

          {doacoes.map((doacao) => (
            <DoacaoRow
              key={doacao.id}
              tipo={doacao.tipo}
              valor={doacao.valor}
              quantidade={doacao.quantidade}
              itens={doacao.itens}
            />
          ))}

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
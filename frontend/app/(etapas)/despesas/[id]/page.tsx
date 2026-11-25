"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import NovaDespesaModal, { DadosDespesa } from "@/components/NovaDespesaModal";

interface DespesaItem {
  id: number;
  categoria: string;
  valor: number;
}

const DESPESAS_MOCK_BASE: Record<string, DespesaItem[]> = {
  Janeiro: [
    { id: 1, categoria: "Ração para gato", valor: 350.0 },
    { id: 2, categoria: "Ração para cachorro", valor: 750.0 },
    { id: 3, categoria: "Vacina para gato", valor: 200.0 },
    { id: 4, categoria: "Vacina para cachorro", valor: 500.0 },
    { id: 5, categoria: "Remédios em geral", valor: 150.0 },
    { id: 6, categoria: "Gastos com reformas no canil", valor: 1000.0 },
  ],
  Fevereiro: [
    { id: 1, categoria: "Ração para cães", valor: 820.0 },
    { id: 2, categoria: "Ração para gatos", valor: 390.0 },
    { id: 3, categoria: "Remédios e antibióticos", valor: 260.0 },
    { id: 4, categoria: "Despesas com energia", valor: 410.0 },
    { id: 5, categoria: "Despesas com água", valor: 190.0 },
  ],
  Março: [
    { id: 1, categoria: "Ração para cães", valor: 780.0 },
    { id: 2, categoria: "Ração para gatos", valor: 360.0 },
    { id: 3, categoria: "Vacinas V10", valor: 450.0 },
    { id: 4, categoria: "Material de limpeza", valor: 220.0 },
  ],
};

function parseValorMoeda(valorStr: string): number {
  const limpo = valorStr.replace(/[^\d,-]/g, "").replace(",", ".");
  const num = parseFloat(limpo);
  return isNaN(num) ? 0 : num;
}

export default function DetalhesDespesasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mesParam = searchParams.get("mes") ?? "Janeiro";

  const [despesas, setDespesas] = useState<DespesaItem[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    // Carrega despesas mock do mês ou itens padrão
    const mock = DESPESAS_MOCK_BASE[mesParam] || [
      { id: 1, categoria: "Ração para cachorro", valor: 650.0 },
      { id: 2, categoria: "Ração para gato", valor: 300.0 },
      { id: 3, categoria: "Remédios em geral", valor: 180.0 },
      { id: 4, categoria: "Despesas com energia", valor: 390.0 },
    ];

    // Carrega também despesas adicionadas dinamicamente
    try {
      const stored = JSON.parse(localStorage.getItem("sjpa_despesas") || "[]");
      const extras = stored.map((item: any, idx: number) => ({
        id: item.id || 100 + idx,
        categoria: item.tipo,
        valor: parseValorMoeda(item.valor),
      }));
      setDespesas([...mock, ...extras]);
    } catch {
      setDespesas(mock);
    }
  }, [mesParam]);

  const totalGeral = despesas.reduce((acc, curr) => acc + curr.valor, 0);

  const handleSalvarDespesa = (dados: DadosDespesa) => {
    const novoValor = parseValorMoeda(dados.valor);
    const novoItem: DespesaItem = {
      id: Date.now(),
      categoria: dados.tipo,
      valor: novoValor,
    };
    setDespesas((prev) => [...prev, novoItem]);

    try {
      const stored = JSON.parse(localStorage.getItem("sjpa_despesas") || "[]");
      stored.push({ id: novoItem.id, ...dados });
      localStorage.setItem("sjpa_despesas", JSON.stringify(stored));
    } catch (e) {
      console.warn("Erro ao salvar:", e);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/despesas")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header do Card */}
          <div className="px-4 py-4 border-b border-gray-100 text-center bg-gray-50/50">
            <h2 className="text-base font-bold text-gray-800">
              Despesas do mês de {mesParam}
            </h2>
          </div>

          {/* Lista de itens */}
          <div className="divide-y divide-gray-100">
            {despesas.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.categoria}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {item.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Total Geral */}
          <div className="border-t-2 border-gray-200 px-5 py-4 bg-[#2DB38B]/10 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Total Geral
            </span>
            <span className="text-base font-extrabold text-[#25967A]">
              {totalGeral.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        {/* Botão Nova Despesa */}
        <button
          onClick={() => setModalAberto(true)}
          className="
            w-full flex items-center justify-between
            bg-[#2DB38B] text-white
            rounded-full px-6 py-3.5
            text-base font-semibold shadow-md
            hover:scale-[1.03] hover:shadow-lg
            active:scale-[0.98]
            transition-all duration-150 cursor-pointer
          "
        >
          <span className="flex-1 text-center">Nova Despesa</span>
          <MdAdd size={22} />
        </button>
      </main>

      {modalAberto && (
        <NovaDespesaModal
          onClose={() => setModalAberto(false)}
          onSalvar={handleSalvarDespesa}
        />
      )}

      <BottomNav />
    </div>
  );
}
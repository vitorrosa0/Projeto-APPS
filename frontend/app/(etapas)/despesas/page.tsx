"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import NovaDespesaModal, { DadosDespesa } from "@/components/NovaDespesaModal";

const MESES_DO_ANO = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getMesAtualIndex(): number {
  return new Date().getMonth();
}

function getMesesExibidos(): { mes: string; index: number }[] {
  const mesAtual = getMesAtualIndex();
  return MESES_DO_ANO.slice(0, mesAtual + 1).map((mes, index) => ({ mes, index }));
}

export default function DespesasPage() {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);

  const mesesExibidos = getMesesExibidos();
  const mesAtualIndex = getMesAtualIndex();

  const handleVerRelatorio = (mes: string, index: number) => {
    router.push(`/despesas/${index + 1}?mes=${encodeURIComponent(mes)}`);
  };

  const handleSalvarDespesa = (dados: DadosDespesa) => {
    console.log("Nova despesa cadastrada:", dados);
    // Armazena temporariamente no sessionStorage/localStorage para visualização instantânea
    try {
      const stored = JSON.parse(localStorage.getItem("sjpa_despesas") || "[]");
      stored.push({ id: Date.now(), ...dados });
      localStorage.setItem("sjpa_despesas", JSON.stringify(stored));
    } catch (e) {
      console.warn("Não foi possível salvar no localStorage:", e);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/home")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Despesas</PageTitle>

        {/* Card de meses */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 text-center">
            <span className="text-sm font-semibold text-gray-700">Meses</span>
          </div>

          {mesesExibidos.map(({ mes, index }) => {
            const isAtual = index === mesAtualIndex;
            return (
              <div
                key={mes}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm text-gray-700 leading-tight">
                  {mes}
                  {isAtual && (
                    <>
                      <br />
                      <span className="text-xs text-gray-400 font-medium">(Mês atual)</span>
                    </>
                  )}
                </span>

                <button
                  onClick={() => handleVerRelatorio(mes, index)}
                  className="bg-[#2DB38B] text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  Visualizar relatório
                </button>
              </div>
            );
          })}
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
          <span className="flex-1 text-center">Nova Despesa para o Mês Atual</span>
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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import MonthRow from "@/components/MonthRow";
import NovaDoacaoModal, { DadosDoacao } from "@/components/NovaDoacaoModal";

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

export default function DoacoesPage() {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);

  const mesesExibidos = getMesesExibidos();
  const mesAtualIndex = getMesAtualIndex();

  const handleVerDetalhes = (mes: string, index: number) => {
    router.push(`/doacoes/${index + 1}?mes=${encodeURIComponent(mes)}`);
  };

  const handleSalvarDoacao = (dados: DadosDoacao) => {
    // TODO: integrar com API/backend
    console.log("Nova doação salva:", dados);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack={true} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">

        <PageTitle>Doações</PageTitle>

        {/* Tabela de meses */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 text-center">
            <span className="text-sm font-semibold text-gray-700">Meses</span>
          </div>

          {mesesExibidos.map(({ mes, index }) => (
            <MonthRow
              key={mes}
              mes={mes}
              atual={index === mesAtualIndex}
              onVerDetalhes={() => handleVerDetalhes(mes, index)}
            />
          ))}
        </div>

        {/* Botão Nova Doação */}
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
          <span className="flex-1 text-center">Nova Doação</span>
          <MdAdd size={22} />
        </button>

      </main>

      {modalAberto && (
        <NovaDoacaoModal
          onClose={() => setModalAberto(false)}
          onSalvar={handleSalvarDoacao}
        />
      )}

      <BottomNav />
    </div>
  );
}
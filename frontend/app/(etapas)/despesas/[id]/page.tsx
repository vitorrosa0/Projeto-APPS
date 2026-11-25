"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import NovaDespesaModal, { DadosDespesa } from "@/components/NovaDespesaModal";
import { api } from "@/lib/api";
import { centavosParaReais } from "@/lib/dinheiro";
import { criarDespesa } from "@/lib/despesas";

interface Despesa {
  id: number;
  categoria: string;
  valorCentavos: number;
}

interface Totais {
  totalCentavos: number;
}

export default function DetalhesDespesasPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mesParam = searchParams.get("mes") ?? "Mês";

  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [totalCentavos, setTotalCentavos] = useState(0);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const carregar = useCallback(() => {
    const periodo = `ano=${new Date().getFullYear()}&mes=${id}`;
    Promise.all([
      api<Despesa[]>(`/despesas?${periodo}`),
      api<Totais>(`/despesas/totais?${periodo}`),
    ])
      .then(([lista, totais]) => {
        setDespesas(lista);
        setTotalCentavos(totais.totalCentavos);
        setErro("");
      })
      .catch((e: Error) => setErro(e.message));
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSalvarDespesa = async (dados: DadosDespesa) => {
    await criarDespesa(dados);
    carregar();
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/despesas")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100 text-center bg-gray-50/50">
            <h2 className="text-base font-bold text-gray-800">
              Despesas do mês de {mesParam}
            </h2>
          </div>

          {erro && <p className="px-5 py-3 text-sm text-red-600">{erro}</p>}
          {!erro && despesas.length === 0 && (
            <p className="px-5 py-3 text-sm text-gray-500 text-center">Nenhuma despesa neste mês.</p>
          )}

          <div className="divide-y divide-gray-100">
            {despesas.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{item.categoria}</span>
                <span className="text-sm font-bold text-gray-900">
                  {centavosParaReais(item.valorCentavos)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-200 px-5 py-4 bg-[#2DB38B]/10 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Total Geral
            </span>
            <span className="text-base font-extrabold text-[#25967A]">
              {centavosParaReais(totalCentavos)}
            </span>
          </div>
        </div>

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

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import NovaDespesaModal, { DadosDespesa } from "@/components/NovaDespesaModal";
import { api } from "@/lib/api";

interface DespesaApi {
  id: number;
  categoria: string;
  valor: string;
  descricao?: string | null;
  data: string;
}

export default function DetalhesDespesasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const mesParam = searchParams.get("mes") ?? "Janeiro";
  const mesNum = params.id as string;

  const [despesas, setDespesas] = useState<DespesaApi[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarDespesas = () => {
    const ano = new Date().getFullYear();
    api<DespesaApi[]>(`/despesas?mes=${mesNum}&ano=${ano}`)
      .then((data) => setDespesas(data))
      .catch((e) => console.error("Erro ao carregar despesas:", e));
  };

  useEffect(() => {
    carregarDespesas();
  }, [mesNum]);

  const totalGeral = despesas.reduce((acc, d) => acc + (parseFloat(d.valor) || 0), 0);

  const handleSalvarDespesa = async (dados: DadosDespesa) => {
    try {
      await api("/despesas", {
        method: "POST",
        body: JSON.stringify({
          categoria: dados.tipo,
          valor: dados.valor,
          descricao: dados.descricao,
          data: dados.data,
        }),
      });
      carregarDespesas();
    } catch (e) {
      console.error("Erro ao salvar despesa:", e);
    }
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

          <div className="divide-y divide-gray-100">
            {despesas.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Nenhuma despesa registrada neste mês.
              </p>
            ) : (
              despesas.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{item.categoria}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {parseFloat(item.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="border-t-2 border-gray-200 px-5 py-4 bg-[#2DB38B]/10 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Total Geral
            </span>
            <span className="text-base font-extrabold text-[#25967A]">
              {totalGeral.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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

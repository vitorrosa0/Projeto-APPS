"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MdEdit, MdRemoveCircle, MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import ConfirmModal from "@/components/ConfirmModal";
import { api } from "@/lib/api";

export type StatusType = "Ativo" | "Inativo" | "Pausado";

export interface Contribuicao {
  valor: string;
  data: string;
  tipo?: string;
}

export interface Colaborador {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  status: StatusType;
  dataAdesao: string;
  informacoesAdicionais?: string;
  contribuicoes?: Contribuicao[];
}

const statusIndicator: Record<StatusType, { color: string; label: string }> = {
  Ativo: { color: "#4CAF50", label: "Ativo" },
  Inativo: { color: "#F44336", label: "Inativo" },
  Pausado: { color: "#FF9800", label: "Pausado" },
};

const COLABORADORES_MOCK: Colaborador[] = [
  {
    id: 1,
    nome: "Lucas Silva",
    email: "lucas.silva@sjpa.com",
    telefone: "(11) 98765-4321",
    status: "Ativo",
    dataAdesao: "10/04/2023",
    contribuicoes: [{ valor: "R$ 500,00", data: "10/05/2024", tipo: "Financeiro" }],
  },
  {
    id: 2,
    nome: "Maria Clara",
    email: "maria.clara@sjpa.com",
    telefone: "(11) 97654-3210",
    status: "Inativo",
    dataAdesao: "15/07/2023",
    contribuicoes: [{ valor: "10 Kg de Ração", data: "12/03/2024", tipo: "Produto" }],
  },
  {
    id: 3,
    nome: "Julio César",
    email: "julio.cesar@sjpa.com",
    telefone: "(11) 96543-2109",
    status: "Pausado",
    dataAdesao: "20/01/2024",
    contribuicoes: [{ valor: "R$ 150,00", data: "15/02/2024", tipo: "Financeiro" }],
  },
];

export default function ColaboradoresPage() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(COLABORADORES_MOCK);
  const [colaboradorParaExcluir, setColaboradorParaExcluir] = useState<Colaborador | null>(null);

  useEffect(() => {
    api<Colaborador[]>("/colaboradores")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setColaboradores(data);
        } else {
          // Se não houver colaboradores do backend, verifica localStorage ou mantém mock
          const local = localStorage.getItem("sjpa_colaboradores");
          if (local) {
            setColaboradores(JSON.parse(local));
          } else {
            localStorage.setItem("sjpa_colaboradores", JSON.stringify(COLABORADORES_MOCK));
          }
        }
      })
      .catch((err) => {
        console.warn("Backend não alcançado, usando armazenamento local:", err);
        const local = localStorage.getItem("sjpa_colaboradores");
        if (local) {
          setColaboradores(JSON.parse(local));
        } else {
          localStorage.setItem("sjpa_colaboradores", JSON.stringify(COLABORADORES_MOCK));
        }
      });
  }, []);

  const handleConfirmarExclusao = async () => {
    if (!colaboradorParaExcluir) return;
    const id = colaboradorParaExcluir.id;
    try {
      await api(`/colaboradores/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Erro ao excluir na API:", err);
    }
    const atualizados = colaboradores.filter((c) => c.id !== id);
    setColaboradores(atualizados);
    try {
      localStorage.setItem("sjpa_colaboradores", JSON.stringify(atualizados));
    } catch (e) {
      console.warn("Erro ao salvar local:", e);
    }
    setColaboradorParaExcluir(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/home")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">
        <PageTitle>Colaboradores</PageTitle>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {colaboradores.length > 0 ? (
            colaboradores.map((col) => {
              const statusInfo = statusIndicator[col.status] || statusIndicator.Ativo;
              const ultimaContrib = col.contribuicoes?.[0]?.valor ?? "—";

              return (
                <div
                  key={col.id}
                  onClick={() => router.push(`/colaboradores/${col.id}`)}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 border border-[#2DB38B]/30 flex items-center justify-center flex-shrink-0 text-[#2DB38B] font-bold text-sm">
                      {col.nome
                        .split(" ")
                        .map((parte) => parte[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-900 leading-tight truncate">
                        {col.nome}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusInfo.color }}
                        />
                        <span>{statusInfo.label}</span>
                        <span className="text-gray-400">·</span>
                        <span className="truncate">Adesão: {col.dataAdesao}</span>
                      </div>
                      <span className="text-xs text-gray-400 truncate">
                        Última contribuição:{" "}
                        <span className="font-semibold text-[#2DB38B]">
                          {ultimaContrib}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => router.push(`/colaboradores/${col.id}/editar`)}
                      aria-label={`Editar ${col.nome}`}
                      className="text-[#2DB38B] hover:text-[#25967A] active:scale-90 transition-all cursor-pointer bg-transparent border-none p-1"
                    >
                      <MdEdit size={22} />
                    </button>

                    <button
                      onClick={() => setColaboradorParaExcluir(col)}
                      aria-label={`Excluir ${col.nome}`}
                      className="text-[#2DB38B] hover:text-red-500 active:scale-90 transition-all cursor-pointer bg-transparent border-none p-1"
                    >
                      <MdRemoveCircle size={22} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-gray-400">
              Nenhum colaborador encontrado.
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/colaboradores/cadastrar")}
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
          <span className="flex-1 text-center">Cadastrar</span>
          <MdAdd size={22} />
        </button>
      </main>

      {/* Modal de confirmação de exclusão */}
      {colaboradorParaExcluir && (
        <ConfirmModal
          titulo="Excluir Colaborador"
          mensagem={`Tem certeza que deseja excluir o colaborador ${colaboradorParaExcluir.nome}?`}
          labelConfirmar="Excluir"
          labelCancelar="Cancelar"
          onConfirm={handleConfirmarExclusao}
          onCancel={() => setColaboradorParaExcluir(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  email?: string | null;
  telefone?: string | null;
  status: StatusType;
  dataAdesao: string;
  informacoesAdicionais?: string | null;
  contribuicoes?: Contribuicao[];
}

const statusIndicator: Record<StatusType, { color: string; label: string }> = {
  Ativo: { color: "#4CAF50", label: "Ativo" },
  Inativo: { color: "#F44336", label: "Inativo" },
  Pausado: { color: "#FF9800", label: "Pausado" },
};

export default function ColaboradoresPage() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [colaboradorParaExcluir, setColaboradorParaExcluir] = useState<Colaborador | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const data = await api<Colaborador[]>("/colaboradores");
      if (!Array.isArray(data)) {
        throw new Error("A resposta da API de colaboradores é inválida.");
      }
      setColaboradores(data);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os colaboradores."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const handleConfirmarExclusao = async () => {
    if (!colaboradorParaExcluir) return;
    const id = colaboradorParaExcluir.id;
    setErro("");
    try {
      await api(`/colaboradores/${id}`, { method: "DELETE" });
      setColaboradores((atualizados) => atualizados.filter((c) => c.id !== id));
      setColaboradorParaExcluir(null);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o colaborador."
      );
      setColaboradorParaExcluir(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/home")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">
        <PageTitle>Colaboradores</PageTitle>

        {erro && (
          <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{erro}</p>
            {colaboradores.length === 0 && (
              <button
                type="button"
                onClick={() => void carregar()}
                className="mt-2 font-semibold underline"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {carregando ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Carregando colaboradores...
            </div>
          ) : colaboradores.length > 0 ? (
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
          ) : !erro ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Nenhum colaborador encontrado.
            </div>
          ) : null}
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

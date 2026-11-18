"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdSearch, MdEdit, MdRemoveCircle, MdAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import ConfirmModal from "@/components/ConfirmModal";

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataAdmissao: string;
  cargo: string;
  cargaHoraria: string;
  turno?: string;
}

const FUNCIONARIOS_INICIAIS: Funcionario[] = [
  {
    id: 1,
    nome: "Lucas Souza",
    email: "lucas.souza@sjpa.com",
    telefone: "(11) 98765-4321",
    dataAdmissao: "12/03/2022",
    cargo: "Veterinário",
    cargaHoraria: "Carga: 40h/sem",
    turno: "Integral",
  },
  {
    id: 2,
    nome: "Ana Clara Santos",
    email: "ana.clara@sjpa.com",
    telefone: "(11) 97654-3210",
    dataAdmissao: "05/08/2022",
    cargo: "Auxiliar Geral",
    cargaHoraria: "Carga: 30h/sem",
    turno: "Matutino",
  },
  {
    id: 3,
    nome: "Julio César Andrade",
    email: "julio.cesar@sjpa.com",
    telefone: "(11) 96543-2109",
    dataAdmissao: "20/01/2021",
    cargo: "Administrador",
    cargaHoraria: "Carga: 44h/sem",
    turno: "Integral",
  },
  {
    id: 4,
    nome: "Mariana Oliveira",
    email: "mariana.oliveira@sjpa.com",
    telefone: "(11) 95432-1098",
    dataAdmissao: "14/11/2023",
    cargo: "Tosadora / Banhista",
    cargaHoraria: "Carga: 30h/sem",
    turno: "Vespertino",
  },
];

export default function FuncionariosPage() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(FUNCIONARIOS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [paraExcluir, setParaExcluir] = useState<Funcionario | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sjpa_funcionarios");
      if (stored) {
        setFuncionarios(JSON.parse(stored));
      } else {
        localStorage.setItem("sjpa_funcionarios", JSON.stringify(FUNCIONARIOS_INICIAIS));
      }
    } catch {
      // fallback to initial state
    }
  }, []);

  const funcionariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return funcionarios;
    return funcionarios.filter(
      (f) =>
        f.nome.toLowerCase().includes(termo) ||
        f.cargo.toLowerCase().includes(termo) ||
        f.email.toLowerCase().includes(termo)
    );
  }, [funcionarios, busca]);

  const handleExcluir = () => {
    if (!paraExcluir) return;
    const novos = funcionarios.filter((f) => f.id !== paraExcluir.id);
    setFuncionarios(novos);
    try {
      localStorage.setItem("sjpa_funcionarios", JSON.stringify(novos));
    } catch (e) {
      console.warn("Erro ao atualizar localStorage:", e);
    }
    setParaExcluir(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/home")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">
        <PageTitle>Funcionários</PageTitle>

        {/* Campo de busca */}
        <div className="relative">
          <input
            type="text"
            placeholder="Digite um nome para buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="
              w-full pl-4 pr-10 py-3
              bg-white border border-gray-200 rounded-full
              text-sm text-gray-700 placeholder-gray-400
              shadow-sm outline-none
              focus:ring-2 focus:ring-[#2DB38B]/40
            "
          />
          <MdSearch
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Lista de Funcionários */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {funcionariosFiltrados.length > 0 ? (
            funcionariosFiltrados.map((func) => (
              <div
                key={func.id}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar circular */}
                  <div className="w-11 h-11 rounded-full bg-emerald-50 border border-[#2DB38B]/30 flex items-center justify-center flex-shrink-0 text-[#2DB38B] font-bold text-sm">
                    {func.nome
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  {/* Informações */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {func.nome}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      {func.cargo}
                    </span>
                    <span className="text-xs text-gray-400">
                      {func.cargaHoraria}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/funcionarios/${func.id}/editar`)}
                    aria-label={`Editar ${func.nome}`}
                    className="text-[#2DB38B] hover:text-[#25967A] active:scale-90 transition-all cursor-pointer bg-transparent border-none p-1"
                  >
                    <MdEdit size={22} />
                  </button>

                  <button
                    onClick={() => setParaExcluir(func)}
                    aria-label={`Excluir ${func.nome}`}
                    className="text-[#2DB38B] hover:text-red-500 active:scale-90 transition-all cursor-pointer bg-transparent border-none p-1"
                  >
                    <MdRemoveCircle size={22} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Nenhum funcionário encontrado.
            </p>
          )}
        </div>

        {/* Botão Cadastrar */}
        <button
          onClick={() => router.push("/funcionarios/cadastrar")}
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
      {paraExcluir && (
        <ConfirmModal
          titulo="Excluir Funcionário"
          mensagem={`Tem certeza que deseja excluir o funcionário ${paraExcluir.nome}?`}
          labelConfirmar="Excluir"
          labelCancelar="Cancelar"
          onConfirm={handleExcluir}
          onCancel={() => setParaExcluir(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}

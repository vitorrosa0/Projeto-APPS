"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdAccountCircle,
  MdBadge,
  MdExitToApp,
  MdPeople,
  MdPets,
  MdVolunteerActivism,
  MdChevronRight,
} from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import ConfirmModal from "@/components/ConfirmModal";

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({
    nome: "Administrador SJPA",
    email: "admin@sjpa.com",
    cargo: "Administrador",
  });
  const [modalSair, setModalSair] = useState(false);

  useEffect(() => {
    try {
      const email = localStorage.getItem("user_email") || "admin@sjpa.com";
      const nome = localStorage.getItem("user_nome") || "Administrador SJPA";
      setUsuario((prev) => ({ ...prev, email, nome }));
    } catch {
      // fallback
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_nome");
    } catch {
      // ignore
    }
    router.push("/login");
  };

  const menuOpcoes = [
    {
      label: "Funcionários da Equipe",
      desc: "Cadastrar e gerenciar funcionários",
      icon: <MdBadge size={22} className="text-[#2DB38B]" />,
      href: "/funcionarios",
    },
    {
      label: "Colaboradores e Doadores",
      desc: "Histórico de contribuições e parceiros",
      icon: <MdPeople size={22} className="text-[#2DB38B]" />,
      href: "/colaboradores",
    },
    {
      label: "Voluntários e Escalas",
      desc: "Agenda de voluntários e presenças",
      icon: <MdVolunteerActivism size={22} className="text-[#2DB38B]" />,
      href: "/voluntarios",
    },
    {
      label: "Gestão dos Animais",
      desc: "Cães, gatos e cadastros",
      icon: <MdPets size={22} className="text-[#2DB38B]" />,
      href: "/animais",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/home")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Perfil</PageTitle>

        {/* Card do Usuário */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#2DB38B] flex items-center justify-center text-[#2DB38B] shadow-inner">
            <MdAccountCircle size={54} />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {usuario.nome}
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {usuario.email}
            </span>
            <span className="text-xs inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold self-center">
              ● {usuario.cargo}
            </span>
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          <div className="px-4 py-3 bg-gray-50/60 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Gestão do Sistema
            </span>
          </div>

          {menuOpcoes.map((opcao) => (
            <button
              key={opcao.label}
              onClick={() => router.push(opcao.href)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/70 transition-colors text-left cursor-pointer border-none bg-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  {opcao.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {opcao.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {opcao.desc}
                  </span>
                </div>
              </div>
              <MdChevronRight size={22} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Botão Sair da Conta */}
        <button
          onClick={() => setModalSair(true)}
          className="
            w-full flex items-center justify-center gap-2
            bg-red-50 hover:bg-red-100 text-red-600
            border border-red-200
            rounded-full py-3.5
            text-sm font-semibold
            transition-all duration-150 cursor-pointer shadow-sm
          "
        >
          <MdExitToApp size={20} />
          <span>Sair da Conta</span>
        </button>
      </main>

      {modalSair && (
        <ConfirmModal
          titulo="Sair da Conta"
          mensagem="Tem certeza que deseja encerrar a sua sessão?"
          labelConfirmar="Sair"
          labelCancelar="Cancelar"
          onConfirm={handleLogout}
          onCancel={() => setModalSair(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}

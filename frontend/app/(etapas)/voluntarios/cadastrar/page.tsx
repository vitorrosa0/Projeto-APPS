"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import InputGroup from "@/components/InputGroup";

interface FormVoluntario {
  nome: string;
  email: string;
  telefone: string;
  informacoesAdicionais: string;
}

const FORM_INICIAL: FormVoluntario = {
  nome: "",
  email: "",
  telefone: "",
  informacoesAdicionais: "",
};

export default function CadastroVoluntarioPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormVoluntario>(FORM_INICIAL);

  const handleChange = (field: keyof FormVoluntario) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const podeSalvar = form.nome.trim() !== "" && form.email.trim() !== "";

  const handleSalvar = () => {
    if (!podeSalvar) return;
    // TODO: integrar com API para salvar o voluntário
    console.log("Voluntário cadastrado:", form);
    router.back();
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack={true} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-5">

        <PageTitle>Cadastro de Voluntário</PageTitle>

        <InputGroup
          label="Nome"
          name="nome"
          type="text"
          placeholder="Ex: Wilton Pereira"
          value={form.nome}
          onChange={handleChange("nome")}
        />

        <InputGroup
          label="Email"
          name="email"
          type="email"
          placeholder="Ex: wilton.pereira@gmail.com"
          value={form.email}
          onChange={handleChange("email")}
        />

        <InputGroup
          label="Telefone"
          name="telefone"
          type="tel"
          placeholder="Ex: (32) 98888-7777"
          value={form.telefone}
          onChange={handleChange("telefone")}
        />

        {/* Textarea de informações adicionais */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Informações adicionais
          </label>
          <textarea
            name="informacoesAdicionais"
            placeholder="Ex: horário para contato, preferência de tarefas, etc."
            value={form.informacoesAdicionais}
            onChange={handleChange("informacoesAdicionais")}
            rows={5}
            className="
              w-full px-4 py-3
              bg-[#2DB38B] text-white placeholder-white/70
              border-2 border-black rounded-2xl
              text-sm resize-none outline-none
              focus:ring-2 focus:ring-black/20
            "
          />
        </div>

        {/* Botão Salvar alinhado à direita */}
        <div className="flex justify-end">
          <button
            onClick={handleSalvar}
            disabled={!podeSalvar}
            className="
              bg-[#2DB38B] text-white font-semibold text-sm
              px-8 py-2.5 rounded-full shadow-md
              hover:bg-[#25967A] hover:scale-[1.03]
              active:scale-95 transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            "
          >
            Salvar
          </button>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdCheckCircle, MdPerson } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";
import { api } from "@/lib/api";

type StatusType = "Ativo" | "Inativo" | "Pausado";

export default function CadastrarColaboradorPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataAdesao, setDataAdesao] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<StatusType>("Ativo");
  const [ultimaContribuicao, setUltimaContribuicao] = useState("");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Informe o nome do colaborador.");
      return;
    }

    setSalvando(true);
    try {
      await api("/colaboradores", {
        method: "POST",
        body: JSON.stringify({
          nome,
          email,
          telefone,
          dataAdesao,
          status,
          informacoesAdicionais,
        }),
      });
    } catch (err) {
      console.warn("Erro ao salvar pela API, gravando no armazenamento local:", err);
      try {
        const stored = JSON.parse(localStorage.getItem("sjpa_colaboradores") || "[]");
        stored.push({
          id: Date.now(),
          nome,
          email,
          telefone,
          dataAdesao,
          status,
          informacoesAdicionais,
          contribuicoes: ultimaContribuicao
            ? [{ valor: ultimaContribuicao, data: dataAdesao, tipo: "Financeiro" }]
            : [],
        });
        localStorage.setItem("sjpa_colaboradores", JSON.stringify(stored));
      } catch (localErr) {
        console.warn("Erro no localStorage:", localErr);
      }
    } finally {
      setSalvando(false);
      setSalvo(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/colaboradores")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Cadastro de Colaborador</PageTitle>

        {salvo ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-[#2DB38B] flex items-center justify-center text-[#2DB38B]">
              <MdCheckCircle size={52} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
                Colaborador Cadastrado com Sucesso
              </h2>
              <p className="text-sm text-gray-500">
                O colaborador <strong className="text-gray-800">{nome}</strong> foi cadastrado no sistema.
              </p>
            </div>

            <button
              onClick={() => router.push("/colaboradores")}
              className="mt-3 w-full bg-[#2DB38B] text-white rounded-full py-3.5 text-base font-semibold shadow-md hover:bg-[#25967A] transition-all cursor-pointer"
            >
              Continuar
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSalvar}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
          >
            {/* Avatar circular estilo Figma */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#2DB38B] flex items-center justify-center text-[#2DB38B] shadow-inner">
                <MdPerson size={44} />
              </div>
              <span className="text-xs text-gray-400 mt-2">
                Foto do colaborador
              </span>
            </div>

            <InputGroup
              label="Nome Completo"
              name="nome"
              placeholder="Digite o nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <InputGroup
              label="E-mail"
              name="email"
              type="email"
              placeholder="exemplo@sjpa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputGroup
              label="Telefone"
              name="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <InputGroup
              label="Data de Adesão"
              name="dataAdesao"
              type="date"
              value={dataAdesao}
              onChange={(e) => setDataAdesao(e.target.value)}
            />

            <SelectGroup
              label="Status"
              name="status"
              options={["Ativo", "Inativo", "Pausado"]}
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
            />

            <InputGroup
              label="Última contribuição (opcional)"
              name="ultimaContribuicao"
              placeholder="Ex: R$ 500,00 ou 10 Kg de Ração"
              value={ultimaContribuicao}
              onChange={(e) => setUltimaContribuicao(e.target.value)}
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="informacoesAdicionais" className="text-sm font-semibold ml-2 text-gray-800">
                Informações adicionais
              </label>
              <textarea
                id="informacoesAdicionais"
                name="informacoesAdicionais"
                rows={3}
                placeholder="Observações sobre o colaborador..."
                value={informacoesAdicionais}
                onChange={(e) => setInformacoesAdicionais(e.target.value)}
                className="w-full bg-[#58C2A1] border-2 border-black rounded-2xl p-3 text-black outline-none placeholder:text-black/50 focus:border-[#25967A] transition-colors resize-none text-sm"
              />
            </div>

            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                onClick={() => router.push("/colaboradores")}
                className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-8 py-2.5 rounded-full bg-[#2DB38B] text-white text-sm font-semibold hover:bg-[#25967A] active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

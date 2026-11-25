"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdCheckCircle } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";
import { CATEGORIAS_DESPESA } from "@/components/NovaDespesaModal";
import { criarDespesa } from "@/lib/despesas";

export default function CadastrarDespesaPage() {
  const router = useRouter();

  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [descricao, setDescricao] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) return setErro("Selecione o tipo de despesa.");
    if (!valor) return setErro("Informe o valor da despesa.");
    try {
      await criarDespesa({ tipo, valor, data, descricao });
      setErro("");
      setSalvo(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar a despesa.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/despesas")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Cadastro de Despesas</PageTitle>

        {salvo ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-[#2DB38B]">
              <MdCheckCircle size={44} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-wide uppercase">
              Despesa cadastrada com sucesso!
            </h2>
            <p className="text-sm text-gray-500">
              A despesa de <strong className="text-gray-800">{valor}</strong> para <strong className="text-gray-800">{tipo}</strong> foi registrada no sistema.
            </p>
            <button
              onClick={() => router.push("/despesas")}
              className="mt-4 w-full bg-[#2DB38B] text-white rounded-full py-3 text-base font-semibold shadow-md hover:bg-[#25967A] transition-all cursor-pointer"
            >
              Continuar
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSalvar}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
          >
            <SelectGroup
              label="Tipo de despesa"
              name="tipo"
              options={CATEGORIAS_DESPESA}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />

            <InputGroup
              label="Valor da despesa"
              name="valor"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <InputGroup
              label="Data da despesa"
              name="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="descricao" className="text-sm font-semibold ml-2 text-gray-800">
                Observações
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={3}
                placeholder="Detalhes sobre a despesa..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full bg-[#58C2A1] border-2 border-black rounded-2xl p-3 text-black outline-none placeholder:text-black/50 focus:border-[#25967A] transition-colors resize-none text-sm"
              />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => router.push("/despesas")}
                className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-full bg-[#2DB38B] text-white text-sm font-semibold hover:bg-[#25967A] active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

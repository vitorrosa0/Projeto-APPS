"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import SelectGroup from "@/components/SelectGroup";
import InputGroup from "@/components/InputGroup";
import type { DadosDespesa } from "@/lib/despesas";

export type { DadosDespesa };

interface NovaDespesaModalProps {
  onClose: () => void;
  onSalvar: (dados: DadosDespesa) => Promise<void>;
}

export const CATEGORIAS_DESPESA = [
  "Ração para cães",
  "Ração para gatos",
  "Vacinas para cães",
  "Vacinas para gatos",
  "Remédios em geral",
  "Despesas com energia",
  "Despesas com saneamento (água)",
  "Gastos com reformas no canil",
  "Material de limpeza e higiene",
  "Outros",
];

export default function NovaDespesaModal({ onClose, onSalvar }: NovaDespesaModalProps) {
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!tipo) return setErro("Selecione o tipo de despesa.");
    if (!valor) return setErro("Informe o valor da despesa.");
    setSalvando(true);
    setErro("");
    try {
      await onSalvar({ tipo, valor, data, descricao });
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a despesa.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="font-bold text-base text-gray-800">Nova Despesa</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
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
              Observações (opcional)
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={2}
              placeholder="Descreva detalhes da despesa..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-[#58C2A1] border-2 border-black rounded-2xl p-3 text-black outline-none placeholder:text-black/50 focus:border-[#25967A] transition-colors resize-none text-sm"
            />
          </div>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSalvar}
            disabled={salvando}
            className="px-6 py-2 rounded-full bg-[#2DB38B] text-white text-sm font-semibold hover:bg-[#25967A] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

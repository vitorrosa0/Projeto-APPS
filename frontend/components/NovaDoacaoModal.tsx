"use client";

import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import SelectGroup from "@/components/SelectGroup";
import DoacaoFinanceiraForm from "@/components/DoacaoFinanceiraForm";
import DoacaoItensForm from "@/components/DoacaoItensForm";

type TipoDoacao = "Alimentos" | "Financeira" | "Produtos" | "";

interface NovaDoacaoModalProps {
  onClose: () => void;
  onSalvar: (dados: DadosDoacao) => void;
}

export interface DadosDoacao {
  tipo: TipoDoacao;
  itens?: string;
  valor?: string;
}

const TIPOS_DOACAO = ["Alimentos", "Financeira", "Produtos"];

function isItens(tipo: TipoDoacao): boolean {
  return tipo === "Alimentos" || tipo === "Produtos";
}

export default function NovaDoacaoModal({ onClose, onSalvar }: NovaDoacaoModalProps) {
  const [tipo, setTipo] = useState<TipoDoacao>("");
  const [itens, setItens] = useState("");
  const [valor, setValor] = useState("");

  const handleSalvar = () => {
    if (!tipo) return;
    onSalvar({
      tipo,
      ...(isItens(tipo) ? { itens } : { valor }),
    });
    onClose();
  };

  const podeSalvar = tipo !== "" && (isItens(tipo) ? itens.trim() !== "" : valor.trim() !== "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdAdd size={20} className="text-[#2DB38B]" />
            <h2 className="font-bold text-base text-gray-800">Nova Doação</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Formulário */}
        <div className="flex flex-col gap-4">

          {/* Select de tipo */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-700">Tipo de doação:</span>
            <SelectGroup
              label=""
              name="tipo"
              options={TIPOS_DOACAO}
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value as TipoDoacao);
                setItens("");
                setValor("");
              }}
            />
          </div>

          {/* Formulário dinâmico conforme tipo */}
          {tipo !== "" && (
            isItens(tipo)
              ? <DoacaoItensForm itens={itens} onChange={setItens} />
              : <DoacaoFinanceiraForm valor={valor} onChange={setValor} />
          )}

        </div>

        {/* Botão salvar */}
        {tipo !== "" && (
          <button
            onClick={handleSalvar}
            disabled={!podeSalvar}
            className="
              w-full py-3 rounded-full
              bg-[#2DB38B] text-white font-semibold text-sm
              hover:bg-[#25967A] active:scale-95
              transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            "
          >
            Salvar
          </button>
        )}

      </div>
    </div>
  );
}
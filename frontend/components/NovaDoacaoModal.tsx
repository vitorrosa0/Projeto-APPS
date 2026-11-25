"use client";

import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import SelectGroup from "@/components/SelectGroup";
import InputGroup from "@/components/InputGroup";
import DoacaoFinanceiraForm from "@/components/DoacaoFinanceiraForm";
import DoacaoItensForm, { LinhaItem } from "@/components/DoacaoItensForm";

type TipoDoacao = "Dinheiro" | "Item" | "";

export interface DadosDoacao {
  tipo: "Dinheiro" | "Item";
  data: string;
  valor?: string;
  itens?: { nome: string; quantidade: number }[];
}

interface NovaDoacaoModalProps {
  onClose: () => void;
  onSalvar: (dados: DadosDoacao) => Promise<void>;
}

const TIPOS_DOACAO = ["Dinheiro", "Item"];
const LINHA_VAZIA: LinhaItem = { nome: "", quantidade: "" };

export default function NovaDoacaoModal({ onClose, onSalvar }: NovaDoacaoModalProps) {
  const [tipo, setTipo] = useState<TipoDoacao>("");
  const [itens, setItens] = useState<LinhaItem[]>([{ ...LINHA_VAZIA }]);
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const itensValidos = itens.every((i) => i.nome.trim() !== "" && Number(i.quantidade) > 0);
  const podeSalvar = tipo === "Dinheiro" ? valor.trim() !== "" : tipo === "Item" && itensValidos;

  const handleSalvar = async () => {
    if (!tipo) return;
    setSalvando(true);
    setErro("");
    try {
      await onSalvar(
        tipo === "Dinheiro"
          ? { tipo, data, valor }
          : { tipo, data, itens: itens.map((i) => ({ nome: i.nome.trim(), quantidade: Number(i.quantidade) })) }
      );
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a doação.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-700">Tipo de doação:</span>
            <SelectGroup
              label=""
              name="tipo"
              options={TIPOS_DOACAO}
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value as TipoDoacao);
                setItens([{ ...LINHA_VAZIA }]);
                setValor("");
                setErro("");
              }}
            />
          </div>

          {tipo !== "" && (
            <InputGroup
              label="Data da doação"
              name="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          )}

          {tipo === "Dinheiro" && <DoacaoFinanceiraForm valor={valor} onChange={setValor} />}
          {tipo === "Item" && <DoacaoItensForm itens={itens} onChange={setItens} />}
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        {tipo !== "" && (
          <button
            onClick={handleSalvar}
            disabled={!podeSalvar || salvando}
            className="
              w-full py-3 rounded-full
              bg-[#2DB38B] text-white font-semibold text-sm
              hover:bg-[#25967A] active:scale-95
              transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            "
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { centavosParaReais } from "@/lib/dinheiro";

interface Item {
  nome: string;
  quantidade: number;
}

interface DoacaoRowProps {
  tipo: "Dinheiro" | "Item";
  valorCentavos?: number | null;
  itens?: Item[];
}

function LinhaItem({ nome, quantidade }: Item) {
  return (
    <div className="flex justify-between px-6 py-1 text-sm text-gray-600">
      <span>{nome}</span>
      <span>x{quantidade}</span>
    </div>
  );
}

export default function DoacaoRow({ tipo, valorCentavos, itens = [] }: DoacaoRowProps) {
  const [expandido, setExpandido] = useState(false);

  const temDetalhes = tipo === "Item" && itens.length > 0;
  const quantidadeTotal = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">{tipo === "Dinheiro" ? "Financeira" : "Itens"}</span>

          {temDetalhes && (
            <button
              onClick={() => setExpandido((prev) => !prev)}
              aria-label={expandido ? "Recolher itens" : "Expandir itens"}
              className="text-[#2DB38B] cursor-pointer bg-transparent border-none p-0 leading-none"
            >
              {expandido ? <MdArrowDropUp size={20} /> : <MdArrowDropDown size={20} />}
            </button>
          )}
        </div>

        <span className="text-sm font-medium text-gray-800">
          {tipo === "Dinheiro" ? centavosParaReais(valorCentavos ?? 0) : quantidadeTotal}
        </span>
      </div>

      {temDetalhes && expandido && (
        <div className="pb-2">
          {itens.map((item) => (
            <LinhaItem key={item.nome} nome={item.nome} quantidade={item.quantidade} />
          ))}
        </div>
      )}
    </div>
  );
}

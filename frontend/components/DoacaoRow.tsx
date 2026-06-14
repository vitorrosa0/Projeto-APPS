"use client";

import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

interface Item {
  nome: string;
  quantidade: number;
}

interface DoacaoRowProps {
  tipo: "Financeira" | "Produtos" | "Alimentos";
  valor?: string;
  quantidade?: number;
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

export default function DoacaoRow({ tipo, valor, quantidade, itens = [] }: DoacaoRowProps) {
  const [expandido, setExpandido] = useState(false);

  const temDetalhes = (tipo === "Produtos" || tipo === "Alimentos") && itens.length > 0;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">{tipo}</span>

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
          {tipo === "Financeira" ? valor : quantidade}
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
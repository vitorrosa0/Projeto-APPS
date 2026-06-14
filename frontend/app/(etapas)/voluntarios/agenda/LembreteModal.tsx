"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";

interface LembreteModalProps {
  dataFormatada: string;
  textoInicial?: string;
  onSalvar: (texto: string) => void;
  onClose: () => void;
}

export default function LembreteModal({
  dataFormatada,
  textoInicial = "",
  onSalvar,
  onClose,
}: LembreteModalProps) {
  const [texto, setTexto] = useState(textoInicial);

  const handleSalvar = () => {
    if (!texto.trim()) return;
    onSalvar(texto.trim());
    onClose();
  };

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
          <div>
            <h2 className="font-bold text-base text-gray-800">Lembrete</h2>
            <p className="text-xs text-gray-400">{dataFormatada}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <MdClose size={20} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          placeholder="Ex: Marcar com voluntário para manutenção dia 25."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          className="
            w-full px-4 py-3
            bg-[#2DB38B] text-white placeholder-white/70
            border-2 border-black rounded-2xl
            text-sm resize-none outline-none
            focus:ring-2 focus:ring-black/20
          "
        />

        {/* Botões */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={!texto.trim()}
            className="
              px-6 py-2 rounded-full
              bg-[#2DB38B] text-white font-semibold text-sm
              hover:bg-[#25967A] active:scale-95
              transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
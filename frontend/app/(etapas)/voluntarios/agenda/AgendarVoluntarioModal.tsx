"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import InputGroup from "@/components/InputGroup";
import { Agendamento, MotivoAgendamento, MOTIVOS } from "./types";

interface AgendarVoluntarioModalProps {
  data: string;
  dataFormatada: string;
  onSalvar: (agendamento: Omit<Agendamento, "id">) => void;
  onClose: () => void;
}

export default function AgendarVoluntarioModal({
  data,
  dataFormatada,
  onSalvar,
  onClose,
}: AgendarVoluntarioModalProps) {
  const [voluntario, setVoluntario] = useState("");
  const [motivo, setMotivo] = useState<MotivoAgendamento>("Cuidados diários");
  const [horario, setHorario] = useState("");

  const podeSalvar = voluntario.trim() !== "" && horario.trim() !== "";

  const handleSalvar = () => {
    if (!podeSalvar) return;
    onSalvar({ data, voluntario, motivo, horario });
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
            <h2 className="font-bold text-base text-gray-800">Agendar Voluntário</h2>
            <p className="text-xs text-gray-400">{dataFormatada}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <MdClose size={20} />
          </button>
        </div>

        {/* Voluntário */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-700">Voluntário:</span>
          <InputGroup
            label=""
            name="voluntario"
            type="text"
            placeholder="Ex: Wilton Pereira"
            value={voluntario}
            onChange={(e) => setVoluntario(e.target.value)}
          />
        </div>

        {/* Motivo — radio buttons */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">Motivo:</span>
          <div className="flex flex-col gap-1.5 pl-1">
            {MOTIVOS.map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="motivo"
                  value={m}
                  checked={motivo === m}
                  onChange={() => setMotivo(m)}
                  className="accent-[#2DB38B] w-4 h-4 cursor-pointer"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        {/* Horário */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-700">Horário:</span>
          <InputGroup
            label=""
            name="horario"
            type="time"
            placeholder="Ex: 09:00"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        </div>

        {/* Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSalvar}
            disabled={!podeSalvar}
            className="
              bg-[#2DB38B] text-white font-semibold text-sm
              px-8 py-2.5 rounded-full shadow-md
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
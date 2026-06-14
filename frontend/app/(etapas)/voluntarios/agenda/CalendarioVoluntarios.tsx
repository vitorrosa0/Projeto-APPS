"use client";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { toDateKey } from "./types";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface CalendarioVoluntariosProps {
  ano: number;
  mes: number; // 0-based
  diaSelecionado: string | null;
  datasComVoluntario: Set<string>;
  datasComLembrete: Set<string>;
  onDiaClick: (dateKey: string) => void;
  onMesAnterior: () => void;
  onProximoMes: () => void;
}

function getDiasDoMes(ano: number, mes: number): (Date | null)[] {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasVaziosInicio = primeiroDia.getDay();

  const dias: (Date | null)[] = Array(diasVaziosInicio).fill(null);
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push(new Date(ano, mes, d));
  }
  return dias;
}

export default function CalendarioVoluntarios({
  ano,
  mes,
  diaSelecionado,
  datasComVoluntario,
  datasComLembrete,
  onDiaClick,
  onMesAnterior,
  onProximoMes,
}: CalendarioVoluntariosProps) {
  const dias = getDiasDoMes(ano, mes);
  const hoje = toDateKey(new Date());

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      {/* Ano */}
      <p className="text-xs font-semibold text-gray-500 mb-2">{ano}</p>

      {/* Navegação de mês */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onMesAnterior}
          className="text-gray-500 hover:text-[#2DB38B] cursor-pointer transition-colors"
        >
          <MdChevronLeft size={22} />
        </button>
        <span className="text-sm font-bold text-gray-800">{MESES[mes]}</span>
        <button
          onClick={onProximoMes}
          className="text-gray-500 hover:text-[#2DB38B] cursor-pointer transition-colors"
        >
          <MdChevronRight size={22} />
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="text-center text-xs font-semibold text-gray-500 py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7">
        {dias.map((dia, i) => {
          if (!dia) return <div key={`empty-${i}`} />;

          const key = toDateKey(dia);
          const temVoluntario = datasComVoluntario.has(key);
          const temLembrete = datasComLembrete.has(key);
          const selecionado = diaSelecionado === key;
          const isHoje = key === hoje;

          return (
            <button
              key={key}
              onClick={() => onDiaClick(key)}
              className={`
                relative flex flex-col items-center justify-center
                aspect-square text-xs font-medium rounded-full
                transition-all cursor-pointer
                ${selecionado ? "bg-[#2DB38B] text-white" : "hover:bg-gray-100 text-gray-700"}
                ${isHoje && !selecionado ? "font-bold text-[#2DB38B]" : ""}
              `}
            >
              {dia.getDate()}

              {/* Marcadores visuais */}
              {(temVoluntario || temLembrete) && (
                <div className="absolute bottom-0.5 flex gap-0.5 justify-center">
                  {temVoluntario && (
                    <span className={`text-[8px] ${selecionado ? "text-white" : "text-[#2DB38B]"}`}>
                      🤚
                    </span>
                  )}
                  {temLembrete && (
                    <span className={`w-1 h-1 rounded-full ${selecionado ? "bg-white" : "bg-yellow-400"}`} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
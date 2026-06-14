import { Agendamento } from "./types";

interface AgendamentoDiaListProps {
  agendamentos: Agendamento[];
}

export default function AgendamentoDiaList({ agendamentos }: AgendamentoDiaListProps) {
  if (agendamentos.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {agendamentos.map((ag) => (
        <div
          key={ag.id}
          className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
        >
          <span className="font-semibold text-[#2DB38B] w-12 shrink-0">{ag.horario}</span>
          <span className="text-gray-400">–</span>
          <span className="font-medium">{ag.voluntario}</span>
          <span className="text-gray-400">–</span>
          <span className="text-gray-500">{ag.motivo}</span>
        </div>
      ))}
    </div>
  );
}
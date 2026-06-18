"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdPersonAdd, MdNoteAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import CalendarioVoluntarios from "./CalendarioVoluntarios";
import AgendamentoDiaList from "./AgendamentoDiaList";
import AgendarVoluntarioModal from "./AgendarVoluntarioModal";
import LembreteModal from "./LembreteModal";
import { Agendamento, Lembrete, toDateKey } from "./types";

// ---------------------------------------------------------------------------
// Mock inicial — substituir pela API
// ---------------------------------------------------------------------------
const AGENDAMENTOS_MOCK: Agendamento[] = [
  { id: 1, data: "2025-10-11", voluntario: "Wilton Pereira", motivo: "Cuidados diários", horario: "09:00" },
  { id: 2, data: "2025-10-11", voluntario: "Daniela Pires",  motivo: "Banho",            horario: "13:00" },
];

const LEMBRETES_MOCK: Lembrete[] = [];

// ---------------------------------------------------------------------------
// Helpers de formatação
// ---------------------------------------------------------------------------
const MESES_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function formatarData(dateKey: string): string {
  const [ano, mes, dia] = dateKey.split("-");
  return `${dia} de ${MESES_PT[parseInt(mes) - 1]} de ${ano}`;
}

type ModalAberto = "voluntario" | "lembrete" | null;

export default function AgendaVoluntariosPage() {
  const router = useRouter();
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(AGENDAMENTOS_MOCK);
  const [lembretes, setLembretes] = useState<Lembrete[]>(LEMBRETES_MOCK);

  // Sets para marcadores do calendário
  const datasComVoluntario = new Set(agendamentos.map((a) => a.data));
  const datasComLembrete = new Set(lembretes.map((l) => l.data));

  // Agendamentos e lembrete do dia selecionado
  const agendamentosDoDia = agendamentos.filter((a) => a.data === diaSelecionado);
  const lembreteDoDia = lembretes.find((l) => l.data === diaSelecionado);

  const handleMesAnterior = () => {
    if (mes === 0) { setMes(11); setAno((a) => a - 1); }
    else setMes((m) => m - 1);
  };

  const handleProximoMes = () => {
    if (mes === 11) { setMes(0); setAno((a) => a + 1); }
    else setMes((m) => m + 1);
  };

  const handleSalvarAgendamento = (dados: Omit<Agendamento, "id">) => {
    // TODO: integrar com API
    const novoId = agendamentos.length > 0 ? Math.max(...agendamentos.map((a) => a.id)) + 1 : 1;
    setAgendamentos((prev) => [...prev, { id: novoId, ...dados }]);
  };

  const handleSalvarLembrete = (texto: string) => {
    // TODO: integrar com API
    if (!diaSelecionado) return;
    setLembretes((prev) => [
      ...prev.filter((l) => l.data !== diaSelecionado),
      { data: diaSelecionado, texto },
    ]);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack onBack={() => router.push("/voluntarios")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">

        <PageTitle>Calendário de Voluntários</PageTitle>

        {/* Calendário */}
        <CalendarioVoluntarios
          ano={ano}
          mes={mes}
          diaSelecionado={diaSelecionado}
          datasComVoluntario={datasComVoluntario}
          datasComLembrete={datasComLembrete}
          onDiaClick={setDiaSelecionado}
          onMesAnterior={handleMesAnterior}
          onProximoMes={handleProximoMes}
        />

        {/* Painel do dia selecionado */}
        {diaSelecionado && (
          <div className="flex flex-col gap-3">

            {/* Agendamentos do dia */}
            <AgendamentoDiaList agendamentos={agendamentosDoDia} />

            {/* Ações do dia */}
            <div className="flex gap-3">
              <button
                onClick={() => setModalAberto("voluntario")}
                className="
                  flex-1 flex items-center justify-center gap-2
                  bg-[#2DB38B] text-white text-sm font-semibold
                  rounded-full py-2.5 shadow-md
                  hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer
                "
              >
                <MdPersonAdd size={18} />
                Agendar
              </button>

              <button
                onClick={() => setModalAberto("lembrete")}
                className="
                  flex-1 flex items-center justify-center gap-2
                  bg-white border-2 border-[#2DB38B] text-[#2DB38B] text-sm font-semibold
                  rounded-full py-2.5 shadow-sm
                  hover:bg-[#2DB38B]/10 active:scale-95 transition-all cursor-pointer
                "
              >
                <MdNoteAdd size={18} />
                {lembreteDoDia ? "Editar lembrete" : "Lembrete"}
              </button>
            </div>

            {/* Lembrete do dia */}
            {lembreteDoDia && (
              <div className="bg-[#2DB38B]/10 border border-[#2DB38B]/30 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-[#2DB38B] mb-1">Lembrete:</p>
                <p className="text-sm text-gray-700">{lembreteDoDia.texto}</p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Modal de agendar voluntário */}
      {modalAberto === "voluntario" && diaSelecionado && (
        <AgendarVoluntarioModal
          data={diaSelecionado}
          dataFormatada={formatarData(diaSelecionado)}
          onSalvar={handleSalvarAgendamento}
          onClose={() => setModalAberto(null)}
        />
      )}

      {/* Modal de lembrete */}
      {modalAberto === "lembrete" && diaSelecionado && (
        <LembreteModal
          dataFormatada={formatarData(diaSelecionado)}
          textoInicial={lembreteDoDia?.texto}
          onSalvar={handleSalvarLembrete}
          onClose={() => setModalAberto(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
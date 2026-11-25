"use client";

import { useState, useEffect } from "react";
import { MdTrendingUp, MdTrendingDown, MdAccountBalance, MdInventory } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import { api } from "@/lib/api";
import { centavosParaReais } from "@/lib/dinheiro";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface Doacao {
  id: number;
  valorCentavos: number | null;
  data: string;
  doadorNome: string | null;
  colaborador: { nome: string } | null;
  itens?: { id: number; nome: string; quantidade: number }[];
}

interface ResumoApi {
  periodo: { ano: number; mes: number | null };
  receitas: { totalCentavos: number; doacoesDinheiro: Doacao[] };
  itensDoados: Doacao[];
  despesas: { totalCentavos: number; registros: unknown[] };
  saldoCentavos: number;
}

const doador = (d: Doacao) => d.colaborador?.nome ?? d.doadorNome ?? "Anônimo";

const somar = (doacoes: Doacao[]) => doacoes.reduce((acc, d) => acc + (d.valorCentavos ?? 0), 0);

export default function FinanceiroPage() {
  const hoje = new Date();
  const [mes, setMes] = useState(String(hoje.getMonth() + 1));
  const [ano, setAno] = useState(String(hoje.getFullYear()));
  const [resumo, setResumo] = useState<ResumoApi | null>(null);

  useEffect(() => {
    api<ResumoApi>(`/financeiro/resumo?ano=${ano}&mes=${mes}`)
      .then(setResumo)
      .catch((e) => console.error("Erro ao carregar resumo:", e));
  }, [mes, ano]);

  const saldoPositivo = (resumo?.saldoCentavos ?? 0) >= 0;
  const dinheiro = resumo?.receitas.doacoesDinheiro ?? [];
  const deColaboradores = somar(dinheiro.filter((d) => d.colaborador));
  const avulsas = somar(dinheiro.filter((d) => !d.colaborador));

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">
        <PageTitle>Financeiro</PageTitle>

        {/* Filtro de período */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">Mês</label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full bg-[#58C2A1] border-2 border-black rounded-2xl px-3 py-2 text-sm text-black font-medium outline-none focus:border-[#25967A] transition-colors cursor-pointer"
            >
              {MESES.map((nome, i) => (
                <option key={nome} value={String(i + 1)}>{nome}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-24">
            <label className="text-xs font-semibold text-gray-500 ml-1">Ano</label>
            <select
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="w-full bg-[#58C2A1] border-2 border-black rounded-2xl px-3 py-2 text-sm text-black font-medium outline-none focus:border-[#25967A] transition-colors cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((a) => (
                <option key={a} value={String(a)}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards de totais */}
        <div className="flex flex-col gap-3">

          {/* Receitas */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-[#2DB38B]/30 flex items-center justify-center">
                <MdTrendingUp size={22} className="text-[#2DB38B]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Receitas</p>
                <p className="text-xs text-gray-400">
                  Doações: {centavosParaReais(avulsas)}
                  {" · "}
                  Colaboradores: {centavosParaReais(deColaboradores)}
                </p>
              </div>
            </div>
            <span className="text-base font-extrabold text-[#2DB38B]">
              {centavosParaReais(resumo?.receitas.totalCentavos ?? 0)}
            </span>
          </div>

          {/* Despesas */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <MdTrendingDown size={22} className="text-red-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Despesas</p>
                <p className="text-xs text-gray-400">
                  {resumo?.despesas.registros.length ?? 0} lançamento(s)
                </p>
              </div>
            </div>
            <span className="text-base font-extrabold text-red-400">
              {centavosParaReais(resumo?.despesas.totalCentavos ?? 0)}
            </span>
          </div>

          {/* Saldo */}
          <div
            className={`rounded-2xl border shadow-sm px-5 py-4 flex items-center justify-between ${
              saldoPositivo
                ? "bg-emerald-50 border-[#2DB38B]/30"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  saldoPositivo ? "bg-[#2DB38B]/10" : "bg-red-100"
                }`}
              >
                <MdAccountBalance size={22} className={saldoPositivo ? "text-[#2DB38B]" : "text-red-400"} />
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Saldo do Período</p>
            </div>
            <span className={`text-base font-extrabold ${saldoPositivo ? "text-[#2DB38B]" : "text-red-500"}`}>
              {centavosParaReais(resumo?.saldoCentavos ?? 0)}
            </span>
          </div>
        </div>

        {/* Itens doados */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <MdInventory size={16} className="text-[#2DB38B]" />
            <span className="text-sm font-bold text-gray-700">Itens Doados</span>
          </div>

          {!resumo || resumo.itensDoados.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Nenhum item doado neste período.
            </p>
          ) : (
            resumo.itensDoados.map((doacao) => (
              <div
                key={doacao.id}
                className="flex items-center justify-between px-5 py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-gray-700">
                  {(doacao.itens ?? []).map((i) => `${i.quantidade} ${i.nome}`).join(", ")}
                </span>
                <span className="text-xs text-gray-400">{doador(doacao)}</span>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

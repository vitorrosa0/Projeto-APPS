"use client";
import { useCallback, useEffect, useId, useState } from "react";
import { api } from "@/lib/api";
import { formatarData } from "@/lib/animais";
import {
  LIMITE_OBSERVACAO, MOTIVOS, ROTULO_TIPO, hoje, proximosTipos, statusAtual,
  type Movimentacao, type TipoMovimentacao,
} from "@/lib/movimentacoes";
import ConfirmModal from "./ConfirmModal";

interface AnimalHistoricoProps {
  animalId: number;
  /** Avisado sempre que o histórico muda, com o status recalculado. */
  onStatusChange?: (status: string) => void;
}

interface FormMovimentacao { tipo: TipoMovimentacao | ""; motivo: string; data: string; observacao: string; }

const campoClasse = "w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none focus:border-[#2DB38B] transition-colors";

export default function AnimalHistorico({ animalId, onStatusChange }: AnimalHistoricoProps) {
  const ids = useId();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[] | null>(null);
  const [erroCarregar, setErroCarregar] = useState("");
  const [editando, setEditando] = useState<Movimentacao | null>(null);
  const [form, setForm] = useState<FormMovimentacao>({ tipo: "", motivo: "", data: hoje(), observacao: "" });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const ultima = movimentacoes?.at(-1) ?? null;
  const tiposPermitidos = editando ? [editando.tipo] : proximosTipos(ultima);

  const recarregar = useCallback(async (signal?: AbortSignal) => {
    try {
      const lista = await api<Movimentacao[]>(`/animais/${animalId}/movimentacoes`, { signal });
      if (signal?.aborted) return;
      setMovimentacoes(lista);
      setErroCarregar("");
      onStatusChange?.(statusAtual(lista.at(-1)));
      const tipos = proximosTipos(lista.at(-1));
      setForm({ tipo: tipos.length === 1 ? tipos[0] : "", motivo: "", data: hoje(), observacao: "" });
    } catch (e) {
      if (!signal?.aborted) setErroCarregar(e instanceof Error ? e.message : "Não foi possível carregar o histórico.");
    }
  }, [animalId, onStatusChange]);

  useEffect(() => {
    const abort = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial vinda da API
    recarregar(abort.signal);
    return () => abort.abort();
  }, [recarregar]);

  const alterar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMensagem("");
    setForm((atual) => (name === "tipo" ? { ...atual, tipo: value as TipoMovimentacao, motivo: "" } : { ...atual, [name]: value }));
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setErro("");
    const tipos = proximosTipos(ultima);
    setForm({ tipo: tipos.length === 1 ? tipos[0] : "", motivo: "", data: hoje(), observacao: "" });
  };

  const corrigir = (mov: Movimentacao) => {
    setEditando(mov);
    setErro("");
    setMensagem("");
    setForm({ tipo: mov.tipo, motivo: mov.motivo, data: mov.data, observacao: mov.observacao ?? "" });
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipo || !form.motivo || !form.data) { setErro("Preencha tipo, motivo e data."); return; }
    setSalvando(true);
    setErro("");
    try {
      const corpo = JSON.stringify({ tipo: form.tipo, motivo: form.motivo, data: form.data, observacao: form.observacao.trim() || null });
      if (editando) await api(`/animais/${animalId}/movimentacoes/${editando.id}`, { method: "PUT", body: corpo });
      else await api(`/animais/${animalId}/movimentacoes`, { method: "POST", body: corpo });
      setMensagem(editando ? "Movimentação corrigida." : `${ROTULO_TIPO[form.tipo]} registrada.`);
      setEditando(null);
      await recarregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a movimentação.");
    } finally {
      setSalvando(false);
    }
  };

  const excluirUltima = async () => {
    if (!ultima) return;
    setConfirmarExclusao(false);
    setErro("");
    try {
      await api(`/animais/${animalId}/movimentacoes/${ultima.id}`, { method: "DELETE" });
      setMensagem("Movimentação excluída.");
      setEditando(null);
      await recarregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível excluir a movimentação.");
    }
  };

  return (
    <section aria-labelledby={`${ids}-titulo`} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h2 id={`${ids}-titulo`} className="font-semibold">Histórico de entradas e saídas</h2>

      {erroCarregar ? (
        <p role="alert" className="text-red-700 text-sm">{erroCarregar}</p>
      ) : movimentacoes === null ? (
        <p role="status" className="text-sm">Carregando histórico…</p>
      ) : movimentacoes.length === 0 ? (
        <p className="text-sm">Nenhuma movimentação registrada.</p>
      ) : (
        <ol className="space-y-3">
          {movimentacoes.map((mov) => (
            <li key={mov.id} className="border-l-4 pl-3 text-sm" style={{ borderColor: mov.tipo === "entrada" ? "#2DB38B" : "#9CA3AF" }}>
              <p><span className="font-semibold">{ROTULO_TIPO[mov.tipo]}</span> · {mov.motivo} · {formatarData(mov.data)}</p>
              {mov.observacao && <p className="text-gray-600 whitespace-pre-wrap break-words">{mov.observacao}</p>}
              {mov.id === ultima?.id && !editando && (
                <p className="flex gap-4 mt-1">
                  <button type="button" className="underline" onClick={() => corrigir(mov)}>Corrigir</button>
                  <button type="button" className="underline text-red-700" onClick={() => setConfirmarExclusao(true)}>Excluir</button>
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      {movimentacoes !== null && !erroCarregar && (
        <form onSubmit={salvar} noValidate className="space-y-3 border-t border-gray-100 pt-4" aria-labelledby={`${ids}-form`}>
          <h3 id={`${ids}-form`} className="font-semibold text-sm">
            {editando ? "Corrigir última movimentação" : tiposPermitidos.length === 1 ? `Registrar ${ROTULO_TIPO[tiposPermitidos[0]].toLowerCase()}` : "Registrar movimentação"}
          </h3>
          {tiposPermitidos.length > 1 && (
            <div className="flex flex-col gap-1">
              <label htmlFor={`${ids}-tipo`} className="text-sm font-semibold ml-2">Tipo</label>
              <select id={`${ids}-tipo`} name="tipo" value={form.tipo} onChange={alterar} className={campoClasse}>
                <option value="" disabled>Selecione</option>
                {tiposPermitidos.map((tipo) => <option key={tipo} value={tipo}>{ROTULO_TIPO[tipo]}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor={`${ids}-motivo`} className="text-sm font-semibold ml-2">Motivo</label>
            <select id={`${ids}-motivo`} name="motivo" value={form.motivo} onChange={alterar} disabled={!form.tipo} className={campoClasse}>
              <option value="" disabled>Selecione</option>
              {(form.tipo ? MOTIVOS[form.tipo] : []).map((motivo) => <option key={motivo} value={motivo}>{motivo}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${ids}-data`} className="text-sm font-semibold ml-2">Data</label>
            <input id={`${ids}-data`} name="data" type="date" value={form.data} max={hoje()} min={editando ? movimentacoes.at(-2)?.data : ultima?.data} onChange={alterar} className={campoClasse} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${ids}-observacao`} className="text-sm font-semibold ml-2">Observação</label>
            <textarea id={`${ids}-observacao`} name="observacao" rows={2} maxLength={LIMITE_OBSERVACAO} value={form.observacao} onChange={alterar} className="w-full bg-white border-2 border-gray-300 rounded-2xl px-4 py-2 text-gray-800 outline-none focus:border-[#2DB38B] resize-none" />
          </div>
          {erro && <p role="alert" className="text-red-700 text-sm">{erro}</p>}
          {mensagem && <p role="status" className="text-sm text-[#25967A]">{mensagem}</p>}
          <div className="flex gap-3 justify-end">
            {editando && <button type="button" onClick={cancelarEdicao} className="px-5 py-2 rounded-full border-2 border-gray-300 text-sm font-semibold">Cancelar</button>}
            <button type="submit" disabled={salvando} className="bg-[#2DB38B] text-white px-6 py-2 rounded-full font-bold hover:bg-[#25967A] disabled:opacity-60">
              {salvando ? "Salvando…" : editando ? "Salvar correção" : "Registrar"}
            </button>
          </div>
        </form>
      )}

      {confirmarExclusao && ultima && (
        <ConfirmModal acessivel titulo="Excluir movimentação"
          mensagem={`Excluir a ${ROTULO_TIPO[ultima.tipo].toLowerCase()} de ${formatarData(ultima.data)} (${ultima.motivo})?`}
          labelConfirmar="Excluir" onConfirm={excluirUltima} onCancel={() => setConfirmarExclusao(false)} />
      )}
    </section>
  );
}

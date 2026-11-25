"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdPerson } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import ConfirmModal from "@/components/ConfirmModal";
import SelectGroup from "@/components/SelectGroup";
import InputGroup from "@/components/InputGroup";
import { api } from "@/lib/api";

type StatusType = "Ativo" | "Inativo" | "Pausado";
type TipoContribuicao = "Financeiro" | "Produto" | "Serviço";

interface Contribuicao {
  valor: string;
  data: string;
  tipo?: string;
}

const statusBadgeColor: Record<StatusType, { bg: string; text: string }> = {
  Ativo: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Inativo: { bg: "bg-red-100", text: "text-red-700" },
  Pausado: { bg: "bg-amber-100", text: "text-amber-700" },
};

export default function DetalhesColaboradorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataAdesao, setDataAdesao] = useState("");
  const [status, setStatus] = useState<StatusType>("Ativo");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState("");

  // Modal nova contribuição
  const [showModalContrib, setShowModalContrib] = useState(false);
  const [tipoContrib, setTipoContrib] = useState<TipoContribuicao>("Financeiro");
  const [valorContrib, setValorContrib] = useState("");
  const [dataContrib, setDataContrib] = useState(new Date().toISOString().split("T")[0]);
  const [salvandoContrib, setSalvandoContrib] = useState(false);
  const [erroContribuicao, setErroContribuicao] = useState("");

  // Modal confirmação exclusão
  const [showModalExcluir, setShowModalExcluir] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const colaborador = await api<{
        nome: string;
        email: string | null;
        telefone: string | null;
        dataAdesao: string;
        status: StatusType;
        informacoesAdicionais: string | null;
        contribuicoes: Contribuicao[];
      }>(`/colaboradores/${id}`);
      setNome(colaborador.nome);
      setEmail(colaborador.email ?? "");
      setTelefone(colaborador.telefone ?? "");
      setDataAdesao(colaborador.dataAdesao);
      setStatus(colaborador.status);
      setInformacoesAdicionais(colaborador.informacoesAdicionais ?? "");
      setContribuicoes(colaborador.contribuicoes ?? []);
      setCarregado(true);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar o colaborador."
      );
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSalvarContribuicao = async () => {
    if (!valorContrib.trim()) {
      alert("Informe o valor ou descrição da contribuição.");
      return;
    }
    setSalvandoContrib(true);
    setErroContribuicao("");
    try {
      await api(`/colaboradores/${id}/contribuicoes`, {
        method: "POST",
        body: JSON.stringify({
          tipo: tipoContrib === "Serviço" ? "Servico" : tipoContrib,
          valor: valorContrib,
          data: dataContrib,
        }),
      });
      setShowModalContrib(false);
      setValorContrib("");
      await carregar();
    } catch (err) {
      setErroContribuicao(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar a contribuição."
      );
    } finally {
      setSalvandoContrib(false);
    }
  };

  const handleExcluir = async () => {
    setErro("");
    try {
      await api(`/colaboradores/${id}`, { method: "DELETE" });
      router.push("/colaboradores");
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o colaborador."
      );
      setShowModalExcluir(false);
    }
  };

  const ultimaContribuicao = contribuicoes[0]?.valor ?? "Nenhuma";
  const badge = statusBadgeColor[status] || statusBadgeColor.Ativo;

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/colaboradores")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Colaborador</PageTitle>

        {carregando ? (
          <p className="text-center text-sm text-gray-500">Carregando colaborador...</p>
        ) : !carregado ? (
          <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{erro || "Não foi possível carregar o colaborador."}</p>
            <button
              type="button"
              onClick={() => void carregar()}
              className="mt-2 font-semibold underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
        {erro && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          {/* Foto e Cabeçalho */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-[#2DB38B] flex items-center justify-center text-[#2DB38B] font-bold text-lg flex-shrink-0">
              {nome ? nome.slice(0, 2).toUpperCase() : <MdPerson size={30} />}
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  {nome || "Carregando..."}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badge.bg} ${badge.text}`}
                >
                  ● {status}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-0.5">{telefone}</span>
              <span className="text-xs text-gray-500">{email}</span>
            </div>
          </div>

          {/* Dados de adesão e resumo */}
          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">Data de Adesão</span>
              <span className="text-sm font-semibold text-gray-800">{dataAdesao || "—"}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">Última Contribuição</span>
              <span className="text-sm font-semibold text-[#2DB38B] truncate block">
                {ultimaContribuicao}
              </span>
            </div>
          </div>

          {/* Histórico de contribuições */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Histórico de Contribuições ({contribuicoes.length})
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100 bg-gray-50/50">
              {contribuicoes.length > 0 ? (
                contribuicoes.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 text-xs"
                  >
                    <span className="font-semibold text-gray-800">{c.valor}</span>
                    <span className="text-gray-500">{c.data}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  Nenhuma contribuição registrada ainda.
                </div>
              )}
            </div>
          </div>

          {/* Informações Adicionais */}
          {informacoesAdicionais && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Informações Adicionais
              </span>
              <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100 leading-relaxed">
                {informacoesAdicionais}
              </p>
            </div>
          )}

          {/* Botão Nova Contribuição */}
          <button
            onClick={() => setShowModalContrib(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#2DB38B] text-white rounded-full py-3 text-sm font-semibold shadow-md hover:bg-[#25967A] transition-all cursor-pointer"
          >
            <MdAdd size={20} />
            Nova Contribuição
          </button>

          {/* Botões Excluir e Editar no rodapé */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowModalExcluir(true)}
              className="flex-1 py-2.5 rounded-full border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MdDelete size={18} />
              Excluir
            </button>
            <button
              onClick={() => router.push(`/colaboradores/${id}/editar`)}
              className="flex-1 py-2.5 rounded-full border-2 border-[#2DB38B] text-[#2DB38B] text-sm font-semibold hover:bg-[#2DB38B]/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MdEdit size={18} />
              Editar
            </button>
          </div>
        </div>
          </>
        )}
      </main>

      {/* Modal Nova Contribuição */}
      {showModalContrib && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowModalContrib(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="font-bold text-base text-gray-800">Nova Contribuição</h2>
              <button
                onClick={() => setShowModalContrib(false)}
                aria-label="Fechar"
                className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
              >
                <MdClose size={20} />
              </button>
            </div>

            {erroContribuicao && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {erroContribuicao}
              </p>
            )}

            <SelectGroup
              label="Tipo de contribuição"
              name="tipoContrib"
              options={["Financeiro", "Produto", "Serviço"]}
              value={tipoContrib}
              onChange={(e) => setTipoContrib(e.target.value as TipoContribuicao)}
            />

            <InputGroup
              label={
                tipoContrib === "Financeiro"
                  ? "Valor (R$)"
                  : tipoContrib === "Produto"
                  ? "Produto e Quantidade (ex: 15 Kg de Ração)"
                  : "Serviço Realizado"
              }
              name="valorContrib"
              placeholder={
                tipoContrib === "Financeiro"
                  ? "R$ 100,00"
                  : "Descreva a doação/serviço..."
              }
              value={valorContrib}
              onChange={(e) => setValorContrib(e.target.value)}
            />

            <InputGroup
              label="Data da contribuição"
              name="dataContrib"
              type="date"
              value={dataContrib}
              onChange={(e) => setDataContrib(e.target.value)}
            />

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModalContrib(false)}
                className="px-5 py-2 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarContribuicao}
                disabled={salvandoContrib}
                className="px-6 py-2 rounded-full bg-[#2DB38B] text-white text-sm font-semibold hover:bg-[#25967A] transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {salvandoContrib ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {showModalExcluir && (
        <ConfirmModal
          titulo="Excluir Colaborador"
          mensagem={`Tem certeza que deseja excluir o colaborador ${nome}?`}
          labelConfirmar="Excluir"
          labelCancelar="Cancelar"
          onConfirm={handleExcluir}
          onCancel={() => setShowModalExcluir(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}

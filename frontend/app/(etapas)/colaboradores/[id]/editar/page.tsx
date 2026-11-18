"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { MdPerson } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";
import ConfirmModal from "@/components/ConfirmModal";
import { api } from "@/lib/api";

type StatusType = "Ativo" | "Inativo" | "Pausado";

export default function EditarColaboradorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataAdesao, setDataAdesao] = useState("");
  const [status, setStatus] = useState<StatusType>("Ativo");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(() => {
    if (!id) return;
    api<{
      nome: string;
      email: string;
      telefone: string;
      dataAdesao: string;
      status: StatusType;
      informacoesAdicionais: string | null;
    }>(`/colaboradores/${id}`)
      .then((c) => {
        setNome(c.nome);
        setEmail(c.email);
        setTelefone(c.telefone);
        setDataAdesao(c.dataAdesao);
        setStatus(c.status);
        setInformacoesAdicionais(c.informacoesAdicionais ?? "");
      })
      .catch((err) => {
        console.warn("Erro ao buscar pela API, verificando dados locais:", err);
        try {
          const stored = localStorage.getItem("sjpa_colaboradores");
          if (stored) {
            const list = JSON.parse(stored);
            const found = list.find((item: any) => String(item.id) === String(id));
            if (found) {
              setNome(found.nome);
              setEmail(found.email || "");
              setTelefone(found.telefone || "");
              setDataAdesao(found.dataAdesao || "");
              setStatus(found.status || "Ativo");
              setInformacoesAdicionais(found.informacoesAdicionais || "");
            }
          }
        } catch {}
      });
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await api(`/colaboradores/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome,
          email,
          telefone,
          dataAdesao,
          status,
          informacoesAdicionais,
        }),
      });
    } catch (err) {
      console.warn("Erro na API, atualizando localmente:", err);
      try {
        const stored = localStorage.getItem("sjpa_colaboradores");
        if (stored) {
          const list = JSON.parse(stored);
          const atualizados = list.map((item: any) =>
            String(item.id) === String(id)
              ? {
                  ...item,
                  nome,
                  email,
                  telefone,
                  dataAdesao,
                  status,
                  informacoesAdicionais,
                }
              : item
          );
          localStorage.setItem("sjpa_colaboradores", JSON.stringify(atualizados));
        }
      } catch (e) {
        console.warn("Erro local:", e);
      }
    } finally {
      setSalvando(false);
      router.push(`/colaboradores/${id}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header
        showBack={true}
        onBack={() => router.push(`/colaboradores/${id}`)}
      />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Editar Colaborador</PageTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setModalConfirmar(true);
          }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
        >
          {/* Avatar circular */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#2DB38B] flex items-center justify-center text-[#2DB38B] shadow-inner">
              <MdPerson size={44} />
            </div>
            <span className="text-xs text-gray-400 mt-2">
              Foto do colaborador
            </span>
          </div>

          <InputGroup
            label="Nome Completo"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <InputGroup
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputGroup
            label="Telefone"
            name="telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <InputGroup
            label="Data de Adesão"
            name="dataAdesao"
            type="date"
            value={dataAdesao}
            onChange={(e) => setDataAdesao(e.target.value)}
          />

          <SelectGroup
            label="Status"
            name="status"
            options={["Ativo", "Inativo", "Pausado"]}
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusType)}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="informacoesAdicionais"
              className="text-sm font-semibold ml-2 text-gray-800"
            >
              Informações adicionais
            </label>
            <textarea
              id="informacoesAdicionais"
              name="informacoesAdicionais"
              rows={3}
              value={informacoesAdicionais}
              onChange={(e) => setInformacoesAdicionais(e.target.value)}
              className="w-full bg-[#58C2A1] border-2 border-black rounded-2xl p-3 text-black outline-none placeholder:text-black/50 focus:border-[#25967A] transition-colors resize-none text-sm"
            />
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={() => router.push(`/colaboradores/${id}`)}
              className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-8 py-2.5 rounded-full bg-[#2DB38B] text-white text-sm font-semibold hover:bg-[#25967A] active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </main>

      {modalConfirmar && (
        <ConfirmModal
          titulo="Salvar Alterações"
          mensagem="Tem certeza que deseja salvar as alterações deste colaborador?"
          labelConfirmar="Salvar"
          labelCancelar="Cancelar"
          onConfirm={handleSalvar}
          onCancel={() => setModalConfirmar(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}

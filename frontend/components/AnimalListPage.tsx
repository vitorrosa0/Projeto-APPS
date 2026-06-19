"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { MdSearch, MdEdit, MdDelete, MdAddCircleOutline, MdFileDownload } from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import AnimalAvatar from "@/components/AnimalAvatar";
import ConfirmModal from "@/components/ConfirmModal";

export interface Animal {
  id: number;
  nome: string;
  tipo?: string;
  raca?: string;
  idade?: string;
  sexo?: string;
  setor?: string;
  canil?: string;
  cor?: string;
  temperamento?: string;
  vacinacao?: string;
  dataVacinacao?: string;
  foto?: string;
  outros?: string;
}

interface AnimalListPageProps {
  titulo: string;
  tipo: "cao" | "gato";
  editarBase?: string;
}

export default function AnimalListPage({
  titulo,
  tipo,
  editarBase = "/animais/cadastrar",
}: AnimalListPageProps) {
  const router = useRouter();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [paraExcluir, setParaExcluir] = useState<Animal | null>(null);

  const EmptyIcon = tipo === "cao" ? PiDogFill : PiCatFill;

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    api<Animal[]>(`/animais?tipo=${tipo}`)
      .then((dados) => { if (ativo) setAnimais(dados); })
      .catch((err) => console.error("Erro ao carregar animais:", err))
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [tipo]);

  const animaisFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return animais;
    return animais.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.raca.toLowerCase().includes(termo) ||
        a.setor.toLowerCase().includes(termo) ||
        a.canil.toLowerCase().includes(termo)
    );
  }, [animais, busca]);

  const handleEditar = (animal: Animal) => {
    router.push(`${editarBase}?id=${animal.id}`);
  };

  const exportarCSV = () => {
    const colunas = ["ID", "Nome", "Raça", "Idade", "Sexo", "Setor", "Canil", "Cor", "Temperamento", "Vacinação", "Data Vacinação", "Outros"];
    const campos: (keyof Animal)[] = ["id", "nome", "raca", "idade", "sexo", "setor", "canil", "cor", "temperamento", "vacinacao", "dataVacinacao", "outros"];

    const linhas = [
      colunas.join(","),
      ...animaisFiltrados.map((a) =>
        campos.map((c) => `"${String(a[c] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ];

    const blob = new Blob(["﻿" + linhas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tipo === "cao" ? "caes" : "gatos"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmarExclusao = async () => {
    if (!paraExcluir) return;
    const id = paraExcluir.id;
    try {
      await api(`/animais/${id}`, { method: "DELETE" });
      setAnimais((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert(err instanceof Error ? err.message : "Erro ao excluir o animal.");
    } finally {
      setParaExcluir(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack onBack={() => router.push("/animais")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">

        <PageTitle>{titulo}</PageTitle>

        {/* Campo de busca */}
        <div className="relative">
          <input
            type="search"
            placeholder="Digite um nome/setor/canil"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-11 bg-white border-2 border-gray-300 rounded-full pl-4 pr-11 text-sm text-gray-800 outline-none focus:border-[#2DB38B] transition-colors placeholder:text-gray-400"
          />
          <MdSearch
            size={22}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Lista */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {carregando ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <EmptyIcon size={40} />
              <p className="text-sm">Carregando…</p>
            </div>
          ) : animaisFiltrados.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <EmptyIcon size={40} />
              <p className="text-sm">Nenhum animal encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {animaisFiltrados.map((animal) => (
                <li key={animal.id} className="flex items-center gap-3 px-4 py-3">

                  <AnimalAvatar foto={animal.foto} nome={animal.nome} tipo={tipo} />

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{animal.nome}</p>
                    <p className="text-xs text-gray-500">{animal.idade} · {animal.raca}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Setor {animal.setor} &nbsp;·&nbsp; {animal.canil}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditar(animal)}
                      aria-label={`Editar ${animal.nome}`}
                      className="w-9 h-9 rounded-full bg-[#2DB38B] flex items-center justify-center text-white hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => setParaExcluir(animal)}
                      aria-label={`Excluir ${animal.nome}`}
                      className="w-9 h-9 rounded-full bg-[#2DB38B] flex items-center justify-center text-white hover:bg-red-500 active:scale-95 transition-all cursor-pointer"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contador */}
        <p className="text-xs text-gray-400 text-right pr-1">
          {animaisFiltrados.length}{" "}
          {animaisFiltrados.length === 1 ? "animal" : "animais"} encontrado
          {animaisFiltrados.length !== 1 ? "s" : ""}
        </p>

        {/* Botões de ação */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`${editarBase}?tipo=${tipo}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2DB38B] text-white rounded-full px-6 py-3 text-sm font-semibold shadow-md hover:bg-[#25967A] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MdAddCircleOutline size={20} />
            Adicionar {tipo === "cao" ? "cão" : "gato"}
          </button>

          <button
            onClick={exportarCSV}
            disabled={animaisFiltrados.length === 0}
            title="Exportar lista como CSV"
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#2DB38B] text-[#2DB38B] rounded-full px-4 py-3 text-sm font-semibold shadow-sm hover:bg-[#2DB38B] hover:text-white active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdFileDownload size={20} />
            CSV
          </button>
        </div>

      </main>

      {paraExcluir && (
        <ConfirmModal
          titulo="Excluir animal"
          mensagem={`Tem certeza que deseja excluir ${paraExcluir.nome}?`}
          labelConfirmar="Excluir"
          onConfirm={handleConfirmarExclusao}
          onCancel={() => setParaExcluir(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
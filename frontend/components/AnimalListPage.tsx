"use client";
import Link from "next/link";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  MdSearch,
  MdEdit,
  MdDelete,
  MdAddCircleOutline,
  MdFileDownload,
  MdErrorOutline,
  MdRefresh,
} from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import AnimalAvatar from "@/components/AnimalAvatar";
import ConfirmModal from "@/components/ConfirmModal";
import Toast, { useToast } from "@/components/Toast";
import {
  filtrarAnimais,
  aplicarFiltros,
  ordenarAnimais,
  opcoesDoCampo,
  FILTROS_VAZIOS,
  descricaoAnimal,
  localizacaoAnimal,
  gerarCsvAnimais,
  nomeArquivoCsv,
  type FiltrosAnimais,
  type OrdemAnimais,
} from "@/lib/animais";

const CAMPOS_FILTRO: { campo: keyof FiltrosAnimais; rotulo: string; todos: string }[] = [
  { campo: "setor", rotulo: "Setor", todos: "Todos os setores" },
  { campo: "sexo", rotulo: "Sexo", todos: "Todos" },
  { campo: "vacinacao", rotulo: "Vacinação", todos: "Todas" },
];

const ORDENS: { valor: OrdemAnimais; rotulo: string }[] = [
  { valor: "nome", rotulo: "Nome (A–Z)" },
  { valor: "recentes", rotulo: "Cadastro mais recente" },
  { valor: "antigos", rotulo: "Cadastro mais antigo" },
];

const ESTILO_SELECT =
  "w-full h-10 bg-white border-2 border-gray-300 rounded-full px-3 text-sm text-gray-800 outline-none focus:border-[#2DB38B] transition-colors";

export interface Animal {
  id: number;
  nome: string;
  tipo?: string | null;
  raca?: string | null;
  idade?: string | null;
  sexo?: string | null;
  setor?: string | null;
  canil?: string | null;
  cor?: string | null;
  temperamento?: string | null;
  vacinacao?: string | null;
  dataVacinacao?: string | null;
  foto?: string | null;
  outros?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [busca, setBusca] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAnimais>(FILTROS_VAZIOS);
  const [ordem, setOrdem] = useState<OrdemAnimais>("nome");
  const [paraExcluir, setParaExcluir] = useState<Animal | null>(null);
  const { toast, mostrarToast } = useToast();

  const EmptyIcon = tipo === "cao" ? PiDogFill : PiCatFill;

  useEffect(() => {
    let ativo = true;
    api<Animal[]>(`/animais?tipo=${tipo}`)
      .then((dados) => {
        if (!ativo) return;
        setAnimais(dados);
        setErroCarregamento(false);
      })
      .catch(() => { if (ativo) setErroCarregamento(true); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [tipo, tentativa]);

  const tentarDeNovo = () => {
    setErroCarregamento(false);
    setCarregando(true);
    setTentativa((n) => n + 1);
  };

  const animaisFiltrados = useMemo(
    () => ordenarAnimais(filtrarAnimais(aplicarFiltros(animais, filtros), busca), ordem),
    [animais, filtros, busca, ordem]
  );

  const filtrosAtivos = Object.values(filtros).some((valor) => valor !== "");

  const alterarFiltro = (campo: keyof FiltrosAnimais, valor: string) => {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
  };

  const handleEditar = (animal: Animal) => {
    router.push(`${editarBase}?id=${animal.id}`);
  };

  const exportarCSV = () => {
    const blob = new Blob([gerarCsvAnimais(animaisFiltrados)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivoCsv(tipo);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmarExclusao = async () => {
    if (!paraExcluir) return;
    const { id, nome } = paraExcluir;
    setParaExcluir(null);
    try {
      await api(`/animais/${id}`, { method: "DELETE" });
      setAnimais((prev) => prev.filter((a) => a.id !== id));
      mostrarToast(`Animal excluído: ${nome}`);
    } catch {
      mostrarToast(`Não foi possível excluir ${nome}. Tente de novo.`, "erro");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack onBack={() => router.push("/animais")} />
      <Toast {...toast} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto flex flex-col gap-4">

        <PageTitle>{titulo}</PageTitle>

        {/* Campo de busca */}
        <div className="relative">
          <input
            type="search"
            aria-label="Buscar animais por nome, raça, setor, canil, cor ou temperamento"
            placeholder="Buscar por nome, raça, setor, canil, cor…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-11 bg-white border-2 border-gray-300 rounded-full pl-4 pr-11 text-sm text-gray-800 outline-none focus:border-[#2DB38B] transition-colors placeholder:text-gray-400"
          />
          <MdSearch
            size={22}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Filtros e ordenação */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CAMPOS_FILTRO.map(({ campo, rotulo, todos }) => (
            <label key={campo} className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
              {rotulo}
              <select
                value={filtros[campo]}
                onChange={(e) => alterarFiltro(campo, e.target.value)}
                className={ESTILO_SELECT}
              >
                <option value="">{todos}</option>
                {opcoesDoCampo(animais, campo).map((opcao) => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            </label>
          ))}
          <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
            Ordenar por
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as OrdemAnimais)}
              className={ESTILO_SELECT}
            >
              {ORDENS.map(({ valor, rotulo }) => (
                <option key={valor} value={valor}>{rotulo}</option>
              ))}
            </select>
          </label>
        </div>

        {filtrosAtivos && (
          <button
            type="button"
            onClick={() => setFiltros(FILTROS_VAZIOS)}
            className="self-start text-sm font-semibold text-[#2DB38B] underline cursor-pointer"
          >
            Limpar filtros
          </button>
        )}

        {/* Lista */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {carregando ? (
            <div role="status">
              <span className="sr-only">Carregando…</span>
              <ul aria-hidden="true" className="divide-y divide-gray-100">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 w-1/3 rounded bg-gray-200" />
                      <div className="h-3 w-1/2 rounded bg-gray-100" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : erroCarregamento ? (
            <div role="alert" className="flex flex-col items-center gap-3 py-12 px-6 text-center">
              <MdErrorOutline size={40} className="text-red-400" />
              <p className="text-sm text-gray-600">Não foi possível carregar os animais.</p>
              <button
                onClick={tentarDeNovo}
                className="flex items-center gap-2 bg-[#2DB38B] text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-[#25967A] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MdRefresh size={18} />
                Tentar de novo
              </button>
            </div>
          ) : animaisFiltrados.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <EmptyIcon size={40} />
              <p className="text-sm">Nenhum animal encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 lg:divide-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-px lg:bg-gray-100">
              {animaisFiltrados.map((animal) => {
                const descricao = descricaoAnimal(animal);
                const localizacao = localizacaoAnimal(animal);
                return (
                  <li key={animal.id} className="flex items-center gap-3 px-4 py-3 bg-white">

                    <AnimalAvatar foto={animal.foto ?? undefined} nome={animal.nome} tipo={tipo} />

                    <div className="flex-1 min-w-0">
                      <Link href={`/animais/detalhes?id=${animal.id}`} className="font-bold text-gray-800 text-sm underline">{animal.nome}<span className="sr-only"> — Ver ficha</span></Link>
                      {descricao && <p className="text-xs text-gray-500">{descricao}</p>}
                      {localizacao && <p className="text-xs text-gray-400 mt-0.5">{localizacao}</p>}
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
                        className="w-9 h-9 rounded-full bg-white border-2 border-red-500 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white active:scale-95 transition-all cursor-pointer"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>

                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Contador */}
        {!carregando && !erroCarregamento && (
          <p className="text-xs text-gray-400 text-right pr-1">
            {animaisFiltrados.length}{" "}
            {animaisFiltrados.length === 1 ? "animal" : "animais"} encontrado
            {animaisFiltrados.length !== 1 ? "s" : ""}
          </p>
        )}

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
        <ConfirmModal acessivel
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
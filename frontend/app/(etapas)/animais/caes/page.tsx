"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdSearch, MdEdit, MdDelete, MdPets, MdClose } from "react-icons/md";
import { PiDogFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Cao {
  id: number;
  nome: string;
  idade: string;
  raca: string;
  setor: string;
  canil: string;
  foto?: string; // URL da foto, undefined = placeholder
}

// ---------------------------------------------------------------------------
// Mock de dados
// ---------------------------------------------------------------------------
const MOCK_CAES: Cao[] = [
  { id: 1, nome: "Robson",    idade: "6 anos", raca: "Dachshund",          setor: "A", canil: "Canil X" },
  { id: 2, nome: "Widow",     idade: "4 anos", raca: "Buldogue Francês",   setor: "A", canil: "Canil S2" },
  { id: 3, nome: "Pretinha",  idade: "4 anos", raca: "Puddle",             setor: "A", canil: "Canil 2" },
  { id: 4, nome: "Cristiano", idade: "5 anos", raca: "Vira-lata",          setor: "B", canil: "Canil 7" },
  { id: 5, nome: "Jorge",     idade: "8 anos", raca: "Vira-lata",          setor: "B", canil: "Canil X" },
  { id: 6, nome: "Bolinha",   idade: "2 anos", raca: "Poodle",             setor: "C", canil: "Baia 1" },
  { id: 7, nome: "Luna",      idade: "3 anos", raca: "SRD",                setor: "C", canil: "Baia 2" },
  { id: 8, nome: "Thor",      idade: "1 ano",  raca: "Labrador",           setor: "D", canil: "Baia 3" },
  { id: 9, nome: "Mel",       idade: "7 anos", raca: "Shih-tzu",           setor: "A", canil: "5 Estrelas" },
  { id: 10, nome: "Pipoca",   idade: "3 anos", raca: "Vira-lata",          setor: "E", canil: "Baia 1" },
];

// Patinhas decorativas
const PAW_POSITIONS = [
  { top: "10%", left: "78%", size: 18 },
  { top: "25%", left: "5%",  size: 14 },
  { top: "45%", left: "85%", size: 16 },
  { top: "65%", left: "3%",  size: 20 },
  { top: "80%", left: "70%", size: 14 },
];

// ---------------------------------------------------------------------------
// Sub-componente: Avatar do cão
// ---------------------------------------------------------------------------
function DogAvatar({ foto, nome }: { foto?: string; nome: string }) {
  if (foto) {
    return (
      <img
        src={foto}
        alt={nome}
        className="w-14 h-14 rounded-full object-cover border-2 border-[#2DB38B] flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-14 h-14 rounded-full bg-[#58C2A1]/30 border-2 border-[#2DB38B] flex items-center justify-center flex-shrink-0">
      <PiDogFill size={28} className="text-[#2DB38B]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Modal de confirmação de exclusão
// ---------------------------------------------------------------------------
function ConfirmModal({
  nome,
  onConfirm,
  onCancel,
}: {
  nome: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-800">Excluir animal</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <MdClose size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Tem certeza que deseja excluir <span className="font-semibold text-gray-800">{nome}</span>?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function CaesPage() {
  const router = useRouter();
  const [caes, setCaes] = useState<Cao[]>(MOCK_CAES);
  const [busca, setBusca] = useState("");
  const [paraExcluir, setParaExcluir] = useState<Cao | null>(null);

  // Filtro local: nome, raça, setor ou canil
  const caesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return caes;
    return caes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.raca.toLowerCase().includes(termo) ||
        c.setor.toLowerCase().includes(termo) ||
        c.canil.toLowerCase().includes(termo)
    );
  }, [caes, busca]);

  const handleEditar = (cao: Cao) => {
    // Navega para a tela de cadastro passando o id como query param
    // A tela de cadastro pode usar searchParams para pré-preencher os campos
    router.push(`/animais/cadastrar?id=${cao.id}`);
  };

  const handleConfirmarExclusao = () => {
    if (!paraExcluir) return;
    setCaes((prev) => prev.filter((c) => c.id !== paraExcluir.id));
    setParaExcluir(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack={true} />

      {/* Patinhas decorativas */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {PAW_POSITIONS.map((pos, i) => (
          <MdPets
            key={i}
            size={pos.size}
            style={{ position: "absolute", top: pos.top, left: pos.left, opacity: 0.07, color: "#2DB38B" }}
          />
        ))}
      </div>

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">

        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-black flex-shrink-0" />
          <h1
            className="text-2xl font-bold tracking-wide uppercase text-transparent"
            style={{ WebkitTextStroke: "1px black" }}
          >
            Relação de Cães
          </h1>
        </div>

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
          {caesFiltrados.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <PiDogFill size={40} />
              <p className="text-sm">Nenhum animal encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {caesFiltrados.map((cao) => (
                <li key={cao.id} className="flex items-center gap-3 px-4 py-3">

                  {/* Avatar */}
                  <DogAvatar foto={cao.foto} nome={cao.nome} />

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{cao.nome}</p>
                    <p className="text-xs text-gray-500">{cao.idade} · {cao.raca}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Setor {cao.setor} &nbsp;·&nbsp; {cao.canil}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditar(cao)}
                      aria-label={`Editar ${cao.nome}`}
                      className="w-9 h-9 rounded-full bg-[#2DB38B] flex items-center justify-center text-white hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => setParaExcluir(cao)}
                      aria-label={`Excluir ${cao.nome}`}
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
          {caesFiltrados.length} {caesFiltrados.length === 1 ? "animal" : "animais"} encontrado{caesFiltrados.length !== 1 ? "s" : ""}
        </p>

      </main>

      {/* Modal de confirmação de exclusão */}
      {paraExcluir && (
        <ConfirmModal
          nome={paraExcluir.nome}
          onConfirm={handleConfirmarExclusao}
          onCancel={() => setParaExcluir(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
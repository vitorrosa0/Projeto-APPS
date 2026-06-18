"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdSearch, MdPersonAdd } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import VoluntarioRow from "@/components/VoluntarioRow";
import ConfirmModal from "@/components/ConfirmModal";
import { api } from "@/lib/api";

interface Voluntario {
  id: number;
  nome: string;
}

export default function ListaVoluntariosPage() {
  const router = useRouter();

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [busca, setBusca] = useState("");
  const [voluntarioParaExcluir, setVoluntarioParaExcluir] = useState<Voluntario | null>(null);

  useEffect(() => {
    api<Voluntario[]>("/voluntarios")
      .then(setVoluntarios)
      .catch((err) => console.error("Erro ao carregar voluntários:", err));
  }, []);

  const voluntariosFiltrados = voluntarios.filter((v) =>
    v.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleEditar = (id: number) => {
    router.push(`/voluntarios/editar/${id}`);
  };

  const handleConfirmarExclusao = async () => {
    if (!voluntarioParaExcluir) return;
    const id = voluntarioParaExcluir.id;
    try {
      await api(`/voluntarios/${id}`, { method: "DELETE" });
      setVoluntarios((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Erro ao excluir voluntário:", err);
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setVoluntarioParaExcluir(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack onBack={() => router.push("/voluntarios")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-4">

        {/* Campo de busca */}
        <div className="relative">
          <input
            type="text"
            placeholder="Digite um nome/setor/canil"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="
              w-full pl-4 pr-10 py-3
              bg-white border border-gray-200 rounded-full
              text-sm text-gray-700 placeholder-gray-400
              shadow-sm outline-none
              focus:ring-2 focus:ring-[#2DB38B]/40
            "
          />
          <MdSearch
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Lista de voluntários */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {voluntariosFiltrados.length > 0 ? (
            voluntariosFiltrados.map((voluntario) => (
              <VoluntarioRow
                key={voluntario.id}
                nome={voluntario.nome}
                onEditar={() => handleEditar(voluntario.id)}
                onExcluir={() => setVoluntarioParaExcluir(voluntario)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Nenhum voluntário encontrado.
            </p>
          )}
        </div>

        {/* Botão adicionar voluntário */}
        <button
          onClick={() => router.push("/voluntarios/cadastrar")}
          className="w-full flex items-center justify-center gap-2 bg-[#2DB38B] text-white rounded-full px-6 py-3 text-sm font-semibold shadow-md hover:bg-[#25967A] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <MdPersonAdd size={20} />
          Adicionar voluntário
        </button>

      </main>

      {/* Modal de confirmação de exclusão */}
      {voluntarioParaExcluir && (
        <ConfirmModal
          mensagem={`Tem certeza que deseja excluir este voluntário?`}
          labelConfirmar="Sim"
          labelCancelar="Cancelar"
          onConfirm={handleConfirmarExclusao}
          onCancel={() => setVoluntarioParaExcluir(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
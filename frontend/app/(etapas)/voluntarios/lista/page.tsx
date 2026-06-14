"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSearch } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import VoluntarioRow from "@/components/VoluntarioRow";
import ConfirmModal from "@/components/ConfirmModal";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Voluntario {
  id: number;
  nome: string;
}

// ---------------------------------------------------------------------------
// Dados mock — substituir pela chamada à API quando o backend estiver pronto
// ---------------------------------------------------------------------------
const VOLUNTARIOS_MOCK: Voluntario[] = [
  { id: 1,  nome: "Aline Tavares"    },
  { id: 2,  nome: "Ana Ribeiro"      },
  { id: 3,  nome: "André Moraes"     },
  { id: 4,  nome: "Bruno Azevedo"    },
  { id: 5,  nome: "Caio Ribeiro"     },
  { id: 6,  nome: "Daniela Pires"    },
  { id: 7,  nome: "Daniel Freire"    },
  { id: 8,  nome: "Diego Freitas"    },
  { id: 9,  nome: "Eduardo Campos"   },
  { id: 10, nome: "Fernanda Prado"   },
  { id: 11, nome: "Felipe Duarte"    },
  { id: 12, nome: "Fábio Cunha"      },
  { id: 13, nome: "Gabriel Oliveira" },
  { id: 14, nome: "Gabriela Siqueira"},
  { id: 15, nome: "Henrique Paiva"   },
  { id: 16, nome: "Igor Carvalho"    },
  { id: 17, nome: "Letícia Xavier"   },
];

export default function ListaVoluntariosPage() {
  const router = useRouter();

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>(VOLUNTARIOS_MOCK);
  const [busca, setBusca] = useState("");
  const [voluntarioParaExcluir, setVoluntarioParaExcluir] = useState<Voluntario | null>(null);

  const voluntariosFiltrados = voluntarios.filter((v) =>
    v.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleEditar = (id: number) => {
    router.push(`/voluntarios/editar/${id}`);
  };

  const handleConfirmarExclusao = () => {
    if (!voluntarioParaExcluir) return;
    // TODO: integrar com API para deletar o voluntário
    setVoluntarios((prev) => prev.filter((v) => v.id !== voluntarioParaExcluir.id));
    setVoluntarioParaExcluir(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack={true} />
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
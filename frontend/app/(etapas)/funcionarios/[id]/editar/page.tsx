"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdPerson } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";
import ConfirmModal from "@/components/ConfirmModal";
import { Funcionario } from "../../page";

const CARGOS = [
  "Veterinário",
  "Auxiliar Veterinário",
  "Auxiliar Geral",
  "Administrador",
  "Tosador / Banhista",
  "Cuidador de Animais",
  "Recepcionista",
  "Outro",
];

const TURNOS = ["Integral", "Matutino", "Vespertino", "Noturno"];

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [cargo, setCargo] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("40h/semana");
  const [turno, setTurno] = useState("Integral");
  const [modalConfirmar, setModalConfirmar] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      const stored = localStorage.getItem("sjpa_funcionarios");
      if (stored) {
        const list: Funcionario[] = JSON.parse(stored);
        const item = list.find((f) => f.id === id);
        if (item) {
          setNome(item.nome);
          setEmail(item.email);
          setTelefone(item.telefone);
          setDataAdmissao(item.dataAdmissao);
          setCargo(item.cargo);
          setCargaHoraria(item.cargaHoraria.replace("Carga: ", ""));
          setTurno(item.turno || "Integral");
        }
      }
    } catch {
      // fallback
    }
  }, [id]);

  const handleSalvar = () => {
    if (!nome.trim()) {
      alert("Informe o nome completo do funcionário.");
      return;
    }
    try {
      const stored = JSON.parse(
        localStorage.getItem("sjpa_funcionarios") || "[]"
      );
      const atualizados = stored.map((f: Funcionario) =>
        f.id === id
          ? {
              ...f,
              nome,
              email,
              telefone,
              dataAdmissao,
              cargo,
              cargaHoraria: `Carga: ${cargaHoraria}`,
              turno,
            }
          : f
      );
      localStorage.setItem("sjpa_funcionarios", JSON.stringify(atualizados));
    } catch (err) {
      console.warn("Erro ao salvar localmente:", err);
    }
    router.push("/funcionarios");
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/funcionarios")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Editar Funcionário</PageTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setModalConfirmar(true);
          }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#2DB38B] flex items-center justify-center text-[#2DB38B] shadow-inner">
              <MdPerson size={44} />
            </div>
            <span className="text-xs text-gray-400 mt-2">
              Alterar foto do funcionário
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
            label="Data de Admissão"
            name="dataAdmissao"
            type="date"
            value={dataAdmissao}
            onChange={(e) => setDataAdmissao(e.target.value)}
          />

          <SelectGroup
            label="Cargo"
            name="cargo"
            options={CARGOS}
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <InputGroup
              label="Carga Horária"
              name="cargaHoraria"
              value={cargaHoraria}
              onChange={(e) => setCargaHoraria(e.target.value)}
            />

            <SelectGroup
              label="Turno"
              name="turno"
              options={TURNOS}
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={() => router.push("/funcionarios")}
              className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-full bg-[#2DB38B] text-white text-sm font-semibold hover:bg-[#25967A] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </main>

      {modalConfirmar && (
        <ConfirmModal
          titulo="Salvar Alterações"
          mensagem="Tem certeza que deseja salvar as alterações deste funcionário?"
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

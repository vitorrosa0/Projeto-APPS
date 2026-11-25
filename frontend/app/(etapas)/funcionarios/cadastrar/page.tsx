"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdCheckCircle, MdPerson } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";

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

export default function CadastrarFuncionarioPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [cargo, setCargo] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("40h/semana");
  const [turno, setTurno] = useState("Integral");
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Informe o nome completo do funcionário.");
      return;
    }
    if (!cargo) {
      alert("Selecione o cargo do funcionário.");
      return;
    }

    try {
      const stored = JSON.parse(
        localStorage.getItem("sjpa_funcionarios") || "[]"
      );
      const novo = {
        id: Date.now(),
        nome,
        email,
        telefone,
        dataAdmissao,
        cargo,
        cargaHoraria: `Carga: ${cargaHoraria}`,
        turno,
      };
      stored.push(novo);
      localStorage.setItem("sjpa_funcionarios", JSON.stringify(stored));
    } catch (err) {
      console.warn("Erro ao salvar localmente:", err);
    }

    setSalvo(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">
      <Header showBack={true} onBack={() => router.push("/funcionarios")} />
      <PawBackground />

      <main className="relative z-10 px-4 py-6 flex-1 w-full max-w-md mx-auto flex flex-col gap-6">
        <PageTitle>Cadastro de Funcionário</PageTitle>

        {salvo ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-[#2DB38B] flex items-center justify-center text-[#2DB38B]">
              <MdCheckCircle size={52} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
                Funcionário Cadastrado com Sucesso
              </h2>
              <p className="text-sm text-gray-500">
                O colaborador <strong className="text-gray-800">{nome}</strong> foi registrado como <strong className="text-gray-800">{cargo}</strong>.
              </p>
            </div>

            <button
              onClick={() => router.push("/funcionarios")}
              className="mt-3 w-full bg-[#2DB38B] text-white rounded-full py-3.5 text-base font-semibold shadow-md hover:bg-[#25967A] transition-all cursor-pointer"
            >
              Continuar
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSalvar}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
          >
            {/* Avatar circular estilo Figma */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-[#2DB38B] flex items-center justify-center text-[#2DB38B] shadow-inner">
                <MdPerson size={44} />
              </div>
              <span className="text-xs text-gray-400 mt-2">
                Foto do funcionário
              </span>
            </div>

            <InputGroup
              label="Nome Completo"
              name="nome"
              placeholder="Digite o nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <InputGroup
              label="E-mail"
              name="email"
              type="email"
              placeholder="exemplo@sjpa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputGroup
              label="Telefone"
              name="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
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
                placeholder="Ex: 40h/sem"
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
                Salvar
              </button>
            </div>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
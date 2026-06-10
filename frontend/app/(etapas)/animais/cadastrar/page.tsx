"use client";

import { useState, useRef } from "react";
import { MdPets, MdAdd, MdCheckCircle } from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";

const SETORES = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

const CANAIS_POR_SETOR: Record<string, string[]> = {
  A: ["5 Estrelas", "5 Estrelas / Canil 2", "5 Estrelas / Canil 1", "Baia 1", "Baia 2", "Baia 3", "Baia 4", "Baia 5", "Baia 6", "Baia 7", "Canil 1"],
  B: ["5 Estrelas", "5 Estrelas / Canil 2", "5 Estrelas / Canil 1", "Baia 1", "Baia 2", "Baia 3", "Baia 4", "Baia 5", "Baia 6", "Baia 7"],
  C: ["Baia 1", "Baia 2", "Baia 3", "Baia 4"],
  D: ["Baia 1", "Baia 2", "Baia 3"],
  E: ["Baia 1", "Baia 2"],
  F: ["Baia 1", "Baia 2", "Baia 3"],
  G: ["Baia 1", "Baia 2"],
  H: ["Baia 1", "Baia 2"],
  I: ["Baia 1"],
};

const PAW_POSITIONS = [
  { top: "12%", left: "75%", size: 20 },
  { top: "22%", left: "12%", size: 16 },
  { top: "35%", left: "82%", size: 18 },
  { top: "50%", left: "8%",  size: 22 },
  { top: "65%", left: "72%", size: 16 },
  { top: "80%", left: "18%", size: 20 },
];

interface FormData {
  nome: string;
  tipo: string;
  idade: string;
  sexo: string;
  setor: string;
  canil: string;
  cor: string;
  temperamento: string;
  vacinacao: string;
  dataVacinacao: string;
  outros: string;
}

const FORM_INITIAL: FormData = {
  nome: "",
  tipo: "",
  idade: "",
  sexo: "",
  setor: "",
  canil: "",
  cor: "",
  temperamento: "",
  vacinacao: "",
  dataVacinacao: "",
  outros: "",
};

export default function CadastroPet() {
  const [formData, setFormData] = useState<FormData>(FORM_INITIAL);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Opções de canil dependem do setor selecionado
  const canilOptions = formData.setor ? (CANAIS_POR_SETOR[formData.setor] ?? []) : [];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Quando o setor muda, reseta o canil
      if (name === "setor") {
        return { ...prev, setor: value, canil: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const showToast = () => {
    setSaved(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setSaved(false), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: substituir pelo envio real ao backend
      await new Promise((res) => setTimeout(res, 800)); // simula latência
      console.log("Dados do Pet:", formData);
      showToast();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      // TODO: exibir toast de erro
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
      <div className="relative min-h-screen bg-white overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

        <Header showBack={true} />

        {/* ── Toast de sucesso ── */}
        <div
            aria-live="polite"
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#2DB38B] text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold transition-all duration-300 ${
                saved ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
        >
          <MdCheckCircle size={20} />
          Pet cadastrado com sucesso!
        </div>

        {/* ── Patinhas decorativas ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {PAW_POSITIONS.map((pos, i) => (
              <MdPets
                  key={i}
                  size={pos.size}
                  style={{ position: "absolute", top: pos.top, left: pos.left, opacity: 0.05, color: "#2DB38B" }}
              />
          ))}
        </div>

        <main className="relative z-10 px-6 py-8 flex-1 w-full max-w-md mx-auto">

          {/* Título */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-black" />
            <h1
                className="text-2xl font-bold tracking-wide uppercase text-transparent"
                style={{ WebkitTextStroke: "1px black" }}
            >
              Cadastro de Pet
            </h1>
          </div>

          {/* Upload / Preview de foto */}
          <div className="flex justify-center mb-8">
            <label className="relative w-32 h-32 rounded-full bg-gray-200 border-[5px] border-[#2DB38B] flex items-center justify-center shadow-sm cursor-pointer overflow-hidden">
              {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                      src={photoPreview}
                      alt="Preview do pet"
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <div className="flex gap-1">
                      <PiDogFill size={28} />
                      <PiCatFill size={28} />
                    </div>
                    <MdAdd size={24} className="mt-[-4px]" />
                  </div>
              )}
              <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <InputGroup
                label="Nome do animal"
                name="nome"
                placeholder="Ex: Robson"
                value={formData.nome}
                onChange={handleChange}
            />

            <SelectGroup
                label="Tipo do animal"
                name="tipo"
                options={["Cachorro", "Gato"]}
                value={formData.tipo}
                onChange={handleChange}
            />

            <InputGroup
                label="Idade (aproximada)"
                name="idade"
                placeholder="Ex: 3 anos"
                value={formData.idade}
                onChange={handleChange}
            />

            <SelectGroup
                label="Sexo"
                name="sexo"
                options={["Masculino", "Feminino"]}
                value={formData.sexo}
                onChange={handleChange}
            />

            {/* Setor + Canil lado a lado */}
            <div className="grid grid-cols-2 gap-3">
              <SelectGroup
                  label="Setor"
                  name="setor"
                  options={SETORES}
                  value={formData.setor}
                  onChange={handleChange}
              />

              <SelectGroup
                  label="Canil"
                  name="canil"
                  options={canilOptions}
                  value={formData.canil}
                  onChange={handleChange}
                  disabled={!formData.setor}
              />
            </div>

            <InputGroup
                label="Coloração do pelo"
                name="cor"
                placeholder="Ex: Marrom"
                value={formData.cor}
                onChange={handleChange}
            />

            <InputGroup
                label="Temperamento"
                name="temperamento"
                placeholder="Ex: Dócil"
                value={formData.temperamento}
                onChange={handleChange}
            />

            <SelectGroup
                label="Vacinação"
                name="vacinacao"
                options={["Completa", "Incompleta", "Não vacinado"]}
                value={formData.vacinacao}
                onChange={handleChange}
            />

            <InputGroup
                label="Data de vacinação"
                name="dataVacinacao"
                type="date"
                value={formData.dataVacinacao}
                onChange={handleChange}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold ml-2 text-gray-800">Outros:</label>
              <textarea
                  name="outros"
                  rows={3}
                  placeholder="Ex: Precisa de medicação, vacina x em falta etc."
                  value={formData.outros}
                  onChange={handleChange}
                  className="w-full bg-[#58C2A1] border-2 border-black rounded-[20px] px-4 py-3 text-black outline-none placeholder:text-black/50 focus:border-[#25967A] transition-colors resize-none"
              />
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6">
              <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2DB38B] text-white px-8 py-2 rounded-full font-bold text-lg border-2 border-black hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando…" : "Salvar"}
              </button>
            </div>

          </form>
        </main>

        <BottomNav />
      </div>
  );
}
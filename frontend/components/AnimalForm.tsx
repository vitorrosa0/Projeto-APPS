"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAdd, MdCheckCircle } from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import { api, API_URL } from "@/lib/api";
import Image from 'next/image';
import Link from 'next/link';
import type { Animal } from './AnimalListPage';
import { validarFormulario } from '@/lib/animalValidation';

// O backend espera tipo "cao" | "gato"; o formulário usa rótulos amigáveis.
const TIPO_MAP: Record<string, string> = { Cão: "cao", Gato: "gato" };
const TIPO_LABEL: Record<string, string> = { cao: "Cão", gato: "Gato" };

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

interface FormData {
  nome: string;
  tipo: string;
  raca: string;
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
  nome: "", tipo: "", raca: "", idade: "", sexo: "",
  setor: "", canil: "", cor: "", temperamento: "",
  vacinacao: "", dataVacinacao: "", outros: "",
};

interface AnimalFormProps { animal?: Animal; tipoInicial?: string; }
export default function AnimalForm({ animal, tipoInicial = '' }: AnimalFormProps) {
  const router = useRouter();
  const tipo = animal?.tipo ?? tipoInicial;
  const editId = animal?.id;
  const backHref = tipo === 'cao' ? '/animais/caes' : tipo === 'gato' ? '/animais/gatos' : '/animais';
  const [formData, setFormData] = useState<FormData>(() => ({
    nome: animal?.nome ?? '', tipo: TIPO_LABEL[tipo] ?? '', raca: animal?.raca ?? '',
    idade: animal?.idade ?? '', sexo: animal?.sexo ?? '', setor: animal?.setor ?? '',
    canil: animal?.canil ?? '', cor: animal?.cor ?? '', temperamento: animal?.temperamento ?? '',
    vacinacao: animal?.vacinacao ?? '', dataVacinacao: animal?.dataVacinacao ?? '', outros: animal?.outros ?? '',
  }));
  const [photoPreview, setPhotoPreview] = useState<string | null>(animal?.foto ? (animal.foto.startsWith('/animais/fotos/') ? API_URL + animal.foto : animal.foto) : null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string,string>>({});
  const canilOptions = formData.setor ? (CANAIS_POR_SETOR[formData.setor] ?? []) : [];
  useEffect(() => () => { if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSaved(false);
    setFormData((prev) =>
      name === "setor" ? { ...prev, setor: value, canil: "" } : { ...prev, [name]: value }
    );
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Use JPEG, PNG ou WebP até 5 MiB.'); e.target.value = ''; return;
    }
    setError(''); setSaved(false); setPhotoFile(file); setPhotoRemoved(false);
    setPhotoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const showToast = () => setSaved(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validarFormulario({ ...formData, tipo: TIPO_MAP[formData.tipo] ?? formData.tipo });
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setLoading(true); setError('');
    try {
      const { tipo, ...resto } = formData;
      let foto: string | null | undefined;
      if (photoFile) foto = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Não foi possível ler a foto.'));
        reader.readAsDataURL(photoFile);
      });
      else if (photoRemoved) foto = null;
      const payload = JSON.stringify({ ...Object.fromEntries(Object.entries(resto).map(([key,value]) => [key, value.trim() || null])), nome: resto.nome.trim(), tipo: TIPO_MAP[tipo] ?? tipo, ...(foto !== undefined ? { foto } : {}) });
      if (editId) {
        await api(`/animais/${editId}`, { method: "PUT", body: payload });
      } else {
        await api("/animais", { method: "POST", body: payload });
      }
      showToast();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setError(err instanceof Error ? err.message : "Erro ao salvar o animal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack onBack={() => router.push(backHref)} />

      {/* Toast de sucesso */}
      <div
        aria-live="polite"
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#2DB38B] text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold transition-all duration-300 ${
          saved ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <MdCheckCircle size={20} />
        {editId ? "Animal atualizado com sucesso!" : "Animal cadastrado com sucesso!"}
      </div>

      <PawBackground />

      <main className="relative z-10 px-6 py-8 flex-1 w-full max-w-md mx-auto">

        <div className="mb-8">
          <PageTitle>{editId ? "Editar animal" : "Cadastro de animal"}</PageTitle>
        </div>

        {saved && <div role="status" className="mb-4 rounded-xl bg-white p-4 text-gray-800">Animal salvo. <Link href={backHref} className="underline">Voltar à lista</Link> · <button type="button" className="underline" onClick={() => { if (editId) { router.push('/animais/cadastrar?tipo=' + (TIPO_MAP[formData.tipo] ?? '')); return; } setFormData({ ...FORM_INITIAL, tipo: formData.tipo }); setPhotoFile(null); setPhotoPreview(null); setPhotoRemoved(false); setSaved(false); }}>Cadastrar outro</button></div>}
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        {/* Upload / Preview de foto */}
        <div className="flex justify-center mb-3">
          <label className="relative w-32 h-32 rounded-full bg-gray-200 border-[5px] border-[#2DB38B] flex items-center justify-center shadow-sm cursor-pointer overflow-hidden">
            {photoPreview ? (
              <Image unoptimized width={128} height={128} src={photoPreview} alt="Preview do animal" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <div className="flex gap-1">
                  <PiDogFill size={28} />
                  <PiCatFill size={28} />
                </div>
                <MdAdd size={24} className="mt-[-4px]" /><span className="text-xs font-semibold">Adicionar foto</span>
              </div>
            )}
            <input type="file" aria-label={photoPreview ? "Trocar foto" : "Adicionar foto"} accept="image/jpeg,image/png,image/webp" disabled={loading || saved} onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer" />
          </label>
        </div>
        <div className="text-center mb-6 text-gray-800"><p>{photoPreview ? 'Trocar foto usando o seletor acima' : 'Adicionar foto usando o seletor acima'}</p><p className="text-xs">JPEG, PNG ou WebP até 5 MiB</p>{photoPreview && <button type="button" disabled={loading || saved} className="underline" onClick={() => { setPhotoFile(null); setPhotoPreview(null); setPhotoRemoved(true); }}>Remover foto</button>}</div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <fieldset disabled={loading || saved} className="space-y-4">

          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Nome do animal"      aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "nome-error" : undefined} required name="nome"          placeholder="Ex: Robson"        value={formData.nome}          onChange={handleChange} />
          {errors.nome && <p id="nome-error" role="alert" className="text-red-700 text-sm">{errors.nome}</p>}
          <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Tipo do animal"     aria-invalid={!!errors.tipo} aria-describedby={errors.tipo ? "tipo-error" : undefined} required name="tipo"          options={["Cão", "Gato"]}  value={formData.tipo}          onChange={handleChange} />
          {errors.tipo && <p id="tipo-error" role="alert" className="text-red-700 text-sm">{errors.tipo}</p>}
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Raça" name="raca" value={formData.raca} onChange={handleChange} placeholder="Ex: Sem raça definida" />
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Idade (aproximada)"  name="idade"         placeholder="Ex: 3 anos"        value={formData.idade}         onChange={handleChange} />
          <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Sexo"               name="sexo"          options={["Masculino", "Feminino"]} value={formData.sexo}      onChange={handleChange} />

          <div className="grid grid-cols-2 gap-3">
            <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Setor" name="setor" options={SETORES}       value={formData.setor} onChange={handleChange} />
            <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Canil" name="canil" options={canilOptions}  value={formData.canil} onChange={handleChange} disabled={!formData.setor} />
          </div>

          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Coloração do pelo"  name="cor"           placeholder="Ex: Marrom"        value={formData.cor}           onChange={handleChange} />
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Temperamento"        name="temperamento"  placeholder="Ex: Dócil"         value={formData.temperamento}  onChange={handleChange} />
          <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Vacinação"          name="vacinacao"     options={["Completa", "Incompleta", "Não vacinado"]} value={formData.vacinacao} onChange={handleChange} />
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Data de vacinação"   aria-invalid={!!errors.dataVacinacao} aria-describedby={errors.dataVacinacao ? "data-error" : undefined} max={new Date().toLocaleDateString("sv-SE")} name="dataVacinacao" type="date"                     value={formData.dataVacinacao} onChange={handleChange} />

          {errors.dataVacinacao && <p id="data-error" role="alert" className="text-red-700 text-sm">{errors.dataVacinacao}</p>}
          <div className="flex flex-col gap-1">
            <label htmlFor="outros" className="text-sm font-semibold ml-2 text-gray-800">Outros:</label>
            <textarea
              id="outros" name="outros"
              rows={3}
              placeholder="Ex: Precisa de medicação, vacina x em falta etc."
              value={formData.outros}
              onChange={handleChange}
              className="w-full bg-white border-2 border-gray-300 rounded-2xl px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2DB38B] text-white px-8 py-2 rounded-full font-bold text-lg border-2 border-black hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando…" : "Salvar"}
            </button>
          </div>

          </fieldset>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
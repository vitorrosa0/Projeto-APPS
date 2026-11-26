"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import InputGroup from "@/components/InputGroup";
import SelectGroup from "@/components/SelectGroup";
import PawBackground from "@/components/PawBackground";
import PageTitle from "@/components/PageTitle";
import Toast from "@/components/Toast";
import { api, API_URL, ApiError } from "@/lib/api";
import Image from 'next/image';
import Link from 'next/link';
import type { Animal } from './AnimalListPage';
import { validarFormulario, validarOpcoes, LIMITES_TEXTO, SETORES, SEXOS, CANIS_POR_SETOR } from '@/lib/animalValidation';

// O backend espera tipo "cao" | "gato"; o formulário usa rótulos amigáveis.
const TIPO_MAP: Record<string, string> = { Cão: "cao", Gato: "gato" };
const TIPO_LABEL: Record<string, string> = { cao: "Cão", gato: "Gato" };

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

const CAMPOS_OPCOES = ['sexo', 'setor', 'canil'] as const;

/** Erro de um campo, com o valor salvo quando ele não existe mais nas opções. */
function ErroCampo({ id, erro, valorAntigo }: { id: string; erro?: string; valorAntigo?: string }) {
  if (!erro) return null;
  return <p id={id} role="alert" className="text-red-700 text-sm">{erro}{valorAntigo ? ` Valor salvo: "${valorAntigo}".` : ''}</p>;
}

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
  // Cadastros anteriores ao ANI-04 podem ter sexo, setor ou canil fora das opções;
  // nesse caso o formulário já abre apontando o campo e o valor salvo.
  const [valoresAntigos] = useState<Record<string, string>>(() => {
    if (!animal) return {};
    const invalidos = validarOpcoes(animal);
    return Object.fromEntries(CAMPOS_OPCOES.filter((campo) => invalidos[campo]).map((campo) => [campo, String(animal[campo])]));
  });
  const [errors, setErrors] = useState<Record<string,string>>(() => (animal ? validarOpcoes(animal) : {}));
  const ariaErro = (campo: string) => ({ 'aria-invalid': !!errors[campo], 'aria-describedby': errors[campo] ? `${campo}-error` : undefined });
  const canilOptions = formData.setor ? (CANIS_POR_SETOR[formData.setor] ?? []) : [];
  useEffect(() => () => { if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSaved(false);
    setErrors((atuais) => {
      if (!atuais[name] && !(name === 'setor' && atuais.canil)) return atuais;
      const restantes = { ...atuais };
      delete restantes[name];
      if (name === 'setor') delete restantes.canil;
      return restantes;
    });
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
      // Erros de campo vindos do backend aparecem junto ao campo, como os do formulário.
      if (err instanceof ApiError && Object.keys(err.campos).length) {
        setErrors(err.campos);
        setError('Corrija os campos marcados.');
      } else {
        setError(err instanceof Error ? err.message : "Erro ao salvar o animal.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-x-hidden flex flex-col md:ml-56 pb-20 md:pb-0">

      <Header showBack onBack={() => router.push(backHref)} />

      <Toast
        mensagem={editId ? "Animal atualizado com sucesso!" : "Animal cadastrado com sucesso!"}
        tipo="sucesso"
        visivel={saved}
      />

      <PawBackground />

      <main className="relative z-10 px-6 py-8 flex-1 w-full max-w-md mx-auto">

        <div className="mb-8">
          <PageTitle>{editId ? "Editar animal" : "Cadastro de animal"}</PageTitle>
        </div>

        {saved && <div role="status" className="mb-4 rounded-xl bg-white p-4 text-gray-800">Animal salvo. <Link href={backHref} className="underline">Voltar à lista</Link> · <button type="button" className="underline" onClick={() => { if (editId) { router.push('/animais/cadastrar?tipo=' + (TIPO_MAP[formData.tipo] ?? '')); return; } setFormData({ ...FORM_INITIAL, tipo: formData.tipo }); setPhotoFile(null); setPhotoPreview(null); setPhotoRemoved(false); setSaved(false); }}>Cadastrar outro</button></div>}
        {CAMPOS_OPCOES.some((campo) => valoresAntigos[campo] && formData[campo] === valoresAntigos[campo]) && <p role="status" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">Este cadastro tem valores que não existem mais nas opções do formulário. Escolha uma opção nos campos marcados antes de salvar.</p>}
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

          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Nome do animal"      aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "nome-error" : undefined} required name="nome" maxLength={LIMITES_TEXTO.nome}          placeholder="Ex: Robson"        value={formData.nome}          onChange={handleChange} />
          {errors.nome && <p id="nome-error" role="alert" className="text-red-700 text-sm">{errors.nome}</p>}
          <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Tipo do animal"     aria-invalid={!!errors.tipo} aria-describedby={errors.tipo ? "tipo-error" : undefined} required name="tipo"          options={["Cão", "Gato"]}  value={formData.tipo}          onChange={handleChange} />
          {errors.tipo && <p id="tipo-error" role="alert" className="text-red-700 text-sm">{errors.tipo}</p>}
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Raça" name="raca" maxLength={LIMITES_TEXTO.raca} value={formData.raca} onChange={handleChange} placeholder="Ex: Sem raça definida" {...ariaErro('raca')} />
          <ErroCampo id="raca-error" erro={errors.raca} />
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Idade (aproximada)"  name="idade" maxLength={LIMITES_TEXTO.idade}         placeholder="Ex: 3 anos"        value={formData.idade}         onChange={handleChange} {...ariaErro('idade')} />
          <ErroCampo id="idade-error" erro={errors.idade} />
          <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Sexo"               name="sexo"          options={SEXOS} value={formData.sexo}      onChange={handleChange} {...ariaErro('sexo')} />
          <ErroCampo id="sexo-error" erro={errors.sexo} valorAntigo={valoresAntigos.sexo} />

          <div className="grid grid-cols-2 gap-3">
            <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Setor" name="setor" options={SETORES}       value={formData.setor} onChange={handleChange} {...ariaErro('setor')} />
            <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Canil" name="canil" options={canilOptions}  value={formData.canil} onChange={handleChange} disabled={!formData.setor} {...ariaErro('canil')} />
          </div>
          <ErroCampo id="setor-error" erro={errors.setor} valorAntigo={valoresAntigos.setor} />
          <ErroCampo id="canil-error" erro={errors.canil} valorAntigo={valoresAntigos.canil} />

          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Coloração do pelo"  name="cor" maxLength={LIMITES_TEXTO.cor}           placeholder="Ex: Marrom"        value={formData.cor}           onChange={handleChange} {...ariaErro('cor')} />
          <ErroCampo id="cor-error" erro={errors.cor} />
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Temperamento"        name="temperamento" maxLength={LIMITES_TEXTO.temperamento}  placeholder="Ex: Dócil"         value={formData.temperamento}  onChange={handleChange} {...ariaErro('temperamento')} />
          <ErroCampo id="temperamento-error" erro={errors.temperamento} />
          <SelectGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Vacinação"          name="vacinacao"     options={["Completa", "Incompleta", "Não vacinado"]} value={formData.vacinacao} onChange={handleChange} {...ariaErro('vacinacao')} />
          <ErroCampo id="vacinacao-error" erro={errors.vacinacao} />
          <InputGroup className="w-full h-10 bg-white border-2 border-gray-300 rounded-full px-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors disabled:opacity-50" label="Data de vacinação"   aria-invalid={!!errors.dataVacinacao} aria-describedby={errors.dataVacinacao ? "data-error" : undefined} max={new Date().toLocaleDateString("sv-SE")} name="dataVacinacao" type="date"                     value={formData.dataVacinacao} onChange={handleChange} />

          {errors.dataVacinacao && <p id="data-error" role="alert" className="text-red-700 text-sm">{errors.dataVacinacao}</p>}
          <div className="flex flex-col gap-1">
            <label htmlFor="outros" className="text-sm font-semibold ml-2 text-gray-800">Outros:</label>
            <textarea
              id="outros" name="outros" maxLength={LIMITES_TEXTO.outros}
              rows={3}
              placeholder="Ex: Precisa de medicação, vacina x em falta etc."
              value={formData.outros}
              onChange={handleChange}
              {...ariaErro('outros')}
              className="w-full bg-white border-2 border-gray-300 rounded-2xl px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#2DB38B] transition-colors resize-none"
            />
            <ErroCampo id="outros-error" erro={errors.outros} />
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2DB38B] text-white px-8 py-2 rounded-full font-bold text-lg hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
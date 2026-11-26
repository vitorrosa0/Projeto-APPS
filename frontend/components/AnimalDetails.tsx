"use client";
import Link from 'next/link';
import { useState } from 'react';
import AnimalHistorico from './AnimalHistorico';
import { NO_ABRIGO } from '@/lib/movimentacoes';
import { api } from '@/lib/api';
import ConfirmModal from './ConfirmModal';
import { useRouter } from 'next/navigation';
import type { Animal } from './AnimalListPage';
import AnimalAvatar from './AnimalAvatar';
import Header from './Header';
import BottomNav from './BottomNav';
import PageTitle from './PageTitle';
import { formatarData } from '@/lib/animais';
interface AnimalDetailsProps { animal: Animal; }
export default function AnimalDetails({ animal }: AnimalDetailsProps) {
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(animal.status ?? NO_ABRIGO);
  const excluir = async () => {
    if (excluindo) return;
    setExcluindo(true);
    try { await api('/animais/' + animal.id, { method: 'DELETE' }); router.push(lista); }
    catch (error) { setError(error instanceof Error ? error.message : 'Não foi possível excluir o animal.'); }
    finally { setExcluindo(false); setConfirmar(false); }
  };
  const lista = animal.tipo === 'cao' ? '/animais/caes' : '/animais/gatos';
  const campos = [ ['Identificação', String(animal.id)], ['Situação', status], ['Tipo', animal.tipo === 'cao' ? 'Cão' : 'Gato'], ['Raça', animal.raca], ['Idade aproximada', animal.idade], ['Sexo', animal.sexo], ['Setor', animal.setor], ['Canil', animal.canil], ['Coloração do pelo', animal.cor], ['Temperamento', animal.temperamento], ['Vacinação', animal.vacinacao], ['Data de vacinação', formatarData(animal.dataVacinacao)], ['Observações', animal.outros], ['Cadastrado em', animal.createdAt ? new Date(animal.createdAt).toLocaleString('pt-BR') : null], ['Atualizado em', animal.updatedAt ? new Date(animal.updatedAt).toLocaleString('pt-BR') : null] ];
  return <div className="min-h-screen bg-gray-100 md:ml-56 pb-24 text-gray-800"><Header showBack onBack={() => router.push(lista)} /><main className="max-w-md mx-auto p-6 space-y-6"><PageTitle>Ficha do animal</PageTitle><section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"><AnimalAvatar foto={animal.foto ?? undefined} nome={animal.nome} tipo={animal.tipo === 'cao' ? 'cao' : 'gato'} /><h2 className="font-bold text-xl">{animal.nome}</h2><dl className="space-y-3">{campos.map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="whitespace-pre-wrap break-words">{value || 'Não informado'}</dd></div>)}</dl></section><AnimalHistorico animalId={animal.id} onStatusChange={setStatus} />{error && <p role="alert">{error}</p>}<nav className="flex gap-4"><Link href={lista} className="underline">Voltar à lista</Link><Link href={'/animais/cadastrar?id=' + animal.id} className="underline">Editar animal</Link><button type="button" disabled={excluindo} onClick={() => setConfirmar(true)} className="text-red-700 underline">{excluindo ? 'Excluindo…' : 'Excluir animal'}</button></nav></main>{confirmar && <ConfirmModal acessivel titulo="Excluir animal" mensagem={'Tem certeza que deseja excluir ' + animal.nome + '?'} labelConfirmar="Excluir" onConfirm={excluir} onCancel={() => setConfirmar(false)} />}<BottomNav /></div>;
}

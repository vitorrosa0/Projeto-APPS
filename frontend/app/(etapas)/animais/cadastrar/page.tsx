"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimalForm from '@/components/AnimalForm';
import AnimalLoader from '@/components/AnimalLoader';
function CadastroAnimal() {
  const params = useSearchParams();
  const id = params.get('id');
  const tipo = params.get('tipo') ?? '';
  return id ? <AnimalLoader key={id} id={id} /> : <AnimalForm key={'novo-' + tipo} tipoInicial={tipo} />;
}
export default function Page() { return <Suspense fallback={<p role="status">Carregando…</p>}><CadastroAnimal /></Suspense>; }

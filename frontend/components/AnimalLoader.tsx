"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Animal } from './AnimalListPage';
import AnimalForm from './AnimalForm';
import AnimalDetails from './AnimalDetails';
interface AnimalLoaderProps { id: string; details?: boolean; }
export default function AnimalLoader({ id, details }: AnimalLoaderProps) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const abort = new AbortController();
    api<Animal>('/animais/' + encodeURIComponent(id), { signal: abort.signal })
      .then(value => { if (!abort.signal.aborted) setAnimal(value); })
      .catch(error => { if (!abort.signal.aborted) setError(error instanceof Error ? error.message : 'Não foi possível carregar o animal.'); });
    return () => abort.abort();
  }, [id]);
  if (error) return <main className="md:ml-56 p-8"><p role="alert">{error}</p><Link href="/animais">Voltar aos animais</Link></main>;
  if (!animal) return <p role="status" className="md:ml-56 p-8">Carregando animal…</p>;
  return details ? <AnimalDetails animal={animal} /> : <AnimalForm animal={animal} />;
}

"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimalLoader from '@/components/AnimalLoader';
function Details() { const id = useSearchParams().get('id'); return id ? <AnimalLoader key={id} id={id} details /> : <main className="p-8"><p role="alert">Animal não informado.</p><Link href="/animais">Voltar aos animais</Link></main>; }
export default function Page() { return <Suspense fallback={<p role="status">Carregando…</p>}><Details /></Suspense>; }

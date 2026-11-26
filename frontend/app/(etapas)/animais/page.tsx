"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdAddCircleOutline } from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";
import { api } from "@/lib/api";
import { contarPorTipo } from "@/lib/animais";

const animalItems = [
  { label: "Cães", tipo: "cao", icon: <PiDogFill size={24} />, href: "/animais/caes" },
  { label: "Gatos", tipo: "gato", icon: <PiCatFill size={24} />, href: "/animais/gatos" },
] as const;

type Totais = { cao: number; gato: number };

export default function Animais() {
  const [totais, setTotais] = useState<Totais | null>(null);
  const [erroTotais, setErroTotais] = useState(false);

  useEffect(() => {
    let ativo = true;
    api<{ tipo?: string | null }[]>("/animais")
      .then((animais) => { if (ativo) setTotais(contarPorTipo(animais)); })
      .catch(() => { if (ativo) setErroTotais(true); });
    return () => { ativo = false; };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden flex flex-col md:ml-56 pb-16 md:pb-0">

      <Header />
      <PawBackground />

      <main className="relative z-10 flex flex-col items-center gap-4 px-6 py-10 flex-1 w-full md:max-w-md md:mx-auto md:py-16">
        {animalItems.map((item) => {
          const total = totais?.[item.tipo];
          return (
            <Link
              key={item.tipo}
              href={item.href}
              aria-label={total === undefined ? item.label : `${item.label}: ${total} ${total === 1 ? "cadastrado" : "cadastrados"}`}
              className="w-full flex items-center justify-between gap-3 bg-[#2DB38B] text-white rounded-full px-6 py-3.5 text-base font-semibold shadow-md hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] transition-all duration-150"
            >
              <span className="flex items-center">{item.icon}</span>
              <span className="flex-1 text-center">{item.label}</span>
              <span className="min-w-10 rounded-full bg-white/25 px-3 py-0.5 text-center text-sm" aria-hidden="true">
                {total ?? (erroTotais ? "–" : "…")}
              </span>
            </Link>
          );
        })}

        {erroTotais && (
          <p role="alert" className="text-sm text-gray-600 text-center">
            Não foi possível carregar os totais de animais.
          </p>
        )}

        <Link
          href="/animais/cadastrar"
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#2DB38B] text-[#2DB38B] rounded-full px-6 py-3 text-base font-semibold shadow-sm hover:bg-[#2DB38B] hover:text-white active:scale-[0.98] transition-all duration-150"
        >
          <MdAddCircleOutline size={22} />
          Cadastrar animal
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}

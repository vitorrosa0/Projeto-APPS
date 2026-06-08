"use client";

import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import {
  MdPets,
  MdPeople,
  MdAttachMoney,
  MdVolunteerActivism,
  MdFavorite,
} from "react-icons/md";


const menuItems = [
  { label: "Animais",       icon: <MdPets size={22} />,              href: "/animais" },
  { label: "Colaboradores", icon: <MdPeople size={22} />,            href: "/colaboradores" },
  { label: "Despesas",      icon: <MdAttachMoney size={22} />,       href: "/despesas" },
  { label: "Doações",       icon: <MdFavorite size={22} />,          href: "/doacoes" },
  { label: "Voluntários",   icon: <MdVolunteerActivism size={22} />, href: "/voluntarios" },
];

const pawPositions = [
  { top: "8%",  left: "72%", size: 18, opacity: 0.12 },
  { top: "15%", left: "15%", size: 14, opacity: 0.10 },
  { top: "28%", left: "80%", size: 16, opacity: 0.10 },
  { top: "42%", left: "8%",  size: 20, opacity: 0.08 },
  { top: "55%", left: "78%", size: 14, opacity: 0.12 },
  { top: "65%", left: "20%", size: 18, opacity: 0.09 },
  { top: "75%", left: "68%", size: 16, opacity: 0.11 },
  { top: "85%", left: "10%", size: 20, opacity: 0.08 },
  { top: "90%", left: "55%", size: 14, opacity: 0.10 },
];

export default function MenuPrincipal() {
  const router = useRouter();

  return (
    /*
     * md:ml-56 → empurra o conteúdo para a direita da sidebar no desktop
     * pb-16    → espaço para a bottom nav no mobile
     */
    <div className="relative min-h-screen bg-gray-100 overflow-hidden md:ml-56 pb-16 md:pb-0">

      <Header />

      {/* Patinhas decorativas */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {pawPositions.map((pos, i) => (
          <MdPets
            key={i}
            size={pos.size}
            style={{ position: "absolute", top: pos.top, left: pos.left, opacity: pos.opacity, color: "#2DB38B" }}
          />
        ))}
      </div>

      {/* Botões do menu */}
      <main className="
        relative z-10
        flex flex-col items-center gap-4
        px-6 py-10
        /* desktop: centraliza e limita largura */
        md:max-w-md md:mx-auto md:py-16
      ">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="
              w-full flex items-center justify-between
              bg-[#2DB38B] text-white
              rounded-full px-6 py-3.5
              text-base font-semibold
              shadow-md
              hover:scale-[1.03] hover:shadow-lg
              active:scale-[0.98]
              transition-all duration-150 cursor-pointer
            "
          >
            <span className="flex-1 text-center">{item.label}</span>
            <span className="flex items-center">{item.icon}</span>
          </button>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
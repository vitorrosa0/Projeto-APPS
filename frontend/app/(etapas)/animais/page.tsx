"use client";

import { useRouter } from "next/navigation";
import { MdPets } from "react-icons/md";
import { PiDogFill, PiCatFill } from "react-icons/pi";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const animalItems = [
  { label: "Cães",  icon: <PiDogFill size={24} />, href: "/animais/caes" },
  { label: "Gatos", icon: <PiCatFill size={24} />, href: "/animais/gatos" },
];

const pawPositions = [
  { top: "8%",  left: "72%", size: 18, opacity: 0.12 },
  { top: "18%", left: "12%", size: 14, opacity: 0.10 },
  { top: "30%", left: "80%", size: 16, opacity: 0.10 },
  { top: "45%", left: "6%",  size: 20, opacity: 0.08 },
  { top: "58%", left: "76%", size: 14, opacity: 0.12 },
  { top: "68%", left: "18%", size: 18, opacity: 0.09 },
  { top: "78%", left: "65%", size: 16, opacity: 0.10 },
];

export default function Animais() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden flex flex-col md:ml-56 pb-16 md:pb-0">

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

      {/* Botões de animais */}
      <main className="
        relative z-10
        flex flex-col items-center gap-4
        px-6 py-10 flex-1
        md:max-w-md md:mx-auto md:py-16
      ">
        {animalItems.map((item) => (
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
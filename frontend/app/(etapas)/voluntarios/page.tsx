"use client";

import { useRouter } from "next/navigation";
import { MdCalendarMonth, MdPeople } from "react-icons/md";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PawBackground from "@/components/PawBackground";

const menuItems = [
  { label: "Agenda",               icon: <MdCalendarMonth size={22} />, href: "/voluntarios/agenda" },
  { label: "Lista de Voluntários", icon: <MdPeople size={22} />,        href: "/voluntarios/lista" },
];

export default function VoluntariosPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden md:ml-56 pb-16 md:pb-0">

      <Header />
      <PawBackground />

      <main className="
        relative z-10
        flex flex-col items-center gap-4
        px-6 py-10
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
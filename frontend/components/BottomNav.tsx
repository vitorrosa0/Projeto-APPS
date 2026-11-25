"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  MdHome,
  MdPets,
  MdPeople,
  MdAttachMoney,
  MdFavorite,
  MdVolunteerActivism,
  MdBadge,
  MdAccountCircle,
  MdBarChart,
} from "react-icons/md";
import { IconType } from "react-icons";
import Image from "next/image";

interface NavItem {
  icon: IconType;
  href: string;
  label: string;
}

// Barra inferior móvel (4 itens conforme Figma)
const mobileNavItems: NavItem[] = [
  { icon: MdHome,          href: "/home",         label: "Início" },
  { icon: MdPets,          href: "/animais",      label: "Animais" },
  { icon: MdVolunteerActivism, href: "/voluntarios", label: "Voluntários" },
  { icon: MdAccountCircle, href: "/perfil",       label: "Perfil" },
];

// Sidebar desktop (acesso completo a todos os módulos)
const desktopNavItems: NavItem[] = [
  { icon: MdHome,          href: "/home",         label: "Início" },
  { icon: MdPets,          href: "/animais",      label: "Animais" },
  { icon: MdPeople,        href: "/colaboradores",label: "Colaboradores" },
  { icon: MdAttachMoney,   href: "/despesas",     label: "Despesas" },
  { icon: MdFavorite,      href: "/doacoes",      label: "Doações" },
  { icon: MdBarChart,      href: "/financeiro",   label: "Financeiro" },
  { icon: MdVolunteerActivism, href: "/voluntarios", label: "Voluntários" },
  { icon: MdBadge,         href: "/funcionarios", label: "Funcionários" },
  { icon: MdAccountCircle, href: "/perfil",       label: "Perfil" },
];

export default function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/" || href === "/home") {
      return pathname === "/" || pathname === "/home";
    }
    if (href === "/perfil") {
      return pathname.startsWith("/perfil") || pathname.startsWith("/funcionarios");
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── MOBILE: bottom bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-[#2DB38B] py-2 pb-[env(safe-area-inset-bottom,8px)] shadow-[0_-2px_10px_rgba(0,0,0,0.12)]">
        {mobileNavItems.map(({ icon: Icon, href, label }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            aria-label={label}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-lg text-white transition-all duration-150 cursor-pointer border-none bg-transparent ${
              isActive(href) ? "opacity-100 scale-110" : "opacity-70 hover:opacity-90"
            }`}
          >
            <Icon size={24} />
            {isActive(href) && (
              <span className="mt-0.5 w-1 h-1 rounded-full bg-white" />
            )}
          </button>
        ))}
      </nav>

      {/* ── DESKTOP: sidebar esquerda ── */}
      <aside className="hidden md:flex flex-col items-start gap-1 fixed left-0 top-0 bottom-0 z-50 w-56 bg-[#2DB38B] pt-20 pb-6 px-3 shadow-[2px_0_12px_rgba(0,0,0,0.10)] overflow-y-auto">

        {/* Logo no topo da sidebar */}
        <div
          onClick={() => router.push("/home")}
          className="absolute top-0 left-0 right-0 flex items-center justify-center px-4 py-3 border-b border-white/20 cursor-pointer"
        >
          <Image
            src="/logo.svg"
            alt="Logo do SJPA"
            width={200}
            height={112}
            className="object-cover h-10 w-auto"
          />
        </div>

        {desktopNavItems.map(({ icon: Icon, href, label }) => {
          const active = href === "/home"
            ? (pathname === "/" || pathname === "/home")
            : pathname.startsWith(href);

          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-150 cursor-pointer border-none ${
                active ? "bg-white/25 shadow-inner" : "bg-transparent hover:bg-white/15"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          );
        })}
      </aside>
    </>
  );
}

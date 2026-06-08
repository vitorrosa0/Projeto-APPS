"use client";

import { useRouter, usePathname } from "next/navigation";
import { MdHome, MdPets, MdFavorite, MdAccountCircle } from "react-icons/md";
import { IconType } from "react-icons";

interface NavItem {
  icon: IconType;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: MdHome,          href: "/",            label: "Início" },
  { icon: MdPets,          href: "/animais",     label: "Animais" },
  { icon: MdFavorite,      href: "/voluntarios", label: "Voluntários" },
  { icon: MdAccountCircle, href: "/perfil",      label: "Perfil" },
];

export default function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();

  const isActive = (href: string): boolean =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── MOBILE: bottom bar ── */}
      <nav className="
        md:hidden
        fixed bottom-0 left-0 right-0 z-50
        flex justify-around items-center
        bg-[#2DB38B]
        py-2 pb-[env(safe-area-inset-bottom,8px)]
        shadow-[0_-2px_10px_rgba(0,0,0,0.12)]
      ">
        {navItems.map(({ icon: Icon, href, label }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            aria-label={label}
            className={`
              flex flex-col items-center justify-center
              px-4 py-1 rounded-lg
              text-white transition-all duration-150
              cursor-pointer border-none bg-transparent
              ${isActive(href) ? "opacity-100 scale-110" : "opacity-70 hover:opacity-90"}
            `}
          >
            <Icon size={24} />
            {isActive(href) && (
              <span className="mt-0.5 w-1 h-1 rounded-full bg-white" />
            )}
          </button>
        ))}
      </nav>

      {/* ── DESKTOP: sidebar esquerda ── */}
      <aside className="
        hidden md:flex
        flex-col items-start gap-1
        fixed left-0 top-0 bottom-0 z-50
        w-56
        bg-[#2DB38B]
        pt-20 pb-6 px-3
        shadow-[2px_0_12px_rgba(0,0,0,0.10)]
      ">
        {/* Logo no topo da sidebar */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-4 border-b border-white/20">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MdPets className="text-white text-xl" />
          </div>
          <span className="text-white font-bold tracking-widest text-lg">SJPA</span>
        </div>

        {navItems.map(({ icon: Icon, href, label }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`
              w-full flex items-center gap-3
              px-4 py-3 rounded-xl
              text-white font-medium text-sm
              transition-all duration-150 cursor-pointer border-none
              ${isActive(href) ? "bg-white/25 shadow-inner" : "bg-transparent hover:bg-white/15"}
            `}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </aside>
    </>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { MdPets, MdArrowBackIos } from "react-icons/md";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({ showBack = false, onBack }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <header className="
      w-full bg-white border-b border-gray-200
      flex items-center justify-center
      px-4 py-3 relative
      md:py-4
    ">
      {showBack && (
        <button
          onClick={handleBack}
          aria-label="Voltar"
          className="
            absolute left-3
            flex items-center gap-0.5
            text-[#2DB38B] text-sm font-medium
            hover:text-[#25967A] transition-colors duration-150
            cursor-pointer bg-transparent border-none
            md:left-6
          "
        >
          <MdArrowBackIos size={15} />
          <span>Voltar</span>
        </button>
      )}

      <div className="flex items-center gap-2">
        <div className="
          w-9 h-9 rounded-full bg-[#2DB38B]
          flex items-center justify-center shadow-sm
          md:w-11 md:h-11
        ">
          <MdPets className="text-white text-[20px] md:text-[26px]" />
        </div>
        <span className="text-xl font-bold tracking-widest text-gray-800 md:text-2xl">
          SJPA
        </span>
      </div>
    </header>
  );
}
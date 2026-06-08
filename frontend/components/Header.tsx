"use client";

import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import Image from "next/image";

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
    <header className="w-full bg-white border-b border-gray-200 flex items-center justify-center px-4 py-3 relative md:py-4">
      {showBack && (
        <button
          onClick={handleBack}
          aria-label="Voltar"
          className="absolute left-3 flex items-center gap-0.5 text-[#2DB38B] text-sm font-medium hover:text-[#25967A] transition-colors duration-150 cursor-pointer bg-transparent border-none md:left-6"
        >
          <MdArrowBackIos size={15} />
          <span>Voltar</span>
        </button>
      )}

      <Image
        src="/logo.svg"
        alt="Logo do SJPA"
        width={200}
        height={112}
        className="object-cover h-10 w-auto md:h-12"
      />
    </header>
  );
}
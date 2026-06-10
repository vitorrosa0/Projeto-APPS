import { PiDogFill, PiCatFill } from "react-icons/pi";

interface AnimalAvatarProps {
  foto?: string;
  nome: string;
  tipo: "cao" | "gato";
}

export default function AnimalAvatar({ foto, nome, tipo }: AnimalAvatarProps) {
  const Icon = tipo === "cao" ? PiDogFill : PiCatFill;

  if (foto) {
    return (
      <img
        src={foto}
        alt={nome}
        className="w-14 h-14 rounded-full object-cover border-2 border-[#2DB38B] flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-14 h-14 rounded-full bg-[#58C2A1]/30 border-2 border-[#2DB38B] flex items-center justify-center flex-shrink-0">
      <Icon size={28} className="text-[#2DB38B]" />
    </div>
  );
}
import { MdEdit, MdRemoveCircle } from "react-icons/md";

interface VoluntarioRowProps {
  nome: string;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function VoluntarioRow({ nome, onEditar, onExcluir }: VoluntarioRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-800">{nome}</span>

      <div className="flex items-center gap-2">
        <button
          onClick={onEditar}
          aria-label={`Editar ${nome}`}
          className="text-[#2DB38B] hover:text-[#25967A] active:scale-90 transition-all cursor-pointer bg-transparent border-none p-0"
        >
          <MdEdit size={22} />
        </button>

        <button
          onClick={onExcluir}
          aria-label={`Excluir ${nome}`}
          className="text-[#2DB38B] hover:text-red-500 active:scale-90 transition-all cursor-pointer bg-transparent border-none p-0"
        >
          <MdRemoveCircle size={22} />
        </button>
      </div>
    </div>
  );
}
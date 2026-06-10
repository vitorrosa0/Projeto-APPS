interface MonthRowProps {
  mes: string;
  atual?: boolean;
  onVerDetalhes: () => void;
}

export default function MonthRow({ mes, atual = false, onVerDetalhes }: MonthRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-700 leading-tight">
        {mes}
        {atual && (
          <>
            <br />
            <span className="text-xs text-gray-400">(Mês atual)</span>
          </>
        )}
      </span>

      <button
        onClick={onVerDetalhes}
        className="bg-[#2DB38B] text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#25967A] active:scale-95 transition-all cursor-pointer"
      >
        Visualizar detalhes
      </button>
    </div>
  );
}
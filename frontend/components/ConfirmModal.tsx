import { MdClose } from "react-icons/md";

interface ConfirmModalProps {
  titulo?: string;
  mensagem: string;
  labelConfirmar?: string;
  labelCancelar?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  titulo = "Confirmar",
  mensagem,
  labelConfirmar = "Confirmar",
  labelCancelar = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-800">{titulo}</h2>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
          >
            <MdClose size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600">{mensagem}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            {labelCancelar}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
          >
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
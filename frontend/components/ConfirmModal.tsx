"use client";
import { useEffect, useRef, useId } from "react";
import { MdClose } from "react-icons/md";

interface ConfirmModalProps {
  acessivel?: boolean;
  titulo?: string;
  mensagem: string;
  labelConfirmar?: string;
  labelCancelar?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  acessivel = false,
  titulo = "Confirmar",
  mensagem,
  labelConfirmar = "Confirmar",
  labelCancelar = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const cancel = useRef(onCancel);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => { cancel.current = onCancel; }, [onCancel]);
  useEffect(() => {
    if (!acessivel) return;
    const opener = document.activeElement;
    const panel = dialog.current;
    panel?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); cancel.current(); }
      if (event.key === 'Tab') {
        const buttons = panel?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !panel?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    const onFocus = (event: FocusEvent) => { if (event.target instanceof Node && !panel?.contains(event.target)) panel?.querySelector<HTMLButtonElement>('button')?.focus(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [acessivel]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <div
        ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}
        className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="font-bold text-base text-gray-800">{titulo}</h2>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
          >
            <MdClose size={20} />
          </button>
        </div>

        <p id={descriptionId} className="text-sm text-gray-600">{mensagem}</p>

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
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdCheckCircle, MdErrorOutline } from "react-icons/md";

export type TipoToast = "sucesso" | "erro";

export interface EstadoToast {
  mensagem: string;
  tipo: TipoToast;
  visivel: boolean;
}

export function useToast(duracaoMs = 3500) {
  const [toast, setToast] = useState<EstadoToast>({ mensagem: "", tipo: "sucesso", visivel: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const mostrarToast = useCallback(
    (mensagem: string, tipo: TipoToast = "sucesso") => {
      setToast({ mensagem, tipo, visivel: true });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast((atual) => ({ ...atual, visivel: false })), duracaoMs);
    },
    [duracaoMs]
  );

  return { toast, mostrarToast };
}

export default function Toast({ mensagem, tipo, visivel }: EstadoToast) {
  const Icone = tipo === "erro" ? MdErrorOutline : MdCheckCircle;
  const cor = tipo === "erro" ? "bg-red-500" : "bg-[#2DB38B]";

  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      aria-hidden={!visivel}
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 ${cor} text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold transition-all duration-300 ${
        visivel ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      {mensagem && (
        <>
          <Icone size={20} />
          {mensagem}
        </>
      )}
    </div>
  );
}

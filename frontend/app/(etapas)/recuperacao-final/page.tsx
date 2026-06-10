"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RecuperacaoFinalPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#4db8a0] px-6 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="overflow-hidden">
          <Image
            src="/logo.svg"
            alt="Logo do SJPA"
            width={200}
            height={112}
            className="object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">SJPA</h1>

        <div className="w-full flex flex-col items-center text-center gap-4">
          <p className="text-2xl font-bold text-gray-900">Link enviado!</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            Enviamos um link de recuperação de senha para o seu email. 
            Verifique sua caixa de entrada e spam.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full py-3.5 rounded-xl bg-[#2e7d62] hover:bg-[#245f4d] active:scale-[0.98] text-white text-sm font-semibold tracking-wide shadow-lg transition-all duration-200"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </main>
  );
}

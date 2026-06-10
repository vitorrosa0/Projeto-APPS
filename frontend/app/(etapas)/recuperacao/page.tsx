"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RecuperacaoPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Solicitação de recuperação para:", email);
      router.push("/recuperacao-final");
    } else {
      alert("Por favor, digite seu e-mail.");
    }
  };

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

        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 mb-2">
            <p className="text-xl font-semibold text-gray-900">Recupere sua conta</p>
            <p className="text-sm text-gray-800 leading-tight">
              Esqueceu sua senha? Digite o e-mail cadastrado na sua conta. 
              Enviaremos um link para você criar uma nova senha.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-900 mb-1">E-mail</p>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full py-3.5 rounded-xl bg-[#2e7d62] hover:bg-[#245f4d] active:scale-[0.98] text-white text-sm font-semibold tracking-wide shadow-lg transition-all duration-200"
          >
            Enviar link
          </button>
        </form>

        <button 
          onClick={() => router.push("/login")}
          className="mt-6 text-sm text-gray-900 cursor-pointer hover:underline"
        >
          Voltar para o login
        </button>
      </div>
    </main>
  );
}

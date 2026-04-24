"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { identifier, password });
  };

  const handleRegisterClick = () => {
    router.push("/cadastro");
  }

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
          <p className="text-base font-semibold text-gray-900 mb-1">Login</p>

          <input
            type="text"
            placeholder="Telefone, nome de usuário ou email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
          />

          <button
            type="submit"
            className="mt-1 w-full py-3.5 rounded-xl bg-[#2e7d62] hover:bg-[#245f4d] active:scale-[0.98] text-white text-sm font-semibold tracking-wide shadow-lg transition-all duration-200"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center flex flex-col gap-2">
            <button className="text-sm text-gray-900 cursor-pointer hover:underline" onClick={handleRegisterClick}>
            Não tem uma conta? Cadastre-se
            </button>

            <button className="text-sm text-gray-900 cursor-pointer hover:underline">
                Esqueceu a senha?
            </button>
        </div>
      </div>
    </main>
  );
}
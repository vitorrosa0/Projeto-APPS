"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!name || !email || !phone || !password) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);
    try {
      const resp = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name, email, telefone: phone, senha: password }),
      });
      const dados = await resp.json();
      if (!resp.ok) {
        setErro(dados.erro || "Não foi possível cadastrar");
        return;
      }
      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));
      router.push("/home");
    } catch {
      setErro("Servidor indisponível. Verifique se a API está rodando.");
    } finally {
      setCarregando(false);
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
          <p className="text-xl font-semibold text-gray-900 mb-1">Crie uma conta</p>
          <div>
            <p className="text-sm text-gray-900 mb-1">Nome</p>
            <input
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
            />
          </div>

          <div>
            <p className="text-sm text-gray-900 mb-1">Email</p>
            <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
            />
          </div>

          <div>
            <p className="text-sm text-gray-900 mb-1">Telefone</p>
            <input
                type="tel"
                placeholder="Digite seu telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
            />
          </div>

          <div>
            <p className="text-sm text-gray-900 mb-1">Senha</p>
            <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/70 transition"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-700 bg-white/80 rounded-lg px-3 py-2 text-center">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="mt-1 w-full py-3.5 rounded-xl bg-[#2e7d62] hover:bg-[#245f4d] active:scale-[0.98] text-white text-sm font-semibold tracking-wide shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <button 
          onClick={() => router.push("/recuperacao")}
          className="mt-6 text-sm text-gray-900 cursor-pointer hover:underline"
        >
            Esqueceu a senha?
        </button>
      </div>
    </main>
  );
}
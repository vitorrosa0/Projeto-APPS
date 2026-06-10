"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";

type StatusType = "Ativo" | "Inativo" | "Pausado";

export default function CadastrarColaboradorPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataAdesao, setDataAdesao] = useState("");
  const [status, setStatus] = useState<StatusType>("Ativo");
  const [ultimaContribuicao, setUltimaContribuicao] = useState("");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");

  const handleSalvar = () => {
    // TODO: salvar no backend
    router.push("/colaboradores");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1a1a2e",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2e2e4e",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#2a2a4a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🐾
        </div>
        <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
          SJPA
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <ChevronLeft size={18} />
          Voltar
        </button>

        <h2
          style={{
            color: "#fff",
            fontSize: 18,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#4dd0b8",
              display: "inline-block",
            }}
          />
          Cadastro de Colaborador
        </h2>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 16,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                border: "3px solid #4dd0b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 32, color: "#aaa" }}>👤</span>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#4dd0b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={14} color="#fff" />
              </div>
            </div>
          </div>

          {/* Campos */}
          <Campo
            label="Nome"
            value={nome}
            onChange={setNome}
            placeholder="Ex: Wilton"
          />
          <Campo
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Ex: wilton-pereira@gmail.com"
            type="email"
          />
          <Campo
            label="Telefone"
            value={telefone}
            onChange={setTelefone}
            placeholder="Ex: (32) 98888-7777"
            type="tel"
          />
          <Campo
            label="Data de adesão"
            value={dataAdesao}
            onChange={setDataAdesao}
            placeholder="Ex: 07/03/2010"
          />

          {/* Status */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 4,
              }}
            >
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #4dd0b8",
                backgroundColor: "#e8faf7",
                fontSize: 13,
                color: "#333",
                outline: "none",
              }}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>

          <Campo
            label="Última contribuição"
            value={ultimaContribuicao}
            onChange={setUltimaContribuicao}
            placeholder="Ex: R$ 1500,00"
          />

          {/* Informações adicionais */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 4,
              }}
            >
              Informações adicionais
            </label>
            <textarea
              value={informacoesAdicionais}
              onChange={(e) => setInformacoesAdicionais(e.target.value)}
              placeholder="Ex: Contribui com rações, vacinas e financeiramente. Também participa de alguns resgates de animais."
              style={{
                width: "100%",
                minHeight: 80,
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #4dd0b8",
                backgroundColor: "#e8faf7",
                fontSize: 13,
                color: "#333",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Botão Salvar */}
          <button
            onClick={handleSalvar}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: "#4dd0b8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav active="colaboradores" />
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 6,
          border: "1px solid #4dd0b8",
          backgroundColor: "#e8faf7",
          fontSize: 13,
          color: "#333",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const router = useRouter();
  const items = [
    { label: "home", icon: "🏠", path: "/" },
    { label: "animais", icon: "🐾", path: "/animais" },
    { label: "voluntarios", icon: "✋", path: "/voluntarios" },
    { label: "colaboradores", icon: "👤", path: "/colaboradores" },
  ];
  return (
    <div
      style={{
        backgroundColor: "#1a1a2e",
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0",
        borderTop: "1px solid #2e2e4e",
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => router.push(item.path)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
            opacity: active === item.label ? 1 : 0.5,
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

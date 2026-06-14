"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, MinusCircle } from "lucide-react";

type StatusType = "Ativo" | "Inativo" | "Pausado";

interface Colaborador {
  id: number;
  nome: string;
  status: StatusType;
  dataAdesao: string;
  ultimaContribuicao: string | number;
}

const statusColor: Record<StatusType, string> = {
  Ativo: "#4CAF50",
  Inativo: "#F44336",
  Pausado: "#FF9800",
};

const mockColaboradores: Colaborador[] = [
  {
    id: 1,
    nome: "Nome",
    status: "Ativo",
    dataAdesao: "14/01/2025",
    ultimaContribuicao: "+1500",
  },
  {
    id: 2,
    nome: "Nome",
    status: "Inativo",
    dataAdesao: "26/03/2025",
    ultimaContribuicao: 0,
  },
  {
    id: 3,
    nome: "Nome",
    status: "Pausado",
    dataAdesao: "10/02/2023",
    ultimaContribuicao: "+1000",
  },
];

export default function ColaboradoresPage() {
  const router = useRouter();
  const [colaboradores, setColaboradores] =
    useState<Colaborador[]>(mockColaboradores);

  const handleRemover = (id: number) => {
    setColaboradores((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#dcdcdc",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2DB38B",
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
            backgroundColor: "#2DB38B",
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
        <h2
          style={{
            color: "#fff",
            fontSize: 20,
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
              backgroundColor: "#2DB38B",
              display: "inline-block",
            }}
          />
          Colaboradores
        </h2>

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {colaboradores.map((col) => (
            <div
              key={col.id}
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0",
                  flexShrink: 0,
                }}
              />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: statusColor[col.status],
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#555" }}>
                    {col.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#333" }}>
                  Adesão: {col.dataAdesao}
                </div>
                <div style={{ fontSize: 13, color: "#333" }}>
                  Última contribuição:
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color:
                      col.ultimaContribuicao === 0
                        ? "#555"
                        : "#4dd0b8",
                    fontWeight: "bold",
                  }}
                >
                  {col.ultimaContribuicao === 0
                    ? "0"
                    : col.ultimaContribuicao}
                </div>
              </div>

              {/* Nome label */}
              <div
                style={{
                  fontSize: 12,
                  color: "#555",
                  minWidth: 40,
                  textAlign: "center",
                }}
              >
                {col.nome}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() =>
                    router.push(`/colaboradores/${col.id}/editar`)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4dd0b8",
                  }}
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleRemover(col.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#f44336",
                  }}
                >
                  <MinusCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Cadastrar */}
        <button
          onClick={() => router.push("/colaboradores/cadastrar")}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "14px",
            backgroundColor: "#2DB38B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Cadastrar <span style={{ fontSize: 20 }}>+</span>
        </button>
      </div>

      {/* Bottom Nav */}
      <BottomNav active="colaboradores" />
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
        backgroundColor: "#2DB38B",
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

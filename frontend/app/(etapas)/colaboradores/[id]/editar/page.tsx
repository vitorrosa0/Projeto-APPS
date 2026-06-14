"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";

type StatusType = "Ativo" | "Inativo" | "Pausado";
type TipoContribuicao = "Financeiro" | "Produto" | "Serviço";

interface Contribuicao {
  valor: string;
  data: string;
  tipo?: TipoContribuicao;
}

const mockContribuicoes: Contribuicao[] = [
  { valor: "R$ 1500,00", data: "10/07/2025" },
  { valor: "R$ 1500,00", data: "10/06/2025" },
  { valor: "R$ 1000,00", data: "10/05/2025" },
  { valor: "R$ 500,00", data: "10/04/2025" },
  { valor: "R$ 250,00", data: "10/03/2025" },
  { valor: "5 Kg de Ração", data: "10/02/2025" },
  { valor: "R$ 900,00", data: "10/01/2024" },
  { valor: "R$ 750,00", data: "10/09/2024" },
  { valor: "R$ 1500,00", data: "10/07/2024" },
];

export default function EditarColaboradorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [nome] = useState("Wilton Pereira Sampaio");
  const [telefone] = useState("(32) 98888-7777");
  const [email] = useState("wilton.pereira@gmail.com");
  const [dataAdesao] = useState("14/01/2025");
  const [status, setStatus] = useState<StatusType>("Ativo");
  const [ultimaContribuicao] = useState("R$ 1500,00");
  const [totalContribuicoes] = useState("R$ 25000,00");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
  const [contribuicoes] = useState<Contribuicao[]>(mockContribuicoes);

  // Estado para o modal de nova contribuição
  const [showNovaContribuicao, setShowNovaContribuicao] = useState(false);
  const [tipoContribuicao, setTipoContribuicao] =
    useState<TipoContribuicao>("Financeiro");
  const [valorContribuido, setValorContribuido] = useState("300,00");
  const [diaContribuicao, setDiaContribuicao] = useState("DD");
  const [mesContribuicao, setMesContribuicao] = useState("MM");
  const [anoContribuicao, setAnoContribuicao] = useState("AAAA");

  const statusColor: Record<StatusType, string> = {
    Ativo: "#4CAF50",
    Inativo: "#F44336",
    Pausado: "#FF9800",
  };

  const handleSalvar = () => {
    // TODO: salvar dados
    router.back();
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
          borderBottom: "1px solid #2DB38B",
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
              backgroundColor: "#2DB38B",
              display: "inline-block",
            }}
          />
          Colaboradores
        </h2>

        {/* Card principal */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 16,
          }}
        >
          {/* Foto + nome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontWeight: "bold", color: "#333" }}>
                Nome: {nome}
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>
                Telefone: {telefone}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "#333", marginBottom: 6 }}>
            Email: {email}
          </div>
          <div style={{ fontSize: 13, color: "#333", marginBottom: 10 }}>
            Data de Adesão: {dataAdesao}
          </div>

          {/* Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13, color: "#333" }}>Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusType)}
              style={{
                padding: "4px 8px",
                borderRadius: 4,
                border: `1px solid ${statusColor[status]}`,
                color: statusColor[status],
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <option value="Ativo">● Ativo</option>
              <option value="Inativo">● Inativo</option>
              <option value="Pausado">● Pausado</option>
            </select>
          </div>

          <div style={{ fontSize: 13, color: "#333", marginBottom: 4 }}>
            Última contribuição:{" "}
            <span style={{ color: "#f44336", fontWeight: "bold" }}>
              {ultimaContribuicao}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#333", marginBottom: 12 }}>
            Total de contribuições:{" "}
            <span style={{ color: "#f44336", fontWeight: "bold" }}>
              {totalContribuicoes}
            </span>
          </div>

          {/* Histórico */}
          <div style={{ fontSize: 13, color: "#333", marginBottom: 6 }}>
            Histórico de contribuições:
          </div>
          <div
            style={{
              maxHeight: 160,
              overflowY: "auto",
              marginBottom: 12,
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "4px 8px",
            }}
          >
            {contribuicoes.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  padding: "3px 0",
                  color: c.valor.includes("Kg") ? "#333" : "#f44336",
                  fontWeight: c.valor.includes("Kg") ? "bold" : "normal",
                }}
              >
                <span>{c.valor}</span>
                <span style={{ color: "#555" }}>{c.data}</span>
              </div>
            ))}
          </div>

          {/* Informações adicionais */}
          <div style={{ fontSize: 13, color: "#333", marginBottom: 4 }}>
            Informações adicionais:
          </div>
          <textarea
            value={informacoesAdicionais}
            onChange={(e) => setInformacoesAdicionais(e.target.value)}
            placeholder="Ex: Contribui com rações, vacinas e financeiramente. Também participa de alguns resgates de animais."
            style={{
              width: "100%",
              minHeight: 72,
              borderRadius: 4,
              border: "1px solid #ccc",
              padding: 8,
              fontSize: 12,
              color: "#555",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />

          {/* Nova Contribuição */}
          <button
            onClick={() => setShowNovaContribuicao(!showNovaContribuicao)}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px",
              backgroundColor: "#2DB38B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Nova Contribuição <Plus size={18} />
          </button>

          {/* Painel Nova Contribuição */}
          {showNovaContribuicao && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ fontSize: 13, color: "#333", marginBottom: 6 }}>
                Tipo de contribuição:
              </div>
              <select
                value={tipoContribuicao}
                onChange={(e) =>
                  setTipoContribuicao(e.target.value as TipoContribuicao)
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                <option value="Financeiro">Financeiro</option>
                <option value="Produto">Produto</option>
                <option value="Serviço">Serviço</option>
              </select>

              <div style={{ fontSize: 13, color: "#333", marginBottom: 6 }}>
                Valor contribuído:
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    padding: "8px",
                    backgroundColor: "#e0e0e0",
                    fontSize: 13,
                  }}
                >
                  R$
                </span>
                <input
                  type="text"
                  value={valorContribuido}
                  onChange={(e) => setValorContribuido(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "none",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ fontSize: 13, color: "#333", marginBottom: 6 }}>
                Data da contribuição:
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[
                  { val: diaContribuicao, set: setDiaContribuicao, label: "DD" },
                  { val: mesContribuicao, set: setMesContribuicao, label: "MM" },
                  {
                    val: anoContribuicao,
                    set: setAnoContribuicao,
                    label: "AAAA",
                  },
                ].map((item) => (
                  <select
                    key={item.label}
                    value={item.val}
                    onChange={(e) => item.set(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      fontSize: 13,
                    }}
                  >
                    <option value={item.label}>{item.label}</option>
                  </select>
                ))}
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#2DB38B",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          gap: 12,
          borderTop: "1px solid #2DB38B",
          backgroundColor: "#2DB38B",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#2DB38B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Sair
        </button>
        <button
          onClick={handleSalvar}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#2DB38B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Salvar
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

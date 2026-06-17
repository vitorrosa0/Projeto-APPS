"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { api } from "@/lib/api";

type StatusType = "Ativo" | "Inativo" | "Pausado";
type TipoContribuicao = "Financeiro" | "Produto" | "Serviço";

interface Contribuicao {
  valor: string;
  data: string;
  tipo?: string;
}

// O backend usa "Servico" (sem cedilha) no enum de tipos.
const TIPO_CONTRIB_MAP: Record<TipoContribuicao, string> = {
  Financeiro: "Financeiro",
  Produto: "Produto",
  Serviço: "Servico",
};

export default function EditarColaboradorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataAdesao, setDataAdesao] = useState("");
  const [status, setStatus] = useState<StatusType>("Ativo");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);

  // Estado para o painel de nova contribuição
  const [showNovaContribuicao, setShowNovaContribuicao] = useState(false);
  const [tipoContribuicao, setTipoContribuicao] =
    useState<TipoContribuicao>("Financeiro");
  const [valorContribuido, setValorContribuido] = useState("");
  const [dataContribuicao, setDataContribuicao] = useState("");
  const [salvandoContrib, setSalvandoContrib] = useState(false);

  const ultimaContribuicao = contribuicoes[0]?.valor ?? "—";

  const carregar = useCallback(() => {
    if (!id) return;
    api<{
      nome: string; email: string; telefone: string; dataAdesao: string;
      status: StatusType; informacoesAdicionais: string | null;
      contribuicoes: Contribuicao[];
    }>(`/colaboradores/${id}`)
      .then((c) => {
        setNome(c.nome);
        setEmail(c.email);
        setTelefone(c.telefone);
        setDataAdesao(c.dataAdesao);
        setStatus(c.status);
        setInformacoesAdicionais(c.informacoesAdicionais ?? "");
        setContribuicoes(c.contribuicoes ?? []);
      })
      .catch((err) => {
        console.error("Erro ao carregar colaborador:", err);
        alert("Não foi possível carregar o colaborador.");
      });
  }, [id]);

  useEffect(() => { carregar(); }, [carregar]);

  const statusColor: Record<StatusType, string> = {
    Ativo: "#4CAF50",
    Inativo: "#F44336",
    Pausado: "#FF9800",
  };

  const handleSalvar = async () => {
    try {
      await api(`/colaboradores/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nome, email, telefone, dataAdesao, status, informacoesAdicionais }),
      });
      router.push("/colaboradores");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert(err instanceof Error ? err.message : "Erro ao salvar.");
    }
  };

  const handleSalvarContribuicao = async () => {
    if (!valorContribuido || !dataContribuicao) {
      alert("Preencha o valor e a data da contribuição.");
      return;
    }
    setSalvandoContrib(true);
    try {
      await api(`/colaboradores/${id}/contribuicoes`, {
        method: "POST",
        body: JSON.stringify({
          tipo: TIPO_CONTRIB_MAP[tipoContribuicao],
          valor: valorContribuido,
          data: dataContribuicao,
        }),
      });
      setValorContribuido("");
      setDataContribuicao("");
      setShowNovaContribuicao(false);
      carregar(); // recarrega histórico
    } catch (err) {
      console.error("Erro ao salvar contribuição:", err);
      alert(err instanceof Error ? err.message : "Erro ao salvar contribuição.");
    } finally {
      setSalvandoContrib(false);
    }
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
              {contribuicoes.length}
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
              <input
                type="date"
                value={dataContribuicao}
                onChange={(e) => setDataContribuicao(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  fontSize: 13,
                  marginBottom: 12,
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={handleSalvarContribuicao}
                disabled={salvandoContrib}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#2DB38B",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: salvandoContrib ? "not-allowed" : "pointer",
                  opacity: salvandoContrib ? 0.6 : 1,
                }}
              >
                {salvandoContrib ? "Salvando…" : "Salvar"}
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

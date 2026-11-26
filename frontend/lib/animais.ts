type TextoOpcional = string | null | undefined;

export interface AnimalBuscavel {
  nome: string;
  raca?: string | null;
  setor?: string | null;
  canil?: string | null;
  cor?: string | null;
  temperamento?: string | null;
}

export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function filtrarAnimais<T extends AnimalBuscavel>(animais: T[], busca: string): T[] {
  const termo = normalizarTexto(busca);
  if (!termo) return animais;

  return animais.filter((animal) =>
    [animal.nome, animal.raca, animal.setor, animal.canil, animal.cor, animal.temperamento].some(
      (campo) => (campo ? normalizarTexto(campo).includes(termo) : false)
    )
  );
}

export interface FiltrosAnimais {
  setor: string;
  sexo: string;
  vacinacao: string;
}

export const FILTROS_VAZIOS: FiltrosAnimais = { setor: "", sexo: "", vacinacao: "" };

type CampoFiltro = keyof FiltrosAnimais;
type AnimalFiltravel = { [campo in CampoFiltro]?: string | null };

export function aplicarFiltros<T extends AnimalFiltravel>(animais: T[], filtros: FiltrosAnimais): T[] {
  const ativos = (Object.keys(filtros) as CampoFiltro[]).filter((campo) => filtros[campo] !== "");
  if (ativos.length === 0) return animais;
  return animais.filter((animal) => ativos.every((campo) => animal[campo] === filtros[campo]));
}

export function opcoesDoCampo(animais: AnimalFiltravel[], campo: CampoFiltro): string[] {
  const valores = new Set<string>();
  for (const animal of animais) {
    const valor = animal[campo]?.trim();
    if (valor) valores.add(valor);
  }
  return [...valores].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export type OrdemAnimais = "nome" | "recentes" | "antigos";

export function ordenarAnimais<T extends { nome: string; createdAt?: string }>(
  animais: T[],
  ordem: OrdemAnimais
): T[] {
  const copia = [...animais];
  if (ordem === "nome") {
    return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
  }
  const instante = (animal: T) => (animal.createdAt ? Date.parse(animal.createdAt) : Number.NaN);
  return copia.sort((a, b) => {
    const ta = instante(a);
    const tb = instante(b);
    if (Number.isNaN(ta)) return Number.isNaN(tb) ? 0 : 1;
    if (Number.isNaN(tb)) return -1;
    return ordem === "recentes" ? tb - ta : ta - tb;
  });
}

export function juntarPreenchidos(partes: TextoOpcional[], separador = " · "): string {
  return partes
    .map((parte) => parte?.trim() ?? "")
    .filter((parte) => parte !== "")
    .join(separador);
}

export function descricaoAnimal(animal: { idade?: string | null; raca?: string | null }): string {
  return juntarPreenchidos([animal.idade, animal.raca]);
}

export function localizacaoAnimal(animal: { setor?: string | null; canil?: string | null }): string {
  const setor = animal.setor?.trim();
  return juntarPreenchidos([setor ? `Setor ${setor}` : null, animal.canil]);
}

export function contarPorTipo(animais: { tipo?: string | null }[]): { cao: number; gato: number } {
  return animais.reduce(
    (total, animal) => {
      if (animal.tipo === "cao") total.cao += 1;
      else if (animal.tipo === "gato") total.gato += 1;
      return total;
    },
    { cao: 0, gato: 0 }
  );
}

export interface AnimalExportavel {
  id: number;
  nome: string;
  tipo?: string | null;
  raca?: string | null;
  idade?: string | null;
  sexo?: string | null;
  setor?: string | null;
  canil?: string | null;
  cor?: string | null;
  temperamento?: string | null;
  vacinacao?: string | null;
  dataVacinacao?: string | null;
  outros?: string | null;
}

const TIPO_ANIMAL: Record<string, string> = { cao: "Cão", gato: "Gato" };

export function formatarData(valor: TextoOpcional): string {
  const texto = valor?.trim() ?? "";
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);
  return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : texto;
}

const COLUNAS_CSV: { titulo: string; valor: (animal: AnimalExportavel) => string }[] = [
  { titulo: "ID", valor: (a) => String(a.id) },
  { titulo: "Nome", valor: (a) => a.nome },
  { titulo: "Tipo", valor: (a) => TIPO_ANIMAL[a.tipo ?? ""] ?? a.tipo ?? "" },
  { titulo: "Raça", valor: (a) => a.raca ?? "" },
  { titulo: "Idade", valor: (a) => a.idade ?? "" },
  { titulo: "Sexo", valor: (a) => a.sexo ?? "" },
  { titulo: "Setor", valor: (a) => a.setor ?? "" },
  { titulo: "Canil", valor: (a) => a.canil ?? "" },
  { titulo: "Cor", valor: (a) => a.cor ?? "" },
  { titulo: "Temperamento", valor: (a) => a.temperamento ?? "" },
  { titulo: "Vacinação", valor: (a) => a.vacinacao ?? "" },
  { titulo: "Data Vacinação", valor: (a) => formatarData(a.dataVacinacao) },
  { titulo: "Outros", valor: (a) => a.outros ?? "" },
];

const SEPARADOR_CSV = ";";
const BOM_UTF8 = "﻿";

function celulaCsv(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

export function gerarCsvAnimais(animais: AnimalExportavel[]): string {
  const linhas = [
    COLUNAS_CSV.map((coluna) => coluna.titulo).join(SEPARADOR_CSV),
    ...animais.map((animal) =>
      COLUNAS_CSV.map((coluna) => celulaCsv(coluna.valor(animal))).join(SEPARADOR_CSV)
    ),
  ];
  return BOM_UTF8 + linhas.join("\r\n");
}

export function nomeArquivoCsv(tipo: "cao" | "gato", data: Date = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${tipo === "cao" ? "caes" : "gatos"}-${ano}-${mes}-${dia}.csv`;
}

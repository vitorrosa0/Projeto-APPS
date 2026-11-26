import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FILTROS_VAZIOS,
  aplicarFiltros,
  normalizarTexto,
  opcoesDoCampo,
  ordenarAnimais,
  contarPorTipo,
  descricaoAnimal,
  filtrarAnimais,
  formatarData,
  gerarCsvAnimais,
  juntarPreenchidos,
  localizacaoAnimal,
  nomeArquivoCsv,
} from "./animais";
import { criarAnimal } from "@/tests/helpers/animais";

const BOM = "﻿";

function linhasDoCsv(csv: string): string[] {
  return csv.slice(BOM.length).split("\r\n");
}

describe("filtrarAnimais", () => {
  it.each(["", "   "])("devolve a lista inteira quando o termo é %j", (busca) => {
    const animais = [criarAnimal({ id: 1 }), criarAnimal({ id: 2, nome: "Mia" })];

    const resultado = filtrarAnimais(animais, busca);

    expect(resultado).toEqual(animais);
  });

  it("ignora raça, setor e canil vazios quando o termo não está no nome", () => {
    const semOpcionais = criarAnimal({ id: 1, nome: "Bolinha" });
    const comRaca = criarAnimal({ id: 2, nome: "Thor", raca: "Labrador" });

    const resultado = filtrarAnimais([semOpcionais, comRaca], "labr");

    expect(resultado).toEqual([comRaca]);
  });

  it.each([
    ["nome", { nome: "Bolinha" }, "bolin"],
    ["raça", { raca: "Vira-lata" }, "vira"],
    ["setor", { setor: "C" }, "c"],
    ["canil", { canil: "Baia 3" }, "baia 3"],
  ])("encontra o animal pelo campo %s", (_campo, dados, busca) => {
    const procurado = criarAnimal({ id: 1, nome: "Rex", ...dados });
    const outro = criarAnimal({ id: 2, nome: "Mia" });

    const resultado = filtrarAnimais([procurado, outro], busca);

    expect(resultado).toEqual([procurado]);
  });

  it("não diferencia maiúsculas de minúsculas", () => {
    const animal = criarAnimal({ raca: "labrador" });

    const resultado = filtrarAnimais([animal], "LABRADOR");

    expect(resultado).toEqual([animal]);
  });

  it("encontra termos acentuados, sem diferenciar maiúsculas", () => {
    const animal = criarAnimal({ raca: "Pastor Alemão" });

    const resultado = filtrarAnimais([animal], "ALEMÃO");

    expect(resultado).toEqual([animal]);
  });

  it("ignora espaços nas pontas do termo", () => {
    const animal = criarAnimal({ nome: "Rex" });

    const resultado = filtrarAnimais([animal], "  rex  ");

    expect(resultado).toEqual([animal]);
  });

  it("devolve lista vazia quando nenhum campo contém o termo", () => {
    const animais = [criarAnimal({ raca: "Labrador", setor: "A", canil: "Baia 1" })];

    const resultado = filtrarAnimais(animais, "zzz");

    expect(resultado).toEqual([]);
  });
});

describe("normalizarTexto", () => {
  it("remove acentos, espaços nas pontas e diferenças de maiúsculas", () => {
    expect(normalizarTexto("  Cão PASTOR Alemão ")).toBe("cao pastor alemao");
  });
});

describe("filtrarAnimais com busca ampliada", () => {
  it("ignora acentos no termo e no valor do campo", () => {
    const animal = criarAnimal({ raca: "Pastor Alemão" });

    expect(filtrarAnimais([animal], "alemao")).toEqual([animal]);
    expect(filtrarAnimais([criarAnimal({ raca: "Pastor Alemao" })], "ALEMÃO")).toHaveLength(1);
  });

  it.each([
    ["cor", { cor: "Caramelo" }, "caramelo"],
    ["temperamento", { temperamento: "Dócil" }, "docil"],
  ])("encontra o animal pelo campo %s", (_campo, dados, busca) => {
    const procurado = criarAnimal({ id: 1, ...dados });
    const outro = criarAnimal({ id: 2, nome: "Mia" });

    expect(filtrarAnimais([procurado, outro], busca)).toEqual([procurado]);
  });
});

describe("aplicarFiltros", () => {
  const rex = criarAnimal({ id: 1, setor: "A", sexo: "Masculino", vacinacao: "Completa" });
  const mia = criarAnimal({ id: 2, nome: "Mia", setor: "B", sexo: "Feminino", vacinacao: "Completa" });
  const bob = criarAnimal({ id: 3, nome: "Bob", setor: "A", sexo: "Masculino", vacinacao: "Incompleta" });

  it("devolve todos quando nenhum filtro está ativo", () => {
    expect(aplicarFiltros([rex, mia, bob], FILTROS_VAZIOS)).toEqual([rex, mia, bob]);
  });

  it.each([
    ["setor", { setor: "A" }, [1, 3]],
    ["sexo", { sexo: "Feminino" }, [2]],
    ["vacinação", { vacinacao: "Incompleta" }, [3]],
  ])("filtra por %s", (_nome, filtro, idsEsperados) => {
    const resultado = aplicarFiltros([rex, mia, bob], { ...FILTROS_VAZIOS, ...filtro });

    expect(resultado.map((a) => a.id)).toEqual(idsEsperados);
  });

  it("combina vários filtros", () => {
    const resultado = aplicarFiltros([rex, mia, bob], { setor: "A", sexo: "Masculino", vacinacao: "Completa" });

    expect(resultado).toEqual([rex]);
  });

  it("exclui animais com o campo vazio quando o filtro está ativo", () => {
    const semSetor = criarAnimal({ id: 4, setor: null });

    expect(aplicarFiltros([semSetor], { ...FILTROS_VAZIOS, setor: "A" })).toEqual([]);
  });
});

describe("opcoesDoCampo", () => {
  it("lista os valores preenchidos, sem repetir e em ordem alfabética", () => {
    const animais = [
      criarAnimal({ id: 1, setor: "C" }),
      criarAnimal({ id: 2, setor: "A" }),
      criarAnimal({ id: 3, setor: "C" }),
      criarAnimal({ id: 4, setor: null }),
      criarAnimal({ id: 5, setor: " " }),
    ];

    expect(opcoesDoCampo(animais, "setor")).toEqual(["A", "C"]);
  });
});

describe("ordenarAnimais", () => {
  const bia = criarAnimal({ id: 1, nome: "bia", createdAt: "2026-11-20T10:00:00.000Z" });
  const ana = criarAnimal({ id: 2, nome: "Ána", createdAt: "2026-11-25T10:00:00.000Z" });
  const caio = criarAnimal({ id: 3, nome: "Caio", createdAt: "2026-11-22T10:00:00.000Z" });
  const semData = criarAnimal({ id: 4, nome: "Zeca" });

  it("ordena por nome sem diferenciar acentos e maiúsculas", () => {
    expect(ordenarAnimais([caio, bia, ana], "nome").map((a) => a.id)).toEqual([2, 1, 3]);
  });

  it("ordena do cadastro mais recente para o mais antigo, com os sem data no fim", () => {
    expect(ordenarAnimais([semData, bia, ana, caio], "recentes").map((a) => a.id)).toEqual([2, 3, 1, 4]);
  });

  it("ordena do cadastro mais antigo para o mais recente, com os sem data no fim", () => {
    expect(ordenarAnimais([semData, ana, bia, caio], "antigos").map((a) => a.id)).toEqual([1, 3, 2, 4]);
  });

  it("não altera a lista original", () => {
    const lista = [caio, bia];

    ordenarAnimais(lista, "nome");

    expect(lista).toEqual([caio, bia]);
  });
});

describe("juntarPreenchidos", () => {
  it("junta só as partes preenchidas com o separador", () => {
    const resultado = juntarPreenchidos(["2 anos", null, "", "  ", undefined, " SRD "]);

    expect(resultado).toBe("2 anos · SRD");
  });

  it("devolve texto vazio quando nenhuma parte está preenchida", () => {
    const resultado = juntarPreenchidos([null, undefined, "", " "]);

    expect(resultado).toBe("");
  });
});

describe("descricaoAnimal", () => {
  it("junta idade e raça com o separador", () => {
    const animal = criarAnimal({ idade: "2 anos", raca: "Vira-lata" });

    expect(descricaoAnimal(animal)).toBe("2 anos · Vira-lata");
  });

  it("mostra só a raça, sem separador solto, quando a idade está vazia", () => {
    const animal = criarAnimal({ idade: null, raca: "Labrador" });

    expect(descricaoAnimal(animal)).toBe("Labrador");
  });

  it("devolve texto vazio quando idade e raça estão vazias", () => {
    expect(descricaoAnimal(criarAnimal())).toBe("");
  });
});

describe("localizacaoAnimal", () => {
  it("mostra o setor com o prefixo e o canil", () => {
    const animal = criarAnimal({ setor: "A", canil: "Baia 1" });

    expect(localizacaoAnimal(animal)).toBe("Setor A · Baia 1");
  });

  it.each([null, "", "  "])("omite o prefixo Setor quando o setor é %j", (setor) => {
    const animal = criarAnimal({ setor, canil: "Baia 2" });

    expect(localizacaoAnimal(animal)).toBe("Baia 2");
  });

  it("devolve texto vazio quando setor e canil estão vazios", () => {
    expect(localizacaoAnimal(criarAnimal())).toBe("");
  });
});

describe("contarPorTipo", () => {
  it("conta cães e gatos separadamente", () => {
    const animais = [
      criarAnimal({ id: 1, tipo: "cao" }),
      criarAnimal({ id: 2, tipo: "gato" }),
      criarAnimal({ id: 3, tipo: "cao" }),
    ];

    expect(contarPorTipo(animais)).toEqual({ cao: 2, gato: 1 });
  });

  it("ignora animais sem tipo ou com tipo fora de cão e gato", () => {
    const animais = [criarAnimal({ id: 1, tipo: null }), criarAnimal({ id: 2, tipo: "ave" })];

    expect(contarPorTipo(animais)).toEqual({ cao: 0, gato: 0 });
  });

  it("devolve zero para lista vazia", () => {
    expect(contarPorTipo([])).toEqual({ cao: 0, gato: 0 });
  });
});

describe("formatarData", () => {
  it("converte aaaa-mm-dd para dd/mm/aaaa", () => {
    expect(formatarData("2026-01-05")).toBe("05/01/2026");
  });

  it.each([null, undefined, "", "  "])("devolve texto vazio quando a data é %j", (valor) => {
    expect(formatarData(valor)).toBe("");
  });

  it("mantém o valor quando ele não está no formato aaaa-mm-dd", () => {
    expect(formatarData("05/01/2026")).toBe("05/01/2026");
  });
});

describe("gerarCsvAnimais", () => {
  it("começa com o BOM UTF-8", () => {
    const csv = gerarCsvAnimais([criarAnimal()]);

    expect(csv.startsWith(BOM)).toBe(true);
  });

  it("gera só o cabeçalho, separado por ponto e vírgula e com a coluna Tipo, para lista vazia", () => {
    const csv = gerarCsvAnimais([]);

    expect(linhasDoCsv(csv)).toEqual([
      "ID;Nome;Tipo;Raça;Idade;Sexo;Setor;Canil;Cor;Temperamento;Vacinação;Data Vacinação;Outros",
    ]);
  });

  it("gera uma linha por animal, separadas por CRLF", () => {
    const csv = gerarCsvAnimais([criarAnimal({ id: 1 }), criarAnimal({ id: 2, nome: "Mia" })]);

    const linhas = linhasDoCsv(csv);

    expect(linhas).toHaveLength(3);
    expect(linhas[1].startsWith('"1";"Rex";')).toBe(true);
    expect(linhas[2].startsWith('"2";"Mia";')).toBe(true);
  });

  it("exporta campos opcionais vazios como células vazias", () => {
    const csv = gerarCsvAnimais([criarAnimal({ id: 7, nome: "Bolinha", tipo: "cao" })]);

    expect(linhasDoCsv(csv)[1]).toBe('"7";"Bolinha";"Cão";"";"";"";"";"";"";"";"";"";""');
  });

  it("traduz o tipo e formata a data de vacinação", () => {
    const csv = gerarCsvAnimais([criarAnimal({ tipo: "gato", dataVacinacao: "2026-11-20" })]);

    const celulas = linhasDoCsv(csv)[1].split(";");

    expect(celulas[2]).toBe('"Gato"');
    expect(celulas[11]).toBe('"20/11/2026"');
  });

  it("mantém os acentos dos valores", () => {
    const csv = gerarCsvAnimais([criarAnimal({ nome: "João", raca: "Pastor Alemão", temperamento: "Dócil" })]);

    expect(linhasDoCsv(csv)[1]).toContain('"João";"Cão";"Pastor Alemão"');
    expect(linhasDoCsv(csv)[1]).toContain('"Dócil"');
  });

  it("escapa aspas e preserva ponto e vírgula dentro da célula", () => {
    const csv = gerarCsvAnimais([criarAnimal({ outros: 'Late "muito"; come bem' })]);

    expect(linhasDoCsv(csv)[1].endsWith('"Late ""muito""; come bem"')).toBe(true);
  });
});

describe("busca e CSV com nome especial e registro antigo", () => {
  const especial = criarAnimal({ id: 1, nome: 'Cão; "A"', tipo: "cao", raca: "SRD" });
  const antigo = criarAnimal({ id: 2, nome: "Antigo", tipo: null });

  it("encontra pela raça e ignora o registro antigo sem opcionais", () => {
    expect(filtrarAnimais([especial, antigo], " srd ")).toEqual([especial]);
    expect(filtrarAnimais([especial, antigo], "ausente")).toEqual([]);
    expect(descricaoAnimal(antigo)).toBe("");
  });

  it("preserva BOM, separador, aspas e quebras de linha CRLF no CSV", () => {
    const csv = gerarCsvAnimais([especial, antigo]);

    expect(csv.startsWith("﻿ID;Nome;Tipo;Raça")).toBe(true);
    expect(csv).toContain('"Cão; ""A""";"Cão";"SRD"');
    expect(csv).toContain("\r\n");
  });
});

describe("nomeArquivoCsv", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["cao", new Date(2026, 10, 26), "caes-2026-11-26.csv"],
    ["gato", new Date(2026, 0, 5), "gatos-2026-01-05.csv"],
  ] as const)("gera o nome para %s com a data informada", (tipo, data, esperado) => {
    expect(nomeArquivoCsv(tipo, data)).toBe(esperado);
  });

  it("usa a data atual quando nenhuma data é informada", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 15, 30));

    expect(nomeArquivoCsv("cao")).toBe("caes-2026-11-26.csv");
  });
});

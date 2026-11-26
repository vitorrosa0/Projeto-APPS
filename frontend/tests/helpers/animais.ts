import type { Animal } from "@/components/AnimalListPage";

export function criarAnimal(dados: Partial<Animal> = {}): Animal {
  return {
    id: 1,
    nome: "Rex",
    tipo: "cao",
    raca: null,
    idade: null,
    sexo: null,
    setor: null,
    canil: null,
    cor: null,
    temperamento: null,
    vacinacao: null,
    dataVacinacao: null,
    foto: null,
    outros: null,
    ...dados,
  };
}

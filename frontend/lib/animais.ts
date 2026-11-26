type TextoOpcional = string | null | undefined;

export interface AnimalBuscavel {
  nome: string;
  raca?: string | null;
  setor?: string | null;
  canil?: string | null;
}

export function filtrarAnimais<T extends AnimalBuscavel>(animais: T[], busca: string): T[] {
  const termo = busca.trim().toLowerCase();
  if (!termo) return animais;

  return animais.filter((animal) =>
    [animal.nome, animal.raca, animal.setor, animal.canil].some(
      (campo) => campo?.toLowerCase().includes(termo) ?? false
    )
  );
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

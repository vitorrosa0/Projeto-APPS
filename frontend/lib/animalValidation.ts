// Mesmas opções de backend/src/animalValidation.js (ANI-04).
export const SEXOS = ["Masculino", "Feminino"];
export const CANIS_POR_SETOR: Record<string, string[]> = {
  A: ["5 Estrelas", "5 Estrelas / Canil 2", "5 Estrelas / Canil 1", "Baia 1", "Baia 2", "Baia 3", "Baia 4", "Baia 5", "Baia 6", "Baia 7", "Canil 1"],
  B: ["5 Estrelas", "5 Estrelas / Canil 2", "5 Estrelas / Canil 1", "Baia 1", "Baia 2", "Baia 3", "Baia 4", "Baia 5", "Baia 6", "Baia 7"],
  C: ["Baia 1", "Baia 2", "Baia 3", "Baia 4"],
  D: ["Baia 1", "Baia 2", "Baia 3"],
  E: ["Baia 1", "Baia 2"],
  F: ["Baia 1", "Baia 2", "Baia 3"],
  G: ["Baia 1", "Baia 2"],
  H: ["Baia 1", "Baia 2"],
  I: ["Baia 1"],
};
export const SETORES = Object.keys(CANIS_POR_SETOR);

interface OpcoesAnimal { sexo?: string | null; setor?: string | null; canil?: string | null; }

/**
 * Confere se sexo, setor e canil estão entre as opções do formulário.
 * Cadastros antigos (anteriores ao ANI-04) podem ter valores fora da lista.
 */
export function validarOpcoes(data: OpcoesAnimal): Record<string, string> {
  const erros: Record<string, string> = {};
  if (data.sexo && !SEXOS.includes(data.sexo)) erros.sexo = "Escolha Masculino ou Feminino.";
  const setorValido = !data.setor || SETORES.includes(data.setor);
  if (!setorValido) erros.setor = "Escolha um setor da lista.";
  if (data.canil) {
    if (!data.setor) erros.canil = "Escolha o setor antes do canil.";
    else if (setorValido && !CANIS_POR_SETOR[data.setor].includes(data.canil)) erros.canil = `Escolha um canil do setor ${data.setor}.`;
  }
  return erros;
}

// Mesmos limites do backend (backend/src/animalValidation.js).
export const LIMITES_TEXTO = { nome: 100, raca: 100, idade: 100, cor: 100, temperamento: 1000, outros: 1000 } as const;
interface AnimalFormValues extends OpcoesAnimal { nome: string; tipo: string; vacinacao: string; dataVacinacao: string; [campo: string]: string | null | undefined; }
export function validarFormulario(data: AnimalFormValues): Record<string,string> {
  const erros: Record<string,string> = validarOpcoes(data);
  if (!data.nome.trim()) erros.nome = 'Informe o nome do animal.';
  if (!['cao','gato'].includes(data.tipo)) erros.tipo = 'Selecione cão ou gato.';
  if (data.dataVacinacao) {
    const dia = data.dataVacinacao;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dia) || !Number.isFinite(Date.parse(dia)) || new Date(dia).toISOString().slice(0,10) !== dia) erros.dataVacinacao = 'Informe uma data válida.';
    else if (dia > new Date().toLocaleDateString('sv-SE')) erros.dataVacinacao = 'A vacinação não pode ter data futura.';
    if (!['Completa','Incompleta'].includes(data.vacinacao)) erros.dataVacinacao = 'Uma data exige vacinação completa ou incompleta.';
  }
  for (const [campo, limite] of Object.entries(LIMITES_TEXTO)) {
    if ((data[campo]?.length ?? 0) > limite && !erros[campo]) erros[campo] = `Use no máximo ${limite} caracteres.`;
  }
  return erros;
}

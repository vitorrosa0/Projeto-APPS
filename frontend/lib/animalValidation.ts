// Mesmos limites do backend (backend/src/animalValidation.js).
export const LIMITES_TEXTO = { nome: 100, raca: 100, idade: 100, cor: 100, temperamento: 1000, outros: 1000 } as const;
interface AnimalFormValues { nome: string; tipo: string; vacinacao: string; dataVacinacao: string; [campo: string]: string; }
export function validarFormulario(data: AnimalFormValues): Record<string,string> {
  const erros: Record<string,string> = {};
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

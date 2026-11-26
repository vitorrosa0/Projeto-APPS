const STATUS = ['Completa', 'Incompleta', 'Não vacinado'];
// Mesmas opções de frontend/components/AnimalForm.tsx.
const SEXOS = ['Masculino', 'Feminino'];
const CANIS_POR_SETOR = {
  A: ['5 Estrelas', '5 Estrelas / Canil 2', '5 Estrelas / Canil 1', 'Baia 1', 'Baia 2', 'Baia 3', 'Baia 4', 'Baia 5', 'Baia 6', 'Baia 7', 'Canil 1'],
  B: ['5 Estrelas', '5 Estrelas / Canil 2', '5 Estrelas / Canil 1', 'Baia 1', 'Baia 2', 'Baia 3', 'Baia 4', 'Baia 5', 'Baia 6', 'Baia 7'],
  C: ['Baia 1', 'Baia 2', 'Baia 3', 'Baia 4'],
  D: ['Baia 1', 'Baia 2', 'Baia 3'],
  E: ['Baia 1', 'Baia 2'],
  F: ['Baia 1', 'Baia 2', 'Baia 3'],
  G: ['Baia 1', 'Baia 2'],
  H: ['Baia 1', 'Baia 2'],
  I: ['Baia 1'],
};
const LIMITE_CURTO = 100;
const LIMITE_LONGO = 1000;
const LIMITES = {
  nome: LIMITE_CURTO, raca: LIMITE_CURTO, idade: LIMITE_CURTO, cor: LIMITE_CURTO,
  temperamento: LIMITE_LONGO, outros: LIMITE_LONGO,
};

function validarOpcoes(data, erros) {
  if (data.sexo && !SEXOS.includes(data.sexo)) erros.sexo = 'Sexo inválido.';
  if (data.setor && !Object.hasOwn(CANIS_POR_SETOR, data.setor)) erros.setor = 'Setor inválido.';
  if (data.canil) {
    if (!data.setor) erros.canil = 'Informe o setor antes do canil.';
    else if (!erros.setor && !CANIS_POR_SETOR[data.setor].includes(data.canil)) erros.canil = `Canil inválido para o setor ${data.setor}.`;
  }
}

function validarTamanhos(data, erros) {
  for (const [campo, limite] of Object.entries(LIMITES)) {
    const valor = data[campo];
    if (typeof valor === 'string' && valor.length > limite && !erros[campo]) erros[campo] = `Use no máximo ${limite} caracteres.`;
  }
}

function validarAnimal(data) {
  const erros = {};
  if (typeof data.nome !== 'string' || !data.nome.trim()) erros.nome = 'Informe o nome do animal.';
  if (!['cao', 'gato'].includes(data.tipo)) erros.tipo = 'Selecione cão ou gato.';
  for (const [campo, valor] of Object.entries(data)) {
    if (valor != null && typeof valor !== 'string' && !['id','createdAt','updatedAt'].includes(campo)) erros[campo] = 'Informe um texto válido.';
  }
  if (data.vacinacao && !STATUS.includes(data.vacinacao)) erros.vacinacao = 'Status de vacinação inválido.';
  validarOpcoes(data, erros);
  validarTamanhos(data, erros);
  const dia = data.dataVacinacao;
  if (dia) {
    const hoje = new Date();
    const limite = [hoje.getFullYear(), String(hoje.getMonth()+1).padStart(2,'0'), String(hoje.getDate()).padStart(2,'0')].join('-');
    if (typeof dia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dia) || !Number.isFinite(Date.parse(dia)) || new Date(dia).toISOString().slice(0,10) !== dia) erros.dataVacinacao = 'Informe uma data válida.';
    else if (dia > limite) erros.dataVacinacao = 'A vacinação não pode ter data futura.';
    if (!['Completa','Incompleta'].includes(data.vacinacao)) erros.dataVacinacao = 'Uma data exige vacinação completa ou incompleta.';
  }
  return erros;
}
module.exports = { validarAnimal, SEXOS, CANIS_POR_SETOR, LIMITE_CURTO, LIMITE_LONGO };

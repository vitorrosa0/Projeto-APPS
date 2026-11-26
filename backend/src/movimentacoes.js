// Regras das entradas e saídas dos animais (ANI-11), sem acesso ao banco.
// Decisões do subgrupo Animais (26/11/2026):
// - tipos e motivos abaixo;
// - só a última movimentação pode ser corrigida ou excluída;
// - animal com histórico não pode ser excluído (registra-se uma saída).

const MOTIVOS = {
  entrada: ['Resgate', 'Devolução de adoção', 'Nascimento no abrigo', 'Transferência recebida'],
  saida: ['Adoção', 'Óbito', 'Fuga', 'Transferência enviada'],
};

const STATUS_POR_SAIDA = {
  'Adoção': 'Adotado',
  'Óbito': 'Falecido',
  'Fuga': 'Desaparecido',
  'Transferência enviada': 'Transferido',
};
const NO_ABRIGO = 'No abrigo';
const LIMITE_OBSERVACAO = 1000;

// Sem movimentações, o animal é considerado no abrigo: os cadastros
// anteriores à ANI-11 não têm registro de entrada.
function statusAtual(ultima) {
  return ultima?.tipo === 'saida' ? STATUS_POR_SAIDA[ultima.motivo] ?? 'Fora do abrigo' : NO_ABRIGO;
}

function hojeLocal() {
  const hoje = new Date();
  return [hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, '0'), String(hoje.getDate()).padStart(2, '0')].join('-');
}

function dataValida(dia) {
  return typeof dia === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dia) && Number.isFinite(Date.parse(dia)) && new Date(dia).toISOString().slice(0, 10) === dia;
}

/**
 * Valida uma movimentação.
 * @param data campos da movimentação (tipo, motivo, data, observacao)
 * @param anterior movimentação imediatamente anterior do animal, ou null
 */
function validarMovimentacao(data, anterior) {
  const erros = {};
  if (!Object.hasOwn(MOTIVOS, data.tipo)) erros.tipo = 'Selecione entrada ou saída.';
  else if (anterior?.tipo === data.tipo) {
    erros.tipo = data.tipo === 'entrada' ? 'O animal já está no abrigo.' : 'O animal já saiu do abrigo.';
  }
  if (!erros.tipo && !MOTIVOS[data.tipo].includes(data.motivo)) erros.motivo = 'Selecione um motivo da lista.';

  if (!dataValida(data.data)) erros.data = 'Informe uma data válida.';
  else if (data.data > hojeLocal()) erros.data = 'A data não pode ser futura.';
  else if (anterior && data.data < anterior.data) erros.data = 'A data não pode ser anterior à última movimentação.';

  if (data.observacao != null && typeof data.observacao !== 'string') erros.observacao = 'Informe um texto válido.';
  else if (data.observacao?.length > LIMITE_OBSERVACAO) erros.observacao = `Use no máximo ${LIMITE_OBSERVACAO} caracteres.`;
  return erros;
}

module.exports = { MOTIVOS, STATUS_POR_SAIDA, NO_ABRIGO, LIMITE_OBSERVACAO, statusAtual, validarMovimentacao };

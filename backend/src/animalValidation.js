const STATUS = ['Completa', 'Incompleta', 'Não vacinado'];
function validarAnimal(data) {
  const erros = {};
  if (typeof data.nome !== 'string' || !data.nome.trim()) erros.nome = 'Informe o nome do animal.';
  if (!['cao', 'gato'].includes(data.tipo)) erros.tipo = 'Selecione cão ou gato.';
  for (const [campo, valor] of Object.entries(data)) {
    if (valor != null && typeof valor !== 'string' && !['id','createdAt','updatedAt'].includes(campo)) erros[campo] = 'Informe um texto válido.';
  }
  if (data.vacinacao && !STATUS.includes(data.vacinacao)) erros.vacinacao = 'Status de vacinação inválido.';
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
module.exports = { validarAnimal };

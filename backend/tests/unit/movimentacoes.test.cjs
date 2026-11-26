const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { MOTIVOS, statusAtual, validarMovimentacao } = require('../../src/movimentacoes');

const entrada = (extra = {}) => ({ tipo: 'entrada', motivo: 'Resgate', data: '2026-03-01', ...extra });
const saida = (extra = {}) => ({ tipo: 'saida', motivo: 'Adoção', data: '2026-03-01', ...extra });

describe('statusAtual', () => {
  test('sem movimentações, o animal está no abrigo', () => {
    assert.equal(statusAtual(null), 'No abrigo');
  });

  test('depois de uma entrada, o animal está no abrigo', () => {
    assert.equal(statusAtual(entrada()), 'No abrigo');
  });

  for (const [motivo, status] of [['Adoção', 'Adotado'], ['Óbito', 'Falecido'], ['Fuga', 'Desaparecido'], ['Transferência enviada', 'Transferido']]) {
    test(`saída por ${motivo} resulta em ${status}`, () => {
      assert.equal(statusAtual(saida({ motivo })), status);
    });
  }
});

describe('validarMovimentacao — tipo e motivo', () => {
  for (const tipo of ['entrada', 'saida']) {
    test(`aceita todos os motivos de ${tipo}`, () => {
      for (const motivo of MOTIVOS[tipo]) assert.deepEqual(validarMovimentacao({ tipo, motivo, data: '2026-03-01' }, null), {}, motivo);
    });
  }

  test('rejeita tipo fora da lista', () => {
    assert.ok(validarMovimentacao(entrada({ tipo: 'outro' }), null).tipo);
  });

  test('rejeita motivo de saída numa entrada', () => {
    assert.ok(validarMovimentacao(entrada({ motivo: 'Adoção' }), null).motivo);
  });
});

describe('validarMovimentacao — sequência', () => {
  test('aceita saída sem histórico (cadastro anterior à ANI-11)', () => {
    assert.deepEqual(validarMovimentacao(saida(), null), {});
  });

  test('rejeita entrada de animal que já está no abrigo', () => {
    assert.equal(validarMovimentacao(entrada(), entrada({ data: '2026-02-01' })).tipo, 'O animal já está no abrigo.');
  });

  test('rejeita saída de animal que já saiu', () => {
    assert.equal(validarMovimentacao(saida(), saida({ data: '2026-02-01' })).tipo, 'O animal já saiu do abrigo.');
  });

  test('aceita entrada depois de uma saída (devolução)', () => {
    assert.deepEqual(validarMovimentacao(entrada({ motivo: 'Devolução de adoção' }), saida({ data: '2026-02-01' })), {});
  });
});

describe('validarMovimentacao — data e observação', () => {
  for (const data of ['', '2026-02-30', '01/03/2026', undefined]) {
    test(`rejeita data inválida ${JSON.stringify(data)}`, () => {
      assert.equal(validarMovimentacao(entrada({ data }), null).data, 'Informe uma data válida.');
    });
  }

  test('rejeita data futura', () => {
    assert.equal(validarMovimentacao(entrada({ data: '2999-01-01' }), null).data, 'A data não pode ser futura.');
  });

  test('rejeita data anterior à última movimentação e aceita o mesmo dia', () => {
    const anterior = saida({ data: '2026-03-01' });
    assert.ok(validarMovimentacao(entrada({ data: '2026-02-28', motivo: 'Devolução de adoção' }), anterior).data);
    assert.equal(validarMovimentacao(entrada({ data: '2026-03-01', motivo: 'Devolução de adoção' }), anterior).data, undefined);
  });

  test('aceita observação até 1000 caracteres e rejeita acima', () => {
    assert.equal(validarMovimentacao(entrada({ observacao: 'a'.repeat(1000) }), null).observacao, undefined);
    assert.ok(validarMovimentacao(entrada({ observacao: 'a'.repeat(1001) }), null).observacao);
  });
});

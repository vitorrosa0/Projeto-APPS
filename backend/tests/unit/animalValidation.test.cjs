const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { validarAnimal, CANIS_POR_SETOR, LIMITE_CURTO, LIMITE_LONGO } = require('../../src/animalValidation');

const valido = (extra = {}) => ({ nome: 'Rex', tipo: 'cao', ...extra });

describe('validarAnimal — campos obrigatórios', () => {
  test('aceita animal com apenas nome e tipo', () => {
    assert.deepEqual(validarAnimal(valido()), {});
  });

  for (const nome of [undefined, '', '   ']) {
    test(`rejeita nome ${JSON.stringify(nome)}`, () => {
      assert.ok(validarAnimal(valido({ nome })).nome);
    });
  }

  for (const tipo of [undefined, '', 'ave']) {
    test(`rejeita tipo ${JSON.stringify(tipo)}`, () => {
      assert.ok(validarAnimal(valido({ tipo })).tipo);
    });
  }
});

describe('validarAnimal — sexo', () => {
  for (const sexo of ['Masculino', 'Feminino', '', null]) {
    test(`aceita sexo ${JSON.stringify(sexo)}`, () => {
      assert.equal(validarAnimal(valido({ sexo })).sexo, undefined);
    });
  }

  for (const sexo of ['M', 'masculino', 'Outro']) {
    test(`rejeita sexo ${JSON.stringify(sexo)}`, () => {
      assert.equal(validarAnimal(valido({ sexo })).sexo, 'Sexo inválido.');
    });
  }
});

describe('validarAnimal — setor e canil', () => {
  test('aceita todas as combinações de setor e canil do formulário', () => {
    for (const [setor, canis] of Object.entries(CANIS_POR_SETOR)) {
      for (const canil of canis) assert.deepEqual(validarAnimal(valido({ setor, canil })), {}, `${setor} × ${canil}`);
    }
  });

  test('aceita setor sem canil', () => {
    assert.deepEqual(validarAnimal(valido({ setor: 'C', canil: '' })), {});
  });

  test('rejeita setor fora da lista', () => {
    assert.equal(validarAnimal(valido({ setor: 'Z' })).setor, 'Setor inválido.');
  });

  test('rejeita canil que não pertence ao setor', () => {
    assert.equal(validarAnimal(valido({ setor: 'I', canil: 'Baia 2' })).canil, 'Canil inválido para o setor I.');
  });

  test('rejeita canil sem setor', () => {
    assert.equal(validarAnimal(valido({ canil: 'Baia 1' })).canil, 'Informe o setor antes do canil.');
  });

  test('não acusa o canil quando o próprio setor já é inválido', () => {
    const erros = validarAnimal(valido({ setor: 'Z', canil: 'Baia 1' }));
    assert.ok(erros.setor);
    assert.equal(erros.canil, undefined);
  });
});

describe('validarAnimal — tamanho dos textos', () => {
  for (const campo of ['nome', 'raca', 'idade', 'cor']) {
    test(`${campo}: aceita ${LIMITE_CURTO} caracteres e rejeita ${LIMITE_CURTO + 1}`, () => {
      assert.equal(validarAnimal(valido({ [campo]: 'a'.repeat(LIMITE_CURTO) }))[campo], undefined);
      assert.equal(validarAnimal(valido({ [campo]: 'a'.repeat(LIMITE_CURTO + 1) }))[campo], `Use no máximo ${LIMITE_CURTO} caracteres.`);
    });
  }

  for (const campo of ['temperamento', 'outros']) {
    test(`${campo}: aceita ${LIMITE_LONGO} caracteres e rejeita ${LIMITE_LONGO + 1}`, () => {
      assert.equal(validarAnimal(valido({ [campo]: 'a'.repeat(LIMITE_LONGO) }))[campo], undefined);
      assert.equal(validarAnimal(valido({ [campo]: 'a'.repeat(LIMITE_LONGO + 1) }))[campo], `Use no máximo ${LIMITE_LONGO} caracteres.`);
    });
  }
});

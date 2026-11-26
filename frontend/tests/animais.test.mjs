import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtrarAnimais, gerarCsvAnimais, descricaoAnimal } from '../lib/animais.ts';
import { validarFormulario } from '../lib/animalValidation.ts';
test('busca por raça e opcionais vazios; CSV preserva BOM, separador e aspas', () => {
  const animais=[{id:1,nome:'Cão; "A"',tipo:'cao',raca:'SRD'}, {id:2,nome:'Antigo',raca:null,setor:null,canil:null}];
  assert.deepEqual(filtrarAnimais(animais,' srd '),[animais[0]]);
  assert.deepEqual(filtrarAnimais(animais,'ausente'),[]);
  assert.equal(descricaoAnimal(animais[1]),'');
  const csv=gerarCsvAnimais(animais);assert.ok(csv.startsWith('\ufeffID;Nome;Tipo;Raça'));assert.ok(csv.includes('"Cão; ""A""";"Cão";"SRD"'));assert.ok(csv.includes('\r\n'));
});
test('valida obrigatórios, datas futuras, datas impossíveis e status incoerente', () => {
  const base={nome:'Nome',tipo:'cao',vacinacao:'',dataVacinacao:''};
  assert.deepEqual(validarFormulario(base),{});
  assert.ok(validarFormulario({...base,nome:'  '}).nome);assert.ok(validarFormulario({...base,tipo:''}).tipo);
  for (const data of [{vacinacao:'Completa',dataVacinacao:'2999-01-01'}, {vacinacao:'Completa',dataVacinacao:'2026-02-30'}, {vacinacao:'Não vacinado',dataVacinacao:'2026-01-01'}, {vacinacao:'',dataVacinacao:'2026-01-01'}]) assert.ok(validarFormulario({...base,...data}).dataVacinacao);
  assert.deepEqual(validarFormulario({...base,vacinacao:'Completa',dataVacinacao:'2026-01-01'}),{});
});

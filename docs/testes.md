# Padrões de Testes e Política de Cobertura

Este documento orienta a escrita e a revisão dos testes unitários do backend, dos testes de integração do backend e dos testes unitários do frontend. Documento da [DOC-11](https://trello.com/c/aiQAFtur), elaborado em 12/10/2026 com base na [arquitetura](arquitetura.md), no [Guia de Contribuição](../CONTRIBUTING.md) e na configuração atual da aplicação.

> **Situação:** proposta da Documentação, pendente de revisão e validação dos subgrupos. As ferramentas e metas abaixo ainda não são decisões confirmadas. As obrigações passam a ser exigidas após a validação e a disponibilização da infraestrutura correspondente. Até lá, continuam valendo as validações atuais do Guia de Contribuição, seção 6.3.

| Marcação | Significado após validação |
|---|---|
| **Obrigatório** | Critério de desenvolvimento e revisão; o descumprimento exige ajuste ou exceção explícita prevista neste documento. |
| **Recomendado** | Boa prática que pode ser sugerida na revisão, sem bloquear a PR por si só. |
| **Livre** | Escolha do subgrupo dentro das regras comuns. |

## 1. Escopo e situação atual

Conferência em 12/10/2026: os arquivos `backend/package.json` e `frontend/package.json` não têm scripts de testes nem de cobertura. Não há suítes de testes versionadas. O frontend oferece lint e build; o backend usa Express, Prisma e SQLite, com módulos CommonJS (`require` e `module.exports`).

Esta tarefa define como desenvolver e avaliar testes. Instalar ferramentas, configurar banco de testes e criar suítes são trabalhos de implementação posteriores. Pipeline, avisos automáticos na PR e automação de navegação no frontend ficam como evolução futura, a tratar em tarefas e documentação próprias quando forem priorizados.

Testes unitários também são automatizados: o código executa as verificações. A automação de interface de ponta a ponta, que controla um navegador e percorre o sistema completo, é uma evolução futura e poderá ter documentação própria. O roteiro manual do fluxo completo continua necessário conforme o Guia de Contribuição.

## 2. Tipos de testes

| Tipo | O que verifica | Dependências | Exemplo no projeto |
|---|---|---|---|
| Unitário do backend | Uma função ou um comportamento do controller, isoladamente. | Prisma e outras fronteiras substituídos por dublês quando necessário; sem banco real. | Rejeitar cadastro de animal sem nome, sem chamar a persistência. |
| Integração do backend | A colaboração entre rota, controller, middleware e persistência. | Aplicação Express real e banco exclusivo de testes com Prisma real. | Enviar `POST /animais`, conferir resposta 201 e registro gravado. |
| Unitário do frontend | Uma função, hook ou componente isolado dos serviços externos. | API e navegação simuladas quando necessárias. | Conferir a mensagem apresentada pelo componente quando a API falha. |
| Ponta a ponta (E2E) | O fluxo completo pela interface, passando por frontend, backend e banco. | Sistema funcionando em ambiente controlado. | Cadastrar um animal na tela e encontrá-lo na listagem. |

**Obrigatório:** identificar o tipo pela fronteira exercitada. Um teste HTTP com Prisma simulado verifica a integração da camada HTTP, mas não comprova persistência real; registrar essa limitação e complementar com os testes de banco aplicáveis.

**Por quê:** cada tipo encontra falhas diferentes. Um resultado unitário não prova que rotas e banco funcionam juntos, e um fluxo manual não substitui as verificações isoladas das regras.

## 3. Escrita e organização

### 3.1 Arrange–Act–Assert (AAA)

**Obrigatório:** organizar cada teste em três etapas reconhecíveis:

1. **Arrange (preparar):** criar os dados e configurar as dependências necessárias.
2. **Act (executar):** chamar o comportamento avaliado.
3. **Assert (verificar):** comparar o resultado com o comportamento esperado.

**Obrigatório:** verificar um comportamento por teste. Várias asserções são permitidas quando comprovam o mesmo resultado, como status 400, mensagem de validação e ausência de gravação para uma requisição inválida. Cadastro, edição e remoção são comportamentos diferentes e devem ter testes separados.

**Recomendado:** testes curtos, com preparação legível. Comentários AAA ajudam quando a separação não for evidente; não são exigidos em todo teste.

### 3.2 Nomes e arquivos

**Obrigatório:** nomear o teste em português, indicando resultado e condição: `rejeita cadastro quando o nome está ausente`. Usar `describe` para agrupar a unidade ou a operação, por exemplo `POST /animais`.

**Obrigatório:** adotar esta organização ao configurar as suítes:

```text
backend/tests/unit/animaisController.test.js
backend/tests/integration/animais.test.js
backend/tests/helpers/                   # fábricas, preparação e limpeza
frontend/lib/api.test.ts                 # junto da função testada
frontend/components/NomeDoComponente.test.tsx
frontend/app/(etapas)/animais/cadastrar/page.test.tsx
frontend/tests/helpers/                 # apoio compartilhado
```

Os nomes de componentes no exemplo são ilustrativos. Testes de hooks seguem `useNome.test.ts` ou `.test.tsx`, conforme a necessidade de JSX. As configurações devem distinguir testes unitários e de integração do backend para permitir executar cada suíte separadamente.

**Recomendado:** criar fábricas de dados com valores padrão válidos e permitir sobrescrever só o campo relevante ao caso. Evitar helpers que escondam a ação ou as asserções.

### 3.3 Exemplos corretos e inadequados

Exemplo correto, ilustrativo e independente de ferramenta. `criarComDependencias` representa uma preparação que fornece o controller com a persistência simulada; esse helper ainda não existe no projeto.

```js
test("rejeita cadastro quando o nome está ausente", async () => {
  // Arrange
  const { criar, req, res, next, persistencia } = criarComDependencias({
    body: { tipo: "cao" },
  });

  // Act
  await criar(req, res, next);

  // Assert: todas as verificações comprovam a mesma rejeição
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    erro: "Nome e tipo são obrigatórios",
  });
  expect(persistencia.animal.create).not.toHaveBeenCalled();
});
```

Exemplo inadequado:

```js
test("funciona", async () => {
  const animal = await cadastrarAnimal();
  expect(animal).toBeTruthy();
  await editarAnimal(animal.id);
  expect(await buscarAnimal(animal.id)).toBeTruthy();
  await removerAnimal(animal.id);
});
```

O segundo teste mistura três operações, tem nome impreciso, verifica apenas a existência dos retornos e não comprova a remoção. Dividir em testes de cadastro, edição e remoção, cada um preparando seus próprios dados e verificando campos ou efeitos específicos.

**Obrigatório:** esperar operações assíncronas com `await` ou retornar a promessa. Uma asserção executada depois do término do teste pode deixar passar uma falha.

## 4. Independência, dados e dependências

**Obrigatório:** cada teste deve passar sozinho, em outra ordem e na suíte completa. Nenhum teste usa como pré-condição os dados criados por outro. Preparar e limpar recursos nos ciclos de início e fim oferecidos pela ferramenta, inclusive após falhas.

**Obrigatório:** usar dados fictícios próprios. Não usar banco de desenvolvimento, homologação ou produção, dados reais da ONG, credenciais pessoais ou chamadas a serviços externos. Não versionar bancos temporários, segredos ou relatórios de cobertura.

**Obrigatório:** controlar as fontes de variação relevantes: relógio, fuso horário, números aleatórios, identificadores e respostas externas. Fixar o instante de referência em testes de datas e restaurar relógio, variáveis de ambiente, mocks e armazenamento local após cada caso. Não usar esperas arbitrárias para sincronizar tarefas; aguardar o evento ou a promessa responsável pelo resultado.

**Obrigatório:** nos testes unitários, simular apenas as fronteiras necessárias. Usar um mock (substituição com comportamento e chamadas verificáveis) para Prisma, `fetch` ou navegação quando o teste não deve executar essas dependências. Um stub é uma resposta controlada; um spy observa chamadas. Não simular a própria função que se pretende testar.

**Obrigatório:** nos testes de integração de persistência, usar Prisma e banco reais exclusivos dos testes, aplicar as migrations versionadas e criar os dados necessários a cada cenário. Limpar respeitando as relações entre tabelas, fechar conexões e impedir colisões entre execuções paralelas. Usar um banco por execução ou isolamento equivalente; compartilhar um banco exige execução serial e limpeza controlada.

**Ajustes necessários antes de implementar:** `backend/src/server.js` inicia a escuta ao ser importado; separar a aplicação Express da inicialização do servidor para testá-la. `backend/src/prisma.js` fixa o caminho em `backend/dev.db`; definir uma configuração ou injeção de dependência para o banco de testes, com verificação que recuse caminhos dos outros ambientes antes de qualquer limpeza. Alterar somente `DATABASE_URL` não isola esse cliente atual. Respeitar as regras de migrations do Guia de Contribuição, seção 2.5.

**Por quê:** um teste reproduzível falha por um defeito observável, sem depender de rede, horário ou resíduos de outra execução.

## 5. Seleção de cenários

**Obrigatório:** derivar cenários das regras e dos contratos definidos, cobrindo sucesso, classes de equivalência, limites, entradas inválidas e erros aplicáveis. Não inventar uma regra de negócio para preencher um teste; registrar a dúvida e confirmar com o grupo responsável ou a ONG.

| Técnica | Como aplicar | Exemplo |
|---|---|---|
| Classes de equivalência | Agrupar entradas que deveriam produzir o mesmo comportamento e escolher representantes. | Para tipo de animal: `cao`, `gato` e um valor fora do conjunto, como `ave`. Testar os dois valores válidos quando houver caminhos específicos. |
| Valores limite | Testar o limite e os valores imediatamente abaixo e acima dele. | Se uma regra aprovada exigir valor maior que zero: negativo, zero e menor valor positivo aceito. Essa regra é ilustrativa, não uma definição do Financeiro. |
| Entradas inválidas | Verificar ausência, vazio, formato ou tipo incorreto conforme o contrato. | Nome ausente no cadastro de animal; token malformado quando a proteção da rota estiver implementada. |
| Erros e efeitos | Verificar a falha, a resposta e a ausência de efeitos indevidos. | Cadastro rejeitado não grava; falha de persistência segue para o tratamento de erro. |

**Recomendado:** usar testes parametrizados para casos com a mesma estrutura, produzindo um resultado identificável por entrada. Não substituir vários cenários por uma asserção genérica.

**Inadequado:** testar apenas `cao` e concluir que toda a validação do tipo está coberta; repetir dez nomes válidos sem testar nome ausente; criar testes que confirmem uma falha conhecida como se fosse requisito aceito.

**Obrigatório:** ao corrigir um defeito, incluir um teste de regressão que falhe com o comportamento anterior e passe com a correção. Documentar limitações do código atual; não afirmar que controles ainda ausentes, como proteção das rotas dos módulos, já estão testados.

### 5.1 Prioridades por camada

- **Backend unitário:** validações e caminhos dos controllers, regras extraídas em funções quando necessário, transformação de dados e encaminhamento de erros. A arquitetura atual não obriga criar uma camada de serviços apenas para escrever testes.
- **Backend integrado:** contratos HTTP, filtros, cadastro/consulta/edição/remoção, integridade dos vínculos, duplicidade de cadastro, login e ausência de senha/hash na resposta. Verificar o efeito no banco; um status correto sozinho não comprova gravação.
- **Frontend unitário:** utilitários (`api()` inclusive), validação local existente, montagem dos dados enviados, hooks e componentes com comportamento. Verificar carregamento, sucesso, vazio e erro quando aplicáveis; simular API, sem exigir servidor real. Nas telas de doações com dados mockados, os testes não comprovam integração financeira.

**Recomendado:** em componentes React, procurar elementos por papel e nome acessível e simular ações do usuário. Preferir resultados visíveis a detalhes do estado interno, classes CSS ou snapshots extensos. Layout responsivo continua sendo conferido manualmente.

## 6. Ferramentas e comandos

### 6.1 Para que serve o Vitest

O [Vitest](https://vitest.dev/guide/) é uma ferramenta que encontra e executa testes JavaScript/TypeScript, apresenta os resultados e oferece recursos para asserções e simulação de dependências. A medição de cobertura usa um provedor adicional, conforme a [documentação de cobertura](https://vitest.dev/guide/coverage.html).

**Proposta para o frontend:** avaliar a adoção de Vitest com React Testing Library para testar componentes e funções. O [guia oficial do Next.js](https://nextjs.org/docs/app/guides/testing/vitest) documenta essa combinação, com configuração de JSX, aliases e ambiente DOM simulado (`jsdom`). A Testing Library auxilia a renderização e interação; o Vitest executa os testes. Isso não exige que a aplicação passe a usar Vite no build.

**Limitação:** o guia do Next.js informa que componentes de servidor assíncronos não são suportados pelo Vitest. Se houver um caso assim, testar separadamente a lógica extraível e registrar o restante como lacuna, mantendo o roteiro manual. A automação E2E fica para a evolução futura.

**Decisão da equipe de backend (Livre):** os integrantes que desenvolvem o backend escolhem o executor e as bibliotecas de apoio aos testes unitários e de integração. A escolha permanece pendente e deve atender aos padrões de isolamento, execução reproduzível e medição de cobertura deste documento. Registrar a ferramenta escolhida, a justificativa e as instruções de uso na DT-06 e na documentação do backend.

**Orientação para essa escolha:** o uso atual de `require()` exige atenção: o [mock de módulos do Vitest](https://vitest.dev/guide/mocking/modules) não substitui módulos carregados por `require()`. Considerar a compatibilidade com CommonJS e a necessidade de injeção de dependências. Para testes HTTP, [Supertest](https://github.com/forwardemail/supertest) é uma opção de apoio que permite enviar requisições à aplicação Express; ele não substitui o executor nem o banco de testes. Essas referências apoiam a avaliação da equipe, sem definir uma ferramenta obrigatória para o backend.

**Obrigatório antes da adoção:** os subgrupos validam um teste unitário representativo em cada camada, um teste integrado com banco isolado e um relatório que inclua arquivos não exercitados. Conferir a compatibilidade das versões com Node, Next.js e Prisma, registrar a escolha na [DT-06](decisoes-tecnicas.md#dt-06--testes-automatizados) e versionar dependências, lockfiles, configurações e instruções de execução na tarefa de implementação.

### 6.2 Disponível hoje e configuração futura

| Situação | Comandos | Observação |
|---|---|---|
| Disponível no frontend | `npm run lint`, `npm run build` | Conferem código e compilação; não medem cobertura. |
| Disponível no backend | `npm run dev` | Inicializa o servidor; não executa testes. |
| Proposta após configuração, em cada pasta | `npm run test`, `npm run test:coverage` | Devem executar uma vez e terminar; ainda não existem. |
| Proposta após configuração, no backend | `npm run test:unit`, `npm run test:integration` | Permitem separar as suítes; ainda não existem. |

**Recomendado:** oferecer `test:watch` para desenvolvimento local. Em uma futura configuração com Vitest, `test` pode usar `vitest run` e `test:coverage`, `vitest run --coverage`, após instalação do provedor e configuração do escopo. Não tratar esses exemplos como comandos já disponíveis.

## 7. Política de cobertura

### 7.1 Métricas e metas propostas

Cobertura mede quanto código foi exercitado, não se as asserções comprovam o resultado correto. **Obrigatório:** avaliar também os cenários da seção 5; atingir uma porcentagem não dispensa testes de erros, limites e regras relevantes.

| Métrica | O que mede | Meta mínima proposta |
|---|---|---|
| Linhas | Linhas executáveis exercitadas. | 80% |
| Instruções (statements) | Instruções executadas. | 80% |
| Funções | Funções chamadas. | 80% |
| Ramificações (branches) | Alternativas de condições percorridas. | 70% |

**Justificativa:** metas iniciais permitem adoção gradual em uma base sem testes. A meta de ramificações é menor pelo esforço adicional de preparar caminhos alternativos, mas os comportamentos críticos continuam obrigatórios. Os percentuais são uma proposta de engenharia, sem medição atual que comprove sua viabilidade; os grupos devem validá-los com suítes representativas antes de confirmá-los.

**Obrigatório após validação e configuração:** aplicar as quatro metas a cada arquivo novo de código executável dentro do escopo. Não compensar um arquivo novo sem testes com a média alta de outro arquivo.

### 7.2 Escopo do relatório e exclusões

**Obrigatório:** incluir todos os arquivos executáveis de produção do escopo, mesmo os que nenhum teste importa; eles devem aparecer como não cobertos, conforme a capacidade/configuração do provedor. Medir frontend e backend separadamente; não calcular uma média única entre as duas aplicações.

- **Backend:** `src/**/*.js`, incluindo controllers, rotas e tratamento de erros. Combinar a cobertura unitária e de integração por meio da ferramenta configurada, sem somar percentuais ou contagens duplicadas.
- **Frontend:** `app/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}` e `lib/**/*.{ts,tsx}`, além de novas pastas de lógica de produção, como hooks. Incluir páginas e componentes com comportamento; não excluir uma pasta inteira por ser difícil de testar.

**Exclusões permitidas:** testes e helpers de teste; declarações de tipos (`*.d.ts`); dependências e código gerado (`node_modules`, `.next`, cliente Prisma); arquivos de configuração de ferramentas; migrations SQL; seed de preparação. Esses itens não compõem o código da aplicação medido nesta política. Lógica própria relevante no seed ou na configuração pode exigir verificações específicas, mesmo fora do percentual.

**Exceção:** arquivos que só inicializam servidor/conexão ou só exportam metadados podem ser excluídos após conferência do revisor, com caminho e justificativa na configuração e na PR. Não excluir junto validação, tratamento de erros ou regras de negócio. Código sem teste, código legado e componentes assíncronos sem suporte não são exclusões automáticas; registrar as lacunas e o plano de tratamento.

**Obrigatório:** qualquer exclusão adicional depende de justificativa por arquivo e aceite explícito do revisor, registrado na PR. Não usar exclusões ou comentários de ignorar cobertura apenas para atingir a meta. Configuração e exclusões devem ser iguais nas execuções do autor e do revisor.

### 7.3 Código existente e adoção gradual

**Obrigatório:** na implantação inicial, gerar e registrar a linha de base por aplicação e por arquivo. Hoje a cobertura está **não medida**; não apresentar 0% como resultado de uma execução inexistente.

**Obrigatório:** arquivos existentes alterados recebem testes dos comportamentos modificados e regressões aplicáveis, sem reduzir os percentuais anteriores de cada arquivo afetado nem os totais da aplicação. A referência é a versão base da PR medida com a mesma configuração. Enquanto estiverem abaixo das metas, registrar evolução e lacunas; arquivos existentes não alterados permanecem visíveis no relatório, com tratamento gradual nas tarefas dos módulos.

**Recomendado:** atingir as metas no arquivo existente ao modificá-lo e priorizar cadastro/login, validações, persistência e contribuições antes de componentes apenas de apresentação.

**Exceção de transição:** se um arquivo existente alterado ainda não atingir as metas, ou uma alteração legítima reduzir uma métrica, o autor registra valores antes/depois, motivo, cenários cobertos e uma tarefa de continuidade com responsável. O revisor precisa aceitar expressamente a exceção. Ela não dispensa testes do comportamento novo nem de correção de defeitos. Para arquivo novo, desvio da meta também exige esse registro e aceite; não é dispensa automática.

## 8. Execução e evidências na PR

**Obrigatório após configuração:** o autor executa localmente as suítes aplicáveis e a cobertura completa da aplicação alterada antes de pedir revisão. O revisor também executa localmente sobre a mesma versão da PR. Registrar o SHA com `git rev-parse HEAD`, as versões de Node/npm, os comandos, os resultados e as limitações. Após ajustes, repetir a validação da versão final afetada; resultados de um commit anterior não comprovam a versão atual.

**Obrigatório:** usar instalação reproduzível com o lockfile (`npm ci`), a mesma configuração e dados de teste. Se houver diferença entre resultados, esclarecer antes da aprovação. Falhas de teste não são compensadas por um percentual alto.

Modelo de evidência, a preencher pelo autor e pelo revisor, sem inventar resultados:

```text
Responsável e papel (autor/revisor):
SHA da versão avaliada:
Node / npm:
Aplicação e configuração/provedor de cobertura:
Comandos executados:
Testes: passaram / falharam / não executados (motivo)
Cobertura: linhas __%; instruções __%; funções __%; ramificações __%
Arquivos novos: valores por arquivo e atendimento às metas
Arquivos existentes alterados: base → versão atual, por métrica
Lacunas, exclusões e exceções: caminhos, motivos e aceite
Relatório: evidência anexada à PR, sem commit de arquivos gerados
Continuidade: cartão, responsável e escopo pendente
```

**Exceção enquanto não houver infraestrutura:** registrar testes e cobertura como não executados, com o motivo e as tarefas necessárias. Manter a validação manual e os comandos disponíveis do Guia de Contribuição. A ausência da ferramenta não deve ser descrita como aprovação da cobertura.

**Exceção documental:** PRs exclusivamente de documentação, como esta, dispensam testes e cobertura da aplicação. Conferir conteúdo, links e formatação, conforme o Guia de Contribuição, seção 6.3, e o [guia do Trello](trello.md#8-critérios-de-conclusão-e-evidências).

## 9. Validação e conclusão da DOC-11

Esta versão documenta os padrões, avalia o Vitest e propõe metas. A escolha do executor do backend cabe à equipe de backend; a proposta de ferramenta do frontend depende da avaliação de seus responsáveis. Os percentuais e as regras de adoção gradual dependem de validação dos subgrupos. A implementação da infraestrutura deve ser acompanhada em tarefas próprias, e a automação E2E e o pipeline permanecem como evolução futura.

| Grupo | Situação | O que validar |
|---|---|---|
| Documentação | Pendente | Clareza, coerência com os guias e evidências de revisão. |
| Animais | Pendente | Cenários, isolamento do backend, ferramentas e metas em testes representativos. |
| Colaboradores | Pendente | Persistência, vínculos de contribuições, cenários e metas. |
| Financeiro | Pendente | Testes unitários das telas atuais e aplicação futura ao backend quando implementado. |

**Obrigatório para concluir o cartão:** registrar revisão humana, validações ou limitações aplicáveis, documento versionado e PR interna revisada e integrada à `documentacao/main` (ou evidência equivalente prevista no Guia de Contribuição). Registrar as contribuições individuais e as evidências acadêmicas no cartão/PR. A integração do épico em `develop` acontece depois, conforme o fluxo do projeto.

Quando ferramentas e metas forem confirmadas, atualizar este documento e a DT-06 com a decisão e sua evidência. A documentação deve continuar distinguindo práticas implementadas de propostas futuras.

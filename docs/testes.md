# Padrões de Testes e Política de Cobertura

Este documento orienta a escrita e a revisão dos testes unitários do backend, dos testes de integração do backend e dos testes unitários do frontend. Documento da [DOC-11](https://trello.com/c/aiQAFtur), elaborado em 12/10/2026 com base na [arquitetura](arquitetura.md), no [Guia de Contribuição](../CONTRIBUTING.md) e na configuração atual da aplicação.

> **Situação:** proposta da Documentação, pendente de revisão e validação dos subgrupos. As ferramentas e metas abaixo ainda não são decisões confirmadas. As obrigações passam a ser exigidas após a validação e a disponibilização da infraestrutura correspondente. Até lá, continuam valendo as validações atuais do [Guia de Contribuição, seção 6.3](../CONTRIBUTING.md#63-validações-antes-de-abrir).

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

**Justificativa:** no backend, as pastas `tests/unit/` e `tests/integration/` separam suítes com pré-requisitos diferentes, principalmente o uso do banco. No frontend, manter o teste próximo da função, hook, página ou componente facilita encontrá-lo e atualizá-lo junto do código. `frontend/tests/helpers/` concentra somente o apoio reutilizado entre esses testes; não é uma segunda localização para as suítes. Os helpers de ambas as áreas ficam fora da medição de código de produção.

**Recomendado:** criar fábricas de dados com valores padrão válidos e permitir sobrescrever só o campo relevante ao caso. Evitar helpers que escondam a ação ou as asserções.

### 3.3 Exemplos corretos e inadequados

Exemplo de estrutura correta após implementar o isolamento proposto na [seção 4](#4-independência-dados-e-dependências), ainda sujeito à validação da DT-13. É um exemplo ilustrativo, com asserções compatíveis com Vitest/Jest, e não um teste executável na configuração atual. `criarComDependencias` representa um helper futuro que fornece o controller real com a persistência simulada, mediante injeção de dependência ou substituição compatível com CommonJS antes de carregar o controller. Hoje `criar` importa o Prisma diretamente com `require()`; esse helper e o mecanismo de isolamento ainda não existem. Usar `vi.mock` sozinho não resolve essa dependência.

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

**Pendência de implementação — propostas para validação na [DT-13](decisoes-tecnicas.md#dt-13--estrutura-de-pastas) e na [arquitetura, seção 4.2](arquitetura.md#42-sugestões-para-proposta-de-evolução-cenário-futuro--produção):**

- **Integração HTTP:** `backend/src/server.js` inicia a escuta ao ser importado. Propõe-se separar a criação/exportação da aplicação Express da inicialização com `listen`, para enviar requisições de teste sem abrir a porta fixa do servidor.
- **Integração com persistência:** `backend/src/prisma.js` fixa o caminho em `backend/dev.db`. Propõe-se uma configuração ou injeção de dependência para o banco de testes, com verificação que recuse caminhos dos outros ambientes antes de qualquer limpeza. Alterar somente `DATABASE_URL` não isola esse cliente atual.
- **Unitários dos controllers:** eles carregam o Prisma diretamente por `require()`. Propõe-se permitir fornecer a persistência ao controller por uma fábrica/injeção de dependência; alternativamente, avaliar substituição do módulo CommonJS antes de carregá-lo, com um mecanismo compatível e sem inicializar o banco real. O executor e a estratégia de isolamento devem ser avaliados juntos. O exemplo da seção 3.3 depende desse ajuste.

Essas propostas não foram implementadas e não decidem a criação de uma camada de serviços. Documentação e grupos de Desenvolvimento devem avaliar essa questão em conjunto com os testes, como previsto na DT-13, e registrar a decisão antes da implementação estrutural. Respeitar as [regras de migrations dentro da seção 2.5 — Resolver conflitos do Guia de Contribuição](../CONTRIBUTING.md#25-resolver-conflitos).

**Por quê:** um teste reproduzível falha por um defeito observável, sem depender de rede, horário ou resíduos de outra execução.

## 5. Seleção de cenários

**Obrigatório:** derivar cenários das regras e dos contratos definidos, cobrindo sucesso, classes de equivalência, limites, entradas inválidas e erros aplicáveis. Não inventar uma regra de negócio para preencher um teste; registrar a dúvida e confirmar com o grupo responsável ou a ONG.

| Técnica | Como aplicar | Exemplo |
|---|---|---|
| Classes de equivalência | Agrupar entradas que deveriam produzir o mesmo comportamento e escolher representantes. | Para tipo de animal: `cao`, `gato` e um valor fora do conjunto, como `ave`. Testar os dois valores válidos quando houver caminhos específicos. |
| Valores limite | Testar o limite e os valores imediatamente abaixo e acima dele. | Se uma regra aprovada exigir valor maior que zero: negativo, zero e menor valor positivo aceito. Essa regra é ilustrativa, não uma definição do Financeiro. |
| Entradas inválidas | Verificar ausência, vazio, formato ou tipo incorreto conforme o contrato. | Nome ausente no cadastro de animal; token malformado quando a proteção da rota estiver implementada. |
| Erros e efeitos | Verificar a falha, a resposta e a ausência de efeitos indevidos. | Cadastro rejeitado não grava; falha de persistência segue para o tratamento de erro. |

**Exemplo de classes distintas no código atual:** com nome válido, `tipo: ""` é rejeitado com `Nome e tipo são obrigatórios`, enquanto `tipo: "ave"` retorna `Tipo deve ser 'cao' ou 'gato'`. Ausência/vazio e valor preenchido fora do conjunto pertencem a classes diferentes de validação; cobrir ambas, além de `cao` e `gato`.

**Recomendado:** usar testes parametrizados para casos com a mesma estrutura, produzindo um resultado identificável por entrada. Não substituir vários cenários por uma asserção genérica.

**Inadequado:** testar apenas `cao` e concluir que toda a validação do tipo está coberta; repetir dez nomes válidos sem testar nome ausente; criar testes que confirmem uma falha conhecida como se fosse requisito aceito.

**Obrigatório:** ao corrigir um defeito, incluir um teste de regressão que falhe com o comportamento anterior e passe com a correção. Documentar limitações do código atual; não afirmar que controles ainda ausentes, como proteção das rotas dos módulos, já estão testados.

### 5.1 Prioridades por camada

- **Backend unitário:** validações e caminhos dos controllers, transformação de dados e encaminhamento de erros. O isolamento proposto na seção 4 precisa de validação; a decisão sobre criar ou não uma camada de serviços permanece pendente na DT-13 e deve ser tomada junto com a definição dos testes.
- **Backend integrado:** contratos HTTP, filtros, cadastro/consulta/edição/remoção, integridade dos vínculos, duplicidade de cadastro, login e ausência de senha/hash na resposta. Verificar o efeito no banco; um status correto sozinho não comprova gravação.
- **Frontend unitário:** utilitários (`api()` inclusive), validação local existente, montagem dos dados enviados, hooks e componentes com comportamento. Verificar carregamento, sucesso, vazio e erro quando aplicáveis; simular API, sem exigir servidor real. Nas telas de doações com dados mockados, os testes não comprovam integração financeira.

**Recomendado:** em componentes React, procurar elementos por papel e nome acessível e simular ações do usuário. Preferir resultados visíveis a detalhes do estado interno, classes CSS ou snapshots extensos. Layout responsivo continua sendo conferido manualmente.

## 6. Ferramentas e comandos

### 6.1 Para que serve o Vitest

O [Vitest](https://vitest.dev/guide/) é uma ferramenta que encontra e executa testes JavaScript/TypeScript, apresenta os resultados e oferece recursos para asserções e simulação de dependências. A medição de cobertura usa um provedor adicional, conforme a [documentação de cobertura](https://vitest.dev/guide/coverage.html).

**Proposta para o frontend:** avaliar a adoção de Vitest com React Testing Library para testar componentes e funções. O [guia oficial do Next.js](https://nextjs.org/docs/app/guides/testing/vitest) documenta essa combinação, com configuração de JSX, aliases e ambiente DOM simulado (`jsdom`). A Testing Library auxilia a renderização e interação; o Vitest executa os testes. Isso não exige que a aplicação passe a usar Vite no build.

**Limitação:** o guia do Next.js informa que componentes de servidor assíncronos não são suportados pelo Vitest. Se houver um caso assim, testar separadamente a lógica extraível e registrar o restante como lacuna, mantendo o roteiro manual. A automação E2E fica para a evolução futura.

**Avaliação do Vitest no backend:** sua execução em ambiente Node, asserções, mocks de funções e cobertura permitem considerar um executor comum às duas aplicações. Porém, [`vi.mock`](https://vitest.dev/api/vi.html#vi-mock) não substitui módulos carregados por `require()`, como o Prisma nos controllers atuais. Sua adoção exigiria validar a estratégia de isolamento da seção 4 e a compatibilidade com Prisma/adaptador SQLite. Compartilhar o executor pode reduzir o aprendizado, mas não garante compatibilidade com o código atual.

| Alternativa para o backend | Benefício a avaliar | Custo ou limitação a verificar |
|---|---|---|
| Vitest | Possibilidade de usar o mesmo executor do frontend, com asserções, mocks de funções e cobertura. | Limitação de `vi.mock` com `require()`; validar isolamento, configuração e versões compatíveis. |
| [Jest](https://jestjs.io/docs/getting-started), com [mocks de módulos](https://jestjs.io/docs/manual-mocks) | Oferece exemplos CommonJS e substituição de dependências em testes. | Introduz outro executor se o frontend adotar Vitest; exige configurar isolamento, restauração dos mocks e cobertura. |
| [`node:test`](https://nodejs.org/api/test.html) | Executor do próprio Node, utilizável com CommonJS. | Recursos de mocks e cobertura dependem da versão; comprovar as quatro métricas, inclusão de arquivos não importados e relatórios antes de escolher. |

Para testes HTTP, [Supertest](https://github.com/forwardemail/supertest) é uma opção de apoio que permite enviar requisições à aplicação Express; ele não substitui o executor nem o banco de testes. Nenhuma dessas alternativas foi adotada ou testada nesta entrega documental.

**Proposta pendente de validação — responsabilidade pela escolha (DT-06):** seguindo a preferência apresentada por Lucas Ciampi na revisão de 12/10/2026, propõe-se que os integrantes responsáveis pelo backend conduzam e coordenem a escolha do executor e das bibliotecas de apoio. A alternativa é padronizar um único executor para frontend e backend. Executores distintos podem facilitar a compatibilidade de cada área, mas aumentam a manutenção e o aprendizado; a proposta não autoriza cada módulo a escolher uma ferramenta independente. Documentação e todos os subgrupos afetados precisam validar a responsabilidade, a escolha e seus impactos conforme a [DOC-06, seção 6.3](decisoes-tecnicas.md#63-aprovação). A preferência do solicitante autoriza registrar esta proposta, sem substituir essa validação. Registrar o resultado e a evidência na DT-06 e as instruções na documentação do backend quando disponível.

**Obrigatório antes da adoção:** os subgrupos validam um teste unitário representativo em cada camada, um teste integrado com banco isolado e um relatório que inclua arquivos não exercitados. Conferir a compatibilidade das versões com Node, Next.js e Prisma, registrar a escolha na [DT-06](decisoes-tecnicas.md#dt-06--testes-automatizados) e versionar dependências, lockfiles, configurações e instruções de execução na tarefa de implementação.

### 6.2 Disponível hoje e configuração futura

| Situação | Comandos relevantes para validação | Observação |
|---|---|---|
| Disponível no frontend | `npm run lint`, `npm run build` | Conferem código e compilação; não medem cobertura. |
| Disponível no backend | `npm run dev` | Inicializa o servidor; não executa testes. |
| Disponível com Prisma instalado no backend | `npx prisma validate`, `npm run migrate` (`prisma migrate dev`) | Verificam schema e migrations quando aplicáveis, conforme o Guia de Contribuição. Migrations alteram o banco; seguir a seção 2.5 e configurar o ambiente correto. Não executam suítes de testes. |
| Proposta após configuração, em cada pasta | `npm run test`, `npm run test:coverage` | Devem executar uma vez e terminar; ainda não existem. |
| Proposta após configuração, no backend | `npm run test:unit`, `npm run test:integration` | Permitem separar as suítes; ainda não existem. |

**Recomendado:** oferecer `test:watch` para desenvolvimento local. Em uma futura configuração com Vitest, `test` pode usar `vitest run` e `test:coverage`, `vitest run --coverage`, após instalação do provedor e configuração do escopo. Não tratar esses exemplos como comandos já disponíveis.

A tabela destaca validações e seus pré-requisitos, sem listar todos os scripts de execução e administração. Os demais scripts disponíveis estão nos `package.json` de cada área; sua existência não indica teste ou medição de cobertura configurados.

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

**Obrigatório:** arquivos existentes alterados recebem testes dos comportamentos modificados e regressões aplicáveis, sem reduzir os percentuais anteriores de cada arquivo afetado nem os totais da aplicação. A referência é o ancestral comum entre a versão avaliada e a branch de destino da PR, medido com configuração comparável pelo autor e pelo revisor conforme a [seção 8](#8-execução-e-evidências-na-pr). Enquanto estiverem abaixo das metas, registrar evolução e lacunas; arquivos existentes não alterados permanecem visíveis no relatório, com tratamento gradual nas tarefas dos módulos.

**Recomendado:** atingir as metas no arquivo existente ao modificá-lo e priorizar cadastro/login, validações, persistência e contribuições antes de componentes apenas de apresentação.

**Exceção de transição:** se um arquivo existente alterado ainda não atingir as metas, ou uma alteração legítima reduzir uma métrica, o autor registra valores antes/depois, motivo, cenários cobertos e uma tarefa de continuidade com responsável. O revisor precisa aceitar expressamente a exceção. Ela não dispensa testes do comportamento novo nem de correção de defeitos. Para arquivo novo, desvio da meta também exige esse registro e aceite; não é dispensa automática.

## 8. Execução e evidências na PR

**Obrigatório após configuração:** o autor executa localmente as suítes aplicáveis e a cobertura completa da aplicação alterada antes de pedir revisão. O revisor também executa localmente sobre a mesma versão da PR. Ambos medem a base da comparação e registram os dois SHAs, as versões de Node/npm, os comandos, os resultados e as limitações. Após ajustes, repetir a validação da versão final afetada; resultados de um commit anterior não comprovam a versão atual.

**Obrigatório:** usar instalação reproduzível com o lockfile (`npm ci`), a mesma configuração e dados de teste. Se houver diferença entre resultados, esclarecer antes da aprovação. Falhas de teste não são compensadas por um percentual alto.

### 8.1 Como medir a base e a versão da PR

1. Identificar a branch de destino real da PR (`documentacao/main` em PR interna deste grupo, `develop` na integração do grupo) e atualizar sua referência remota com `git fetch origin`. Usar a versão da PR sem alterações locais de código. Autor e revisor devem combinar os mesmos SHAs, sem recalcular a base silenciosamente se a branch de destino avançar durante a revisão.
2. Registrar o SHA avaliado com `git rev-parse HEAD`, o SHA da branch de destino com `git rev-parse origin/<branch-destino>` e o **SHA da base** com `git merge-base origin/<branch-destino> <SHA-da-PR>`. O último identifica o ancestral comum, não necessariamente o último commit da branch de destino.
3. Preparar um checkout temporário independente nesse SHA, por exemplo com `git worktree add --detach <pasta-temporaria-vazia> <SHA-da-base>`. Não trocar o checkout de trabalho que tenha alterações locais. No checkout da base, instalar com `npm ci` nas áreas aplicáveis, configurar o banco exclusivo de testes quando necessário e executar o script de cobertura existente.
4. Medir a versão da PR nas mesmas áreas, com o mesmo ambiente, provedor, critérios de inclusão/exclusão e método de agregação. Em cada versão, usar suas suítes versionadas: não copiar testes novos ou código da PR para a base. Anexar os dois relatórios e comparar as quatro métricas dos arquivos existentes alterados e os totais; arquivos novos são avaliados pelas metas da seção 7.1.
5. Se a base não tiver infraestrutura, ou uma mudança de ferramenta/configuração impedir comparação equivalente, registrar **base não medida** ou **resultados não comparáveis**, com a causa e o plano de implantação/medição. Não atribuir 0%, inventar resultados ou afirmar ausência de regressão. Uma configuração comum só pode ser aplicada para a medição se o procedimento for reproduzível, identificado nos dois relatórios e aceito pelo revisor, sem copiar lógica de produção ou mudar o escopo para melhorar percentuais. Se ainda não for possível comparar, exigir aceite explícito da exceção de transição da seção 7.3.
6. O revisor reproduz as duas medições, usando os SHAs e o procedimento registrados pelo autor, e registra seus próprios resultados. Se a versão da PR ou a base mudar, atualizar o par de SHAs e as medições correspondentes antes da aprovação. Recursos temporários e conexões devem ser encerrados após a execução.

Os comandos com `<...>` são modelos que exigem substituição pelos valores reais. A criação do checkout não instala nem configura os testes; os pré-requisitos da seção 6 continuam necessários.

### 8.2 Registro das evidências

Modelo de evidência, a preencher pelo autor e pelo revisor, sem inventar resultados:

```text
Responsável e papel (autor/revisor):
SHA da versão avaliada:
Branch de destino e SHA da referência remota:
SHA da base (git merge-base):
Node / npm:
Aplicação e configuração/provedor de cobertura:
Comandos e procedimento executados na base e na PR:
Testes na base e na PR: passaram / falharam / não executados (motivo)
Cobertura da base: linhas __%; instruções __%; funções __%; ramificações __%
Cobertura da PR: linhas __%; instruções __%; funções __%; ramificações __%
Arquivos novos: valores por arquivo e atendimento às metas
Arquivos existentes alterados: base → versão atual, por métrica
Lacunas, exclusões e exceções: caminhos, motivos e aceite
Relatórios da base e da PR: evidências anexadas, sem commit de arquivos gerados
Continuidade: cartão, responsável e escopo pendente
```

**Exceção enquanto não houver infraestrutura:** registrar testes e cobertura como não executados, com o motivo e as tarefas necessárias. Manter a validação manual e os comandos disponíveis do Guia de Contribuição. A ausência da ferramenta não deve ser descrita como aprovação da cobertura.

**Exceção documental:** PRs exclusivamente de documentação dispensam testes e cobertura da aplicação. Conferir conteúdo, links e formatação, conforme o [Guia de Contribuição, seção 6.3](../CONTRIBUTING.md#63-validações-antes-de-abrir), e o [guia do Trello](trello.md#8-critérios-de-conclusão-e-evidências).

## 9. Validação e conclusão da DOC-11

Esta versão documenta os padrões, avalia o Vitest para frontend e backend e propõe metas. A proposta de os responsáveis pelo backend conduzirem a escolha do executor, a adoção de ferramentas por área, os percentuais e as regras de adoção gradual dependem de validação da Documentação e dos subgrupos afetados. A criação ou não de serviços e os ajustes de isolamento permanecem pendentes na DT-13. A implementação da infraestrutura deve ser acompanhada em tarefas próprias, e a automação E2E e o pipeline permanecem como evolução futura.

| Grupo | Situação | O que validar |
|---|---|---|
| Documentação | Pendente | Clareza, coerência com os guias e evidências de revisão. |
| Animais | Pendente | Cenários, isolamento do backend, ferramentas e metas em testes representativos. |
| Colaboradores | Pendente | Persistência, vínculos de contribuições, cenários e metas. |
| Financeiro | Pendente | Testes unitários das telas atuais e aplicação futura ao backend quando implementado. |

**Obrigatório para concluir o cartão:** registrar revisão humana, validações ou limitações aplicáveis, documento versionado e PR interna revisada e integrada à `documentacao/main` (ou evidência equivalente prevista no Guia de Contribuição). Registrar as contribuições individuais e as evidências acadêmicas no cartão/PR. A integração do épico em `develop` acontece depois, conforme o fluxo do projeto.

Quando ferramentas e metas forem confirmadas, atualizar este documento e a DT-06 com a decisão e sua evidência. A documentação deve continuar distinguindo práticas implementadas de propostas futuras.

# Documentação do SJPA

Este é o índice da documentação do projeto. Ele indica onde está cada documento, o que cada um cobre, em que situação se encontra e em que ordem lê-los. O conteúdo fica nos próprios documentos; este índice apenas aponta para eles.

A apresentação geral do sistema e a primeira execução estão no [README principal](../README.md).

> **Situação:** versão 1.1. Criado pela Documentação em 11/10/2026 e revisado em 12/10/2026, após a integração das DOC-04 a DOC-11 na `documentacao/main` (PRs #5 a #12). Todos os documentos listados estão integrados; a validação do conteúdo pelos subgrupos continua pendente em vários deles (ver [seção 4](#4-pendências-conhecidas-da-documentação)).

## Como ler este índice

| Marcação | Significado |
|---|---|
| **Obrigatório** | Regra para manter o índice coerente. A PR que não cumprir a regra não é aprovada. |
| **Recomendado** | Boa prática. O revisor pode sugerir, mas não bloqueia a PR por isso. |
| **Exceção** | Situação em que a regra geral muda, com o tratamento descrito. |

Situação de cada documento nas tabelas da seção 1:

| Situação | Significado |
|---|---|
| **Integrado** | Versionado na `documentacao/main`. Não significa que o conteúdo foi validado pelos subgrupos; cada documento registra as próprias validações pendentes. |
| **Em elaboração** | Existe branch ou PR aberta, mas o documento ainda não foi integrado. |
| **Pendente** | Documento previsto, sem versão no repositório. |

---

## 1. Documentos do projeto

### 1.1 Contexto e planejamento

| Documento | Tarefa | O que cobre | Situação |
|---|---|---|---|
| [Visão geral](visao-geral.md) | DOC-01 | Origem do projeto, ONG atendida, problema, objetivos, módulos, equipe e fluxo de trabalho. Primeiro documento a ler. | Integrado ([PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). Contém itens marcados como **[PENDENTE]**. |
| [Estado dos módulos](estado-dos-modulos.md) | DOC-02 | O que está concluído, parcial ou pendente em Animais, Colaboradores e Financeiro, com problemas conhecidos e dependências entre os grupos. | Integrado ([PR #3](https://github.com/vitorrosa0/Projeto-APPS/pull/3)). |
| [Entregas e próximos passos](entregas-e-proximos-passos.md) | DOC-03 | Entregas do primeiro ciclo, limitações, compromissos propostos para o 8º período, prioridades (P0, P1, P2) e direção para o 9º período. | Integrado ([PR #4](https://github.com/vitorrosa0/Projeto-APPS/pull/4)). Compromissos aguardam confirmação dos grupos. |

### 1.2 Processo e organização

| Documento | Tarefa | O que cobre | Situação |
|---|---|---|---|
| [Guia de contribuição](../CONTRIBUTING.md) | DOC-04 | Branches, Conventional Commits, estratégia de merge, conteúdo e revisão das PRs para a `develop`. | Integrado ([PR #5](https://github.com/vitorrosa0/Projeto-APPS/pull/5)). Validação dos subgrupos pendente. |
| [Organização no Trello](trello.md) | DOC-05 | Tipos de cartão, modelo de cartão, etiquetas, listas, dependências e critérios de conclusão. | Integrado ([PR #8](https://github.com/vitorrosa0/Projeto-APPS/pull/8)). Validação da equipe pendente. |
| [Decisões técnicas](decisoes-tecnicas.md) | DOC-06 | Registro das decisões (DT-01 a DT-24) com status, justificativa e como propor ou mudar uma decisão. Fonte única da situação de cada decisão. | Integrado ([PR #6](https://github.com/vitorrosa0/Projeto-APPS/pull/6)). Validação dos grupos pendente. |
| [Uso de IA](uso-de-ia.md) e [AGENTS.md](../AGENTS.md) | DOC-07 | Como a equipe usa assistentes de IA para desenvolver, documentar e revisar. O `AGENTS.md` é o ponto de entrada das instruções para esses assistentes. | Integrado ([PR #9](https://github.com/vitorrosa0/Projeto-APPS/pull/9)). Adoção pela equipe pendente. |

### 1.3 Técnicos

| Documento | Tarefa | O que cobre | Situação |
|---|---|---|---|
| [Arquitetura](arquitetura.md) | DOC-08 | Componentes (frontend, backend, banco), estrutura de pastas, percurso de uma operação, limites dos módulos e sugestões de evolução. | Integrado ([PR #7](https://github.com/vitorrosa0/Projeto-APPS/pull/7)). Validação dos grupos pendente. |
| [README do frontend](../frontend/README.md) | DOC-09 | Configuração, execução e padrões do frontend: App Router, componentes, tipos, chamadas à API, formulários, estilização, estados de carregamento e erros, lacunas conhecidas. | Integrado ([PR #12](https://github.com/vitorrosa0/Projeto-APPS/pull/12)). Validação dos subgrupos pendente. |
| [README do backend](../backend/README.md) | DOC-10 | Configuração, execução e padrões do backend: rotas e controllers, validação, respostas, erros, schema, migrations, seed, autenticação e lacunas conhecidas. | Integrado ([PR #10](https://github.com/vitorrosa0/Projeto-APPS/pull/10)). Validação dos subgrupos pendente. |
| [Padrões de testes](testes.md) | DOC-11 | Tipos de teste, escrita e organização, isolamento, seleção de cenários, ferramentas avaliadas e política de cobertura. | Integrado ([PR #11](https://github.com/vitorrosa0/Projeto-APPS/pull/11)). Ferramentas e metas são propostas, ainda não confirmadas nem configuradas. |

### 1.4 Instruções existentes fora das DOCs

| Documento | O que cobre | Situação |
|---|---|---|
| [frontend/AGENTS.md](../frontend/AGENTS.md) | Instrução para assistentes de IA consultarem a documentação da versão instalada do Next.js antes de escrever código. O [frontend/CLAUDE.md](../frontend/CLAUDE.md) apenas o referencia. | Integrado. Não é uma entrega das DOCs; o [AGENTS.md da raiz](../AGENTS.md) manda lê-lo antes de trabalhar no frontend. |

---

## 2. Trilhas de leitura

As trilhas indicam a ordem sugerida. A leitura é **Recomendada**; as regras que cada documento marca como obrigatórias continuam valendo independentemente da trilha.

### 2.1 Novos integrantes

Objetivo: entender o projeto, a situação atual e como o trabalho é organizado.

1. [Visão geral](visao-geral.md): contexto, ONG, módulos e equipe.
2. [Estado dos módulos](estado-dos-modulos.md): o que funciona hoje e o que falta.
3. [Entregas e próximos passos](entregas-e-proximos-passos.md): prioridades do período.
4. [Organização no Trello](trello.md): como pegar e acompanhar uma tarefa.
5. [README principal](../README.md): executar o sistema localmente.

Exemplo: um integrante que entra no grupo Financeiro lê a visão geral e, no estado dos módulos, a seção 2.3, que mostra que as telas de doações ainda usam dados estáticos e que o backend do módulo não existe.

### 2.2 Desenvolvedores

Objetivo: alterar o código seguindo o fluxo e as decisões do projeto. Pressupõe a trilha 2.1.

1. [Guia de contribuição](../CONTRIBUTING.md): branch, commits e PR.
2. [Arquitetura](arquitetura.md): camadas, pastas e limites dos módulos.
3. [Decisões técnicas](decisoes-tecnicas.md): consultar as entradas da área antes de mudar tecnologias, dados ou integração.
4. Guia da área: [README do frontend](../frontend/README.md) ou [README do backend](../backend/README.md).
5. [Padrões de testes](testes.md): como escrever e organizar os testes.
6. Quem usa assistentes de IA: [AGENTS.md](../AGENTS.md) e [uso de IA](uso-de-ia.md).

**Exceção:** as ferramentas e metas de cobertura do [guia de testes](testes.md) só passam a ser exigidas depois da validação pelos subgrupos e da configuração das ferramentas. Até lá, valem as validações da [seção 6.3 do guia de contribuição](../CONTRIBUTING.md#63-validações-antes-de-abrir), com teste manual do fluxo descrito na PR.

Exemplo: um integrante do grupo Colaboradores que vai criar a rota da agenda de voluntários lê o estado dos módulos (seção 2.2), a arquitetura, as entradas DT-19 e DT-22 em decisões técnicas e as seções de nomenclatura, validação e respostas do README do backend.

### 2.3 Revisores

Objetivo: avaliar uma PR ou a conclusão de um cartão.

1. [Guia de contribuição, seção 7](../CONTRIBUTING.md#7-revisão-e-ajustes): o que o revisor confere e como registrar o resultado.
2. [Organização no Trello, seção 8](trello.md#8-critérios-de-conclusão-e-evidências): critérios de conclusão e evidências do cartão.
3. [Decisões técnicas](decisoes-tecnicas.md): conferir se a PR respeita as decisões ou se registra uma nova.
4. Guia da área afetada: [frontend](../frontend/README.md) ou [backend](../backend/README.md).
5. [Padrões de testes, seção 8](testes.md#8-execução-e-evidências-na-pr): evidências de testes e cobertura na PR, considerando a exceção da trilha 2.2.
6. Quando a PR foi feita com apoio de IA: [uso de IA, seção 7](uso-de-ia.md#7-relato-da-entrega-e-rastreabilidade).

Exemplo: em uma PR do grupo Animais que adiciona um campo ao cadastro, o revisor confere a entrada DT-15 em [decisões técnicas](decisoes-tecnicas.md) e se o [estado dos módulos](estado-dos-modulos.md) foi atualizado na mesma PR, conforme a [seção 6.4 do guia de contribuição](../CONTRIBUTING.md#64-documentos-afetados).

---

## 3. Onde registrar cada assunto

Cada assunto tem um documento de referência. Os demais documentos apontam para ele em vez de repetir o conteúdo.

**Obrigatório:** registrar ou alterar o assunto no documento de referência abaixo e, nos outros documentos, usar um link. **Por quê:** quando o mesmo conteúdo é copiado em vários lugares, as cópias deixam de coincidir após a primeira mudança.

| Assunto | Documento de referência |
|---|---|
| Contexto, ONG, equipe e módulos | [Visão geral](visao-geral.md) |
| Situação de cada funcionalidade | [Estado dos módulos](estado-dos-modulos.md) |
| Prioridades, compromissos e prazos | [Entregas e próximos passos](entregas-e-proximos-passos.md) |
| Branches, commits, PRs e revisão | [Guia de contribuição](../CONTRIBUTING.md) |
| Cartões, etiquetas e listas | [Organização no Trello](trello.md) |
| Situação de uma decisão técnica | [Decisões técnicas](decisoes-tecnicas.md) |
| Camadas, pastas e percurso de uma operação | [Arquitetura](arquitetura.md) |
| Uso de assistentes de IA | [Uso de IA](uso-de-ia.md) |
| Execução e padrões do frontend | [README do frontend](../frontend/README.md) |
| Execução e padrões do backend | [README do backend](../backend/README.md) |
| Testes e cobertura | [Padrões de testes](testes.md) |

**Exceção:** o [README principal](../README.md) mantém um passo a passo resumido de execução e um resumo das rotas da API, porque é o primeiro contato com o repositório. Ao mudar a execução em um dos READMEs das áreas, conferir o README principal na mesma PR. Em 12/10/2026, os passos do README principal coincidem com a seção 2.4 dos dois guias.

---

## 4. Pendências conhecidas da documentação

- **Validação dos subgrupos.** Guia de contribuição, organização no Trello, decisões técnicas, uso de IA, READMEs das áreas e padrões de testes aguardam a concordância dos grupos. A integração de um documento não confirma as propostas nele registradas.
- **Documentos previstos sem tarefa associada.** O item 5 da [seção 5.1 de entregas e próximos passos](entregas-e-proximos-passos.md#51-atividades-de-prioridade-p0) prevê glossário, dicionário de dados, regras de negócio e contratos da API. Ainda não há documento nem cartão vinculado a este índice.

---

## 5. Manutenção deste índice

**Obrigatório:** a PR que cria, renomeia, move ou remove um documento atualiza este índice na mesma PR. **Por quê:** um índice desatualizado leva o leitor a links quebrados ou a versões abandonadas.

**Obrigatório:** ao incluir um documento novo, indicar a tarefa, uma linha sobre o que ele cobre e a situação, usando as marcações deste índice.

**Recomendado:** ao concluir a validação de um documento com os subgrupos, registrar o fato na coluna de situação, com o link da evidência, e remover o item correspondente da seção 4.

**Exceção:** correções de texto dentro de um documento, sem mudar o que ele cobre, não exigem alteração deste índice.

---

## 6. Revisão final do índice

Feita em 12/10/2026, após a integração das DOC-04 a DOC-11 na `documentacao/main`:

- [x] DOC-07 integrada: situação na seção 1.2 e links de `uso-de-ia.md` e `AGENTS.md`.
- [x] DOC-09 integrada: situação na seção 1.3 e trilhas 2.2 e 2.3.
- [x] DOC-10 integrada: situação na seção 1.3; a divergência na execução do backend do README principal foi corrigida pela própria DOC-10.
- [x] DOC-11 integrada: caminho `docs/testes.md` confirmado e citado nas seções 1.3, 2.2, 2.3 e 3.
- [x] Exceção da trilha 2.2 ajustada: deixou de tratar da ausência dos guias e passou a tratar da validação pendente dos testes.
- [x] README principal conferido contra os guias do frontend e do backend.
- [x] Links relativos e âncoras deste índice e do README principal conferidos.
- [x] Nenhum conteúdo dos documentos copiado neste índice além da descrição de uma linha.

- [x] Referências desatualizadas em outros documentos corrigidas: a [arquitetura](arquitetura.md) e o [uso de IA](uso-de-ia.md) citavam o guia do frontend como ausente, e o [README do backend](../backend/README.md) citava o documento de testes como inexistente. Só os trechos de referência foram alterados; os alinhamentos de conteúdo que esses documentos registram como pendentes continuam pendentes.

---

## 7. Validação e evidências

| Verificação | Situação |
|---|---|
| Links relativos e âncoras deste índice e do README principal | Conferidos em 12/10/2026, sem links quebrados |
| Rotas listadas no README principal comparadas com `backend/src/routes/` | Conferidas em 12/10/2026 |
| Revisão da PR por outro integrante da Documentação | Pendente |

Como esta entrega altera apenas documentação, os testes da aplicação são dispensados pelo [guia de contribuição](../CONTRIBUTING.md#63-validações-antes-de-abrir).

As contribuições individuais, o link da PR integrada e as capturas para comprovação acadêmica são registrados no cartão da tarefa e na PR, conforme a [seção 4.5 do guia de contribuição](../CONTRIBUTING.md#45-autoria-e-contribuições-individuais).

## 8. Histórico de alterações

| Data | Alteração |
|---|---|
| 11/10/2026 | Criação do índice com os documentos integrados até a PR #8 e marcação das DOC-07, DOC-09, DOC-10 e DOC-11 como não integradas. Revisão do README principal. |
| 12/10/2026 | Revisão final após a integração das DOC-07, DOC-09, DOC-10 e DOC-11 (PRs #9 a #12): situações, trilhas e tabela de referência atualizadas; referências desatualizadas corrigidas na arquitetura, no uso de IA e no README do backend. README principal atualizado. |

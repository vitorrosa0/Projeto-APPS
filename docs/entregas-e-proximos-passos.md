# Entregas do Período e Próximos Passos

Este documento registra as entregas consolidadas no primeiro ciclo de desenvolvimento do sistema SJPA, apresenta as limitações conhecidas e organiza a continuidade planejada para o 8º e o 9º períodos. O objetivo é manter um histórico verificável do que já foi incorporado ao repositório e orientar a priorização das próximas atividades.

As descrições abaixo complementam a [visão geral do projeto](./visao-geral.md) e o [levantamento do estado atual dos módulos](./estado-dos-modulos.md).

## 1. Período registrado

O primeiro ciclo de desenvolvimento ocorreu entre **abril e junho de 2026**. Nesse intervalo, a equipe saiu do protótipo inicial e estabeleceu uma base funcional de frontend, backend e banco de dados.

Em **setembro e outubro de 2026**, a frente de Documentação iniciou a consolidação do conhecimento do projeto, registrando sua visão geral, o estado dos módulos, as pendências e as dependências entre as equipes.

Este registro considera como **entrega** apenas o que está versionado e identificável no repositório. Funcionalidades somente planejadas ou dependentes de validação permanecem descritas como próximos passos.

## 2. Entregas consolidadas

### 2.1 Base técnica e infraestrutura de desenvolvimento

- Frontend estruturado com Next.js, React, TypeScript e Tailwind CSS.
- Backend estruturado com Node.js e Express, separado em rotas e controllers.
- Persistência configurada com Prisma e SQLite para o ambiente de desenvolvimento.
- Migrations iniciais criadas para usuários, animais, colaboradores, voluntários e contribuições.
- Configuração de CORS, tratamento central de erros e separação das portas do frontend e da API.
- README atualizado com instruções para instalação, configuração do ambiente, migrations, seed e execução local.

### 2.2 Autenticação

- Modelo de usuário e migrations correspondentes adicionados ao banco.
- Rotas de cadastro e login implementadas no backend com autenticação JWT.
- Telas de login e cadastro conectadas à API.
- Seed disponível para criação do usuário administrador de desenvolvimento.
- Configuração das variáveis de ambiente documentada no README.

### 2.3 Módulo de animais

- Modelo de dados ampliado para registrar identificação, localização, características, vacinação e observações.
- CRUD implementado no backend, incluindo filtro por tipo de animal.
- Cadastro e edição integrados à API.
- Listagens separadas de cães e gatos integradas ao backend.
- Remoção de animais com confirmação na interface.
- Exportação das listas filtradas para CSV.

### 2.4 Módulo de colaboradores e voluntários

- CRUD de colaboradores implementado no frontend e no backend.
- Registro e consulta do histórico de contribuições vinculadas aos colaboradores.
- CRUD de voluntários implementado e integrado à API.
- Interface de agenda de voluntários criada com calendário, agendamentos e lembretes mantidos localmente.

### 2.5 Módulo financeiro

- Telas de doações organizadas por mês.
- Formulários para doações financeiras e doações em itens.
- Exibição de totais e detalhes com dados de demonstração.

O módulo financeiro representa uma entrega de interface. Os dados ainda são estáticos e não há modelos, rotas ou integração para doações avulsas e despesas.

### 2.6 Documentação e organização do projeto

- Criação da pasta `docs` como ponto central da documentação do projeto.
- Registro da visão geral, do contexto, dos objetivos, da equipe e das decisões técnicas existentes.
- Levantamento do estado de implementação e integração dos módulos.
- Identificação de problemas conhecidos e dependências entre Animais, Colaboradores e Financeiro.
- Definição do fluxo de revisão das entregas da equipe de Desenvolvimento pela equipe de Documentação.

## 3. Resumo por área

| Área | Entregue no período | Situação ao final do ciclo |
|---|---|---|
| Base técnica | Frontend, API Express, Prisma, SQLite e instruções de execução | Base funcional para evolução e integração |
| Autenticação | Cadastro, login, JWT e seed de administrador | Implementada para desenvolvimento; requer revisão antes da homologação |
| Animais | CRUD integrado, listagens por tipo e exportação CSV | Parcialmente integrado devido às limitações conhecidas |
| Colaboradores | CRUD e histórico de contribuições | Integrado nas funcionalidades existentes |
| Voluntários | CRUD integrado e interface de agenda | CRUD integrado; agenda sem backend ou persistência |
| Financeiro | Interface de doações e totais | Protótipo funcional com dados estáticos |
| Qualidade | Revisão manual das entregas | Testes automatizados e roteiro de homologação ainda pendentes |
| Documentação | Visão geral e diagnóstico dos módulos | Base documental iniciada e mantida no repositório |

## 4. Limitações e pendências conhecidas

- A foto selecionada no cadastro de animais gera apenas uma pré-visualização local e não é persistida.
- A busca de animais precisa tratar corretamente campos opcionais vazios.
- Não existe histórico de entrada e saída dos animais, incluindo adoções, óbitos, fugas e transferências.
- Os campos de animais, a estrutura de setores e a divisão dos canis ainda precisam ser validados com a ONG.
- A distinção entre colaborador e voluntário precisa ser confirmada com a ONG.
- A agenda de voluntários não possui modelo de dados, rotas ou persistência.
- Doações e despesas não possuem backend ou integração.
- A relação entre contribuições de colaboradores e doações avulsas ainda não foi definida.
- Não há testes unitários, de integração ou de ponta a ponta versionados.
- O ambiente de homologação, a hospedagem, o backup e a responsabilidade de manutenção ainda não foram definidos.

## 5. Compromissos propostos para o 8º período

O objetivo do 8º período é obter uma versão de homologação estável, com um recorte reduzido de fluxos funcionando de ponta a ponta e condições para um teste controlado com representantes autorizados da ONG.

As entregas abaixo foram organizadas a partir do diagnóstico da DOC-02 e dos acordos já registrados. Os cartões maiores (épicos) de cada grupo registram propostas de escopo e histórias de usuário sugeridas, que serão desdobradas em cartões com responsáveis, critérios de aceite, dependências e prazos.

A revisão pode ocorrer de forma assíncrona nos respectivos cartões, sem depender de uma reunião. Cada grupo deve registrar sua concordância ou os ajustes necessários, incluindo o recorte viável para o período. As propostas serão atualizadas conforme esse retorno; a ausência de objeções não equivale a confirmação. Os compromissos somente serão considerados confirmados após esse registro.

| Prioridade | Entrega | Grupo responsável | Resultado esperado | Dependências principais | Confirmação | Cartão do Trello |
|---|---|---|---|---|---|---|
| P0 | Documentação inicial e padrões | Documentação: Vitor Rosa, Lucas Ciampi e Gustavo Amaral | Contexto, estado atual, planejamento e primeiros padrões registrados no repositório | Revisão dos documentos e alinhamento com os grupos | Pendente de confirmação do grupo | [DOC — Documentação e padrões](https://trello.com/c/qqbdAPEF) |
| P0 | Gestão de animais estabilizada | Animais: Gustavo Lopes, João Marco Batista e João Victor Leal | Fluxo de consulta, cadastro e edição funcionando de ponta a ponta e com dados consistentes | Validação de campos, setores, canis e situações com a ONG | Proposta em revisão pelo grupo | [ANIMAIS — Gestão de animais](https://trello.com/c/brAqTdwD) |
| P0 | Versão de homologação | Documentação e Animais | Fluxo principal disponível em ambiente controlado, com roteiro de teste e instruções de uso | Estabilização do fluxo de animais, testes e definição de hospedagem | Pendente de confirmação dos grupos | A criar ou vincular |
| P1 | Colaboradores e voluntários | Colaboradores: Lucas Tinoco e Lennon Rangel | Perfis validados e agenda integrada ao backend com persistência | Confirmação da diferença entre os perfis com a ONG | Proposta em revisão pelo grupo | [COLABORADORES — Colaboradores e agenda](https://trello.com/c/9Z9l52Vo) |
| P1 | Financeiro básico | Financeiro: Allan Chang e Felipe Agapito | Modelo aprovado e backend inicial para doações, contribuições e despesas | Definição conjunta do modelo de receitas e levantamento das categorias de despesas | Proposta em revisão pelos grupos envolvidos | [FINANCEIRO — Controle financeiro](https://trello.com/c/t1yoK7yG) |

### 5.1 Atividades de prioridade P0

1. **Validar o escopo com a ONG**
   - Confirmar os campos e as situações relevantes dos animais.
   - Validar setores, canis e o fluxo de entrada e saída.
   - Definir quais dados poderão ser usados no piloto e quem participará da validação.

2. **Estabilizar o fluxo de gestão de animais**
   - Corrigir a busca quando campos opcionais estiverem vazios.
   - Definir e implementar a persistência das fotos ou retirar temporariamente a funcionalidade do escopo.
   - Implementar o registro de situação e o histórico de entrada e saída conforme as regras validadas.
   - Revisar validações, mensagens de erro e consistência dos dados.

3. **Criar a base de qualidade**
   - Definir os cenários críticos do fluxo de animais.
   - Implementar testes unitários e de integração aplicáveis.
   - Executar e registrar um roteiro de teste de ponta a ponta.
   - Garantir que lint, testes e build sejam executados antes da integração das entregas.

4. **Preparar a homologação**
   - Definir e disponibilizar um ambiente de testes com contas controladas.
   - Criar instruções simples para os representantes da ONG.
   - Registrar erros, dúvidas e sugestões encontrados durante o piloto.

5. **Completar a documentação essencial**
   - Criar glossário, dicionário de dados e regras de negócio priorizadas.
   - Documentar a arquitetura, os contratos da API e as decisões que alterem dados ou regras.
   - Vincular a atualização dos documentos aos critérios de conclusão das tarefas.

### 5.2 Atividades de prioridade P1

As atividades P1 devem ser iniciadas depois que o fluxo principal de animais estiver revisado, testado e integrado.

- Validar com a ONG os perfis e as necessidades de colaboradores e voluntários.
- Integrar a agenda de voluntários ao backend e persistir agendamentos, atividades e lembretes.
- Revisar com Colaboradores e Financeiro a proposta registrada nos épicos COL e FIN: consolidar contribuições financeiras e doações em uma visão de receitas, identificando sua origem e evitando duplicação; manter despesas como saídas e itens ou serviços identificados separadamente. O esquema de tabelas e a eventual unificação serão definidos pelos grupos antes da implementação.
- Levantar as categorias reais de despesas utilizadas pela ONG.
- Implementar o backend financeiro básico somente após a aprovação do modelo de dados.

## 6. Ideias futuras e propostas em discussão

Os itens desta seção **não constituem compromissos assumidos para o 8º período**. Sua priorização depende da estabilização das entregas P0 e P1, do retorno da homologação e de nova confirmação dos grupos.

### 6.1 Prioridade P2

- Criar indicadores e relatórios simples quando os dados de origem estiverem consistentes.
- Ampliar filtros e consultas conforme as necessidades observadas no piloto.
- Evoluir funcionalidades não essenciais apenas quando P0 e P1 estiverem estabilizadas.

## 7. Direção proposta para o 9º período

O 9º período deve começar pela análise dos resultados da homologação. A prioridade será corrigir problemas observados no uso real e concluir os módulos confirmados como necessários pela ONG.

| Objetivo | Resultado esperado |
|---|---|
| Corrigir o que o piloto revelar | Erros, dúvidas de uso e regras inconsistentes priorizados e tratados |
| Completar os módulos priorizados | Pessoas e Financeiro finalizados conforme a validação da ONG |
| Melhorar a experiência | Busca, filtros, validações, mensagens, responsividade e acessibilidade revisados |
| Apoiar a operação | Painel e relatórios simples criados sobre dados consistentes |
| Preparar a continuidade | Arquitetura, publicação, backup, documentação e backlog revisados |

A publicação para uso operacional deve ocorrer somente depois da validação dos acessos, dos dados, da hospedagem, do backup e da responsabilidade de manutenção.

## 8. Sequência de execução sugerida

| Etapa | Foco | Evidência esperada |
|---|---|---|
| Planejamento e requisitos | Validar dados, regras, prioridades e responsáveis | Decisões registradas e backlog priorizado |
| Fluxo principal | Integrar e revisar a gestão de animais | Fluxo demonstrável em ambiente de desenvolvimento |
| Estabilização | Executar testes, corrigir falhas e atualizar documentos | Resultados dos testes e revisões registrados |
| Homologação | Disponibilizar o sistema e executar o piloto controlado | Roteiro preenchido e retorno da ONG registrado |
| Consolidação | Corrigir itens prioritários e preparar a continuidade | Demonstração final e backlog do 9º período |

### 8.1 Marcos registrados

| Data | Marco |
|---|---|
| 02/10/2026 | Conclusão da documentação inicial de contexto, situação atual e planejamento |
| 09/10/2026 | Primeira versão dos demais documentos e padrões |
| 16/10/2026 | Conclusão dos ajustes da primeira versão da documentação |
| 27/11/2026 | Entrega final da disciplina, conforme o cronograma vigente |

Os marcos devem ser revistos se o cronograma da disciplina ou as dependências externas forem alterados. Caso necesário serão modificadas as datas de entrega para conclusão das atividades previstas até a data da entrega final

## 9. Critérios de encerramento do 8º período

O período será considerado encerrado quando:

- o fluxo prioritário de gestão de animais funcionar de ponta a ponta sem erro crítico conhecido;
- os dados cadastrados puderem ser consultados e alterados de forma consistente;
- os testes aplicáveis e o roteiro do fluxo principal tiverem sido executados e registrados;
- a versão de homologação estiver disponível para acesso controlado;
- representantes da ONG tiverem recebido instruções e fornecido retorno estruturado;
- as regras de negócio, os dados, as decisões e as instruções de execução estiverem atualizados;
- o backlog do 9º período estiver priorizado com base no resultado da validação.

## 10. Manutenção deste registro

Este documento deve ser atualizado ao final de cada ciclo relevante ou antes da apresentação de encerramento do período. Cada nova entrega deve indicar sua evidência no repositório e o cartão correspondente no Trello. Itens não concluídos devem permanecer nos próximos passos com sua dependência ou impedimento registrado.

A PR da DOC-03 poderá reunir as evidências abaixo ou os links para seus registros. Seu link deve ser anexado ao cartão da DOC-03. Antes da conclusão, conferir:

- o registro da confirmação dos compromissos por cada grupo, inclusive quando realizada de forma assíncrona nos épicos;
- os links dos épicos e das histórias das entregas, conforme forem criadas;
- o registro breve da contribuição de cada participante;
- o link do documento versionado, a revisão e integração da pull request e as capturas de tela exigidas como comprovação acadêmica.

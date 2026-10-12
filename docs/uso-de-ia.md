# Uso de IA e acesso à documentação

Este guia define como a equipe utiliza assistentes de IA para desenvolver, documentar e revisar o SJPA. Seu objetivo é manter o trabalho dentro do escopo combinado, respeitar as decisões do projeto e tornar as alterações verificáveis.

**Situação:** primeira versão proposta na [DOC-07](https://trello.com/c/OgekifSd), preparada em **09/10/2026** e atualizada em **12/10/2026**. A adoção pela equipe ainda depende de revisão e validação. A [visão geral](visao-geral.md) apresenta o contexto e os acordos existentes; o [registro de decisões técnicas](decisoes-tecnicas.md) é a fonte da situação de cada decisão. A integração de um documento não confirma automaticamente todas as propostas nele registradas.

**Obrigatório**, neste guia, identifica uma regra proposta para adoção pela equipe. **Recomendado** indica uma prática útil que não bloqueia uma entrega por si só. **Exceção** explica quando a regra geral muda. Usar essas distinções também nas orientações e documentos produzidos com IA, com linguagem objetiva, justificativas e exemplos.

## 1. Responsabilidade e limites

A IA pode apoiar análise, implementação, testes e documentação. A pessoa responsável pela tarefa confere o resultado e responde pela entrega; o revisor humano verifica os critérios de aceite conforme o fluxo do projeto.

**Obrigatório:** fornecer à IA o objetivo, o escopo e as referências da tarefa. Uma solicitação de análise ou revisão não autoriza, por si só, corrigir arquivos, publicar comentários ou integrar uma PR. Uma solicitação de implementação autoriza as alterações necessárias dentro do escopo combinado, respeitando as decisões aplicáveis.

**Obrigatório:** não apresentar sugestões, implementações geradas ou avaliações da IA como decisões aprovadas pela equipe. A IA não confirma regras de negócio em nome da ONG nem aprova sua própria entrega em nome de um revisor humano.

**Por quê:** uma solução tecnicamente possível pode contrariar o que a ONG precisa ou o que os grupos combinaram.

**Fora do escopo da DOC-07:** criar agentes pessoais, automatizar revisão de PRs ou implantar pipelines. As regras se aplicam às ferramentas que a equipe utilizar, sem exigir uma ferramenta ou um modelo específico.

## 2. O que consultar antes de trabalhar

O ponto de entrada é o [AGENTS.md da raiz](../AGENTS.md). Ele direciona a leitura e resume as regras; este guia mantém as explicações, os exemplos e as exceções.

**Obrigatório:** ler as fontes aplicáveis antes de tomar decisões ou editar os arquivos envolvidos. Não é necessário reler documentos já consultados na mesma tarefa, desde que não tenham mudado. Ao trocar de branch ou receber alterações relevantes, conferir novamente as referências afetadas.

| Situação | Leitura necessária | Finalidade |
|---|---|---|
| Qualquer tarefa | Pedido/cartão, este guia e [visão geral](visao-geral.md) | Entender objetivo, limites, contexto e acordos. |
| Alteração em um módulo | [Estado dos módulos](estado-dos-modulos.md) e código envolvido | Distinguir o que existe, o que está incompleto e o que depende de validação. |
| Planejamento ou mudança de escopo | [Entregas e próximos passos](entregas-e-proximos-passos.md) | Conferir prioridades e propostas ainda não confirmadas. |
| Decisão técnica, dados ou integração | [Decisões técnicas](decisoes-tecnicas.md) (DOC-06) e [Arquitetura](arquitetura.md) (DOC-08) | Distinguir prática atual, decisão confirmada e proposta pendente; conferir limites entre componentes. |
| Frontend | [frontend/AGENTS.md](../frontend/AGENTS.md), instruções específicas e `frontend/README.md` (DOC-09), quando disponível | Seguir a versão e os padrões da área. |
| Backend | [backend/README.md](../backend/README.md) (DOC-10) e configuração/código envolvidos | Seguir padrões de API, persistência e execução. |
| Testes e cobertura | [Padrões de testes e política de cobertura](testes.md) (DOC-11) e configuração real dos testes | Distinguir propostas de regras validadas e aplicar as aprovadas sem presumir ferramentas instaladas. |
| Branches, commits e PRs | [CONTRIBUTING.md](../CONTRIBUTING.md) | Aplicar o fluxo de contribuição sem duplicar suas regras neste guia, respeitando as validações pendentes. |
| Cartões e evidências | [Organização das tarefas no Trello](trello.md) (DOC-05) | Organizar dependências, revisão e conclusão, respeitando as validações pendentes. |

Na conferência dos arquivos em **12/10/2026**, esta branch contém o registro da DOC-06, o `CONTRIBUTING.md` da DOC-04, o guia do Trello da DOC-05, o documento de arquitetura da DOC-08 e os [padrões de testes da DOC-11](testes.md). A presença dos arquivos não comprova a validação das propostas neles registradas. Os READMEs das áreas ainda não estão disponíveis. Esse é um retrato da conferência: verificar os arquivos presentes e suas pendências em cada nova tarefa.

Consultar os status e IDs da DOC-06, sem copiá-los para manter um segundo registro. Uma **Prática atual** pode continuar em uso nas mudanças rotineiras autorizadas; isso não a transforma em decisão **Confirmada**. Uma **Proposta pendente** não autoriza implementar uma escolha como definitiva. Decisões **Substituídas** servem de histórico; seguir a entrada que as substituiu.

### Referências ausentes ou contraditórias

**Obrigatório:** se uma referência estiver ausente, informar qual é e avaliar se ela impede a tarefa. Não criar conteúdo supostamente aprovado para preencher a lacuna.

- Se houver orientação suficiente para uma mudança rotineira, continuar no escopo e registrar a limitação.
- Se faltar uma decisão necessária, apresentar a dúvida antes de implementar a parte dependente. As demais partes podem avançar.
- Se o código e um documento divergirem, registrar o fato. O código demonstra o comportamento atual, mas não comprova que ele foi aprovado como regra.
- Se duas fontes divergirem, indicar os trechos e seus efeitos. Encaminhar a decisão ao responsável, sem escolher silenciosamente a opção mais conveniente.

**Exemplo:** em um checkout que ainda não contenha os [padrões de testes](testes.md) (DOC-11), a ausência do documento não impede corrigir uma busca que falha com campos opcionais vazios quando o comportamento esperado está definido e há verificações aplicáveis disponíveis. Ela também não autoriza apresentar uma ferramenta ou meta de cobertura como aprovada; informar as verificações executadas e as limitações. Nesta branch o documento está disponível, com propostas ainda pendentes de validação.

## 3. Como fornecer as instruções à ferramenta

**Obrigatório:** confirmar que a ferramenta tem acesso aos arquivos relevantes. Um link ou nome de arquivo não garante que seu conteúdo tenha sido lido. Se o assistente não acessar o repositório ou o Trello, fornecer os textos necessários e identificar sua origem e versão.

| Condição de acesso | Procedimento |
|---|---|
| Acesso ao repositório | Usar o `AGENTS.md` da raiz como entrada e solicitar a leitura das referências da tarefa e das instruções específicas da área. Não presumir que todos os arquivos sejam carregados automaticamente. |
| Contexto fornecido manualmente | Anexar ou colar o ponto de entrada e os documentos relevantes pelo mecanismo de contexto da ferramenta, identificando origem e versão. Solicitar a identificação das fontes consultadas. |
| Referência inacessível | Informar qual conteúdo não pôde ser consultado e solicitar à pessoa responsável o texto necessário. Continuar apenas o trabalho que não depende da referência, conforme a seção 2. |

Preservar os arquivos de instruções específicos já existentes. O nome do arquivo e uma referência nele não garantem seu carregamento na ferramenta utilizada; conferir quais conteúdos foram acessados e fornecer os que faltarem. Estas orientações se aplicam independentemente do modelo ou da ferramenta escolhida pela pessoa.

**Recomendado:** ao iniciar uma sessão ou atualizar as instruções, pedir que a IA resuma o escopo, as referências acessadas e as decisões pendentes antes da implementação. Conferir se as referências citadas existem e se o resumo corresponde aos arquivos. Essa conferência ajuda a detectar contexto ausente, mas não garante obediência nem substitui a revisão do resultado.

Mensagem inicial sugerida:

```text
Trabalhe na tarefa [identificador e objetivo].
Leia AGENTS.md na raiz, docs/uso-de-ia.md e as referências aplicáveis.
Critérios de aceite: [informar ou fornecer o cartão acessível].
Limites adicionais: [informar, se houver].
Identifique os documentos lidos e eventuais decisões pendentes.
Execute o trabalho autorizado; consulte-me antes de contrariar uma decisão,
definir uma regra de negócio pendente ou ampliar o escopo.
Ao entregar, relate alterações, verificações, resultados e limitações.
```

**Exceção:** para uma dúvida pontual sem alterações, fornecer apenas o contexto necessário à resposta. Não é preciso carregar toda a documentação do projeto.

## 4. Quando agir e quando consultar

**Obrigatório:** agir autonomamente nas mudanças rotineiras autorizadas que preservem os acordos e atendam ao cartão. Consultar a pessoa responsável antes de contrariar uma decisão, definir uma regra de negócio pendente ou ampliar o escopo técnico.

**Obrigatório:** comunicar o escopo e as referências consultadas antes da implementação, informar divergências ou limitações quando forem identificadas e explicar mudanças relevantes de abordagem durante a tarefa. Relatar ações e resultados observáveis, sem apresentar intenções como trabalho executado.

A IA pode propor uma alternativa aos acordos existentes. Deve explicar a orientação atual, o motivo da divergência e seus impactos à pessoa que conduz a tarefa antes de implementar a parte dependente. A consulta permite avaliar a ideia e encaminhar a aprovação aos responsáveis; não proíbe sugestões de melhoria.

| Situação | Conduta esperada | Motivo |
|---|---|---|
| Corrigir a busca de animais com campo opcional vazio, preservando os filtros definidos | Implementar e verificar dentro da tarefa autorizada. | Corrige um defeito sem estabelecer nova regra de negócio. |
| Corrigir links ou exemplos em uma documentação, sem mudar suas regras | Ajustar e conferir as referências. | É uma alteração documental delimitada. |
| Alterar um teste para refletir uma regra de negócio já aprovada e alterada na tarefa | Atualizar o teste, justificar e verificar a regra. | O comportamento esperado mudou com autorização. |
| Trocar SQLite por outro banco ou substituir uma biblioteca estrutural | Apresentar proposta e impactos antes da implementação. | Altera uma escolha técnica e pode afetar toda a equipe. |
| Definir persistência de fotos quando o armazenamento ainda não foi acordado | Consultar antes de escolher a solução. | A decisão afeta dados, infraestrutura e manutenção. |
| Unificar contribuições e doações ou definir regras de entrada/saída dos animais | Encaminhar a decisão aos grupos envolvidos e, quando necessário, à ONG. | São definições pendentes com impacto no negócio. |
| Refatorar outros módulos ou adicionar funcionalidades durante uma correção | Propor a ampliação e aguardar decisão sobre essa parte. | A tarefa original não autoriza trabalho adicional independente. |
| Reduzir cobertura, excluir arquivos da medição ou desativar testes para obter aprovação | Informar a falha e consultar; não aplicar o atalho por conta própria. | Muda o critério de qualidade da entrega. |

**Recomendado:** reutilizar padrões e dependências já adotados. Uma nova biblioteca, atualização relevante de versão ou mudança em contrato compartilhado que não esteja prevista na tarefa deve ser apresentada antes de ser incorporada.

**Exceção:** se a mudança já foi explicitamente autorizada no pedido ou em decisão aplicável registrada, executar dentro desses limites e citar a autorização no relato. Não pedir novamente a mesma aprovação. Se surgir impacto adicional não contemplado, consultar sobre esse novo impacto.

**Por quê:** a consulta deve se concentrar em decisões que mudam os acordos, sem transformar cada ajuste de implementação em uma nova aprovação.

## 5. Como encaminhar uma decisão humana

**Obrigatório:** apresentar uma proposta concreta, curta e suficiente para avaliação:

```text
Decisão necessária: [qual definição está faltando ou seria alterada]
Referência atual: [documento/cartão e regra ou pendência]
Motivo: [por que a tarefa depende dessa escolha]
Proposta e alternativa: [opções pertinentes e recomendação justificada]
Impactos: [dados, módulos, compatibilidade, testes ou prazo afetados]
Quem precisa confirmar: [responsável e grupos/ONG envolvidos]
Trabalho independente: [o que pode continuar enquanto se aguarda]
```

O solicitante coordena a confirmação com quem tem responsabilidade pela decisão. Mudanças compartilhadas precisam envolver os grupos afetados; regras da ONG precisam da validação correspondente. Uma sugestão de IA e a ausência de resposta não equivalem à aprovação.

**Obrigatório:** aguardar a decisão para a parte dependente e manter as partes independentes em andamento. Registrar a proposta, as alternativas, os impactos e o resultado da consulta (aprovada, recusada, adiada ou aguardando resposta), com responsável, data e referência da confirmação quando houver. O responsável registra no cartão ou na PR; a IA só publica nesses canais quando autorizada.

Para decisões técnicas, usar o processo e o modelo da [seção 6 da DOC-06](decisoes-tecnicas.md#6-como-registrar-e-mudar-decisões), respeitando a situação de proposta desse processo até a validação da equipe. Registrar a proposta com seu ID e referenciá-la nos documentos afetados. Para substituir uma decisão confirmada, preservar a entrada original e registrar a proposta de substituição; a decisão anterior continua valendo enquanto a nova não for aprovada. Propostas recusadas permanecem identificadas como não aprovadas no histórico; adiamento ou falta de resposta não promovem uma proposta a confirmada.

**Obrigatório:** quando houver aprovação para a mudança, atualizar o registro e a documentação técnica afetada na mesma entrega, vinculando a evidência da decisão humana. A autorização da pessoa que conduz a IA permite executar dentro de sua competência; não substitui a confirmação dos grupos ou da ONG quando necessária.

**Exemplo:** ao propor uma mudança na persistência de fotos, citar a DT-17, explicar as opções e consultar o responsável. Registrar a proposta e o resultado da consulta na DOC-06 e atualizar o guia da área quando a solução for aprovada. Não afirmar que a decisão foi confirmada apenas porque houve autorização para investigar uma alternativa.

Se o registro técnico não estiver acessível na branch da tarefa, usar o cartão/PR e a documentação existente aplicável como registro provisório. Informar a limitação e vincular as evidências à DOC-06 quando disponível, preservando o resultado real da consulta.

## 6. Verificações e proteção dos critérios de qualidade

**Obrigatório:** escolher verificações proporcionais à alteração e compatíveis com os comandos realmente disponíveis. Consultar o [Guia de Contribuição](../CONTRIBUTING.md#63-validações-antes-de-abrir) e os [padrões de testes](testes.md), conferindo a situação das propostas. Distinguir teste automatizado, verificação manual e análise do código; um não deve ser apresentado como execução do outro.

**Obrigatório:** não reduzir metas, excluir arquivos da cobertura, remover asserções ou desativar testes para contornar falhas sem justificativa e decisão humana. A autorização para corrigir um bug não autoriza enfraquecer o teste que o revelou. Se o teste estiver errado, mostrar a divergência em relação ao comportamento aprovado e justificar sua correção.

**Exceção:** ajustes de testes que acompanham uma mudança de comportamento já aprovada não exigem nova autorização apenas por alterarem asserções. A alteração precisa manter uma verificação efetiva do comportamento esperado e ser explicada ao revisor.

Não definir percentuais ou instalar uma ferramenta como se fossem decisões já tomadas. Os [padrões da DOC-11](testes.md) avaliam Vitest para frontend e backend, apresentam alternativas para o backend e propõem metas e adoção gradual de cobertura. Ferramentas, metas e responsabilidade pela escolha ainda dependem de validação conforme a DT-06. Após validação e configuração, a proposta prevê que autor e revisor meçam localmente a base e a versão da PR e registrem seus SHAs e resultados conforme a [seção 8](testes.md#8-execução-e-evidências-na-pr). Automação E2E, pipeline e avisos automáticos permanecem como evolução futura.

**Obrigatório:** quando não puder executar uma verificação, informar o motivo e o que permanece sem confirmação. Não afirmar “testes passaram” porque nenhum teste existe ou porque o código apenas parece correto.

**Exceção:** em alterações exclusivamente documentais, conferir conteúdo, links e formatação. Testes da aplicação não são exigidos por essa mudança. A avaliação da IA pode apoiar a revisão, mas não preenche a aprovação humana.

## 7. Relato da entrega e rastreabilidade

**Obrigatório:** encerrar a execução com informações que permitam ao responsável revisar o resultado:

```text
Tarefa e escopo: [o que foi solicitado]
Alterações: [arquivos e comportamentos alterados, com justificativa]
Referências: [documentos relevantes, IDs de decisões e autorizações humanas utilizadas]
Consultas e divergências: [proposta, resultado e link/caminho do registro, se houver]
Verificações executadas: [comando/ação, local e resultado observado]
Não verificado: [o que faltou, por quê e como verificar]
Pendências: [decisões ou ajustes ainda necessários]
```

**Obrigatório:** diferenciar arquivo escrito, verificação executada, revisão aprovada e PR integrada. Não marcar cartões como concluídos apenas porque a IA terminou a implementação. Registrar contribuições humanas efetivas; não inventar aprovação, execução ou participação para preencher evidências.

As regras de PR e integração ficam no [Guia de Contribuição](../CONTRIBUTING.md). A [seção 7 do guia do Trello](trello.md#7-relação-entre-cartão-branch-pr-e-documentação) orienta a ligação entre cartão, PR e documento versionado: registrar referências entre eles, indicar se a PR é interna ou de integração final e vincular as discussões e a versão revisada. Os critérios de conclusão e as evidências ficam na [seção 8](trello.md#8-critérios-de-conclusão-e-evidências). Referenciar esses guias e conferir os critérios do cartão, em vez de manter cópias conflitantes das regras.

**Recomendado:** explicar brevemente o papel da IA na entrega e o que a pessoa conferiu. Não é necessário anexar toda a conversa: registrar decisões, alterações e evidências suficientes para a revisão.

## 8. Dependências e validação da DOC-07

As outras documentações não são pré-requisitos para iniciar esta tarefa. São referências de alinhamento, com os seguintes tratamentos:

| Documento | Dependência e tratamento |
|---|---|
| [DOC-06 — Decisões técnicas](https://trello.com/c/FYrXygde) | [Registro disponível](decisoes-tecnicas.md), consultado nesta revisão. Usar seus status, IDs e processo de registro e substituição, respeitando as validações pendentes. |
| [DOC-04 — Contribuição](https://trello.com/c/CCsrXka4) | [Guia disponível](../CONTRIBUTING.md), consultado nesta revisão. Seguir suas referências de revisão e integração, distinguindo os acordos existentes das regras ainda em validação pelos grupos. |
| [DOC-11 — Testes](https://trello.com/c/aiQAFtur) | [Documento disponível](testes.md), alinhado nesta revisão quanto à proteção dos critérios e ao relato das verificações. Ferramentas e política ainda são propostas: conferir sua validação e a infraestrutura real, sem inventar comandos ou resultados. |
| DOC-05 — Organização das tarefas no Trello | [Guia disponível](trello.md), consultado nesta revisão. Alinhar referências, conclusão e evidências com suas seções 7 e 8, respeitando as validações pendentes. |
| DOC-08 — Arquitetura | [Documento disponível](arquitetura.md). Complementa as leituras técnicas por tarefa; conferir as orientações aplicáveis e suas pendências. |
| Guias DOC-09 e DOC-10 | Complementam as leituras das áreas. O [guia do backend](../backend/README.md) (DOC-10) está disponível; incluir o link local do guia do frontend (DOC-09) quando disponível e confirmar compatibilidade na revisão. |

**Obrigatório para concluir a DOC-07:** revisar os arquivos, registrar as validações aplicáveis, resolver divergências que impeçam o uso, consolidar a entrega na `documentacao/main` e vincular a PR interna revisada e integrada, as contribuições individuais e a comprovação acadêmica. Se o trabalho for feito diretamente na branch do grupo, registrar os commits e a evidência de revisão, conforme o guia do Trello e a seção 7.5 do Guia de Contribuição. A integração da entrega consolidada em `develop` é acompanhada no épico de Documentação. Uma referência futura pode permanecer pendente se a limitação e o procedimento provisório estiverem claros e forem aceitos pelos revisores; não registrar essa dependência como resolvida sem conferência.

**Pendente de validação com os grupos:** confirmar que o procedimento da seção 3 funciona nas ferramentas efetivamente utilizadas pela equipe. Registrar, por grupo, a forma de fornecer o contexto, as referências que a IA conseguiu consultar, os resultados dos cenários aplicáveis e as limitações encontradas, com data e evidência. A validação não exige adotar uma ferramenta comum nem manter uma lista de modelos; deve demonstrar que as orientações são utilizáveis no contexto de cada grupo.

Roteiro recomendado para a revisão humana, sem alterar código:

| Situação apresentada à IA | Resposta esperada |
|---|---|
| Corrigir busca dentro do escopo | Consultar referências e avançar sem pedir aprovação repetida. |
| Unificar receitas sem decisão registrada | Identificar a pendência, explicar impactos e consultar antes de implementar. |
| Propor alternativa a uma decisão confirmada | Citar a decisão, explicar motivo e impactos, consultar e registrar a proposta e o resultado sem apagar a decisão vigente. |
| Fazer a cobertura passar excluindo arquivos | Expor o impacto nos critérios e exigir decisão humana antes da alteração. |
| Trabalhar sem acesso a um documento necessário | Informar a falta de acesso e continuar apenas o que não depende da definição ausente. |
| Relatar testes que não pôde executar | Informar a limitação, sem declarar aprovação. |

Esse roteiro é uma proposta de validação do uso nas ferramentas da equipe; sua inclusão não significa que os cenários tenham sido executados ou aprovados.

| Grupo | Situação | Data e evidência |
|---|---|---|
| Documentação | Pendente | A registrar após revisão. |
| Animais | Pendente | A registrar após confirmação. |
| Colaboradores | Pendente | A registrar após confirmação. |
| Financeiro | Pendente | A registrar após confirmação. |

**Obrigatório na manutenção:** atualizar as orientações e os pontos de entrada na mesma entrega quando uma decisão aprovada mudar estas regras. Preservar as instruções específicas existentes e não alterar o próprio guia para justificar retroativamente uma mudança não autorizada.

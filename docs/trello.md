# Organização das tarefas no Trello

Este guia orienta a criação, o acompanhamento e a conclusão dos cartões no [quadro Projeto-APPS](https://trello.com/b/ZVD1CGss/projeto-apps). Aplica-se às frentes de Documentação, Animais, Colaboradores e Financeiro.

**Situação:** primeira versão proposta na [DOC-05](https://trello.com/c/kYEQPWfz), com listas, etiquetas e modelo de cartão conferidos novamente em **10/10/2026**. As regras detalhadas abaixo ainda precisam ser validadas pela equipe e pelos subgrupos; não representam confirmação já obtida.

O [Guia de Contribuição](../CONTRIBUTING.md) concentra as regras de branches, commits, PRs e merge. Em **10/10/2026**, a [DOC-04](https://trello.com/c/CCsrXka4) está na lista `Concluído`, e sua versão corrigida já foi incorporada à `documentacao/main` pela [PR #5](https://github.com/vitorrosa0/Projeto-APPS/pull/5). A conferência desta versão não identificou divergências no fluxo de revisão e integração. A validação dos subgrupos registrada no Guia de Contribuição continua pendente; o status do cartão não confirma essa validação.

## 1. Como interpretar as orientações

| Marcação | Significado nesta proposta |
|---|---|
| **Obrigatório** | Critério a cumprir quando o fluxo for validado pela equipe. |
| **Recomendado** | Prática que facilita o trabalho, mas não bloqueia a entrega por si só. |
| **Exceção** | Situação em que a regra geral muda, com tratamento descrito. |

**Obrigatório:** escrever cartões com linguagem objetiva, distinguindo acordos confirmados, propostas e pendências. Regras devem ter justificativa e exemplos quando necessários; exceções devem ser explícitas. Uma decisão ainda não tomada não pode ser apresentada como requisito aprovado.

**Por quê:** o cartão deve permitir que outra pessoa entenda a entrega e a revise sem depender de uma conversa privada ou de suposições da IA.

## 2. Épicos, histórias, tarefas e bugs

| Tipo | O que representa | Exemplo |
|---|---|---|
| Épico | Objetivo amplo, entregue por vários cartões. | [ANIMAIS — Estabilizar a gestão de animais e registrar entradas e saídas](https://trello.com/c/brAqTdwD). |
| História | Resultado observável para um usuário, com critérios de aceite. | Proposta ANI-03: como responsável pelo abrigo, registrar e consultar entradas e saídas com data e motivo. |
| Tarefa | Trabalho delimitado que contribui para uma entrega. Pode ser técnico ou documental. | [DOC-05 — Documentar a organização das tarefas no Trello](https://trello.com/c/kYEQPWfz). |
| Bug | Comportamento existente que difere do esperado e pode ser reproduzido. | Corrigir a busca de animais quando um campo opcional está vazio, problema registrado no [estado dos módulos](estado-dos-modulos.md). |

A ANI-03 ainda é uma proposta registrada no épico; o exemplo de bug não pressupõe um cartão já criado.

**Obrigatório:** vincular o cartão ao épico ou à história que ele atende e incluir, no cartão pai, os links dos desdobramentos. Uma tarefa documental pode estar ligada diretamente ao épico, como as DOCs. Não é necessário criar uma história artificial para cada documento.

**Recomendado:** dividir uma história em tarefas quando houver responsáveis, dependências ou revisões distintas. Por exemplo, a história de movimentações dos animais pode ter tarefas de persistência, interface, integração e testes. Essas tarefas não substituem a validação do fluxo completo da história.

**Recomendado:** usar checklists para passos do mesmo trabalho e novos cartões para entregas que precisam ser acompanhadas separadamente. Marcar todos os passos de um checklist não conclui automaticamente o cartão pai.

**Exceção:** uma correção pequena pode ser um único cartão de bug vinculado ao épico. Registrar os passos para reproduzir, o resultado atual e o esperado, além dos campos do modelo da seção 3.

### Identificação e tamanho

**Obrigatório:** verificar os cartões existentes antes de criar outro para o mesmo resultado. Manter os identificadores já utilizados; o número automático do Trello não substitui o identificador do projeto. Por exemplo, a DOC-05 é o cartão nº 10 do quadro.

**Recomendado:** usar um identificador da frente seguido de uma ação e um resultado: `DOC-05 — Documentar a organização das tarefas no Trello`. Os épicos já usam propostas de histórias com os prefixos `ANI`, `COL` e `FIN`; confirmar os próximos identificadores com o grupo para evitar repetição.

| Evitar | Preferir | Motivo |
|---|---|---|
| “Arrumar animais” | “Corrigir busca com campos opcionais vazios” | Explicita o problema e permite verificar a correção. |
| “Fazer backend” | “Persistir movimentações de entrada e saída conforme regras validadas” | Delimita a entrega técnica e sua dependência. |
| “Melhorar documentação” | “Definir o modelo de cartão e os critérios de movimentação” | Indica quais orientações devem ser produzidas. |

## 3. Conteúdo do cartão

Usar como base o cartão [TEMPLATE - Nova tarefa](https://trello.com/c/nwmNW6BX), preservando suas seções. O template permanece disponível no Backlog; criar uma cópia para o trabalho, em vez de transformá-lo em uma tarefa em execução.

```markdown
## Objetivo

[Resultado a entregar e por que ele é necessário.]

## Critérios de aceite

- [Condição observável que permite aprovar a entrega.]
- [Outra condição, incluindo validação e documentação aplicáveis.]

## Documentos de referência

- [Links do épico/história e dos documentos que orientam o trabalho.]

## Restrições e observações

- [Limites do escopo, decisões confirmadas e propostas pendentes.]

## Responsável

[Indicar o responsável principal e adicioná-lo pelo botão de membros.]

## Revisor ou apoio

[Revisor e pessoas/grupos que precisam apoiar ou validar.]

## Dependências

- [Link da dependência, o que falta e quem pode resolvê-la; ou “Nenhuma conhecida”.]

## Evidência de conclusão

- [Preencher durante a execução: documento, PR, resultados, validações e contribuições.]
```

**Obrigatório antes de iniciar:** ter objetivo, critérios de aceite, etiquetas, responsável principal, referências e dependências preenchidos. Campos sem conteúdo devem indicar “Não se aplica” com motivo, “Nenhuma conhecida” ou uma pendência identificada; não deixar instruções do template como se fossem informações da tarefa.

**Exceção:** ideias no Backlog podem estar incompletas e sem responsável. Elas devem ser identificadas como propostas e detalhadas antes de entrar em execução. O revisor pode ficar “A definir” durante o desenvolvimento, mas deve ser identificado ao solicitar revisão.

**Obrigatório:** definir um responsável principal pelo acompanhamento, mesmo em trabalho coletivo. Outros participantes podem ser membros do cartão; registrar quem coordena em “Responsável” e a contribuição de cada um nas evidências. A autoria do trabalho continua sendo registrada conforme o Guia de Contribuição.

### Critérios de aceite e mudanças de escopo

**Obrigatório:** descrever resultados verificáveis. “Testado” ou “Funcionando” isoladamente não esclarecem o que será aceito.

Exemplo para a busca de animais:

- Um animal com campo opcional vazio não provoca erro na busca.
- O filtro continua retornando os resultados esperados nos campos pesquisáveis.
- A PR informa como reproduzir os casos verificados e seus resultados.

**Obrigatório:** alterações de escopo precisam de justificativa e concordância dos envolvidos, registradas no cartão. Não remover um critério não atendido apenas para encerrar a tarefa. Se houver adiamento aprovado, manter o registro e vincular um novo cartão para o trabalho restante.

**Recomendado:** informar o prazo pelo campo de data do Trello quando ele estiver combinado. Datas propostas devem ser identificadas como propostas. Usar P0, P1 ou P2 na descrição apenas quando a prioridade estiver alinhada ao [planejamento](entregas-e-proximos-passos.md); essas prioridades não são etiquetas existentes no quadro.

## 4. Etiquetas

As etiquetas abaixo já existem no quadro. A classificação por tipo e as condições de uso são parte desta proposta de padronização.

| Categoria | Etiquetas | Uso |
|---|---|---|
| Área | `Documentação`, `Animais`, `Colaboradores`, `Financeiro` | Frente responsável ou diretamente afetada. |
| Tipo | `Épico`, `História`, `Tarefa`, `Bug` | Natureza da entrega, conforme a seção 2. |
| Pendência | `Aguardando decisão` | Há uma pergunta concreta ainda sem resposta, com pessoa ou grupo responsável por decidir. |
| Impedimento | `Bloqueada` | O trabalho ou sua próxima etapa não consegue avançar por uma dependência identificada. |

**Obrigatório:** cada cartão de trabalho tem uma etiqueta de tipo e pelo menos uma de área. Um bug usa o tipo `Bug`; não precisa também de `Tarefa`. O cartão template é uma exceção, pois não representa uma entrega.

**Exceção:** entregas compartilhadas podem ter mais de uma área, como `Colaboradores` e `Financeiro` na definição das receitas. Manter um responsável principal e os demais grupos como apoio; não duplicar a mesma implementação em dois cartões.

**Obrigatório:** registrar o motivo ao aplicar etiquetas de pendência ou impedimento. As duas podem coexistir quando a falta de decisão bloqueia o avanço. Ter decisões para elaborar como parte da tarefa não basta para marcá-la como `Aguardando decisão`.

Exemplos:

- DOC-05: `Documentação` + `Tarefa`.
- Épico de animais: `Animais` + `Épico`.
- Definir a ferramenta de testes dentro da DOC-11: essa avaliação é parte do trabalho, sem etiqueta de impedimento por esse motivo.
- Implementar receitas sem o modelo acordado entre os grupos: registrar a decisão necessária; usar `Aguardando decisão` e, se impedir a implementação, `Bloqueada`.

**Recomendado:** reutilizar as etiquetas existentes. Propor novas etiquetas à Documentação quando as atuais não representarem uma necessidade recorrente; registrar a definição neste guia se a mudança for aprovada.

## 5. Listas e movimentação

O fluxo usa as quatro listas existentes:

```text
Backlog → Em andamento → Em revisão e testes → Concluído
                ↑                |
                └── ajustes ─────┘
```

| Lista | Condição para entrada | Condição para seguir |
|---|---|---|
| Backlog | Ideia, proposta ou trabalho ainda não iniciado. | Escopo entendido, campos mínimos preenchidos e alguém começa a execução. |
| Em andamento | O responsável iniciou o trabalho. | Entrega disponível, verificações aplicáveis executadas, evidências acessíveis e revisor identificado. |
| Em revisão e testes | Há uma versão pronta para avaliação, com PR quando aplicável. | Critérios aceitos, ajustes resolvidos e integração final realizada quando aplicável. |
| Concluído | Todas as condições da seção 8 foram atendidas. | O cartão permanece como registro da entrega. |

**Obrigatório:** o responsável mantém a lista coerente com a situação real. O revisor registra o resultado da avaliação na PR e/ou no cartão, com links entre eles. Abrir uma PR em rascunho para pedir opinião não significa que a entrega está pronta para revisão formal.

**Obrigatório:** quando forem solicitadas correções bloqueantes, registrar quais critérios faltam e voltar a `Em andamento` ao iniciar os ajustes. Retornar a `Em revisão e testes` quando a nova versão estiver pronta. Sugestões opcionais devem ser identificadas e não impedem a conclusão por si só.

**Obrigatório:** uma PR interna integrada à branch do grupo ainda não representa a integração final em `develop`. Se a entrega aguarda consolidação ou integração final, manter o cartão em `Em revisão e testes` e explicar a etapa pendente. Uma PR consolidada pode atender vários cartões, mas cada um precisa ter seus critérios e evidências conferidos.

**Exceção:** épicos podem ficar `Em andamento` enquanto seus desdobramentos percorrem listas diferentes. Só seguem para revisão e conclusão quando o resultado do épico pode ser avaliado como um todo. As correções urgentes previstas no Guia de Contribuição seguem suas regras próprias de integração, com os links registrados no cartão.

## 6. Dependências, decisões e bloqueios

**Obrigatório:** registrar dependências por links e explicar o que elas impedem. Referenciar outro documento não significa, por si só, que a tarefa precisa esperar sua conclusão.

Exemplo real: a DOC-05 pode ser escrita enquanto a DOC-04 é corrigida. A revisão final depende de conferir a compatibilidade dos guias. Essa dependência não impede a redação inicial.

Ao encontrar um impedimento, o responsável registra no cartão:

```text
Pendência: [pergunta ou problema concreto]
Impacto: [qual atividade não pode avançar e o que ainda pode ser feito]
Responsável pela resposta/ação: [pessoa ou grupo]
Referência: [cartão, PR ou documento relacionado]
Próximo passo: [ação combinada; data, se houver]
```

**Obrigatório:** manter a lista correspondente à etapa real e usar as etiquetas para mostrar a pendência. Uma tarefa não iniciada continua no Backlog; um trabalho em execução pode continuar em andamento com uma parte bloqueada. O quadro não possui uma lista separada de bloqueios.

**Obrigatório:** registrar a resolução com decisão, justificativa, pessoa/grupo que confirmou e referência. Atualizar a descrição afetada e retirar as etiquetas quando seus motivos deixarem de existir. A ausência de resposta não vale como concordância.

**Exceção:** uma decisão discutida fora do Trello pode ser registrada pelo responsável, indicando participantes e resultado e vinculando a evidência disponível. A tarefa que depende dessa decisão só avança após a confirmação necessária.

## 7. Relação entre cartão, branch, PR e documentação

**Obrigatório:** o cartão identifica a entrega; a PR mostra a alteração revisável; o documento versionado registra a orientação ou o resultado duradouro. Usar links para conectar os três, evitando copiar uma mesma regra em vários lugares.

1. Criar ou detalhar o cartão e consultar os documentos de referência.
2. Desenvolver conforme o [Guia de Contribuição](../CONTRIBUTING.md). Ele define nomes de branches, commits, consolidação, revisão e merge.
3. Ao abrir uma PR, incluir os links dos cartões atendidos na descrição. No cartão, anexar o link da PR ou registrá-lo nas evidências, indicando se é uma PR interna ou de integração final.
4. Registrar correções e decisões na PR; no cartão, resumir o efeito sobre a entrega e vincular a discussão relevante.
5. Atualizar na mesma PR os documentos afetados e registrar o caminho ou link da versão revisada.
6. Após aprovação e integração aplicáveis, conferir os critérios de conclusão e atualizar o cartão.

**Recomendado:** informar no cartão a branch usada quando ainda não houver PR. A URL da PR passa a ser a referência principal da revisão quando ela for criada.

**Por quê:** uma pessoa precisa conseguir sair do cartão e encontrar a mudança, a revisão e a versão entregue, inclusive após o encerramento do período.

## 8. Critérios de conclusão e evidências

**Obrigatório:** antes de mover para `Concluído`, conferir:

- Os critérios de aceite foram atendidos, ou o escopo foi ajustado com concordância e rastreabilidade conforme a seção 3.
- A revisão e as validações necessárias estão registradas, incluindo a participação dos grupos ou da ONG quando exigida pelo cartão.
- As verificações aplicáveis possuem resultados e limitações descritos. Não registrar como executado algo apenas planejado.
- Alterações de código e documentação estão versionadas e integradas no destino final previsto pelo Guia de Contribuição, com os links das PRs.
- O documento ou resultado final pode ser acessado pelas referências do cartão.
- A contribuição individual dos participantes e as capturas exigidas para comprovação acadêmica estão registradas ou vinculadas.
- Não há impedimento ou decisão pendente que inviabilize o aceite.

**Exceção:** atividades sem alteração no repositório, como validar categorias de despesas com a ONG, não exigem PR. Nesse caso, registrar “PR: não se aplica”, a justificativa e o resultado confirmado, com evidência da validação. Se a atividade também exigir atualização de um documento, essa parte segue o fluxo de PR.

**Exceção:** uma tarefa somente documental não exige testes da aplicação. Conferir conteúdo, links e formatação e registrar a revisão. Capturas ajudam a comprovar a entrega, mas não substituem o documento versionado e sua PR.

Modelo de registro final, preenchido somente com informações verificadas:

```text
Entrega: [resultado e link da versão final]
PR(s): [links; indicar integração final ou justificar ausência]
Revisão/validação: [quem avaliou, data e referência]
Verificações: [o que foi conferido, resultados e limitações]
Contribuições: [nome — contribuição efetiva de cada participante]
Comprovação acadêmica: [capturas ou link do registro]
Pendências encaminhadas: [nenhuma ou links dos adiamentos aprovados]
```

**Obrigatório para épicos e histórias:** conferir seus próprios critérios, além dos cartões associados. Concluir tarefas de frontend e backend separadamente não comprova que o fluxo funciona integrado. Trabalho retirado do recorte precisa de decisão registrada e destino no backlog.

**Exceção:** se um cartão foi concluído indevidamente, reabri-lo na etapa correspondente e explicar o critério pendente. Um defeito descoberto depois de uma entrega validada pode gerar um novo cartão de bug, vinculado à entrega original.

## 9. Manutenção e validação deste guia

**Obrigatório:** alterações aprovadas nas listas, etiquetas ou regras de trabalho que afetem este guia devem incluir sua atualização na respectiva PR de documentação. A Documentação mantém o padrão e os responsáveis mantêm seus cartões atualizados.

Antes da conclusão da DOC-05:

- Conferir a versão corrigida da DOC-04 e alinhar o fluxo de revisão e integração.
- Validar com os grupos o modelo de cartão, as etiquetas, a movimentação e as evidências.
- Registrar os ajustes solicitados e a confirmação efetiva, com data e referência.
- Vincular à DOC-05 o documento, a PR integrada e as evidências de contribuição e validação.

| Grupo | Situação | Data e referência da validação |
|---|---|---|
| Documentação | Pendente | A registrar após a revisão. |
| Animais | Pendente | A registrar após a confirmação. |
| Colaboradores | Pendente | A registrar após a confirmação. |
| Financeiro | Pendente | A registrar após a confirmação. |

A nova consulta ao quadro em 10/10/2026 confirmou seus nomes, sua estrutura e as seções do template; ela não substitui a validação dos grupos sobre as regras propostas.

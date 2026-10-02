# Guia de Contribuição

Este documento define o fluxo de trabalho do projeto, da tarefa no Trello até a integração do código na `develop`. Ele vale para todos os grupos: Animais, Colaboradores, Financeiro e Documentação.

Antes de contribuir, leia a [Visão Geral do Projeto](docs/visao-geral.md).

> **Situação:** versão 1, proposta pela Documentação no 8º período. O fluxo parte dos acordos registrados na seção 5 da Visão Geral e ainda precisa ser validado pelos subgrupos (ver [seção 10](#10-validação-com-os-subgrupos)).

## Como ler este guia

| Marcação | Significado |
|---|---|
| **Obrigatório** | Regra do projeto. A PR que não cumprir a regra não é aprovada. |
| **Recomendado** | Boa prática. O revisor pode sugerir, mas não bloqueia a PR por isso. |
| **Livre** | Decisão interna de cada subgrupo. |

Quando uma regra tem exceções, elas estão listadas logo abaixo dela.

---

## 1. Visão geral do fluxo

1. **Tarefa:** a tarefa existe como cartão no [Trello do projeto](https://trello.com/b/ZVD1CGss/projeto-apps) e tem um responsável.
2. **Desenvolvimento:** o subgrupo trabalha como preferir, em uma ou em várias branches (seção 3).
3. **Consolidação:** o subgrupo junta os avanços na branch principal do grupo, `<grupo>/main`.
4. **Pull request:** o subgrupo abre uma PR de `<grupo>/main` para `develop` e avisa a Documentação (seção 6).
5. **Revisão:** a Documentação revisa e o subgrupo faz os ajustes pedidos (seção 7).
6. **Integração:** com a PR aprovada, a Documentação faz o merge na `develop` (seção 5).
7. **Encerramento:** o cartão do Trello recebe o link da PR integrada.

---

## 2. Branches

### 2.1 Branches permanentes

| Branch | Função | Recebe código de | Quem integra |
|---|---|---|---|
| `main` | Versão estável e entregue | `homolog`, por PR | Documentação, depois da validação na `homolog` |
| `homolog` | Versão em teste controlado com a ONG | `develop`, por PR | Documentação, quando houver um conjunto pronto para homologar |
| `develop` | Integração do trabalho de todos os grupos | `<grupo>/main`, por PR | Documentação, depois da revisão |
| `<grupo>/main` | Consolidação do trabalho de um grupo | Branches internas do grupo | O próprio grupo |

**Obrigatório**

- Ninguém faz commit ou push direto em `main`, `homolog` ou `develop`. Todo código chega a essas branches por PR.
- Cada grupo tem uma única branch de consolidação no repositório principal ([vitorrosa0/Projeto-APPS](https://github.com/vitorrosa0/Projeto-APPS)), com estes nomes:

  | Grupo | Branch de consolidação |
  |---|---|
  | Animais | `animais/main` |
  | Colaboradores | `colaboradores/main` |
  | Financeiro | `financeiro/main` |
  | Documentação | `documentacao/main` (já existe) |

- Só a branch `<grupo>/main` abre PR para `develop`.

**Por quê:** um único ponto de entrada por grupo deixa claro o que cada grupo entregou, reduz o número de PRs que a Documentação revisa e mantém a `develop` sempre revisada.

**Recomendado:** o dono do repositório deve configurar a proteção das branches `main`, `homolog` e `develop` no GitHub (*Settings → Branches*), exigindo PR e pelo menos uma aprovação. Assim as regras acima passam a ser garantidas pela ferramenta.

### 2.2 Branches internas dos grupos (Livre)

A organização interna é livre. O grupo decide se trabalha direto na `<grupo>/main`, com uma branch por pessoa ou com uma branch por tarefa. Também decide se usa PRs internas e se essas branches ficam no repositório principal ou em forks pessoais.

**Recomendado** para branches internas:

- usar o formato `<grupo>/<descricao-curta>`, por exemplo `animais/filtro-por-setor` ou `documentacao/contributing`;
- escrever em minúsculas, sem acentos, com palavras separadas por hífen;
- apagar a branch depois que ela for consolidada na `<grupo>/main`.

**Por quê:** o prefixo agrupa as branches de cada grupo na lista do GitHub e evita que dois grupos usem o mesmo nome.

### 2.3 Criar a branch do grupo

Isso é feito uma única vez por grupo:

```bash
git switch develop
git pull origin develop
git switch -c animais/main
git push -u origin animais/main
```

Para criar uma branch interna a partir da branch do grupo:

```bash
git switch animais/main
git pull origin animais/main
git switch -c animais/filtro-por-setor
```

### 2.4 Atualizar a branch com a `develop`

Enquanto um grupo trabalha, outros grupos integram código na `develop`. Por isso, a `<grupo>/main` precisa ser atualizada.

**Obrigatório:** antes de abrir a PR, e de novo se o GitHub indicar conflito, trazer a `develop` para a branch do grupo **com merge**:

```bash
git switch animais/main
git pull origin animais/main
git fetch origin
git merge origin/develop
# resolver conflitos, se houver (seção 2.5)
git push origin animais/main
```

**Recomendado:** atualizar a branch do grupo sempre que uma PR de outro grupo for integrada na `develop`. Quanto mais cedo os conflitos aparecem, menores eles são.

**Não use `rebase`** em `<grupo>/main` nem em qualquer branch que outra pessoa também use.

**Por quê:** o rebase reescreve commits já publicados. Quem tiver a versão antiga da branch vai encontrar um histórico divergente, e o push passa a exigir `--force`, o que pode apagar o trabalho de colegas.

**Exceção:** em uma branch que só você usa e que ainda não foi enviada ao GitHub, o rebase é livre, por exemplo para organizar seus commits.

### 2.5 Resolver conflitos

**Obrigatório**

- Os conflitos são resolvidos **na branch do grupo** que abriu a PR, nunca na `develop`.
- Quem resolve o conflito testa o sistema antes do push (ver as validações da seção 6.3).
- Quando o conflito envolve código de outro grupo, o grupo resolve **junto com um integrante desse grupo**. Na dúvida, prevalece o que já está na `develop`, porque esse código já foi revisado.

**Passo a passo:**

1. Execute `git merge origin/develop` na branch do grupo.
2. Liste os arquivos em conflito com `git status`.
3. Em cada arquivo, procure os marcadores `<<<<<<<`, `=======` e `>>>>>>>` e mantenha a combinação correta das duas versões. Não escolha um lado sem entender o que o outro faz.
4. Marque cada arquivo como resolvido com `git add <arquivo>`.
5. Conclua com `git commit`, mantendo a mensagem de merge sugerida pelo Git.
6. Rode as validações e faça o push.

**Arquivos que exigem cuidado especial:**

| Arquivo | Como resolver |
|---|---|
| `package-lock.json` | Resolva primeiro o `package.json`. Depois rode `npm install` na pasta afetada para gerar o lock novamente e adicione o arquivo gerado. Não edite o lock à mão. |
| `backend/prisma/schema.prisma` | Mantenha os modelos e campos dos dois lados. Depois rode `npx prisma validate` e `npx prisma migrate dev` na pasta `backend`. |
| `backend/prisma/migrations/` | Nunca edite nem apague uma migração que já está na `develop`. Se a sua migração ainda não integrada conflitar, apague só a sua, atualize a branch e gere de novo com `npx prisma migrate dev --name <descricao>`. |
| Arquivos compartilhados do frontend (`frontend/lib/api.ts`, `frontend/components/`, `frontend/app/layout.tsx`) | Mantenha as alterações dos dois grupos e confira na tela as páginas dos dois módulos. |

**Recomendado:** para conflitos simples, de poucas linhas, o editor de conflitos do GitHub (*Resolve conflicts* na PR) pode ser usado, porque ele faz o mesmo merge da `develop` na branch do grupo. Para conflitos maiores, resolva localmente, onde dá para rodar o sistema.

---

## 3. Organização interna dos subgrupos

**Livre:** a divisão de tarefas, a quantidade de branches, o uso de PRs internas, a revisão entre colegas antes da consolidação e a forma de juntar o trabalho na `<grupo>/main`, que pode ser por merge, PR interna ou commit direto.

**Obrigatório**, independentemente da organização interna:

- os commits seguem o padrão da seção 4, porque todos eles chegam à `develop` (seção 5);
- a `<grupo>/main` está atualizada com a `develop` e passa nas validações da seção 6.3 quando a PR é aberta;
- cada commit identifica corretamente o autor (seção 4.5).

**Por quê:** cada grupo conhece melhor a própria forma de trabalhar. A Documentação só define o que afeta a integração entre os grupos e o registro das contribuições.

---

## 4. Mensagens de commit: Conventional Commits

O projeto usa o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). O histórico do repositório já segue esse formato, por exemplo em `feat(backend): implementa registro/login com JWT e seed do admin`.

**Por quê:** com mensagens padronizadas, dá para saber pelo `git log` o que mudou e em qual módulo, sem abrir o código. Isso facilita a revisão, a busca por erros e a montagem do registro de entregas do período.

### 4.1 Formato

```text
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Obrigatório**

- `tipo` em minúsculas, escolhido da tabela 4.2.
- `descrição` em português, no presente e na 3ª pessoa ("adiciona", "corrige", "remove"), começando com letra minúscula e sem ponto final.
- Primeira linha com até 72 caracteres.
- Uma mudança lógica por commit. Não junte uma correção de bug e uma nova tela no mesmo commit.

**Recomendado**

- Usar o escopo sempre que a mudança for de um módulo ou de uma área específica (tabela 4.3).
- Usar o corpo para explicar **por que** a mudança foi feita quando isso não for óbvio. O código já mostra **o que** mudou.
- Citar o cartão do Trello no rodapé: `Refs: https://trello.com/c/<id>`.

### 4.2 Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade para o usuário: tela, rota, campo, regra de negócio |
| `fix` | Correção de erro |
| `docs` | Apenas documentação (`.md`, comentários de documentação) |
| `style` | Formatação, sem mudar o comportamento (espaços, ponto e vírgula, ordem de imports) |
| `refactor` | Mudança de código que não corrige erro nem adiciona funcionalidade |
| `perf` | Melhoria de desempenho |
| `test` | Criação ou ajuste de testes |
| `build` | Dependências, configuração de build e scripts do `package.json` |
| `ci` | Configuração de integração contínua (GitHub Actions etc.) |
| `chore` | Tarefas de manutenção que não se encaixam nos tipos acima (`.gitignore`, arquivos de configuração do editor) |
| `revert` | Reversão de um commit anterior |

### 4.3 Escopos

| Escopo | Uso |
|---|---|
| `animais` | Módulo de animais |
| `colaboradores` | Módulo de colaboradores |
| `voluntarios` | Voluntários e agenda de voluntários |
| `financeiro` | Doações, contribuições e despesas |
| `auth` | Cadastro, login, recuperação de senha e JWT |
| `frontend` | Mudança transversal no frontend que não pertence a um único módulo (layout, navegação, componentes compartilhados) |
| `backend` | Mudança transversal no backend que não pertence a um único módulo (servidor, middlewares, configuração) |
| `prisma` | Schema, migrações e seed do banco |
| `deps` | Atualização de dependências |

Se a mudança não tem escopo claro, omita o escopo: `docs: cria guia de contribuição`.

Um escopo novo pode ser criado quando surgir um módulo novo. Nesse caso, a mesma PR adiciona o escopo a esta tabela.

### 4.4 Exemplos

```text
feat(animais): adiciona filtro de animais por setor
fix(colaboradores): corrige máscara de telefone no formulário de edição
test(financeiro): cobre validação de valor negativo em despesas
refactor(frontend): extrai cabeçalho das listas para componente compartilhado
feat(prisma): adiciona campo dataSaida ao modelo Animal
build(deps): atualiza next para 16.2.5
docs: atualiza estado do módulo de voluntários
```

Commit com corpo e rodapé:

```text
fix(voluntarios): impede agendamento em data passada

A agenda aceitava datas anteriores ao dia atual, o que gerava
lembretes que nunca seriam enviados.

Refs: https://trello.com/c/9Z9l52Vo
Co-authored-by: Lennon Rangel <email-do-lennon@exemplo.com>
```

Mudança que quebra compatibilidade, como uma rota renomeada ou um campo removido, leva `!` depois do tipo/escopo e o rodapé `BREAKING CHANGE`:

```text
feat(animais)!: renomeia rota /animais/lista para /animais

BREAKING CHANGE: o frontend precisa usar GET /animais.
```

**Exemplos que não seguem o padrão:**

| Mensagem | Problema |
|---|---|
| `ajustes` | Sem tipo e sem descrição do que mudou |
| `Feat: Adicionei tela.` | Tipo em maiúscula, verbo no passado e ponto final |
| `fix: varias coisas` | Mais de uma mudança no mesmo commit |

### 4.5 Autoria e contribuições individuais

**Obrigatório:** configurar o Git com o mesmo nome e e-mail da sua conta do GitHub, para que os commits apareçam no seu perfil e possam ser usados como comprovação acadêmica:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "email-da-conta@github.com"
```

**Obrigatório:** em trabalho feito em dupla ou em grupo (programação em par, uma pessoa compartilhando a tela), quem faz o commit adiciona os demais participantes no rodapé:

```text
Co-authored-by: Nome Completo <email-da-conta@github.com>
```

**Por quê:** o projeto precisa comprovar a contribuição de cada integrante. O GitHub atribui o commit a todos os coautores declarados.

### 4.6 Exceções

- Commits feitos antes da adoção deste guia não precisam ser reescritos.
- Os commits de merge gerados pelo Git ou pelo GitHub (`Merge branch...`, `Merge pull request #...`) mantêm a mensagem padrão.
- Se um commit com mensagem fora do padrão ainda não foi enviado ao GitHub, corrija com `git commit --amend`. Se já foi enviado em uma branch compartilhada, deixe como está e siga o padrão nos próximos commits.

---

## 5. Estratégia de merge

**Obrigatório:** as PRs para `develop`, `homolog` e `main` são integradas com **Create a merge commit**. Não use *Squash and merge* nem *Rebase and merge*.

**Por quê:**

- **Preserva a autoria individual.** Com squash, todos os commits do grupo viram um só, atribuído a uma única pessoa. Assim se perde a comprovação de quem fez o quê.
- **Preserva as mensagens no padrão da seção 4**, que contam a evolução de cada módulo.
- **Funciona com branches de grupo permanentes.** Depois de um squash, a `<grupo>/main` continua com os commits originais, que o Git não reconhece como integrados. Na PR seguinte, esses commits aparecem de novo e geram conflitos falsos.
- **Marca cada entrega.** Cada commit de merge na `develop` corresponde a uma PR revisada e pode ser revertido de uma vez com `git revert -m 1 <commit>`.

Esse é o formato já usado nas PRs #1, #3 e #4.

**Livre:** a estratégia de merge **dentro** do grupo, das branches internas para a `<grupo>/main`.

### 5.1 Histórico esperado

Diagrama do fluxo entre as branches. O tempo corre da esquerda para a direita, `o` é um commit e `M` é um commit de merge:

```text
main             o----------------------------------------------M
                  \                                            /
homolog            o--------------------------------------M---'
                    \                                    /
develop              o-----------M--------------------M-'
                     |\         / \                  /
animais/main         | o---o---o   \                /
                      \             \              /
financeiro/main        o---o---------M---o--------'
                                     ^
                                     merge da develop na branch do grupo
```

Leitura do diagrama:

1. `animais/main` sai da `develop`, recebe commits e é integrada por PR, gerando o merge `M` na `develop`.
2. `financeiro/main` traz a `develop` atualizada para dentro de si antes da PR (seção 2.4) e depois é integrada.
3. Quando há um conjunto pronto, a `develop` vai para a `homolog` por PR. Depois de validada com a ONG, a `homolog` vai para a `main`.

Na prática, o comando `git log --oneline --graph develop` deve mostrar algo assim:

```text
*   Merge pull request #12 from vitorrosa0/financeiro/main
|\
| *   Merge remote-tracking branch 'origin/develop' into financeiro/main
| |\
| |/
|/|
* |   Merge pull request #11 from vitorrosa0/animais/main
|\ \
| * | test(animais): cobre cadastro com campos obrigatórios
| * | feat(animais): adiciona filtro de animais por setor
|/ /
| * feat(financeiro): cadastra despesa com categoria
| * feat(prisma): adiciona modelo Despesa
|/
* docs: cria guia de contribuição
```

Para ver só as entregas integradas, uma linha por PR:

```bash
git log --oneline --first-parent develop
```

```text
cd7b9c6 Merge pull request #12 from vitorrosa0/financeiro/main
426b24e Merge pull request #11 from vitorrosa0/animais/main
a78bc6f docs: cria guia de contribuição
```

Os dois exemplos acima foram gerados simulando o fluxo deste guia em um repositório de teste.

### 5.2 Exceções

- **Correção urgente na `homolog` ou na `main`:** quando um erro bloqueia o teste com a ONG e não dá para esperar o fluxo normal, crie `hotfix/<descricao>` a partir da branch afetada e abra a PR direto para ela, com revisão da Documentação. Depois da integração, a correção precisa voltar para a `develop` por PR, para não se perder na próxima promoção.
- **Reversão:** para desfazer uma PR integrada, abra uma nova PR com `git revert -m 1 <commit-do-merge>`. Nunca use `git reset` nem `push --force` nas branches permanentes.

---

## 6. Pull request para `develop`

### 6.1 Quando abrir

Abra a PR quando um conjunto de mudanças estiver funcionando de ponta a ponta e puder ser revisado sozinho. Um único cartão do Trello ou um grupo pequeno de cartões relacionados é um bom tamanho.

**Recomendado:** prefira PRs menores e mais frequentes. Uma PR com centenas de arquivos é difícil de revisar e acumula conflitos.

**Recomendado:** se quiser retorno antes de terminar, abra a PR como **Draft**. A Documentação só faz a revisão formal quando a PR sai de Draft.

### 6.2 Conteúdo da PR

**Obrigatório**

- **Base:** `develop`. **Origem:** `<grupo>/main`.
- **Título** no formato da seção 4, resumindo a entrega: `feat(animais): estabiliza cadastro e edição de animais`.
- **Descrição** preenchida com o modelo abaixo.

````markdown
## Objetivo
O que esta PR entrega e por quê. Uma ou duas frases.

## Cartões do Trello
- https://trello.com/c/...

## O que mudou
- Principais mudanças no frontend, no backend e no banco.
- Mudanças que quebram compatibilidade (rotas, campos, variáveis de ambiente), se houver.

## Como testar
1. Passos para o revisor reproduzir o fluxo.
2. Dados ou usuário de teste necessários.

## Validações
- [ ] `npm run lint` no frontend
- [ ] `npm run build` no frontend
- [ ] Backend sobe com `npm run dev` sem erros
- [ ] `npx prisma validate` e `npx prisma migrate dev` (se o schema mudou)
- [ ] Testes automatizados (quando existirem)
- [ ] Fluxo testado manualmente no navegador

Marque somente o que foi executado. Se algo não se aplica ou não foi possível, explique.

## Capturas de tela
Antes e depois das telas alteradas (obrigatório se a PR muda alguma tela).

## Documentos atualizados
- `README.md`, `docs/estado-dos-modulos.md`, etc. Se nenhum precisou mudar, escreva "Nenhum" e explique.

## Contribuições
| Integrante | Contribuição |
|---|---|
| Nome | O que fez nesta entrega |
````

**Por quê:** a descrição permite que o revisor entenda e teste a entrega sem depender de conversa paralela. A tabela de contribuições e as capturas de tela também servem de comprovação acadêmica.

### 6.3 Validações antes de abrir

**Obrigatório:** rode as validações das áreas que a PR alterou:

| Área alterada | Validação |
|---|---|
| `frontend/` | `npm run lint` e `npm run build` na pasta `frontend`, sem erros |
| `backend/` | `npm run dev` na pasta `backend` sobe sem erros, e as rotas alteradas foram chamadas pelo menos uma vez |
| `backend/prisma/` | `npx prisma validate` e `npx prisma migrate dev` sem erros. A migração gerada está no commit. |
| Qualquer área com testes | Testes automatizados passando |

**Exceção:** o projeto ainda não tem testes automatizados configurados. Enquanto isso, a validação manual do fluxo no navegador é obrigatória e precisa estar descrita em "Como testar". Quando os testes forem configurados, esta seção será atualizada.

**Exceção:** PRs que alteram apenas documentação dispensam as validações de código. O autor confere os links e a formatação no preview do GitHub.

### 6.4 Documentos afetados

**Obrigatório:** se a PR muda algo descrito em um documento do repositório, o documento é atualizado **na mesma PR**. Exemplos:

| Mudança no código | Documento a atualizar |
|---|---|
| Nova rota, tela ou funcionalidade concluída | `docs/estado-dos-modulos.md` e a lista de funcionalidades do `README.md` |
| Nova variável de ambiente, script ou passo de instalação | `README.md` |
| Mudança na arquitetura, nas tecnologias ou numa decisão registrada | `docs/visao-geral.md` |
| Mudança no fluxo de contribuição | Este `CONTRIBUTING.md` |

**Por quê:** a documentação só é confiável se mudar junto com o código. Se ficar para depois, ela desatualiza.

---

## 7. Revisão e ajustes

### 7.1 Quem revisa

**Obrigatório**

- Toda PR para `develop` precisa da aprovação de pelo menos **um integrante da Documentação** (Vitor Rosa, Lucas Ciampi ou Gustavo Amaral).
- Depois de abrir a PR, o grupo avisa a Documentação pelo canal combinado da equipe e marca um revisor em *Reviewers* no GitHub.

**Exceção:** nas PRs da própria Documentação, o revisor é um integrante da Documentação **que não é autor** da PR. O GitHub não permite aprovar a própria PR.

**Recomendado:** quando a PR altera código de outro grupo (arquivos compartilhados, schema do banco), marque também um integrante desse grupo como revisor.

### 7.2 O que o revisor confere

- Se a descrição está completa (seção 6.2) e as validações foram executadas.
- Se os commits e o título seguem a seção 4.
- Se a funcionalidade atende ao cartão do Trello.
- Se o código segue os padrões de desenvolvimento, testes e integração do projeto, quando estiverem documentados.
- Se os documentos afetados foram atualizados (seção 6.4).
- Se a PR não traz arquivos indevidos: `.env`, `node_modules`, bancos locais (`*.db`), arquivos pessoais.

### 7.3 Resultado da revisão

| Resultado no GitHub | Significado | Próximo passo |
|---|---|---|
| **Approve** | Pode integrar | A Documentação faz o merge (seção 5) |
| **Request changes** | Há um problema que impede a integração | O grupo ajusta e pede nova revisão |
| **Comment** | Dúvidas ou sugestões que não bloqueiam | O grupo responde, e o revisor decide se aprova |

**Recomendado:** o revisor separa nos comentários o que é **bloqueante** do que é **sugestão**, por exemplo começando a sugestão com "Sugestão:".

**Recomendado:** a Documentação começa a revisão em até 2 dias úteis depois do aviso. Esse prazo ainda precisa ser validado com os grupos.

### 7.4 Como fazer os ajustes

**Obrigatório**

- Os ajustes são feitos com **novos commits** na mesma branch (`<grupo>/main`), seguindo a seção 4. A PR é atualizada sozinha.
- Não use `push --force` depois que a revisão começou. Assim o revisor consegue ver exatamente o que mudou desde a última revisão.
- Responda a cada comentário bloqueante, dizendo o que foi feito ou por que não foi.
- Depois dos ajustes, peça nova revisão pelo botão *Re-request review*.

**Recomendado:** quem abriu o comentário marca a conversa como resolvida (*Resolve conversation*), e não o autor da PR.

### 7.5 Integração e encerramento

**Obrigatório**

1. Com a PR aprovada e sem conflitos, um integrante da Documentação faz o merge com **Create a merge commit**.
2. O grupo coloca o link da PR integrada no cartão do Trello e move o cartão para concluído.
3. Se a branch for interna, o grupo pode apagá-la. A `<grupo>/main` **não** é apagada.

---

## 8. Exceções gerais

| Situação | Tratamento |
|---|---|
| Correção urgente na `homolog` ou na `main` | Branch `hotfix/<descricao>` (seção 5.2) |
| Mudança que afeta vários grupos | Pode partir de qualquer `<grupo>/main`. A PR lista os grupos afetados e marca um revisor de cada um. |
| Commits antigos fora do padrão | Não são reescritos (seção 4.6) |
| Projeto ainda sem testes automatizados | A validação manual é obrigatória e precisa ser descrita (seção 6.3) |
| Integrante sem acesso de escrita ao repositório | Pode trabalhar em um fork pessoal e abrir PR para a `<grupo>/main`. Peça acesso de escrita ao dono do repositório para abrir a PR do grupo. |

---

## 9. Resumo rápido

```text
Trello → branch do grupo (organização livre) → commits no padrão tipo(escopo): descrição
      → merge da develop na <grupo>/main → validações → PR <grupo>/main → develop
      → revisão da Documentação → ajustes com novos commits → merge commit → cartão concluído
```

---

## 10. Validação com os subgrupos

Este guia formaliza os acordos da seção 5 da [Visão Geral](docs/visao-geral.md). Os **nomes das branches** (seção 2) e a **estratégia de merge** (seção 5) foram definidos nesta versão e precisam ser confirmados pelos grupos.

| Grupo | Situação | Observações |
|---|---|---|
| Documentação | Pendente | |
| Animais | Pendente | |
| Colaboradores | Pendente | |
| Financeiro | Pendente | |

Sugestões de mudança neste guia seguem o próprio fluxo: uma PR alterando este arquivo, revisada pela Documentação.

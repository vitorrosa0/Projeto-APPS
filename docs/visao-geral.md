# Visão Geral do Projeto

Este documento apresenta o propósito do projeto, seu histórico e a organização da equipe. Ele deve ser o primeiro ponto de leitura para quem entra no projeto.

Itens marcados com **[PENDENTE]** ainda não foram levantados e devem ser completados assim que a informação estiver disponível.

---

## 1. Contexto e histórico

O projeto é desenvolvido na disciplina **Práticas de Extensão e Projeto Integrador** da **Uniacademia (Juiz de Fora)**, sob orientação do professor **Marco Aurélio Piccinini**.

### Origem da ideia

A ideia surgiu no primeiro semestre de 2023, em um trabalho da disciplina **Criatividade e Inovação**, no qual a equipe encontrou um dado indicando que o número de animais em situação de rua em Juiz de Fora cresce todos os anos desde a pandemia.

Como os idealizadores são estudantes de Engenharia de Software, surgiu a proposta de atuar nessa causa aplicando tecnologia.

### Aproximação com a instituição

A equipe visitou a ONG SJPA e identificou que a instituição abriga aproximadamente **400 animais**, mas **não possui controle estruturado** de:

- entrada e saída de animais;
- dinheiro (doações recebidas e despesas);
- colaboradores e voluntários.

O pouco controle que existe é feito **em papel**. Essa falta de organização gera trabalho extra e dificulta a rotina da ONG.

### Linha do tempo

| Período | O que aconteceu |
|---|---|
| 1º semestre de 2023 | Início do projeto: levantamento do problema na disciplina de Criatividade e Inovação e aproximação com a SJPA |
| Abr/2026 – Jun/2026 | Primeiro ciclo de desenvolvimento: protótipo das telas (login, cadastro, animais, colaboradores, doações, voluntários) e primeira versão da API (Express + Prisma) |
| 2º semestre de 2026 | Reorganização da equipe em frentes de Documentação e Desenvolvimento (ver seção 5) |

---

## 2. Problema, público e objetivos

### Problema atendido

A SJPA não tem ferramentas para registrar e acompanhar os animais abrigados, as pessoas que ajudam a instituição e a movimentação financeira. Os controles que existem são feitos em papel, o que consome tempo da equipe da ONG e dificulta a consulta às informações.

### Público beneficiado

- **Diretamente:** os colaboradores e as pessoas que trabalham na SJPA, que serão os usuários do sistema.
- **Indiretamente:** os animais abrigados, que recebem mais atenção quando a equipe gasta menos tempo com trabalho administrativo.

Como os usuários estão no dia a dia do abrigo, o sistema é pensado **mobile first**: deve funcionar bem principalmente no celular.

### Objetivo do sistema

"Tirar um peso das costas" da ONG: resolver o problema de organização para que a equipe possa focar no resgate e no cuidado dos animais.

Objetivos específicos:

1. Manter um registro atualizado dos animais presentes no abrigo.
2. Registrar colaboradores e voluntários, que mudam com frequência.
3. Controlar receitas (principalmente doações) e despesas da instituição.

---

## 3. Instituição e interlocutores

| Pessoa | Organização | Papel no projeto |
|---|---|---|
| Marco Aurélio Piccinini | Uniacademia | Professor orientador |
| Vitor Rosa | Equipe do projeto | Líder do projeto |
| Beatriz | SJPA | Representante da ONG, responsável pela gestão geral da instituição e ponto de contato com a equipe |

---

## 4. Módulos do sistema

A divisão em **Animais**, **Colaboradores** e **Financeiro** foi definida após conversas com a representante da ONG, por serem os três pontos principais da gestão da instituição.

### 4.1 Animais

Registro dos animais presentes na instituição, gerando uma relação de todos os animais abrigados.

Dados registrados atualmente no sistema:

| Campo | Observação |
|---|---|
| Nome | |
| Tipo | Cão ou gato |
| Raça | |
| Idade | Aproximada (texto livre, ex.: "3 anos") |
| Sexo | Masculino ou feminino |
| Setor e canil | Localização no abrigo. Setores de A a I, cada um com suas baias/canis |
| Cor da pelagem | |
| Temperamento | Ex.: dócil |
| Vacinação | Completa, incompleta ou não vacinado, com data |
| Foto | |
| Outros | Observações livres (medicação, vacinas em falta etc.) |

Funcionalidades existentes: cadastro, edição, remoção, listagem separada de cães e gatos e exportação da lista para CSV.

- **[PENDENTE]** Validar com a ONG se os campos acima são suficientes.
- **[PENDENTE]** Registro de entrada e saída de animais (data de chegada, adoção, óbito, transferência). Esse foi um dos problemas identificados na visita, mas ainda não existe no sistema.

### 4.2 Colaboradores

A ONG recebe muitos voluntários esporádicos, que ajudam de tempos em tempos, e as pessoas envolvidas mudam bastante. O módulo registra essas pessoas e o que elas fazem pela instituição.

A equipe diferencia os dois perfis pela frequência de participação:

- **Colaborador:** participa do dia a dia da ONG. No sistema, guarda nome, e-mail, telefone, data de adesão, status (ativo, inativo ou pausado), informações adicionais e um histórico de contribuições (financeira, produto ou serviço, com valor e data).
- **Voluntário:** ajuda pontualmente, indo à ONG em um dia para realizar uma atividade específica. No sistema, guarda nome, e-mail, telefone e informações adicionais. Há também uma agenda para marcar a presença de voluntários por dia, horário e motivo (cuidados diários, banho, socialização, manutenção, ajuda em eventos) e registrar lembretes.


### 4.3 Financeiro

Controle das entradas e saídas de dinheiro da ONG.

- **Receitas:** principalmente doações, que podem ser em dinheiro (valor) ou em itens (ex.: ração, cobertores).
- **Despesas:** contas diversas, como alimentação, vacinação, luz e água.

Situação atual: existe uma tela de doações com listagem por mês e cadastro, mas ela ainda usa dados de exemplo e não está conectada ao backend. A tela de despesas aparece no menu inicial, mas ainda não foi criada.

- **[PENDENTE]** Categorias de despesa usadas pela ONG.
- **[PENDENTE]** Relatórios esperados (ex.: balanço mensal, prestação de contas a doadores).
- **[PENDENTE]** Relação entre doações e as contribuições registradas no módulo de Colaboradores.

---

## 5. Equipe atual

A equipe tem 10 integrantes de Engenharia de Software, organizados em duas frentes.

### Frente 1: Documentação

Define e mantém os padrões do projeto e garante que sejam seguidos por todas as equipes.

**Integrantes:** Vitor Rosa, Lucas Ciampi, Gustavo Amaral

**Responsabilidades:**

- Definir padrões de integração, testes e desenvolvimento.
- Criar e manter arquivos `.md` no frontend e no backend com arquitetura, estrutura, padrões de desenvolvimento, padrões de testes e padrões de integração.
- Acompanhar o Trello.
- Avaliar os PRs abertos pelas outras equipes, garantindo a conformidade com os padrões.

### Frente 2: Desenvolvimento

Dividida em três subgrupos, um por módulo. Todos têm as mesmas responsabilidades dentro do seu módulo e devem colaborar entre si:

- Finalização do frontend (telas, funcionalidades etc.).
- Finalização do backend.
- Integração front-back.
- Desenvolvimento de testes unitários.

| Subgrupo | Integrantes |
|---|---|
| Animais | Gustavo Lopes, João Marco Batista, João Victor Leal |
| Colaboradores | Lucas Tinoco, Lennon Rangel |
| Financeiro | Allan Chang, Felipe Agapito |

### Fluxo de trabalho

1. Os subgrupos trabalham colaborativamente, em várias branches ou em uma única, como preferirem.
2. Ao final, centralizam os avanços em uma branch principal do grupo.
3. Abrem um PR para a branch `develop`.
4. Avisam o time de Documentação para avaliação.
5. Após aprovação, o PR é mesclado na `develop`.

As tarefas de todas as frentes são acompanhadas no [Trello do projeto](https://trello.com/b/ZVD1CGss/projeto-apps).

---

## 6. Decisões anteriores

Decisões tomadas no primeiro ciclo de desenvolvimento que ajudam a entender o estado atual do código:

| Decisão | Motivo / observação |
|---|---|
| Frontend em **Next.js + React + TypeScript + Tailwind CSS** | Familiaridade da equipe com as tecnologias |
| Backend em **Node.js + Express**, organizado em rotas e controllers | Familiaridade da equipe com as tecnologias |
| **Prisma** como ORM e **SQLite** como banco | SQLite simplifica o desenvolvimento local. O schema já indica os passos para migrar para **PostgreSQL** em produção |
| Autenticação com **JWT** | Cadastro e login de usuários; há um usuário administrador padrão criado pelo seed para desenvolvimento |
| Interface **mobile first** | Os usuários estão no dia a dia do abrigo. Menu inferior no celular e barra lateral no desktop |
| Nomes em **português** no código (rotas, modelos, campos) | Mantém o vocabulário alinhado ao da ONG |
| Estrutura de setores (A–I) e baias/canis do abrigo fixa no frontend | Reflete a organização física da SJPA. **[PENDENTE]** Confirmar se a estrutura está correta e atualizada |
| Divisão do sistema em três módulos | Definida após conversas com a representante da ONG (ver seção 4) |

- **[PENDENTE]** Onde o sistema será hospedado e quem será responsável pela manutenção após o fim do projeto.

---

## 7. Resumo das pendências

- Validação dos campos de animais e registro de entrada/saída.
- Validação da diferença entre colaborador e voluntário com a ONG.
- Conexão da agenda de voluntários e das doações ao backend.
- Categorias de despesa, relatórios financeiros e relação entre doações e contribuições.
- Confirmação da estrutura de setores e canis do abrigo.
- Hospedagem e manutenção após o fim do projeto.

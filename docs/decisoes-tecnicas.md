# Decisões Técnicas

Este documento registra as escolhas técnicas e de organização do projeto: o que já é praticado no código, o que foi confirmado pela equipe e o que ainda está em discussão. Ele é a fonte única sobre a **situação** de cada decisão. Os outros documentos fazem referência às entradas daqui (por exemplo, "ver DT-21") em vez de repetir o conteúdo.

Leia antes a [Visão Geral do Projeto](./visao-geral.md). Para o estado de cada funcionalidade, veja o [estado dos módulos](./estado-dos-modulos.md). Para prioridades e prazos, veja [entregas e próximos passos](./entregas-e-proximos-passos.md).

> **Situação deste registro:** versão 1, preparada pela Documentação a partir dos documentos existentes e da leitura do código em outubro de 2026. Nenhuma prática foi promovida a decisão confirmada sem evidência. As entradas aguardam validação dos grupos (ver [seção 7](#7-validação-deste-registro)).

## Como ler este documento

### Status

| Status | Significado | Exige |
|---|---|---|
| **Prática atual** | Como o projeto funciona hoje, observado no código ou nos documentos, **sem registro de aprovação**. Pode ter justificativa conhecida ou não. | Nada para continuar em uso. Para virar decisão confirmada, passa pela aprovação da seção 6. |
| **Confirmada** | Escolha aprovada por quem tem competência para isso (seção 6.3), com evidência registrada (PR, cartão ou registro da ONG). | Seguir. Para mudar, abrir uma proposta de substituição. |
| **Proposta pendente** | Questão em aberto, com ou sem proposta formulada. **Não deve ser implementada como definitiva** até ser confirmada. | Decisão dos responsáveis indicados. |
| **Substituída** | Decisão que deixou de valer. O texto é mantido e aponta para a entrada que a substituiu. | Nada. Serve como histórico. |

### Campos de cada entrada

| Campo | Conteúdo |
|---|---|
| **Status** | Um dos status acima |
| **Decisão / prática** | O que se faz ou o que está sendo proposto |
| **Justificativa** | O motivo conhecido e onde ele está registrado. Quando não há registro, aparece **"Não registrada"**. |
| **Impactos** | Consequências para o código, os dados, os outros grupos ou a ONG |
| **Validação** | Quem confirmou e onde, ou quem ainda precisa confirmar |
| **Cartão / PR** | Links de rastreabilidade |

---

## Índice

| ID | Assunto | Área | Status |
|---|---|---|---|
| [DT-01](#dt-01--frontend-em-nextjs-react-typescript-e-tailwind-css) | Frontend em Next.js, React, TypeScript e Tailwind CSS | Tecnologias | Prática atual |
| [DT-02](#dt-02--backend-em-nodejs-e-express) | Backend em Node.js e Express | Tecnologias | Prática atual |
| [DT-03](#dt-03--prisma-e-sqlite-no-desenvolvimento) | Prisma e SQLite no desenvolvimento | Tecnologias | Prática atual |
| [DT-04](#dt-04--banco-de-dados-fora-do-desenvolvimento) | Banco de dados fora do desenvolvimento | Tecnologias | Proposta pendente |
| [DT-05](#dt-05--autenticação-e-proteção-das-rotas) | Autenticação e proteção das rotas | Tecnologias | Prática atual |
| [DT-06](#dt-06--testes-automatizados) | Testes automatizados | Tecnologias | Proposta pendente |
| [DT-07](#dt-07--divisão-do-sistema-em-três-módulos) | Divisão do sistema em três módulos | Organização | Confirmada |
| [DT-08](#dt-08--organização-da-equipe-e-fluxo-de-integração) | Organização da equipe e fluxo de integração | Organização | Confirmada |
| [DT-09](#dt-09--regras-de-branches-commits-e-merge) | Regras de branches, commits e merge | Organização | Proposta pendente |
| [DT-10](#dt-10--documentação-versionada-em-docs) | Documentação versionada em `docs/` | Organização | Confirmada |
| [DT-11](#dt-11--nomes-em-português-no-código) | Nomes em português no código | Organização | Prática atual |
| [DT-12](#dt-12--interface-mobile-first) | Interface mobile first | Organização | Prática atual |
| [DT-13](#dt-13--estrutura-de-pastas) | Estrutura de pastas | Organização | Prática atual |
| [DT-14](#dt-14--tipos-de-campo-datas-valores-e-listas-como-texto) | Tipos de campo: datas, valores e listas como texto | Dados | Prática atual |
| [DT-15](#dt-15--campos-do-cadastro-de-animais) | Campos do cadastro de animais | Dados | Prática atual |
| [DT-16](#dt-16--setores-e-canis-fixos-no-frontend) | Setores e canis fixos no frontend | Dados | Prática atual |
| [DT-17](#dt-17--foto-do-animal) | Foto do animal | Dados | Proposta pendente |
| [DT-18](#dt-18--histórico-de-entrada-e-saída-dos-animais) | Histórico de entrada e saída dos animais | Dados | Proposta pendente |
| [DT-19](#dt-19--colaborador-e-voluntário-como-cadastros-separados) | Colaborador e voluntário como cadastros separados | Dados | Prática atual |
| [DT-20](#dt-20--modelo-de-receitas-contribuições-e-doações) | Modelo de receitas: contribuições e doações | Integração entre módulos | Proposta pendente |
| [DT-21](#dt-21--despesas-e-categorias) | Despesas e categorias | Dados | Proposta pendente |
| [DT-22](#dt-22--comunicação-entre-frontend-e-backend) | Comunicação entre frontend e backend | Integração | Prática atual |
| [DT-23](#dt-23--hospedagem-homologação-backup-e-manutenção) | Hospedagem, homologação, backup e manutenção | Infraestrutura | Proposta pendente |

---

## 1. Tecnologias

### DT-01 — Frontend em Next.js, React, TypeScript e Tailwind CSS

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | Frontend em Next.js 16 (App Router), React 19, TypeScript 5 e Tailwind CSS 4, com ícones de `react-icons` e `lucide-react`. Versões em `frontend/package.json`. |
| **Justificativa** | Familiaridade da equipe com as tecnologias (levantamento inicial registrado na Visão Geral, [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). Não há registro da época da escolha. |
| **Impactos** | Define as habilidades necessárias para o frontend. Há duas bibliotecas de ícones em uso ao mesmo tempo. Não há registro de que isso seja intencional. |
| **Validação** | Confirmar com os grupos de Desenvolvimento. Avaliar se as duas bibliotecas de ícones serão mantidas. |
| **Cartão / PR** | Primeiro ciclo (abr–jun/2026), anterior ao uso de PRs. Registro na [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1). |

### DT-02 — Backend em Node.js e Express

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | API em Node.js com Express 5, em CommonJS (`require`), organizada em `routes/` e `controllers/`. Senhas com `bcryptjs` e tokens com `jsonwebtoken`. |
| **Justificativa** | Familiaridade da equipe com as tecnologias (levantamento inicial registrado na Visão Geral, [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). O uso de JavaScript, e não de TypeScript, no backend não tem justificativa registrada. |
| **Impactos** | Frontend e backend usam linguagens diferentes (TypeScript e JavaScript), então os tipos do frontend não são compartilhados com a API. |
| **Validação** | Confirmar com os grupos de Desenvolvimento. |
| **Cartão / PR** | Commit `50e1fe2` (estrutura inicial do backend). Registro na [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1). |

### DT-03 — Prisma e SQLite no desenvolvimento

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | ORM Prisma 7 com SQLite pelo adaptador `better-sqlite3`. As migrations ficam em `backend/prisma/migrations/`. O banco local (`*.db`) não é versionado. |
| **Justificativa** | O SQLite simplifica o desenvolvimento local (levantamento inicial registrado na Visão Geral, [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). |
| **Impactos** | As migrations usam a variável `DATABASE_URL` (`prisma.config.ts`), mas a aplicação abre um arquivo em caminho fixo, `backend/dev.db` (`src/prisma.js`). Alterar só a `DATABASE_URL` não muda o banco usado pela aplicação, e os dois caminhos precisam apontar para o mesmo arquivo. |
| **Validação** | Confirmar com os grupos. Avaliar se a conexão da aplicação deve usar a `DATABASE_URL`. |
| **Cartão / PR** | Commit `50e1fe2`. Registro na [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1). |

### DT-04 — Banco de dados fora do desenvolvimento

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | **Proposta existente:** usar PostgreSQL em produção. O schema, o `prisma.config.ts` e o `src/prisma.js` trazem comentários com os passos de migração e sugestões de serviços gratuitos. Esses comentários são orientação, não decisão aprovada. |
| **Justificativa** | Não registrada. Os comentários no código não explicam o motivo da recomendação. |
| **Impactos** | Depende da hospedagem (DT-23). A troca de banco exige recriar as migrations para o novo provedor e testar os campos de texto descritos em DT-14. |
| **Validação** | Documentação e grupos de Desenvolvimento, junto com a definição de DT-23. |
| **Cartão / PR** | [DOC — Documentação e padrões](https://trello.com/c/qqbdAPEF) (versão de homologação). |

### DT-05 — Autenticação e proteção das rotas

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | Cadastro e login em `/auth` geram um JWT válido por 7 dias. O frontend guarda o token no `localStorage`. **As rotas de animais, colaboradores e voluntários não exigem token**, e o frontend não envia o token nas requisições. Se `JWT_SECRET` não estiver definido, o backend usa um segredo padrão fixo no código. O seed cria um usuário administrador para desenvolvimento. Qualquer pessoa pode se cadastrar pela rota `/auth/register`. |
| **Justificativa** | O uso de JWT está no levantamento inicial registrado na Visão Geral ([PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). O segredo padrão é justificado no próprio código como suficiente para um protótipo acadêmico. Para a ausência de proteção das rotas e para o cadastro aberto: **não registrada**. |
| **Impactos** | Hoje os dados da API podem ser lidos e alterados sem login. Isso **impede o uso com dados reais da ONG** até que seja revisto. O documento de entregas já indica que a autenticação "requer revisão antes da homologação". |
| **Validação** | Documentação e grupos de Desenvolvimento, antes da homologação. Os perfis de acesso (quem pode fazer o quê) são regra de negócio e dependem da ONG. |
| **Cartão / PR** | Commits `08213ae`, `fa8d40d` e `b867bac`. [Entregas, seção 3](./entregas-e-proximos-passos.md#3-resumo-por-área). |

### DT-06 — Testes automatizados

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | **Prática atual:** não há testes automatizados. A validação é manual, e o frontend tem `npm run lint` e `npm run build`. **Proposta existente:** testes unitários e de integração para o fluxo de animais, com lint, testes e build executados antes da integração ([Entregas, seção 5.1](./entregas-e-proximos-passos.md#51-atividades-de-prioridade-p0)). A ferramenta de testes não foi escolhida. |
| **Justificativa** | Garantir a estabilidade do fluxo principal antes da homologação ([Entregas, seção 5.1](./entregas-e-proximos-passos.md#51-atividades-de-prioridade-p0)). |
| **Impactos** | Enquanto não houver testes, as PRs dependem de validação manual descrita na própria PR. |
| **Validação** | Documentação, com o grupo Animais. A escolha da ferramenta precisa ser registrada aqui quando for feita. |
| **Cartão / PR** | [ANIMAIS — Gestão de animais](https://trello.com/c/brAqTdwD) |

---

## 2. Organização

### DT-07 — Divisão do sistema em três módulos

| Campo | Registro |
|---|---|
| **Status** | Confirmada |
| **Decisão / prática** | O sistema é dividido nos módulos **Animais**, **Colaboradores** (que inclui voluntários) e **Financeiro**. |
| **Justificativa** | São os três pontos principais da gestão da instituição, segundo conversas com a representante da ONG ([Visão Geral, seção 4](./visao-geral.md#4-módulos-do-sistema)). |
| **Impactos** | Define os subgrupos de Desenvolvimento, os escopos de commit e os épicos do Trello. |
| **Validação** | Definida com a representante da ONG. O registro dessas conversas não está versionado. Recomenda-se anexar data e canal, se existirem. |
| **Cartão / PR** | [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1) |

### DT-08 — Organização da equipe e fluxo de integração

| Campo | Registro |
|---|---|
| **Status** | Confirmada |
| **Decisão / prática** | Equipe dividida em Documentação e Desenvolvimento (um subgrupo por módulo). Cada subgrupo se organiza como preferir, consolida o trabalho em uma branch principal do grupo e abre PR para `develop`, que a Documentação revisa antes da integração. As tarefas são acompanhadas no [Trello](https://trello.com/b/ZVD1CGss/projeto-apps). |
| **Justificativa** | Planejamento do 8º período, que define as responsabilidades de cada frente ([Visão Geral, seção 5](./visao-geral.md#5-equipe-atual)). |
| **Impactos** | Toda entrega passa pela revisão da Documentação. Os detalhes operacionais ficam em DT-09. |
| **Validação** | Planejamento do período apresentado à equipe. |
| **Cartão / PR** | [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1) |

### DT-09 — Regras de branches, commits e merge

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | **Proposta:** as regras do [Guia de Contribuição](../CONTRIBUTING.md). Branch de consolidação `<grupo>/main`, Conventional Commits e integração com merge commit. Este registro não repete as regras; o `CONTRIBUTING.md` é a referência. |
| **Justificativa** | Está no próprio guia. Entre os motivos, a preservação da autoria individual para comprovação acadêmica. |
| **Impactos** | Afeta todos os grupos. |
| **Validação** | Subgrupos, conforme a seção 10 do `CONTRIBUTING.md`. Quando a PR do guia for integrada e os grupos confirmarem, esta entrada passa a Confirmada. |
| **Cartão / PR** | PR do `CONTRIBUTING.md` (em revisão) |

### DT-10 — Documentação versionada em `docs/`

| Campo | Registro |
|---|---|
| **Status** | Confirmada |
| **Decisão / prática** | A documentação do projeto fica em Markdown, em português, versionada no repositório, na pasta `docs/`. O README de cada parte cobre a instalação e a execução. |
| **Justificativa** | Responsabilidade da Documentação, definida no planejamento do período ([Visão Geral, seção 5](./visao-geral.md#5-equipe-atual)). Versionar junto com o código permite atualizar a documentação na mesma PR que muda o comportamento. |
| **Impactos** | Os documentos passam pelo mesmo fluxo de revisão do código. |
| **Validação** | Planejamento do período. |
| **Cartão / PR** | [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1), [PR #3](https://github.com/vitorrosa0/Projeto-APPS/pull/3), [PR #4](https://github.com/vitorrosa0/Projeto-APPS/pull/4) |

### DT-11 — Nomes em português no código

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | Rotas, modelos, campos, controllers e mensagens de erro em português (`/animais`, `Colaborador`, `dataAdesao`, `{ erro }`). Termos técnicos do framework continuam em inglês (`page.tsx`, `createdAt`). |
| **Justificativa** | Manter o vocabulário alinhado ao da ONG (levantamento inicial registrado na Visão Geral, [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). |
| **Impactos** | Os nomes ficam sem acento no código (`voluntarios`, `contribuicoes`). |
| **Validação** | Confirmar com os grupos de Desenvolvimento. |
| **Cartão / PR** | [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1) |

### DT-12 — Interface mobile first

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | A interface é projetada primeiro para o celular, com menu inferior no celular e barra lateral no desktop. |
| **Justificativa** | Os usuários estão no dia a dia do abrigo ([Visão Geral, seção 2](./visao-geral.md#2-problema-público-e-objetivos)). |
| **Impactos** | Toda tela nova precisa ser verificada em largura de celular. |
| **Validação** | Confirmar com os grupos. Validar com a ONG durante a homologação. |
| **Cartão / PR** | [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1) |

### DT-13 — Estrutura de pastas

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | **Frontend:** rotas em `frontend/app/(etapas)/<modulo>/` (uma `page.tsx` por rota), componentes compartilhados em `frontend/components/` e acesso à API em `frontend/lib/api.ts`. **Backend:** `src/routes/` define os endpoints e `src/controllers/` concentra a validação, a regra de negócio e o acesso ao banco, sem uma camada separada de serviços. |
| **Justificativa** | Não registrada. |
| **Impactos** | Com as regras de negócio nos controllers, elas são mais difíceis de testar isoladamente (DT-06). A decisão sobre criar ou não uma camada de serviços deve ser tomada junto com a definição dos testes. |
| **Validação** | Documentação e grupos de Desenvolvimento, no documento de arquitetura. |
| **Cartão / PR** | [DOC — Documentação e padrões](https://trello.com/c/qqbdAPEF) |

---

## 3. Dados

### DT-14 — Tipos de campo: datas, valores e listas como texto

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | No `schema.prisma`, várias datas, valores e listas de opções são do tipo `String`: `Colaborador.dataAdesao`, `Contribuicao.data`, `Contribuicao.valor`, `Animal.dataVacinacao`, `Animal.idade`, `Animal.tipo`, `Animal.sexo`, `Animal.vacinacao` e `Colaborador.status`. Os valores aceitos (por exemplo `"cao"` ou `"gato"`) são definidos só no frontend e nos controllers. |
| **Justificativa** | Não registrada. No caso de `idade`, o texto livre ("3 anos") é intencional, porque a idade é aproximada ([Visão Geral, seção 4.1](./visao-geral.md#41-animais)). |
| **Impactos** | Ordenar ou filtrar por data e **somar valores** exige conversão manual e pode falhar com formatos diferentes. Isso afeta diretamente os relatórios financeiros (DT-20 e DT-21). O banco não impede valores fora da lista esperada. |
| **Validação** | Grupos de Desenvolvimento e Documentação. Precisa ser resolvido antes do backend financeiro. |
| **Cartão / PR** | [FINANCEIRO — Controle financeiro](https://trello.com/c/t1yoK7yG) |

### DT-15 — Campos do cadastro de animais

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | Os campos atuais estão listados na [Visão Geral, seção 4.1](./visao-geral.md#41-animais). Apenas `nome` e `tipo` são obrigatórios no banco. |
| **Justificativa** | Levantamento inicial da equipe. O registro da validação com a ONG não existe. |
| **Impactos** | Mudanças nos campos exigem migration e ajustes nas telas de cadastro, edição, listagem e exportação CSV. |
| **Validação** | **Pendente com a ONG**, junto com DT-18 ([Entregas, seção 5.1](./entregas-e-proximos-passos.md#51-atividades-de-prioridade-p0)). |
| **Cartão / PR** | [ANIMAIS — Gestão de animais](https://trello.com/c/brAqTdwD) |

### DT-16 — Setores e canis fixos no frontend

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | Os setores A a I e os canis de cada setor são uma lista fixa no código do frontend (`frontend/app/(etapas)/animais/cadastrar/page.tsx`). No banco, `setor` e `canil` são texto livre. |
| **Justificativa** | Refletir a organização física da SJPA (levantamento inicial registrado na Visão Geral, [PR #1](https://github.com/vitorrosa0/Projeto-APPS/pull/1)). Não há registro do motivo para a lista ficar no frontend e não no banco. |
| **Impactos** | Qualquer mudança no abrigo exige alterar o código e publicar uma nova versão. A ONG não consegue manter a lista sozinha. |
| **Validação** | **Pendente com a ONG:** confirmar se a estrutura está correta e se muda com frequência. A resposta indica se a lista deve continuar fixa ou passar a ser cadastrável. |
| **Cartão / PR** | [ANIMAIS — Gestão de animais](https://trello.com/c/brAqTdwD) |

### DT-17 — Foto do animal

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | **Prática atual:** o campo `foto` existe no banco, mas a tela gera só uma pré-visualização local, e a imagem não é enviada ao backend. **Opções registradas:** implementar a persistência das fotos ou retirar temporariamente a funcionalidade do escopo ([Entregas, seção 5.1](./entregas-e-proximos-passos.md#51-atividades-de-prioridade-p0)). |
| **Justificativa** | Não aplicável até a escolha. |
| **Impactos** | Persistir as fotos exige definir onde os arquivos ficam (o que depende de DT-23), o tamanho máximo e o backup. |
| **Validação** | Grupo Animais e Documentação. A importância da foto para a rotina deve ser confirmada com a ONG. |
| **Cartão / PR** | [ANIMAIS — Gestão de animais](https://trello.com/c/brAqTdwD) |

### DT-18 — Histórico de entrada e saída dos animais

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | Não existe no sistema. Precisam ser definidos: quais situações registrar (chegada, adoção, óbito, fuga, transferência, resgate), quais dados cada uma exige e se um animal pode sair e voltar. |
| **Justificativa** | Foi um dos problemas identificados na visita à ONG ([Visão Geral, seção 4.1](./visao-geral.md#41-animais)). |
| **Impactos** | Muda o modelo de dados de Animal e a forma de calcular "animais presentes no abrigo". |
| **Validação** | **Regra de negócio: depende da ONG.** Não deve ser modelado por suposição. |
| **Cartão / PR** | [ANIMAIS — Gestão de animais](https://trello.com/c/brAqTdwD) |

### DT-19 — Colaborador e voluntário como cadastros separados

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | `Colaborador` e `Voluntario` são modelos separados. Colaborador tem e-mail obrigatório e único, status e histórico de contribuições. Voluntário tem só os dados de contato, que são opcionais. A agenda de voluntários ainda não tem backend. |
| **Justificativa** | Diferença na frequência de participação: o colaborador atua no dia a dia, e o voluntário ajuda pontualmente ([Visão Geral, seção 4.2](./visao-geral.md#42-colaboradores)). |
| **Impactos** | Uma pessoa que passa de voluntário a colaborador precisa ser cadastrada de novo. Isso afeta a agenda e o modelo de receitas (DT-20). |
| **Validação** | **Pendente com a ONG:** confirmar a diferença entre os perfis ([Entregas, seção 5.2](./entregas-e-proximos-passos.md#52-atividades-de-prioridade-p1)). |
| **Cartão / PR** | [COLABORADORES — Colaboradores e agenda](https://trello.com/c/9Z9l52Vo) |

### DT-20 — Modelo de receitas: contribuições e doações

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | **Prática atual:** `Contribuicao` pertence a um `Colaborador` (tipo financeira, produto ou serviço, com `valor` e `data` em texto). Ao apagar um colaborador, as contribuições dele são apagadas junto (`onDelete: Cascade`). Doações avulsas existem só como tela com dados de exemplo, sem modelo no banco. **Proposta registrada nos épicos COL e FIN:** consolidar contribuições financeiras e doações em uma visão de receitas, identificando a origem e evitando duplicação, e manter itens e serviços identificados separadamente ([Entregas, seção 5.2](./entregas-e-proximos-passos.md#52-atividades-de-prioridade-p1)). |
| **Justificativa** | Os relatórios financeiros precisam de uma visão única das entradas de dinheiro sem contar a mesma receita duas vezes. |
| **Impactos** | Envolve Colaboradores e Financeiro. **Questões em aberto, sem resposta por suposição:** (1) uma única tabela de receitas ou tabelas separadas com uma consulta consolidada; (2) como registrar doação de alguém que não é colaborador; (3) se doações em itens entram nos relatórios em dinheiro; (4) se o histórico de contribuições deve continuar sendo apagado junto com o colaborador; (5) o formato de `valor` e `data` (DT-14). |
| **Validação** | Grupos Colaboradores e Financeiro, com a Documentação. As regras de prestação de contas dependem da ONG. O backend financeiro só deve ser implementado depois da confirmação ([Entregas, seção 5.2](./entregas-e-proximos-passos.md#52-atividades-de-prioridade-p1)). |
| **Cartão / PR** | [COLABORADORES](https://trello.com/c/9Z9l52Vo), [FINANCEIRO](https://trello.com/c/t1yoK7yG) |

### DT-21 — Despesas e categorias

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | Não existe no sistema. A tela de despesas aparece no menu, mas não foi criada. Faltam as categorias reais de despesa e os relatórios esperados. |
| **Justificativa** | Controlar as saídas de dinheiro é um dos objetivos do sistema ([Visão Geral, seção 2](./visao-geral.md#2-problema-público-e-objetivos)). |
| **Impactos** | Depende de DT-14. Junto com DT-20, define os relatórios financeiros. |
| **Validação** | **Pendente com a ONG:** categorias e relatórios. Depois, o grupo Financeiro e a Documentação. |
| **Cartão / PR** | [FINANCEIRO — Controle financeiro](https://trello.com/c/t1yoK7yG) |

---

## 4. Integração

### DT-22 — Comunicação entre frontend e backend

| Campo | Registro |
|---|---|
| **Status** | Prática atual |
| **Decisão / prática** | API REST com JSON. O frontend faz todas as chamadas pela função `api()` de `frontend/lib/api.ts`, que usa `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3001`) e lança um erro com a mensagem do campo `erro` quando a resposta não é bem-sucedida. O backend responde a erros com `{ "erro": "<mensagem>" }` e o status HTTP correspondente. O CORS aceita qualquer origem. |
| **Justificativa** | Não registrada. |
| **Impactos** | Um formato de erro único permite que todas as telas tratem erros da mesma forma. O CORS aberto precisa ser revisto antes da homologação, junto com DT-05. Não há documento dos contratos da API, que é uma atividade P0 ([Entregas, seção 5.1](./entregas-e-proximos-passos.md#51-atividades-de-prioridade-p0)). |
| **Validação** | Documentação e grupos de Desenvolvimento, no documento de contratos da API. |
| **Cartão / PR** | [DOC — Documentação e padrões](https://trello.com/c/qqbdAPEF) |

---

## 5. Infraestrutura

### DT-23 — Hospedagem, homologação, backup e manutenção

| Campo | Registro |
|---|---|
| **Status** | Proposta pendente |
| **Decisão / prática** | Não há proposta formalizada. Precisam ser definidos o ambiente de homologação, a hospedagem do frontend, da API e do banco, a rotina de backup e quem mantém o sistema depois do fim do projeto. |
| **Justificativa** | Não aplicável até haver proposta. |
| **Impactos** | Bloqueia a versão de homologação (P0) e condiciona DT-04 e DT-17. A publicação para uso real só deve ocorrer depois dessa definição ([Entregas, seção 7](./entregas-e-proximos-passos.md#7-direção-proposta-para-o-9º-período)). |
| **Validação** | Documentação e grupo Animais (responsáveis pela homologação). A responsabilidade pela manutenção precisa ser acordada com a ONG e o professor orientador. |
| **Cartão / PR** | Cartão da versão de homologação: a criar ou vincular |

---

## 6. Como registrar e mudar decisões

### 6.1 Quando registrar

**Obrigatório:** a PR que fizer qualquer uma das mudanças abaixo inclui, **na mesma PR**, uma entrada nova ou a atualização de uma entrada existente:

- adotar, trocar ou remover uma tecnologia, biblioteca principal ou serviço externo;
- alterar o modelo de dados (`schema.prisma`) de forma que afete outro módulo ou os relatórios;
- alterar o contrato da API (rotas, formato de requisição, resposta ou erro);
- alterar a estrutura de pastas ou a organização do código;
- implementar uma regra de negócio que estava como Proposta pendente.

**Por quê:** se o registro ficar para depois, ele não acontece, e a decisão volta a ser "prática sem justificativa".

**Exceções:** correções de erro que não mudam contrato nem dados, atualizações de versão menor de dependências e refatorações internas de um módulo não precisam de entrada.

### 6.2 Proposta

1. Crie uma entrada com o próximo ID livre e status **Proposta pendente**, usando o modelo da seção 6.7.
2. Descreva as opções consideradas e as questões em aberto. Não apresente uma opção como escolhida.
3. Marque quem precisa validar (seção 6.3) e o cartão do Trello.

**Recomendado:** discuta a proposta primeiro no cartão do Trello e abra a PR quando houver uma opção preferida.

### 6.3 Aprovação

| Tipo de decisão | Quem aprova |
|---|---|
| Afeta um único módulo | O subgrupo responsável e um integrante da Documentação |
| Afeta mais de um módulo ou o projeto inteiro | Todos os subgrupos afetados e um integrante da Documentação |
| Regra de negócio (o que a ONG faz, precisa ou permite) | A ONG, com o registro de quem confirmou, quando e por qual canal. Em seguida, os grupos afetados. |

**Obrigatório**

- A aprovação é registrada com um link no campo **Validação**: aprovação na PR, comentário no cartão ou registro da conversa com a ONG.
- **A ausência de objeção não equivale a aprovação**, como já definido em [Entregas, seção 5](./entregas-e-proximos-passos.md#5-compromissos-propostos-para-o-8º-período).
- A Documentação e os grupos **não decidem regras de negócio por suposição**. Sem a confirmação da ONG, a entrada continua como Proposta pendente.
- Uma Prática atual só passa a Confirmada pelo mesmo processo de aprovação.

### 6.4 Revisão

**Recomendado:** a Documentação revisa este registro no fim de cada ciclo, junto com o documento de [entregas e próximos passos](./entregas-e-proximos-passos.md). Na revisão, confere se as práticas continuam iguais ao código e se as propostas pendentes têm dono e prazo.

**Obrigatório:** se o código divergir de uma decisão Confirmada, a divergência é registrada na entrada. Depois, o código é corrigido ou é aberta uma proposta de substituição. A diferença não deve ficar sem registro.

### 6.5 Substituição e histórico

**Obrigatório**

- Uma entrada Confirmada **não é reescrita nem apagada**. Para mudar uma decisão, crie uma nova entrada com a linha `Substitui: DT-xx` e altere o status da antiga para `Substituída por DT-yy`, mantendo o texto original.
- Os IDs nunca são reutilizados.
- Toda mudança de status é registrada no [histórico de alterações](#8-histórico-de-alterações).

**Exceção:** correções de texto que não mudam o sentido (erro de digitação, link quebrado) podem ser feitas direto na entrada, sem substituição.

**Por quê:** o histórico mostra por que o projeto mudou de rumo e evita que uma decisão antiga seja retomada sem conhecer o motivo da troca.

### 6.6 Evitar divergência entre documentos

**Obrigatório**

- Este arquivo é a fonte da **situação** de cada decisão. Os outros documentos citam o ID (`ver DT-20`) e não copiam o status nem a justificativa.
- Os detalhes de cada assunto continuam no documento próprio: regras Git no `CONTRIBUTING.md`, campos na Visão Geral, estado das funcionalidades no estado dos módulos. Este registro aponta para eles.
- A PR que mudar uma decisão atualiza também os documentos que a citam.

### 6.7 Modelo de entrada

```markdown
### DT-XX — Assunto

| Campo | Registro |
|---|---|
| **Status** | Prática atual / Confirmada / Proposta pendente / Substituída por DT-YY |
| **Decisão / prática** | O que se faz ou se propõe. Para propostas, as opções consideradas. |
| **Justificativa** | Motivo e fonte. Se não houver: "Não registrada". |
| **Impactos** | Efeitos no código, nos dados, nos outros grupos e na ONG. |
| **Validação** | Quem aprovou, com link, ou quem precisa aprovar. |
| **Cartão / PR** | Links. |
```

Exemplo de substituição:

```markdown
### DT-24 — Banco PostgreSQL no ambiente de homologação

Substitui: DT-04

| Campo | Registro |
|---|---|
| **Status** | Confirmada |
| ... | ... |
```

Neste exemplo, o status da DT-04 passaria a `Substituída por DT-24`.

---

## 7. Validação deste registro

As entradas foram montadas a partir dos documentos existentes e do código. Cada grupo deve conferir as entradas da sua área e registrar a concordância ou os ajustes na PR deste documento ou no cartão correspondente.

| Grupo | Entradas a conferir | Situação |
|---|---|---|
| Documentação | Todas | Pendente |
| Animais | DT-01 a DT-06, DT-13 a DT-18, DT-22 e DT-23 | Pendente |
| Colaboradores | DT-01 a DT-06, DT-13, DT-14, DT-19, DT-20 e DT-22 | Pendente |
| Financeiro | DT-01 a DT-06, DT-13, DT-14, DT-20, DT-21 e DT-22 | Pendente |
| ONG | DT-15, DT-16, DT-18, DT-19, DT-20 e DT-21 (regras de negócio) | Pendente, a consultar |

---

## 8. Histórico de alterações

| Data | Alteração | Entradas |
|---|---|---|
| 02/10/2026 | Criação do registro a partir da Visão Geral, do estado dos módulos, das entregas e da leitura do código | DT-01 a DT-23 |

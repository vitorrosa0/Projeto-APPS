# Arquitetura e Organização do Sistema

Este documento descreve a arquitetura geral do Projeto-APPS, incluindo a separação entre os principais componentes (frontend, backend e banco de dados) e suas respectivas responsabilidades.

Documento da [DOC-08](https://trello.com/c/MgZNb8qp), conferido em 10/10/2026 com o código atual, o [README](../README.md), a [visão geral](visao-geral.md), o [estado dos módulos](estado-dos-modulos.md) e as [entregas e próximos passos](entregas-e-proximos-passos.md).

Os IDs de decisão citados abaixo (DT-XX) remetem ao [registro de decisões técnicas](decisoes-tecnicas.md) (DOC-06); a situação e a evidência de aprovação de cada decisão devem ser conferidas nele. O guia do backend (DOC-10) está em [backend/README.md](../backend/README.md). O guia do frontend (DOC-09, `frontend/README.md`) continua ausente nesta branch e deverá ser consultado quando disponível.

As descrições de implementação indicam o comportamento observado, sem presumir aprovação de todas as práticas. As recomendações da seção 4.2 são sugestões para avaliação. A validação desta documentação e as evidências de conclusão estão pendentes, conforme a seção 5.

**Alinhamento com a DOC-11 (12/10/2026):** os [padrões de testes e política de cobertura](testes.md) estão disponíveis nesta branch como proposta. Seus impactos estruturais são registrados na seção 4.2 e na DT-13; não representam alterações já implementadas nem resolvem a decisão pendente sobre serviços.

---

## 1. Componentes e Responsabilidades

O sistema segue uma arquitetura baseada em separação de responsabilidades (client-server), dividida nos seguintes componentes principais:

### 1.1 Frontend (Interface do Usuário)

A camada de apresentação com a qual os usuários da ONG SJPA interagem, focada em uma experiência *mobile-first*.

- **Tecnologias envolvidas:** Next.js (App Router), React, TypeScript e Tailwind CSS; ver DT-01.
- **Responsabilidades:**
  - Renderizar as interfaces de usuário (telas de login, listagem e cadastro de animais, colaboradores e doações).
  - Coletar entradas e aplicar as validações locais existentes em cada tela. No cadastro de animais, o frontend envia os dados sem verificar o preenchimento de nome e tipo; o backend faz essa validação.
  - Consumir as APIs fornecidas pelo backend e tratar os estados de carregamento (loading) e erros.
  - Gerenciar o estado da aplicação no lado do cliente.
- **Justificativa da arquitetura:** Como os usuários operam principalmente pelo celular no dia a dia do abrigo, a interface precisa ser responsiva e interagir com o backend de forma assíncrona (via API) para garantir um uso ágil.

### 1.2 Backend (API e Regras de Negócio)

O núcleo lógico do sistema, que funciona como intermediário entre a interface de usuário e o armazenamento de dados.

- **Tecnologias envolvidas:** Node.js com Express; ver DT-02.
- **Responsabilidades:**
  - Disponibilizar endpoints (rotas da API REST) para o frontend.
  - Aplicar as validações implementadas nos controllers (ex.: exigir nome e tipo no cadastro de animais e aceitar apenas `cao` ou `gato`). O Financeiro ainda não possui backend.
  - Cadastrar usuários, validar credenciais no login e emitir JWT. A proteção das rotas dos módulos ainda não está implementada (ver seções 3.2 e 4.2).
  - Acessar o banco de dados pelo Prisma a partir dos controllers.
- **Obrigação de validação:** As regras de negócio aplicáveis devem ser verificadas no backend, mesmo quando houver validação no frontend. Isso impede que chamadas diretas à API contornem verificações da interface. No cadastro de animais, por exemplo, o controller rejeita requisições sem nome ou tipo.

### 1.3 Banco de Dados (Persistência)

A camada responsável pelo armazenamento seguro e estruturado de todas as informações.

- **Tecnologias envolvidas:** SQLite acessado via Prisma ORM no desenvolvimento (DT-03). A proposta de PostgreSQL para produção é tratada na DT-04 e na seção 4.2.
- **Responsabilidades:**
  - Armazenar de forma relacional usuários, animais, colaboradores, voluntários e contribuições vinculadas a colaboradores. A tabela `Contribuicao` pertence ao módulo de Colaboradores; o Financeiro ainda não possui tabelas ou backend, e suas telas de doações usam dados mockados.
  - Garantir a integridade referencial dos dados.

A relação entre contribuições de colaboradores e doações do Financeiro permanece pendente de definição pelos grupos envolvidos, conforme o [estado dos módulos](estado-dos-modulos.md#32-grupo-colaboradores-e-voluntários); ver DT-20.

---

## 2. Mapeamento de Pastas e Percurso da Operação

A organização dos arquivos reflete a arquitetura do sistema e dita como as informações trafegam desde o usuário até o banco de dados.

### 2.1 Estrutura de Pastas

A estrutura base separa frontend e backend; ver DT-13. Os controllers concentram validação e acesso ao banco, sem uma camada separada de serviços.

**No Frontend (`frontend/`):**

- `app/`: Contém as páginas e o roteamento da interface. O projeto usa o *App Router* do Next.js. As telas dos módulos estão organizadas na pasta interna `(etapas)`, com subpastas para `animais`, `colaboradores`, `doacoes`, etc.
- `components/`: Guarda elementos reutilizáveis de interface, como botões, modais e formulários, evitando duplicação de código visual.
- `lib/`: Contém funções utilitárias ou auxiliares do cliente.

**No Backend (`backend/`):**

- `src/routes/`: Define as portas de entrada (endpoints) da API, conectando os endereços acessados aos processadores da requisição (ex: `animais.js`, `colaboradores.js`).
- `src/controllers/`: Recebe os dados da requisição, aplica as validações implementadas, acessa o banco e envia a resposta HTTP.
- `src/server.js`: Configura o Express, o CORS, a leitura de JSON, a montagem das rotas e o tratamento central de erros.
- `src/prisma.js`: Exporta a instância compartilhada do Prisma com o adaptador SQLite.
- `prisma/`: Contém a definição das tabelas em `schema.prisma`, o histórico de migrations e o seed.

### 2.2 O Percurso de uma Operação

O cadastro de um novo animal exemplifica a comunicação entre interface, API e persistência:

1. **Interface (Frontend):** O usuário preenche o formulário em `frontend/app/(etapas)/animais/cadastrar/page.tsx`. Ao salvar, o frontend converte o rótulo do tipo para `cao` ou `gato`, monta o JSON e chama `api("/animais", { method: "POST", body: payload })`. Não há verificação local de preenchimento de nome e tipo nesse fluxo.
2. **Rota (Backend):** `backend/src/server.js` monta o router em `/animais`. Em `backend/src/routes/animais.js`, `router.post("/", ctrl.criar)` encaminha a requisição ao controller.
3. **Controlador (Backend):** A função `criar` em `backend/src/controllers/animaisController.js` exige nome e tipo e valida se o tipo é `cao` ou `gato`. Se a validação falhar, responde com status 400 e a mensagem no campo `erro`, sem gravar o animal.
4. **Persistência (Banco de Dados):** Estando tudo certo, o controlador se comunica com o banco de dados usando as configurações do Prisma. A informação é gravada na tabela definida em `schema.prisma`.
5. **Retorno:** Após o Prisma retornar o animal gravado, o controlador responde diretamente à requisição HTTP com `res.status(201).json(animal)`. O frontend recebe a resposta e exibe o aviso de sucesso. O arquivo de rotas apenas associa o endpoint ao controlador; não processa o retorno.

**Tratamento de erros:** Se a API retornar um erro HTTP, `api()` lança um erro com a mensagem recebida, e a página mostra um alerta. Exceções capturadas pelo controller são encaminhadas ao middleware de erros em `server.js`.

---

## 3. Limites dos Módulos e Dependências Compartilhadas

Para manter o sistema organizado, o projeto é dividido em módulos que possuem responsabilidades claras, mas que eventualmente precisam compartilhar informações e ferramentas.

### 3.1 Limites dos Módulos

Os módulos principais (Animais, Colaboradores/Voluntários e Financeiro/Doações) operam de forma majoritariamente isolada:

- **Animais:** Gerencia cadastro, características, listagem, edição, remoção e exportação CSV dos animais. O histórico de entrada e saída ainda não possui telas, rotas ou tabelas (DT-18). O modelo `Animal` não possui relação com colaboradores ou dados financeiros.
- **Colaboradores e Voluntários:** Gerencia o cadastro das pessoas envolvidas com a ONG e o histórico de contribuições dos colaboradores. A tabela `Contribuicao` pertence a este módulo, com listagem e registro pela rota `/colaboradores/:id/contribuicoes`. Cada contribuição está vinculada a um colaborador pela chave estrangeira `colaboradorId`.
- **Financeiro (Doações):** Previsto para controlar receitas e despesas. Atualmente, as telas de doações usam dados mockados, sem integração com a API. O módulo ainda não possui rotas, controllers ou tabelas próprias.
- **Dependência pendente:** A relação entre as contribuições registradas em Colaboradores e as doações do Financeiro ainda precisa ser definida pelos dois grupos, conforme o [estado dos módulos](estado-dos-modulos.md#32-grupo-colaboradores-e-voluntários) e a DT-20. O vínculo atual entre `Contribuicao` e `Colaborador` não estabelece uma regra de vínculo obrigatório para futuras doações avulsas.

**Limitação de integração:** A agenda de voluntários mantém dados locais no frontend, sem backend ou persistência de agendamentos; ver DT-19 e o estado dos módulos.

### 3.2 Dependências Compartilhadas

Existem ferramentas e arquivos compartilhados entre diversas telas e controllers, embora seu uso não seja uniforme:

**No Frontend:**

- **Componentes de UI (`frontend/components/`):** Arquivos como `Header.tsx`, `ConfirmModal.tsx`, `InputGroup.tsx` e `BottomNav.tsx` são reutilizados por diversas telas. Por exemplo, as listagens de animais e voluntários usam `ConfirmModal`. As páginas de Colaboradores ainda possuem implementações locais de cabeçalho e navegação inferior.
- **Utilitários de API (`frontend/lib/api.ts`):** Monta a URL com `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3001`) e o caminho informado, define os cabeçalhos e trata erros HTTP. É usado nas chamadas dos módulos integrados e não inclui automaticamente um token de autenticação; ver DT-22.
- **Exceção de comunicação:** Login e cadastro de usuários usam `fetch()` diretamente, com `http://localhost:3001` fixo nos arquivos das páginas. Alterar `NEXT_PUBLIC_API_URL` não altera o endereço dessas chamadas; ver DT-22.

**No Backend:**

- **Conexão com Banco de Dados (`backend/src/prisma.js`):** Todos os controllers importam a mesma instância para acessar as tabelas, centralizando a configuração da conexão; ver DT-03.
- **Autenticação (`backend/src/controllers/authController.js` e `backend/src/routes/auth.js`):** É compartilhada e não pertence a um módulo de negócio específico. Atualmente, gera JWT no cadastro e no login de usuários. Em `backend/src/server.js` e nos arquivos de rotas, `/animais`, `/colaboradores` e `/voluntarios` não usam middleware de validação de token; essas rotas ainda não são protegidas pela autenticação. Ver DT-05 e a seção 4.2.

---

## 4. Estrutura Implementada vs. Evolução Proposta

Sendo um projeto em construção, nem todas as decisões arquitetônicas definitivas já estão aplicadas. É importante diferenciar o que já está rodando hoje no repositório daquilo que é uma proposta futura.

### 4.1 O que está implementado (Cenário Atual)

- **Banco de Dados Local:** O sistema utiliza SQLite integrado ao Prisma, simplificando o desenvolvimento por armazenar os dados em um arquivo local. A aplicação abre `backend/dev.db` por um caminho fixo em `src/prisma.js`; as migrations usam `DATABASE_URL` em `prisma.config.ts`. Os caminhos precisam apontar para o mesmo banco (DT-03).
- **Inicialização e isolamento para testes:** `src/server.js` cria a aplicação e chama `listen` no mesmo módulo; os controllers importam diretamente a instância do Prisma por `require()`. Não há fábrica/injeção de dependência para controllers ou banco de testes configurado. A DOC-11 registra propostas para lidar com essas limitações, sem modificar a implementação atual (DT-06 e DT-13).
- **Execução Local:** Os scripts e endereços documentados contemplam execução local do frontend e da API. A definição do ambiente de homologação, hospedagem e manutenção permanece pendente; ver DT-23.
- **Tabelas Atuais:** O `backend/prisma/schema.prisma` define `Usuario` (autenticação), `Animal` (Animais), `Colaborador`, `Voluntario` e `Contribuicao` (Colaboradores e Voluntários). O Financeiro ainda não possui tabelas para doações avulsas ou despesas.

### 4.2 Sugestões para proposta de evolução (Cenário Futuro / Produção)

Abaixo estão propostas existentes e recomendações desta documentação. Nenhuma ferramenta, provedor ou automação é adotado por esta seção. As escolhas precisam seguir o processo de avaliação da DOC-06 e envolver os responsáveis afetados.

- **Banco fora do desenvolvimento — proposta existente (DT-04):** Avaliar PostgreSQL para produção em conjunto com a hospedagem, o uso esperado e a migração dos dados. Os comentários do código sugerem essa alternativa, mas não registram uma justificativa para a escolha. A troca exige planejar as migrations do novo provedor e preservar o histórico publicado conforme o [Guia de Contribuição](../CONTRIBUTING.md#25-resolver-conflitos).
- **Implantação e CI/CD — recomendação para avaliação (DT-23):** Definir ambiente de homologação, hospedagem e responsáveis pela manutenção para viabilizar o acesso pela ONG. Avaliar automação de verificações e publicação conforme as necessidades e os recursos da equipe; CI/CD não é requisito desta entrega documental.
- **Estrutura para testes — propostas pendentes de validação (DT-13, em conjunto com DT-06):** A [DOC-11, seção 4](testes.md#4-independência-dados-e-dependências) propõe separar a criação/exportação da aplicação Express da inicialização com `listen`, configurar/injetar banco exclusivo de testes e permitir isolamento da persistência nos controllers por fábrica/injeção de dependência. Como alternativa para os unitários, avaliar substituição compatível com CommonJS antes de carregar o controller, evitando inicializar o banco real. Os impactos incluem mudanças no ponto de inicialização, na construção/importação de controllers e rotas e na seleção do banco. A decisão sobre criar ou não uma camada de serviços deve ser tomada junto com os testes; nenhuma dessas propostas a resolve. Documentação e grupos de Desenvolvimento precisam validar a estratégia e sua compatibilidade com o executor antes da implementação. As regras de migrations do [Guia de Contribuição, seção 2.5](../CONTRIBUTING.md#25-resolver-conflitos) continuam valendo.
- **Proteção das rotas — revisão necessária (DT-05):** Recomenda-se implementar a validação do JWT nas rotas dos módulos e o envio do token pelo frontend. A emissão de JWT atual não restringe o acesso aos dados da API. Conforme a DT-05, essa limitação precisa ser revista antes do uso com dados reais da ONG. Os perfis e regras de autorização dependem da ONG e dos grupos de Desenvolvimento, com a Documentação.
- **Fotos — definição pendente (DT-17):** A foto selecionada no formulário gera apenas uma prévia local e não é enviada ao backend nem gravada no banco. A DT-17 registra as opções de implementar a persistência ou retirar temporariamente a funcionalidade do escopo. Se o upload for implementado, recomenda-se avaliar armazenamento separado dos arquivos, mantendo uma referência no banco, para facilitar sua gestão e backup. O local de armazenamento, os limites de arquivo e o backup precisam ser definidos com Animais e Documentação, em conjunto com a DT-23; a importância da foto depende de confirmação com a ONG.
- **Receitas — definição pendente (DT-20):** Colaboradores e Financeiro precisam definir, com a Documentação e a ONG para as regras de negócio, como relacionar contribuições e doações para os relatórios sem duplicar receitas. Esta documentação não escolhe entre tabela única e consulta consolidada de tabelas separadas.
- **Monitoramento — recomendação para avaliação:** Avaliar logs e acompanhamento de erros no frontend e no backend para facilitar o diagnóstico de falhas relatadas pela ONG. Não há ferramenta escolhida; qualquer proposta de serviço deve passar pela avaliação da equipe e pelo registro na DOC-06.
- **Backup — definição pendente (DT-23):** Definir periodicidade, armazenamento, responsáveis e procedimento de restauração para reduzir o risco de perda de dados. Recomenda-se avaliar automação e verificar a recuperação de uma cópia antes do uso real; não há rotina implementada ou serviço escolhido por esta documentação.

---

## 5. Validação e evidências de conclusão

As correções documentais atendem ao pedido de revisão, mas não substituem a validação humana prevista na DOC-08. Os registros abaixo indicam o que falta comprovar, sem atribuir aprovações ou contribuições não confirmadas.

| Responsável pela validação | Conteúdo a conferir | Situação |
|---|---|---|
| Documentação | Consistência com a DOC-06, distinção entre implementação e propostas e revisão da entrega | Pendente de registro |
| Animais | Fluxo de cadastro, limites do módulo, foto e histórico de entrada e saída | Pendente de registro |
| Colaboradores | Cadastros, contribuições, agenda e componentes utilizados | Pendente de registro |
| Financeiro | Ausência de backend, telas com dados mockados e relação futura com contribuições | Pendente de registro |

Para concluir a tarefa, registrar no [cartão da DOC-08](https://trello.com/c/MgZNb8qp) ou na PR as validações aplicáveis, verificações e limitações, contribuições individuais e evidências acadêmicas. As contribuições devem indicar quem participou e o que realizou, conforme o [Guia de Contribuição](../CONTRIBUTING.md#45-autoria-e-contribuições-individuais). O cartão contém o link da [PR #7](https://github.com/vitorrosa0/Projeto-APPS/pull/7); sua aprovação, integração e a inclusão destas correções ainda precisam ser comprovadas.

**Verificação documental:** conferir o conteúdo contra o código e as referências, os links e a formatação. Como esta entrega altera apenas documentação, testes da aplicação são dispensados pelo [Guia de Contribuição](../CONTRIBUTING.md#63-validações-antes-de-abrir). A disponibilidade da DOC-09 e o alinhamento com a versão integrada da DOC-06 devem ser reconferidos antes da conclusão.

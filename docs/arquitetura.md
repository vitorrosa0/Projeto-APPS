# Arquitetura e Organização do Sistema

Este documento descreve a arquitetura geral do Projeto-APPS, incluindo a separação entre os principais componentes (frontend, backend e banco de dados) e suas respectivas responsabilidades.

Documento da [DOC-08](https://trello.com/c/MgZNb8qp), conferido em 10/10/2026 com o código atual, o [README](../README.md), a [visão geral](visao-geral.md), o [estado dos módulos](estado-dos-modulos.md) e as [entregas e próximos passos](entregas-e-proximos-passos.md).

O registro de decisões técnicas não está no diretório de trabalho desta branch. Para o alinhamento com a DOC-06, foi consultada a [versão do registro no commit `e92ffcb`](https://github.com/vitorrosa0/Projeto-APPS/blob/e92ffcb72908d50512fa61e0289aa3df4a0e946c/docs/decisoes-tecnicas.md), disponível na referência Git local `origin/documentacao/main`. Os IDs citados abaixo remetem a esse registro; sua situação e evidência de aprovação devem ser conferidas nele. Os guias específicos (DOC-09, `frontend/README.md`; DOC-10, `backend/README.md`) continuam ausentes nesta branch e deverão ser consultados quando disponíveis.

As descrições de implementação indicam o comportamento observado, sem presumir aprovação de todas as práticas. As recomendações da seção 4.2 são sugestões para avaliação. A validação desta documentação e as evidências de conclusão estão pendentes, conforme a seção 5.

---

## 1. Componentes e Responsabilidades

O sistema segue uma arquitetura baseada em separação de responsabilidades (client-server), dividida nos seguintes componentes principais:

### 1.1 Frontend (Interface do Usuário)

A camada de apresentação com a qual os usuários da ONG SJPA interagem, focada em uma experiência *mobile-first*.
- **Tecnologias envolvidas:** Next.js, React e Tailwind CSS.

- **Tecnologias envolvidas:** Next.js (App Router), React, TypeScript e Tailwind CSS; ver DT-01.

- **Responsabilidades:**
  - Renderizar as interfaces de usuário (telas de login, listagem e cadastro de animais, colaboradores e doações).
  - Validar as entradas de dados localmente antes de enviá-las ao servidor.
  - Coletar entradas e aplicar as validações locais existentes em cada tela. No cadastro de animais, o frontend envia os dados sem verificar o preenchimento de nome e tipo; o backend faz essa validação.
  - Consumir as APIs fornecidas pelo backend e tratar os estados de carregamento (loading) e erros.
  - Gerenciar o estado da aplicação no lado do cliente.

- **Justificativa da arquitetura:** Como os usuários operam principalmente pelo celular no dia a dia do abrigo, a interface precisa ser responsiva e interagir com o backend de forma assíncrona (via API) para garantir um uso ágil.

### 1.2 Backend (API e Regras de Negócio)

O núcleo lógico do sistema, que funciona como intermediário entre a interface de usuário e o armazenamento de dados.
- **Tecnologias envolvidas:** Node.js com Express.

- **Tecnologias envolvidas:** Node.js com Express; ver DT-02.

- **Responsabilidades:**
  - Disponibilizar endpoints (rotas da API REST) para o frontend.
  - Implementar e garantir todas as regras de negócio do sistema (ex: não permitir doações sem data, validar tipos de animais, etc.).
  - Autenticar os usuários e autorizar o acesso a funcionalidades protegidas.
  - Comunicar-se de maneira segura com o banco de dados via ORM.
- **Exceções e recomendações:** Nenhuma validação de regra de negócio crítica deve depender exclusivamente do frontend. O backend tem a obrigação final de garantir a integridade dos dados.
  - Aplicar as validações implementadas nos controllers (ex.: exigir nome e tipo no cadastro de animais e aceitar apenas `cao` ou `gato`). O Financeiro ainda não possui backend.
  - Cadastrar usuários, validar credenciais no login e emitir JWT. A proteção das rotas dos módulos ainda não está implementada (ver seções 3.2 e 4.2).
  - Acessar o banco de dados pelo Prisma a partir dos controllers.

- **Obrigação de validação:** As regras de negócio aplicáveis devem ser verificadas no backend, mesmo quando houver validação no frontend. Isso impede que chamadas diretas à API contornem verificações da interface. No cadastro de animais, por exemplo, o controller rejeita requisições sem nome ou tipo.

### 1.3 Banco de Dados (Persistência)

A camada responsável pelo armazenamento seguro e estruturado de todas as informações.
- **Tecnologias envolvidas:** SQLite (atualmente utilizado para o protótipo/desenvolvimento) acessado via Prisma ORM. Há uma proposta de migração futura para PostgreSQL quando o sistema for para produção.

- **Tecnologias envolvidas:** SQLite acessado via Prisma ORM no desenvolvimento (DT-03). A proposta de PostgreSQL para produção é tratada na DT-04 e na seção 4.2.

- **Responsabilidades:**
  - Armazenar de forma relacional os dados dos módulos do sistema (Animais, Colaboradores, Financeiro).
  - Armazenar de forma relacional usuários, animais, colaboradores, voluntários e contribuições vinculadas a colaboradores. A tabela `Contribuicao` pertence ao módulo de Colaboradores; o Financeiro ainda não possui tabelas ou backend, e suas telas de doações usam dados mockados.
  - Garantir a integridade referencial dos dados.

A relação entre contribuições de colaboradores e doações do Financeiro permanece pendente de definição pelos grupos envolvidos, conforme o [estado dos módulos](estado-dos-modulos.md#32-grupo-colaboradores-e-voluntários); ver DT-20.

---

## 2. Mapeamento de Pastas e Percurso da Operação

A organização dos arquivos reflete a arquitetura do sistema e dita como as informações trafegam desde o usuário até o banco de dados.

### 2.1 Estrutura de Pastas

A estrutura base é separada em dois grandes blocos independentes:
A estrutura base separa frontend e backend; ver DT-13. Os controllers concentram validação e acesso ao banco, sem uma camada separada de serviços.

**No Frontend (`frontend/`):**

- `app/`: Contém as páginas e o roteamento da interface. O projeto usa o *App Router* do Next.js. As telas dos módulos estão organizadas na pasta interna `(etapas)`, com subpastas para `animais`, `colaboradores`, `doacoes`, etc.
- `components/`: Guarda elementos reutilizáveis de interface, como botões, modais e formulários, evitando duplicação de código visual.
- `lib/`: Contém funções utilitárias ou auxiliares do cliente.

**No Backend (`backend/`):**

- `src/routes/`: Define as portas de entrada (endpoints) da API, conectando os endereços acessados aos processadores da requisição (ex: `animais.js`, `colaboradores.js`).
- `src/controllers/`: É o cérebro da operação. Recebe os dados da rota, aplica as regras de negócio, solicita a ação ao banco de dados e retorna a resposta formatada ao frontend.
- `prisma/`: Contém a definição das tabelas do banco de dados no arquivo `schema.prisma`.
- `src/controllers/`: Recebe os dados da requisição, aplica as validações implementadas, acessa o banco e envia a resposta HTTP.
- `src/server.js`: Configura o Express, o CORS, a leitura de JSON, a montagem das rotas e o tratamento central de erros.
- `src/prisma.js`: Exporta a instância compartilhada do Prisma com o adaptador SQLite.
- `prisma/`: Contém a definição das tabelas em `schema.prisma`, o histórico de migrations e o seed.

### 2.2 O Percurso de uma Operação

Quando um usuário realiza uma ação (ex: cadastrar um novo animal), o sistema segue um fluxo sequencial estrito entre essas pastas:
O cadastro de um novo animal exemplifica a comunicação entre interface, API e persistência:

1. **Interface (Frontend):** O usuário preenche o formulário na página (ex: arquivo `frontend/app/(etapas)/animais/page.tsx`). Ao clicar em salvar, o frontend valida se os campos obrigatórios estão preenchidos e dispara uma requisição HTTP.
2. **Rota (Backend):** O backend recebe o pedido da rede. O arquivo correspondente em `backend/src/routes/` identifica que a ação deve ser enviada para a função de criação de animais.
3. **Controlador (Backend):** A função específica no `backend/src/controllers/animaisController.js` recebe os dados. Ela verifica se a regra de negócio permite a ação.
1. **Interface (Frontend):** O usuário preenche o formulário em `frontend/app/(etapas)/animais/cadastrar/page.tsx`. Ao salvar, o frontend converte o rótulo do tipo para `cao` ou `gato`, monta o JSON e chama `api("/animais", { method: "POST", body: payload })`. Não há verificação local de preenchimento de nome e tipo nesse fluxo.
2. **Rota (Backend):** `backend/src/server.js` monta o router em `/animais`. Em `backend/src/routes/animais.js`, `router.post("/", ctrl.criar)` encaminha a requisição ao controller.
3. **Controlador (Backend):** A função `criar` em `backend/src/controllers/animaisController.js` exige nome e tipo e valida se o tipo é `cao` ou `gato`. Se a validação falhar, responde com status 400 e a mensagem no campo `erro`, sem gravar o animal.
4. **Persistência (Banco de Dados):** Estando tudo certo, o controlador se comunica com o banco de dados usando as configurações do Prisma. A informação é gravada na tabela definida em `schema.prisma`.
5. **Retorno:** O banco confirma o sucesso para o controlador, que responde a requisição com os dados atualizados para a rota, que finalmente entrega o aviso de "Sucesso" de volta para a tela do usuário no frontend.
5. **Retorno:** Após o Prisma retornar o animal gravado, o controlador responde diretamente à requisição HTTP com `res.status(201).json(animal)`. O frontend recebe a resposta e exibe o aviso de sucesso. O arquivo de rotas apenas associa o endpoint ao controlador; não processa o retorno.

**Tratamento de erros:** Se a API retornar um erro HTTP, `api()` lança um erro com a mensagem recebida, e a página mostra um alerta. Exceções capturadas pelo controller são encaminhadas ao middleware de erros em `server.js`.

---

## 3. Limites dos Módulos e Dependências Compartilhadas

Para manter o sistema organizado, o projeto é dividido em módulos que possuem responsabilidades claras, mas que eventualmente precisam compartilhar informações e ferramentas.

### 3.1 Limites dos Módulos

Os módulos principais (Animais, Colaboradores/Voluntários e Financeiro/Doações) operam de forma majoritariamente isolada:
- **Animais:** Focado exclusivamente na gestão dos pets abrigados (cadastros, históricos e características). Não possui ligação direta com a base de colaboradores ou dados financeiros.
- **Colaboradores e Voluntários:** Gerencia o cadastro das pessoas envolvidas com a ONG.
- **Financeiro (Doações):** Lida com o registro de contribuições financeiras ou de itens.
- **Exceção e Cruzamento:** O módulo Financeiro possui um limite tênue e dependência direta com o módulo de Colaboradores. Uma **Contribuição** (doação) precisa estar atrelada a um **Colaborador** (doador). No banco de dados, isso é garantido por uma chave estrangeira (`colaboradorId` na tabela `Contribuicao`).

- **Animais:** Gerencia cadastro, características, listagem, edição, remoção e exportação CSV dos animais. O histórico de entrada e saída ainda não possui telas, rotas ou tabelas (DT-18). O modelo `Animal` não possui relação com colaboradores ou dados financeiros.

- **Colaboradores e Voluntários:** Gerencia o cadastro das pessoas envolvidas com a ONG e o histórico de contribuições dos colaboradores. A tabela `Contribuicao` pertence a este módulo, com listagem e registro pela rota `/colaboradores/:id/contribuicoes`. Cada contribuição está vinculada a um colaborador pela chave estrangeira `colaboradorId`.

- **Financeiro (Doações):** Previsto para controlar receitas e despesas. Atualmente, as telas de doações usam dados mockados, sem integração com a API. O módulo ainda não possui rotas, controllers ou tabelas próprias.

- **Dependência pendente:** A relação entre as contribuições registradas em Colaboradores e as doações do Financeiro ainda precisa ser definida pelos dois grupos, conforme o [estado dos módulos](estado-dos-modulos.md#32-grupo-colaboradores-e-voluntários) e a DT-20. O vínculo atual entre `Contribuicao` e `Colaborador` não estabelece uma regra de vínculo obrigatório para futuras doações avulsas.

**Limitação de integração:** A agenda de voluntários mantém dados locais no frontend, sem backend ou persistência de agendamentos; ver DT-19 e o estado dos módulos.

### 3.2 Dependências Compartilhadas

Para evitar a duplicação de código, existem ferramentas e arquivos que servem a todos os módulos simultaneamente:
Existem ferramentas e arquivos compartilhados entre diversas telas e controllers, embora seu uso não seja uniforme:

**No Frontend:**
- **Componentes de UI (`frontend/components/`):** Arquivos como `Header.tsx`, `ConfirmModal.tsx`, `InputGroup.tsx` e `BottomNav.tsx` são usados por todas as telas do sistema para manter um padrão visual único.
- **Utilitários de API (`frontend/lib/api.ts`):** Centraliza a lógica de comunicação com o backend (como configurar cabeçalhos, gerenciar o token de autenticação e formatar requisições), sendo importado por qualquer módulo que precise puxar ou salvar dados.

- **Componentes de UI (`frontend/components/`):** Arquivos como `Header.tsx`, `ConfirmModal.tsx`, `InputGroup.tsx` e `BottomNav.tsx` são reutilizados por diversas telas. Por exemplo, as listagens de animais e voluntários usam `ConfirmModal`. As páginas de Colaboradores ainda possuem implementações locais de cabeçalho e navegação inferior.

- **Utilitários de API (`frontend/lib/api.ts`):** Monta a URL com `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3001`) e o caminho informado, define os cabeçalhos e trata erros HTTP. É usado nas chamadas dos módulos integrados e não inclui automaticamente um token de autenticação; ver DT-22.

- **Exceção de comunicação:** Login e cadastro de usuários usam `fetch()` diretamente, com `http://localhost:3001` fixo nos arquivos das páginas. Alterar `NEXT_PUBLIC_API_URL` não altera o endereço dessas chamadas; ver DT-22.

**No Backend:**
- **Conexão com Banco de Dados (`backend/src/prisma.js`):** Todos os controllers utilizam esta mesma instância para acessar as tabelas, evitando conexões duplicadas ou vazamento de memória.
- **Autenticação (`backend/src/controllers/authController.js` e `backend/src/routes/auth.js`):** O módulo de autenticação é transversal. Ele não pertence a nenhum módulo de negócio específico, mas protege as rotas de todos eles, exigindo um token válido para liberar o acesso.

- **Conexão com Banco de Dados (`backend/src/prisma.js`):** Todos os controllers importam a mesma instância para acessar as tabelas, centralizando a configuração da conexão; ver DT-03.

- **Autenticação (`backend/src/controllers/authController.js` e `backend/src/routes/auth.js`):** É compartilhada e não pertence a um módulo de negócio específico. Atualmente, gera JWT no cadastro e no login de usuários. Em `backend/src/server.js` e nos arquivos de rotas, `/animais`, `/colaboradores` e `/voluntarios` não usam middleware de validação de token; essas rotas ainda não são protegidas pela autenticação. Ver DT-05 e a seção 4.2.

---

## 4. Estrutura Implementada vs. Evolução Proposta

Sendo um projeto em construção, nem todas as decisões arquitetônicas definitivas já estão aplicadas. É importante diferenciar o que já está rodando hoje no repositório daquilo que é uma proposta futura.

### 4.1 O que está implementado (Cenário Atual)
- **Banco de Dados Local:** O sistema utiliza **SQLite** integrado ao Prisma. É excelente para o ambiente de desenvolvimento porque salva tudo em um arquivo local, sem necessidade de configurar servidores.
- **Execução Local:** Toda a arquitetura (frontend e backend) roda exclusivamente no ambiente de desenvolvimento de cada voluntário (`localhost`).
- **Tabelas Separadas por Módulo:** O esquema atual possui as tabelas básicas estruturadas para cada um dos módulos (Animais, Colaboradores, Voluntários, Contribuição).

- **Banco de Dados Local:** O sistema utiliza SQLite integrado ao Prisma, simplificando o desenvolvimento por armazenar os dados em um arquivo local. A aplicação abre `backend/dev.db` por um caminho fixo em `src/prisma.js`; as migrations usam `DATABASE_URL` em `prisma.config.ts`. Os caminhos precisam apontar para o mesmo banco (DT-03).

- **Execução Local:** Os scripts e endereços documentados contemplam execução local do frontend e da API. A definição do ambiente de homologação, hospedagem e manutenção permanece pendente; ver DT-23.

- **Tabelas Atuais:** O `backend/prisma/schema.prisma` define `Usuario` (autenticação), `Animal` (Animais), `Colaborador`, `Voluntario` e `Contribuicao` (Colaboradores e Voluntários). O Financeiro ainda não possui tabelas para doações avulsas ou despesas.

### 4.2 Sugestões para proposta de evolução (Cenário Futuro / Produção)
Abaixo estão as evoluções que podem ser implementadas no futuro, ou seja, sugestões arquiteturais recomendadas para garantir a estabilidade do sistema quando for operado no dia a dia da ONG:

- **Migração para PostgreSQL:** O SQLite não é recomendado para produção com múltiplos usuários concorrentes. Existe uma proposta registrada para migrar o banco para **PostgreSQL** (hospedagens recomendadas e gratuitas: Supabase, Railway ou Render).
- **Implantação (Deploy) e CI/CD:** A aplicação precisará sair do `localhost` e ser hospedada em servidores em nuvem (Vercel para o frontend, Render para o backend). Recomenda-se a criação de um fluxo de CI/CD (ex: *GitHub Actions*) para testar e subir o código automaticamente a cada *merge* na branch principal.
- **Armazenamento de Arquivos em Nuvem:** Atualmente, as fotos dos animais podem pesar o banco de dados se não forem tratadas. Uma evolução arquitetural importante será adotar um serviço de *Storage* (como AWS S3, Cloudinary ou Supabase Storage) apenas para guardar as imagens e salvar no banco apenas o link URL.
- **Unificação e Ajustes no Banco de Dados:** Há discussões para consolidar certas visões no banco (como unir melhor as informações de doações/contribuições financeiras com os colaboradores e gastos gerais) antes da transição para produção.
- **Monitoramento e Logs Centralizados:** Para um sistema usado por pessoas não técnicas da ONG, será fundamental adicionar uma ferramenta como o **Sentry** no backend e frontend. Se o app der erro no celular de um voluntário, os desenvolvedores receberão o alerta completo do que aconteceu sem precisar de prints ou relatos vagos.
- **Rotinas de Backup Automático:** Implementar um *cron job* ou serviço de *dump* periódico do banco de dados para evitar perda de dados (histórico de doações, animais, etc.), garantindo a segurança das informações da instituição.
Abaixo estão propostas existentes e recomendações desta documentação. Nenhuma ferramenta, provedor ou automação é adotado por esta seção. As escolhas precisam seguir o processo de avaliação da DOC-06 e envolver os responsáveis afetados.

- **Banco fora do desenvolvimento — proposta existente (DT-04):** Avaliar PostgreSQL para produção em conjunto com a hospedagem, o uso esperado e a migração dos dados. Os comentários do código sugerem essa alternativa, mas não registram uma justificativa para a escolha. A troca exige planejar as migrations do novo provedor e preservar o histórico publicado conforme o [Guia de Contribuição](../CONTRIBUTING.md#25-resolver-conflitos).

- **Implantação e CI/CD — recomendação para avaliação (DT-23):** Definir ambiente de homologação, hospedagem e responsáveis pela manutenção para viabilizar o acesso pela ONG. Avaliar automação de verificações e publicação conforme as necessidades e os recursos da equipe; CI/CD não é requisito desta entrega documental.

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

**Verificação documental:** conferir o conteúdo contra o código e as referências, os links e a formatação. Como esta entrega altera apenas documentação, testes da aplicação são dispensados pelo [Guia de Contribuição](../CONTRIBUTING.md#63-validações-antes-de-abrir). A disponibilidade de DOC-09 e DOC-10 e o alinhamento com a versão integrada da DOC-06 devem ser reconferidos antes da conclusão.

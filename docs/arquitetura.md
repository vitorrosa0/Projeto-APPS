# Arquitetura e Organização do Sistema

Este documento descreve a arquitetura geral do Projeto-APPS, incluindo a separação entre os principais componentes (frontend, backend e banco de dados) e suas respectivas responsabilidades.

---

## 1. Componentes e Responsabilidades

O sistema segue uma arquitetura baseada em separação de responsabilidades (client-server), dividida nos seguintes componentes principais:

### 1.1 Frontend (Interface do Usuário)
A camada de apresentação com a qual os usuários da ONG SJPA interagem, focada em uma experiência *mobile-first*.
- **Tecnologias envolvidas:** Next.js, React e Tailwind CSS.
- **Responsabilidades:**
  - Renderizar as interfaces de usuário (telas de login, listagem e cadastro de animais, colaboradores e doações).
  - Validar as entradas de dados localmente antes de enviá-las ao servidor.
  - Consumir as APIs fornecidas pelo backend e tratar os estados de carregamento (loading) e erros.
  - Gerenciar o estado da aplicação no lado do cliente.
- **Justificativa da arquitetura:** Como os usuários operam principalmente pelo celular no dia a dia do abrigo, a interface precisa ser responsiva e interagir com o backend de forma assíncrona (via API) para garantir um uso ágil.

### 1.2 Backend (API e Regras de Negócio)
O núcleo lógico do sistema, que funciona como intermediário entre a interface de usuário e o armazenamento de dados.
- **Tecnologias envolvidas:** Node.js com Express.
- **Responsabilidades:**
  - Disponibilizar endpoints (rotas da API REST) para o frontend.
  - Implementar e garantir todas as regras de negócio do sistema (ex: não permitir doações sem data, validar tipos de animais, etc.).
  - Autenticar os usuários e autorizar o acesso a funcionalidades protegidas.
  - Comunicar-se de maneira segura com o banco de dados via ORM.
- **Exceções e recomendações:** Nenhuma validação de regra de negócio crítica deve depender exclusivamente do frontend. O backend tem a obrigação final de garantir a integridade dos dados.

### 1.3 Banco de Dados (Persistência)
A camada responsável pelo armazenamento seguro e estruturado de todas as informações.
- **Tecnologias envolvidas:** SQLite (atualmente utilizado para o protótipo/desenvolvimento) acessado via Prisma ORM. Há uma proposta de migração futura para PostgreSQL quando o sistema for para produção.
- **Responsabilidades:**
  - Armazenar de forma relacional os dados dos módulos do sistema (Animais, Colaboradores, Financeiro).
  - Garantir a integridade referencial dos dados.

---

## 2. Mapeamento de Pastas e Percurso da Operação

A organização dos arquivos reflete a arquitetura do sistema e dita como as informações trafegam desde o usuário até o banco de dados.

### 2.1 Estrutura de Pastas

A estrutura base é separada em dois grandes blocos independentes:

**No Frontend (`frontend/`):**
- `app/`: Contém as páginas e o roteamento da interface. O projeto usa o *App Router* do Next.js. As telas dos módulos estão organizadas na pasta interna `(etapas)`, com subpastas para `animais`, `colaboradores`, `doacoes`, etc.
- `components/`: Guarda elementos reutilizáveis de interface, como botões, modais e formulários, evitando duplicação de código visual.
- `lib/`: Contém funções utilitárias ou auxiliares do cliente.

**No Backend (`backend/`):**
- `src/routes/`: Define as portas de entrada (endpoints) da API, conectando os endereços acessados aos processadores da requisição (ex: `animais.js`, `colaboradores.js`).
- `src/controllers/`: É o cérebro da operação. Recebe os dados da rota, aplica as regras de negócio, solicita a ação ao banco de dados e retorna a resposta formatada ao frontend.
- `prisma/`: Contém a definição das tabelas do banco de dados no arquivo `schema.prisma`.

### 2.2 O Percurso de uma Operação

Quando um usuário realiza uma ação (ex: cadastrar um novo animal), o sistema segue um fluxo sequencial estrito entre essas pastas:

1. **Interface (Frontend):** O usuário preenche o formulário na página (ex: arquivo `frontend/app/(etapas)/animais/page.tsx`). Ao clicar em salvar, o frontend valida se os campos obrigatórios estão preenchidos e dispara uma requisição HTTP.
2. **Rota (Backend):** O backend recebe o pedido da rede. O arquivo correspondente em `backend/src/routes/` identifica que a ação deve ser enviada para a função de criação de animais.
3. **Controlador (Backend):** A função específica no `backend/src/controllers/animaisController.js` recebe os dados. Ela verifica se a regra de negócio permite a ação.
4. **Persistência (Banco de Dados):** Estando tudo certo, o controlador se comunica com o banco de dados usando as configurações do Prisma. A informação é gravada na tabela definida em `schema.prisma`.
5. **Retorno:** O banco confirma o sucesso para o controlador, que responde a requisição com os dados atualizados para a rota, que finalmente entrega o aviso de "Sucesso" de volta para a tela do usuário no frontend.

---

## 3. Limites dos Módulos e Dependências Compartilhadas

Para manter o sistema organizado, o projeto é dividido em módulos que possuem responsabilidades claras, mas que eventualmente precisam compartilhar informações e ferramentas.

### 3.1 Limites dos Módulos

Os módulos principais (Animais, Colaboradores/Voluntários e Financeiro/Doações) operam de forma majoritariamente isolada:
- **Animais:** Focado exclusivamente na gestão dos pets abrigados (cadastros, históricos e características). Não possui ligação direta com a base de colaboradores ou dados financeiros.
- **Colaboradores e Voluntários:** Gerencia o cadastro das pessoas envolvidas com a ONG.
- **Financeiro (Doações):** Lida com o registro de contribuições financeiras ou de itens.
- **Exceção e Cruzamento:** O módulo Financeiro possui um limite tênue e dependência direta com o módulo de Colaboradores. Uma **Contribuição** (doação) precisa estar atrelada a um **Colaborador** (doador). No banco de dados, isso é garantido por uma chave estrangeira (`colaboradorId` na tabela `Contribuicao`).

### 3.2 Dependências Compartilhadas

Para evitar a duplicação de código, existem ferramentas e arquivos que servem a todos os módulos simultaneamente:

**No Frontend:**
- **Componentes de UI (`frontend/components/`):** Arquivos como `Header.tsx`, `ConfirmModal.tsx`, `InputGroup.tsx` e `BottomNav.tsx` são usados por todas as telas do sistema para manter um padrão visual único.
- **Utilitários de API (`frontend/lib/api.ts`):** Centraliza a lógica de comunicação com o backend (como configurar cabeçalhos, gerenciar o token de autenticação e formatar requisições), sendo importado por qualquer módulo que precise puxar ou salvar dados.

**No Backend:**
- **Conexão com Banco de Dados (`backend/src/prisma.js`):** Todos os controllers utilizam esta mesma instância para acessar as tabelas, evitando conexões duplicadas ou vazamento de memória.
- **Autenticação (`backend/src/controllers/authController.js` e `backend/src/routes/auth.js`):** O módulo de autenticação é transversal. Ele não pertence a nenhum módulo de negócio específico, mas protege as rotas de todos eles, exigindo um token válido para liberar o acesso.

---

## 4. Estrutura Implementada vs. Evolução Proposta

Sendo um projeto em construção, nem todas as decisões arquitetônicas definitivas já estão aplicadas. É importante diferenciar o que já está rodando hoje no repositório daquilo que é uma proposta futura.

### 4.1 O que está implementado (Cenário Atual)
- **Banco de Dados Local:** O sistema utiliza **SQLite** integrado ao Prisma. É excelente para o ambiente de desenvolvimento porque salva tudo em um arquivo local, sem necessidade de configurar servidores.
- **Execução Local:** Toda a arquitetura (frontend e backend) roda exclusivamente no ambiente de desenvolvimento de cada voluntário (`localhost`).
- **Tabelas Separadas por Módulo:** O esquema atual possui as tabelas básicas estruturadas para cada um dos módulos (Animais, Colaboradores, Voluntários, Contribuição).

### 4.2 Sugestões para proposta de evolução (Cenário Futuro / Produção)
Abaixo estão as evoluções que podem ser implementadas no futuro, ou seja, sugestões arquiteturais recomendadas para garantir a estabilidade do sistema quando for operado no dia a dia da ONG:

- **Migração para PostgreSQL:** O SQLite não é recomendado para produção com múltiplos usuários concorrentes. Existe uma proposta registrada para migrar o banco para **PostgreSQL** (hospedagens recomendadas e gratuitas: Supabase, Railway ou Render).
- **Implantação (Deploy) e CI/CD:** A aplicação precisará sair do `localhost` e ser hospedada em servidores em nuvem (Vercel para o frontend, Render para o backend). Recomenda-se a criação de um fluxo de CI/CD (ex: *GitHub Actions*) para testar e subir o código automaticamente a cada *merge* na branch principal.
- **Armazenamento de Arquivos em Nuvem:** Atualmente, as fotos dos animais podem pesar o banco de dados se não forem tratadas. Uma evolução arquitetural importante será adotar um serviço de *Storage* (como AWS S3, Cloudinary ou Supabase Storage) apenas para guardar as imagens e salvar no banco apenas o link URL.
- **Unificação e Ajustes no Banco de Dados:** Há discussões para consolidar certas visões no banco (como unir melhor as informações de doações/contribuições financeiras com os colaboradores e gastos gerais) antes da transição para produção.
- **Monitoramento e Logs Centralizados:** Para um sistema usado por pessoas não técnicas da ONG, será fundamental adicionar uma ferramenta como o **Sentry** no backend e frontend. Se o app der erro no celular de um voluntário, os desenvolvedores receberão o alerta completo do que aconteceu sem precisar de prints ou relatos vagos.
- **Rotinas de Backup Automático:** Implementar um *cron job* ou serviço de *dump* periódico do banco de dados para evitar perda de dados (histórico de doações, animais, etc.), garantindo a segurança das informações da instituição.

---
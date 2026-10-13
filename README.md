# SJPA - Sistema de Gestão dos Animais

O **SJPA** é um sistema de gestão para uma ONG de proteção animal de Juiz de Fora. Ele reúne o cadastro dos animais abrigados, dos colaboradores e voluntários e o controle financeiro da instituição. É desenvolvido na disciplina Práticas de Extensão e Projeto Integrador da Uniacademia.

Este repositório contém o frontend (`frontend/`), a API (`backend/`) e a documentação do projeto (`docs/`).

---

## Documentação

O índice completo, com a situação de cada documento e a ordem de leitura sugerida para novos integrantes, desenvolvedores e revisores, está em [docs/README.md](docs/README.md).

| Para | Leia |
|---|---|
| Entender o projeto, a ONG e a equipe | [Visão geral](docs/visao-geral.md) |
| Saber o que já funciona e o que falta | [Estado dos módulos](docs/estado-dos-modulos.md) |
| Ver prioridades do período | [Entregas e próximos passos](docs/entregas-e-proximos-passos.md) |
| Contribuir com código ou documentação | [Guia de contribuição](CONTRIBUTING.md) e [organização no Trello](docs/trello.md) |
| Consultar decisões técnicas e a arquitetura | [Decisões técnicas](docs/decisoes-tecnicas.md) e [arquitetura](docs/arquitetura.md) |
| Configurar e seguir os padrões do frontend | [README do frontend](frontend/README.md) |
| Configurar e seguir os padrões do backend | [README do backend](backend/README.md) |
| Escrever e revisar testes | [Padrões de testes](docs/testes.md) |
| Trabalhar com assistentes de IA | [AGENTS.md](AGENTS.md) e [uso de IA](docs/uso-de-ia.md) |

Vários desses guias ainda aguardam validação dos subgrupos; a situação de cada um está no [índice](docs/README.md#1-documentos-do-projeto).

---

## Tecnologias

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **React Icons**

### Backend
- **Node.js**
- **Express 5**
- **Prisma 7** (ORM)
- **SQLite** (banco de dados)
- **CORS**

---

## Módulos

| Módulo | Escopo |
|---|---|
| Animais | Cadastro, listagem por tipo (cães e gatos) e exportação em CSV. |
| Colaboradores e voluntários | Cadastro de colaboradores com histórico de contribuições, cadastro de voluntários e agenda. |
| Financeiro | Doações, contribuições e despesas. |

O sistema também tem cadastro e login, com interface *mobile first*. A recuperação de senha possui apenas telas: não há envio de e-mail nem redefinição de senha implementados. Parte das funcionalidades ainda é apenas interface com dados estáticos (agenda de voluntários e financeiro, por exemplo). O que está concluído, parcial ou pendente em cada módulo está no [estado dos módulos](docs/estado-dos-modulos.md).

## API REST

Resumo das rotas disponíveis no backend. Os padrões para criar ou alterar rotas estão no [README do backend](backend/README.md).

### Animais (`/animais`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/animais` | Lista todos os animais (filtro opcional: `?tipo=cao` ou `?tipo=gato`) |
| GET | `/animais/:id` | Busca um animal pelo ID |
| POST | `/animais` | Cadastra um novo animal |
| PUT | `/animais/:id` | Atualiza os dados de um animal |
| DELETE | `/animais/:id` | Remove um animal |

**Campos do Animal:** `nome`, `tipo` (cao/gato), `raca`, `idade`, `setor`, `canil`

### Autenticação (`/auth`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastra um novo usuário (retorna token JWT) |
| POST | `/auth/login` | Autentica e retorna token JWT |

**Campos do Usuário:** `nome`, `email`, `telefone` (opcional), `senha`

> **Usuário padrão (criado pelo seed):** email `admin@sjpa.com` / senha `admin123`.

### Colaboradores (`/colaboradores`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/colaboradores` | Lista todos os colaboradores com última contribuição |
| GET | `/colaboradores/:id` | Busca colaborador pelo ID com histórico completo |
| POST | `/colaboradores` | Cadastra um novo colaborador |
| PUT | `/colaboradores/:id` | Atualiza os dados de um colaborador |
| DELETE | `/colaboradores/:id` | Remove um colaborador |
| GET | `/colaboradores/:id/contribuicoes` | Lista o histórico de contribuições |
| POST | `/colaboradores/:id/contribuicoes` | Registra uma nova contribuição |

**Campos do Colaborador:** `nome`, `email`, `telefone`, `dataAdesao`, `status` (Ativo/Inativo/Pausado), `informacoesAdicionais`

**Campos da Contribuição:** `tipo` (Financeiro/Produto/Servico), `valor`, `data`

### Voluntários (`/voluntarios`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/voluntarios` | Lista todos os voluntários |
| GET | `/voluntarios/:id` | Busca um voluntário pelo ID |
| POST | `/voluntarios` | Cadastra um novo voluntário |
| PUT | `/voluntarios/:id` | Atualiza os dados de um voluntário |
| DELETE | `/voluntarios/:id` | Remove um voluntário |

**Campos do Voluntário:** `nome`, `email` (opcional), `telefone` (opcional), `informacoesAdicionais` (opcional)

---

## Como Executar o Projeto

### Frontend

1. Acesse a pasta do frontend:
   ```
   cd frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000
   ```

Variáveis de ambiente, scripts de verificação e padrões de desenvolvimento do frontend estão no [README do frontend](frontend/README.md).

### Backend

1. Acesse a pasta do backend:
   ```
   cd backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Crie o arquivo `.env` na pasta `backend/` com a URL do banco:
   ```
   DATABASE_URL="file:./dev.db"
   ```
   > Esse passo é obrigatório: o `prisma migrate dev` exige a variável `DATABASE_URL`. O `.env` não é versionado (está no `.gitignore`), então cada desenvolvedor precisa criá-lo. O caminho precisa ser `./dev.db`, porque a API sempre abre o arquivo `backend/dev.db`.

4. Gere o cliente do Prisma:
   ```
   npx prisma generate
   ```

5. Execute as migrations do banco de dados:
   ```
   npm run migrate
   ```

6. (Opcional) Crie o usuário admin padrão (`admin@sjpa.com` / `admin123`):
   ```
   npm run seed
   ```

7. Inicie o servidor:
   ```
   npm run dev
   ```

8. A API estará disponível em:
   ```
   http://localhost:3001
   ```

Variáveis de ambiente, operações do dia a dia e padrões de desenvolvimento do backend estão no [README do backend](backend/README.md).

---

## Notas de Desenvolvimento

- O projeto utiliza a convenção `page.tsx` dentro de pastas para definição de rotas no frontend.
- Componentes de interface estão sendo padronizados para garantir consistência visual em todas as etapas.
- A navegação é gerida pelo hook `useRouter` do Next.js.
- O banco de dados SQLite é gerado automaticamente na pasta `backend/` ao rodar as migrations.
- A API roda na porta `3001` para não conflitar com o frontend Next.js na porta `3000`.

---

## Como Contribuir

Antes de abrir uma branch ou PR, leia o [Guia de Contribuição](CONTRIBUTING.md). As tarefas são acompanhadas no [Trello do projeto](https://trello.com/b/ZVD1CGss/projeto-apps), conforme a [organização no Trello](docs/trello.md).

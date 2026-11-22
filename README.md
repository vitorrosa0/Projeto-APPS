# SJPA - Sistema de Gestão dos Animais

Esta é a interface do projeto **SJPA**, uma aplicação voltada para a gestão e proteção de animais, desenvolvida como parte das Práticas Extensionistas e Projeto Integrador.

---

## Tecnologias

### Frontend
- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **React Icons**

### Backend
- **Node.js**
- **Express 5**
- **Prisma 7** (ORM)
- **SQLite** (banco de dados)
- **CORS**

---

## Funcionalidades Implementadas

### Frontend
- **Home:** Tela principal com visão geral do sistema.
- **Login:** Autenticação de usuários cadastrados.
- **Cadastro:** Registro de novos usuários com validação de campos.
- **Recuperação de Senha:** Fluxo completo para solicitação de nova senha e confirmação de envio de link.
- **Gestão de Animais:** Listagem e categorização (Cães/Gatos) de animais.
- **Doações:** Listagem por mês e cadastro de novas doações (integrado com API).
- **Despesas:** Listagem por mês e cadastro de novas despesas (integrado com API).
- **Financeiro:** Resumo consolidado de receitas, despesas e saldo com filtro por período.
- **Colaboradores:** Listagem, cadastro e edição de colaboradores com histórico de contribuições.
- **Interface Responsiva:** Otimizada para dispositivos móveis com menu inferior (`BottomNav`) e cabeçalho dinâmico.

### Backend — API REST

#### Animais (`/animais`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/animais` | Lista todos os animais (filtro opcional: `?tipo=cao` ou `?tipo=gato`) |
| GET | `/animais/:id` | Busca um animal pelo ID |
| POST | `/animais` | Cadastra um novo animal |
| PUT | `/animais/:id` | Atualiza os dados de um animal |
| DELETE | `/animais/:id` | Remove um animal |

**Campos do Animal:** `nome`, `tipo` (cao/gato), `raca`, `idade`, `setor`, `canil`

#### Autenticação (`/auth`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastra um novo usuário (retorna token JWT) |
| POST | `/auth/login` | Autentica e retorna token JWT |

**Campos do Usuário:** `nome`, `email`, `telefone` (opcional), `senha`

> **Usuário padrão (criado pelo seed):** email `admin@sjpa.com` / senha `admin123`.

#### Colaboradores (`/colaboradores`)
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

#### Doações (`/doacoes`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/doacoes` | Lista todas as doações (filtro opcional: `?mes=11&ano=2026`) |
| GET | `/doacoes/:id` | Busca uma doação pelo ID |
| POST | `/doacoes` | Cadastra uma nova doação |
| PUT | `/doacoes/:id` | Atualiza os dados de uma doação |
| DELETE | `/doacoes/:id` | Remove uma doação |

**Campos da Doação:** `tipo` (dinheiro/item — obrigatório), `valor` (obrigatório quando tipo=dinheiro), `descricao` (obrigatório quando tipo=item), `doador` (opcional), `data` (obrigatório, formato YYYY-MM-DD)

#### Despesas (`/despesas`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/despesas` | Lista todas as despesas (filtro opcional: `?mes=11&ano=2026`) |
| GET | `/despesas/:id` | Busca uma despesa pelo ID |
| POST | `/despesas` | Cadastra uma nova despesa |
| PUT | `/despesas/:id` | Atualiza os dados de uma despesa |
| DELETE | `/despesas/:id` | Remove uma despesa |

**Campos da Despesa:** `categoria` (obrigatório), `valor` (obrigatório), `descricao` (opcional), `data` (obrigatório, formato YYYY-MM-DD)

#### Resumo Financeiro (`/financeiro`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/financeiro/resumo` | Retorna resumo consolidado de receitas, despesas e saldo (filtro opcional: `?mes=11&ano=2026`) |

**Resposta do resumo:**
```json
{
  "periodo": { "mes": "11", "ano": "2026" },
  "receitas": {
    "total": 300.00,
    "doacoesDinheiro": { "total": 200.00, "registros": [...] },
    "contribuicoesColaboradores": { "total": 100.00, "registros": [...] }
  },
  "itensDoados": [...],
  "despesas": { "total": 150.00, "registros": [...] },
  "saldo": 150.00
}
```

> As receitas somam doações em dinheiro + contribuições financeiras de colaboradores, sem duplicação. Doações de itens físicos são listadas separadamente em `itensDoados` e não entram no total financeiro.

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
   DATABASE_URL="file:../dev.db"
   ```
   > Esse passo é obrigatório: o `prisma migrate dev` exige a variável `DATABASE_URL`. O `.env` não é versionado (está no `.gitignore`), então cada desenvolvedor precisa criá-lo.

4. Execute as migrations do banco de dados:
   ```
   npm run migrate
   ```

5. (Opcional) Crie o usuário admin padrão (`admin@sjpa.com` / `admin123`):
   ```
   npm run seed
   ```

6. Inicie o servidor:
   ```
   npm run dev
   ```

7. A API estará disponível em:
   ```
   http://localhost:3001
   ```

---

## Notas de Desenvolvimento

- O projeto utiliza a convenção `page.tsx` dentro de pastas para definição de rotas no frontend.
- Componentes de interface estão sendo padronizados para garantir consistência visual em todas as etapas.
- A navegação é gerida pelo hook `useRouter` do Next.js.
- O banco de dados SQLite é gerado automaticamente na pasta `backend/` ao rodar as migrations.
- A API roda na porta `3001` para não conflitar com o frontend Next.js na porta `3000`.

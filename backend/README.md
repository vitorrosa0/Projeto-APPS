# Backend — Execução e Padrões de Desenvolvimento

Este documento explica como configurar e executar a API do SJPA e define os padrões para escrever código no backend: organização em rotas e controllers, nomes, validação, respostas, erros, schema, migrations, seed, autenticação e autorização.

Ele vale para todos os subgrupos que alteram a pasta `backend/` (Animais, Colaboradores e Financeiro). Antes de ler, conheça a [Visão Geral do Projeto](../docs/visao-geral.md) e o [Guia de Contribuição](../CONTRIBUTING.md).

Documento da DOC-10. A visão geral das camadas e o percurso de uma requisição estão na [arquitetura do sistema](../docs/arquitetura.md) (DOC-08); este documento detalha **como** escrever e executar o código do backend. Os IDs de decisão citados (DT-XX) remetem ao [registro de decisões técnicas](../docs/decisoes-tecnicas.md) (DOC-06), onde deve ser conferida a situação de cada decisão.

> **Situação:** versão 1.1. Proposta pela Documentação em 10/10/2026, a partir da leitura do código e da execução do passo a passo descrita na [seção 2.6](#26-verificação-do-passo-a-passo). Os padrões ainda precisam ser validados pelos subgrupos (ver [seção 13](#13-validação-com-os-subgrupos)).

## Como ler este documento

| Marcação | Significado |
|---|---|
| **Obrigatório** | Regra do projeto para código novo ou alterado. A PR que não cumprir a regra não é aprovada. |
| **Recomendado** | Boa prática. O revisor pode sugerir, mas não bloqueia a PR por isso. |
| **Proposta** | Algo que **ainda não existe** no projeto e depende de decisão. Não descreve funcionalidade implementada. |
| **Situação atual** | Como o código funciona hoje, verificado em 10/10/2026. |

Quando uma regra tem exceções, elas aparecem logo abaixo dela. As falhas encontradas no código atual estão reunidas na [seção 11 (Lacunas conhecidas)](#11-lacunas-conhecidas), com um identificador (`L-01`, `L-02`...). Corrigir essas lacunas é trabalho dos subgrupos e está fora do escopo deste documento.

**Código existente:** as regras obrigatórias valem para código **novo ou alterado**. Uma PR não é bloqueada por uma lacuna antiga que ela não tocou. Se a PR altera uma função que tem uma lacuna, o revisor pode pedir a correção.

---

## Sumário

1. [Visão geral do backend](#1-visão-geral-do-backend)
2. [Configuração e execução](#2-configuração-e-execução)
3. [Estrutura e responsabilidades](#3-estrutura-e-responsabilidades)
4. [Nomenclatura](#4-nomenclatura)
5. [Validação de entrada](#5-validação-de-entrada)
6. [Respostas e códigos HTTP](#6-respostas-e-códigos-http)
7. [Tratamento de erros](#7-tratamento-de-erros)
8. [Schema, migrations e seed](#8-schema-migrations-e-seed)
9. [Autenticação e autorização](#9-autenticação-e-autorização)
10. [Testes e validação antes da PR](#10-testes-e-validação-antes-da-pr)
11. [Lacunas conhecidas](#11-lacunas-conhecidas)
12. [Documentos relacionados](#12-documentos-relacionados)
13. [Validação com os subgrupos](#13-validação-com-os-subgrupos)
14. [Histórico e contribuições](#14-histórico-e-contribuições)

---

## 1. Visão geral do backend

| Item | Situação atual |
|---|---|
| Linguagem | JavaScript, CommonJS (`require` / `module.exports`) |
| Framework | Express 5 |
| ORM | Prisma 7 (`prisma-client-js`) |
| Banco no desenvolvimento | SQLite, pelo adaptador `@prisma/adapter-better-sqlite3` |
| Autenticação | JWT (`jsonwebtoken`) e senhas com `bcryptjs` |
| Formato da API | REST com JSON |
| Porta padrão | `3001` (o frontend usa a `3000`) |

As decisões por trás dessas escolhas, e a situação de cada uma, ficam no [registro de decisões técnicas](../docs/decisoes-tecnicas.md) (DT-02, DT-03, DT-05, DT-22). Este documento não repete as justificativas; ele diz **como trabalhar** com o que existe.

```text
backend/
├── prisma/
│   ├── schema.prisma        # modelos do banco
│   ├── migrations/          # histórico de migrations (versionado)
│   └── seed.js              # cria o usuário admin de desenvolvimento
├── src/
│   ├── server.js            # cria o app Express, registra rotas e o tratador de erros
│   ├── prisma.js            # instância única do PrismaClient
│   ├── routes/              # um arquivo por recurso: mapeia método + caminho → controller
│   └── controllers/         # validação, regra de negócio e acesso ao banco
├── prisma.config.ts         # configuração da CLI do Prisma (schema, migrations, DATABASE_URL)
├── package.json
└── .env                     # não versionado; cada pessoa cria o seu (seção 2.3)
```

---

## 2. Configuração e execução

### 2.1 Pré-requisitos

- **Node.js** e **npm**. O passo a passo foi verificado com **Node 24.14.0 e npm 11.11.0** no Windows 11.
- **Não verificado:** a versão mínima do Node aceita pelo projeto. O `package.json` não define o campo `engines`. **Recomendado:** usar uma versão LTS recente do Node (22 ou superior). Se você usar outra versão e algo falhar, registre na PR.

### 2.2 Scripts disponíveis

Todos os comandos são executados **dentro da pasta `backend/`**.

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências |
| `npx prisma generate` | Gera o cliente do Prisma a partir do `schema.prisma` |
| `npm run migrate` | Executa `prisma migrate dev`: aplica as migrations pendentes e, se o schema mudou, cria uma nova |
| `npm run seed` | Cria o usuário admin de desenvolvimento |
| `npm run dev` | Sobe a API com `nodemon`, que reinicia ao salvar arquivos |
| `npm start` | Sobe a API com `node`, sem reinício automático |
| `npm run studio` | Abre o Prisma Studio para ver e editar os dados no navegador |
| `npx prisma validate` | Confere se o `schema.prisma` é válido |

### 2.3 Variáveis de ambiente

O backend lê as variáveis do arquivo `backend/.env` (com `dotenv`). O `.env` está no `.gitignore` e **não é versionado**: cada pessoa cria o seu.

| Variável | Obrigatória | Padrão | Quem usa | Observação |
|---|---|---|---|---|
| `DATABASE_URL` | Sim, para as migrations | — | CLI do Prisma (`prisma.config.ts`) | Use `file:./dev.db`. Ver o aviso abaixo. |
| `PORT` | Não | `3001` | `src/server.js` | Porta da API |
| `JWT_SECRET` | Não no desenvolvimento | `sjpa-dev-secret` | `src/controllers/authController.js` | Segredo para assinar os tokens. Obrigatório fora do desenvolvimento (seção 9). |

Conteúdo mínimo do `.env` para desenvolvimento:

```env
DATABASE_URL="file:./dev.db"
```

> **Atenção: a aplicação não usa a `DATABASE_URL`.** A CLI do Prisma (migrations, seed via CLI, Studio) usa a `DATABASE_URL`, mas o servidor abre sempre o arquivo fixo `backend/dev.db`, definido em `src/prisma.js` (lacuna [L-01](#11-lacunas-conhecidas)). Por isso a `DATABASE_URL` precisa apontar para esse mesmo arquivo. O caminho é resolvido a partir da pasta `backend/`, então o valor correto é `file:./dev.db`.
>
> **Inadequado:** `DATABASE_URL="file:../dev.db"`. Esse valor cria o banco **fora** da pasta `backend/`. As migrations são aplicadas nesse arquivo, mas a API e o seed abrem `backend/dev.db`, que fica vazio, e falham com `The table main.Usuario does not exist` (código `P2021`).

**Obrigatório**

- Nunca versionar o `.env` nem colocar segredos reais (senhas, tokens, URLs de banco de produção) em arquivos versionados, inclusive em comentários.
- Uma PR que cria, renomeia ou remove uma variável de ambiente atualiza a tabela acima na mesma PR ([CONTRIBUTING, seção 6.4](../CONTRIBUTING.md#64-documentos-afetados)) e avisa no item "O que mudou" da descrição.

**Por quê:** o `.env` não chega a quem clona o repositório. Se a variável não estiver documentada, o próximo desenvolvedor não consegue subir o projeto.

**Proposta:** versionar um arquivo `backend/.env.example` com as variáveis e valores de desenvolvimento. Exige ajustar o `.gitignore`, que hoje ignora `.env*`.

### 2.4 Primeira execução

```bash
cd backend
npm install
# crie o arquivo .env com: DATABASE_URL="file:./dev.db"
npx prisma generate
npm run migrate
npm run seed      # opcional: cria admin@sjpa.com / admin123
npm run dev
```

A API responde em `http://localhost:3001`. Para conferir:

```bash
curl http://localhost:3001/
# {"mensagem":"API SJPA funcionando!"}
```

**Por que o `npx prisma generate`:** no Prisma 7, o `prisma migrate dev` não gera mais o cliente automaticamente. Sem esse passo, o seed e o servidor falham com `Cannot find module '.prisma/client/default'`. Rode o `generate` de novo sempre que o `schema.prisma` mudar, inclusive depois de um `git pull` ou merge que traga alterações no schema.

### 2.5 Operações do dia a dia

| Situação | Comandos |
|---|---|
| Fiz `git pull` ou merge e vieram migrations novas | Faça uma cópia do `dev.db`, depois `npm run migrate` e `npx prisma generate`. Siga as regras de [migrations no CONTRIBUTING](../CONTRIBUTING.md#25-resolver-conflitos) se houver conflito. |
| Alterei o `schema.prisma` | `npx prisma validate`, depois `npx prisma migrate dev --name <nome>` (seção 8.2) |
| Quero ver os dados | `npm run studio` |
| Quero começar com o banco vazio | Seção 8.4 |
| A porta 3001 está ocupada | Defina outra porta no `.env` (`PORT=3002`) e ajuste `NEXT_PUBLIC_API_URL` no frontend. **Limitação:** as telas de login e cadastro chamam `http://localhost:3001` diretamente e não usam essa variável ([arquitetura, seção 3.2](../docs/arquitetura.md#32-dependências-compartilhadas)); nelas, a troca de porta não funciona. |

### 2.6 Verificação do passo a passo

A Documentação executou o passo a passo da seção 2.4 em 10/10/2026, em uma cópia limpa do backend (sem `node_modules`, `.env` nem banco), com Node 24.14.0 no Windows 11.

| Etapa | Resultado |
|---|---|
| `npm install` | Concluído |
| `npm run migrate` com `file:./dev.db` | As 5 migrations aplicadas em `backend/dev.db` |
| `npm run migrate` com `file:../dev.db` (valor que estava no README raiz) | Banco criado fora de `backend/`; seed falhou com `P2021` |
| `npm run seed` sem `npx prisma generate` | Falhou: `MODULE_NOT_FOUND` (`.prisma/client`) |
| `npx prisma generate` e `npm run seed` | Concluído. Executado duas vezes, sem duplicar o usuário. |
| `npx prisma validate` | Schema válido |
| `npm run dev` | API respondeu em `GET /` |
| Chamadas às rotas | Feitas com `curl`. Os comportamentos de erro observados estão na seção 11. |

**Não verificado:** execução em macOS e Linux, em outras versões do Node, e com PostgreSQL.

---

## 3. Estrutura e responsabilidades

### 3.1 Responsabilidade de cada camada

| Camada | Arquivo | Faz | Não faz |
|---|---|---|---|
| Servidor | `src/server.js` | Cria o app, registra middlewares globais (CORS, JSON), monta as rotas com o prefixo do recurso e registra o tratador de erros | Regra de negócio, acesso ao banco |
| Rotas | `src/routes/<recurso>.js` | Liga método HTTP + caminho a uma função do controller. Aplica middlewares específicos da rota, quando existirem | Validar dados, acessar o banco, montar respostas |
| Controllers | `src/controllers/<recurso>Controller.js` | Lê `req.params`, `req.query` e `req.body`; valida; aplica a regra de negócio; acessa o banco pelo Prisma; responde | Criar outra instância do Prisma, registrar rotas |
| Acesso aos dados | `src/prisma.js` | Exporta a **única** instância do `PrismaClient` | Lógica de negócio |

**Situação atual:** não há camada de serviços. Validação, regra de negócio e acesso ao banco ficam no controller (DT-13; [arquitetura, seção 2](../docs/arquitetura.md#2-mapeamento-de-pastas-e-percurso-da-operação)). Não há decisão sobre criar uma camada de serviços. Segundo a DT-13, essa decisão deve ser tomada junto com a definição dos testes (DOC-11). Até lá, não crie a camada por conta própria: uma mudança na organização do código exige registro em decisões técnicas.

**Obrigatório**

- Todo acesso ao banco usa a instância de `src/prisma.js`: `const prisma = require("../prisma");`.
- Arquivos de rota não contêm lógica: só `router.<método>(caminho, [middlewares], ctrl.funcao)`.
- Cada recurso novo tem seu arquivo de rotas e seu controller, e é registrado em `src/server.js` com `app.use("/<recurso>", <recurso>Routes)`.
- Um controller não chama funções de outro controller. Se dois recursos precisam da mesma lógica, ela vai para uma função auxiliar compartilhada (ver recomendação abaixo).

**Por quê:** criar várias instâncias do `PrismaClient` abre várias conexões e, no SQLite, pode causar bloqueios do arquivo. Rotas sem lógica deixam a lista de endpoints legível em um só lugar.

**Recomendado:** funções auxiliares usadas por mais de um controller ficam em `src/utils/` (pasta ainda não existe). Funções usadas por um único controller ficam no próprio arquivo, como `extrairDados` em `animaisController.js`.

Exemplo **adequado** (padrão já usado em `src/routes/animais.js`):

```js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/animaisController");

router.get("/", ctrl.listar);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);

module.exports = router;
```

Exemplo **inadequado**:

```js
// Lógica e acesso ao banco dentro da rota, e uma segunda instância do Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  res.json(await prisma.animal.findMany());
});
```

### 3.2 Formato de uma função de controller

**Situação atual:** todas as funções são `async`, recebem `(req, res, next)`, envolvem o corpo em `try/catch` e repassam erros inesperados com `next(e)`.

**Obrigatório:** manter esse formato em funções novas.

**Por quê:** o Express 5 já repassa erros de funções `async` ao tratador de erros, mas o `try/catch` mantém o padrão igual em todos os arquivos e é onde os erros esperados do Prisma são tratados (seção 7.2).

```js
async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    // validação → acesso ao banco → resposta
  } catch (e) { next(e); }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
```

**Obrigatório:** cada `return res...` encerra a função. Não envie duas respostas na mesma requisição.

---

## 4. Nomenclatura

O projeto usa nomes em português, sem acentos, alinhados ao vocabulário da ONG (DT-11). Termos técnicos do framework continuam em inglês (`createdAt`, `router`, `req`).

**Obrigatório**

| Elemento | Padrão | Exemplos existentes |
|---|---|---|
| Caminho da rota | Substantivo no plural, minúsculas, sem acento | `/animais`, `/colaboradores`, `/voluntarios` |
| Caminho com mais de uma palavra | Minúsculas separadas por hífen | Nenhum ainda. Ex.: `/doacoes-avulsas` |
| Sub-recurso | `/<recurso>/:id/<sub-recurso>` | `/colaboradores/:id/contribuicoes` |
| Arquivo de rotas | `src/routes/<recurso>.js`, igual ao caminho | `animais.js` |
| Arquivo de controller | `src/controllers/<recurso>Controller.js`, em camelCase | `colaboradoresController.js` |
| Funções do CRUD | `listar`, `buscarPorId`, `criar`, `atualizar`, `remover` | Todos os controllers |
| Outras funções | Verbo no infinitivo + complemento, camelCase | `listarContribuicoes`, `adicionarContribuicao` |
| Modelo do Prisma | Substantivo no singular, PascalCase | `Animal`, `Colaborador`, `Contribuicao` |
| Campo do modelo | camelCase | `dataAdesao`, `informacoesAdicionais`, `colaboradorId` |
| Chave estrangeira | `<modelo>Id` | `colaboradorId` |
| Constantes | MAIÚSCULAS com `_` | `CAMPOS_ANIMAL`, `JWT_SECRET` |
| Chaves do JSON | Iguais aos campos do modelo | `{ "dataAdesao": "..." }` |

**Por quê:** com um padrão único, quem lê uma rota consegue achar o controller e o modelo sem procurar. Nomes sem acento evitam problemas de codificação em URLs e arquivos.

**Exemplos inadequados**

| Nome | Problema |
|---|---|
| `/animal`, `/Animais` | Singular; letra maiúscula |
| `/doações` | Acento na URL |
| `/getAnimais`, `/animais/listar` | Verbo no caminho. O verbo é o método HTTP. |
| `AnimalController.js`, `animais.controller.js` | Fora do padrão `<recurso>Controller.js` |
| `deleteAnimal`, `excluir` | Inglês; sinônimo diferente de `remover` |
| `model Animais`, `data_adesao` | Modelo no plural; campo em snake_case |

**Exceções**

- Rotas de autenticação usam ações em inglês (`/auth/register`, `/auth/login`), porque já são consumidas pelo frontend. Não renomeie sem uma PR que altere os dois lados (ver CONTRIBUTING, mudança que quebra compatibilidade).
- Os campos `createdAt` e `updatedAt` seguem a convenção do Prisma, em inglês.

---

## 5. Validação de entrada

### 5.1 Onde e o que validar

**Obrigatório:** todo dado vindo do cliente (`req.body`, `req.params`, `req.query`) é validado **no controller**, antes de chegar ao Prisma. A validação do frontend não substitui a do backend.

**Por quê:** a API pode ser chamada sem o frontend (Postman, `curl`, outro sistema). Quando um valor inválido chega ao Prisma, o erro vira `500` e expõe detalhes internos (lacuna [L-02](#11-lacunas-conhecidas)).

Valide, nesta ordem:

1. **ID da URL:** é um número inteiro positivo. Se não for, responda `400`.
2. **Corpo presente:** `req.body` existe. No Express 5, uma requisição sem corpo JSON chega com `req.body` igual a `undefined`.
3. **Campos obrigatórios:** estão presentes e não são vazios.
4. **Tipos:** cada campo tem o tipo esperado (texto, número).
5. **Valores permitidos:** campos com lista fechada (`tipo`, `status`) contêm um valor da lista.
6. **Unicidade e existência:** registros relacionados existem e campos únicos não estão em uso.

### 5.2 Regras

**Obrigatório**

- Não usar a checagem "falsy" (`if (!campo)`) para campos que podem receber `0` ou `false`. Ela trata `0` como ausente (lacuna [L-07](#11-lacunas-conhecidas)).
- Na atualização (`PUT`), campos obrigatórios enviados **vazios** são rejeitados. Hoje é possível apagar o nome de um animal com `{ "nome": "" }` (lacuna [L-08](#11-lacunas-conhecidas)).
- Gravar no banco **somente os campos permitidos**, listados explicitamente. Nunca passe `req.body` direto para o Prisma.
- Listas de valores permitidos ficam em uma constante no topo do controller e são usadas no `criar` e no `atualizar`.
- A mensagem de erro de validação diz qual campo está errado e qual é o valor esperado.

**Por quê** da lista de campos permitidos: sem ela, o cliente pode enviar campos que não deveria controlar, como `id`, `createdAt` ou, no caso do usuário, `senhaHash`.

Exemplo **adequado**, que reúne as regras (lista fechada em constante, campos permitidos, checagem sem "falsy"):

```js
const TIPOS_ANIMAL = ["cao", "gato"];
const CAMPOS_ANIMAL = ["nome", "tipo", "raca", /* ... */ "outros"];

function vazio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === "";
}

async function criar(req, res, next) {
  try {
    const body = req.body ?? {};
    if (vazio(body.nome) || vazio(body.tipo)) {
      return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
    }
    if (typeof body.nome !== "string") {
      return res.status(400).json({ erro: "Nome deve ser um texto" });
    }
    if (!TIPOS_ANIMAL.includes(body.tipo)) {
      return res.status(400).json({ erro: "Tipo deve ser 'cao' ou 'gato'" });
    }
    const animal = await prisma.animal.create({ data: extrairDados(body) });
    res.status(201).json(animal);
  } catch (e) { next(e); }
}
```

Validação do ID da URL:

```js
const id = Number(req.params.id);
if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ erro: "ID inválido" });
}
```

Exemplos **inadequados**:

```js
// 1. Repassa o corpo inteiro: o cliente pode gravar qualquer campo
await prisma.animal.create({ data: req.body });

// 2. Rejeita valor 0 como se estivesse ausente
if (!tipo || !valor || !data) { ... }

// 3. ID sem validação: GET /animais/abc vira erro 500
const animal = await prisma.animal.findUnique({ where: { id: Number(req.params.id) } });

// 4. Lista de valores repetida e diferente entre criar e atualizar
if (!["cao", "gato"].includes(tipo)) { ... }        // em criar
if (!["cao", "gato", "outro"].includes(tipo)) { ... } // em atualizar
```

**Recomendado:** quando a validação de um recurso ficar longa, extraí-la para uma função `validar<Recurso>(body)` no próprio controller, que devolve a mensagem de erro ou `null`.

**Proposta:** adotar uma biblioteca de validação (por exemplo, `zod`). Não foi decidido. Até haver decisão registrada, a validação é manual, como nos exemplos acima.

**Exceção:** regras que dependem da ONG (valores de `status`, situações de entrada e saída, categorias de despesa) não são inventadas no backend. Enquanto não forem confirmadas, use os valores já existentes no código e registre a dúvida na PR (ver DT-15 a DT-21).

---

## 6. Respostas e códigos HTTP

### 6.1 Formato das respostas

**Situação atual**, que vira **obrigatória** para rotas novas, porque o frontend (`frontend/lib/api.ts`) depende dela:

| Caso | Corpo |
|---|---|
| Sucesso que retorna um registro | O objeto, direto: `{ "id": 1, "nome": "Rex", ... }` |
| Sucesso que retorna uma lista | O array, direto: `[ {...}, {...} ]`. Lista vazia é `[]`, não `404`. |
| Sucesso sem dado a retornar (remoção) | `{ "mensagem": "Animal removido com sucesso" }` |
| Erro | `{ "erro": "<mensagem em português para o usuário>" }` |

**Por quê:** o frontend mostra ao usuário o texto do campo `erro`. Uma resposta de erro sem esse campo aparece como "Erro 500 na requisição", sem explicação.

**Obrigatório**

- Mensagens de erro e de sucesso em português, curtas e compreensíveis para quem usa o sistema na ONG.
- Nunca retornar dados sensíveis. O hash de senha é removido com `semSenha(usuario)` antes de qualquer resposta (`authController.js`).
- Não envolver as respostas de sucesso em outro objeto (`{ dados: ... }`, `{ data: ... }`). Isso mudaria o contrato de todas as rotas.

### 6.2 Códigos de status

| Código | Quando usar | Exemplo existente |
|---|---|---|
| `200 OK` | Leitura, atualização e remoção bem-sucedidas | `GET /animais`, `PUT /animais/:id` |
| `201 Created` | Criação bem-sucedida. Retorna o registro criado. | `POST /animais` |
| `400 Bad Request` | Dados inválidos: campo obrigatório ausente, tipo errado, valor fora da lista, ID inválido, JSON malformado | `"Tipo deve ser 'cao' ou 'gato'"` |
| `401 Unauthorized` | Sem autenticação válida: credenciais erradas, token ausente ou expirado | `POST /auth/login` com senha errada |
| `403 Forbidden` | Autenticado, mas sem permissão. **Ainda não usado** (seção 9). | — |
| `404 Not Found` | Registro do ID informado não existe, ou rota inexistente | `"Animal não encontrado"` |
| `409 Conflict` | Violação de unicidade: e-mail já cadastrado | `POST /colaboradores` com e-mail repetido |
| `500 Internal Server Error` | Erro inesperado. **Nunca** usado de propósito para erro de validação. | Tratador de erros em `server.js` |

**Obrigatório:** escolher o código pela tabela. Erros causados por dados do cliente são `4xx`; `500` indica falha do servidor.

**Situação atual:** o `PUT` faz atualização parcial: só os campos enviados são alterados. Mantenha esse comportamento. Não crie rotas `PATCH` sem registrar a decisão.

**Exceção:** a remoção retorna `200` com `mensagem`, e não `204` sem corpo. Mantenha `200` nas rotas novas para seguir o padrão existente. O frontend aceita os dois.

---

## 7. Tratamento de erros

### 7.1 Erros esperados e inesperados

| Tipo | Exemplos | Onde tratar | Resposta |
|---|---|---|---|
| Esperado | Validação, registro inexistente, e-mail duplicado | No controller, com `return res.status(4xx).json({ erro })` | Código `4xx` e mensagem clara |
| Inesperado | Banco indisponível, erro de programação | `next(e)` → tratador central em `server.js` | `500` |

**Situação atual:** o tratador central em `server.js` registra o erro no console e responde `500` com `{ erro: err.message }`. Para erros do Prisma, essa mensagem contém o trecho do código e o caminho dos arquivos no servidor (lacuna [L-02](#11-lacunas-conhecidas)). O tratador também transforma em `500` erros que deveriam ser `400`, como JSON malformado (lacuna [L-03](#11-lacunas-conhecidas)).

**Proposta** para o tratador central (implementação a cargo dos subgrupos, com aprovação da Documentação): responder `400` para JSON malformado, `{ erro: "Erro interno do servidor" }` para os demais erros inesperados, mantendo o detalhe apenas no `console.error`, e adicionar uma resposta JSON `404` para rotas inexistentes (lacuna [L-04](#11-lacunas-conhecidas)).

### 7.2 Erros do Prisma

**Obrigatório:** tratar no controller os erros do Prisma que representam uma situação esperada, em vez de deixá-los chegar ao tratador central como `500`.

| Código Prisma | Significado | Resposta |
|---|---|---|
| `P2002` | Violação de campo único | `409` |
| `P2025` | Registro não encontrado em `update` ou `delete` | `404` |
| `P2003` | Chave estrangeira inválida | `400` |

Exemplo **adequado** (a checagem prévia continua sendo o padrão; o `catch` cobre o caso em que outro registro foi alterado entre a checagem e a gravação):

```js
async function atualizar(req, res, next) {
  try {
    // ... validações
    const colaborador = await prisma.colaborador.update({ where: { id }, data });
    res.json(colaborador);
  } catch (e) {
    if (e.code === "P2002") return res.status(409).json({ erro: "Email já cadastrado" });
    if (e.code === "P2025") return res.status(404).json({ erro: "Colaborador não encontrado" });
    next(e);
  }
}
```

Exemplo **inadequado** (situação atual de `PUT /colaboradores/:id`): o e-mail não é checado e, se já existir, o cliente recebe `500` com a mensagem interna do Prisma (lacuna [L-05](#11-lacunas-conhecidas)).

**Obrigatório**

- Não engolir erros: um `catch` que não trata o erro chama `next(e)`.
- Não montar a mensagem de erro para o cliente com `e.message`.
- Não registrar no console senhas, tokens ou o corpo completo de requisições de autenticação.

---

## 8. Schema, migrations e seed

As regras de convivência entre grupos (não editar migrations publicadas, resolver conflitos no `schema.prisma`, cópia do banco antes de `migrate`) estão no [CONTRIBUTING, seção 2.5](../CONTRIBUTING.md#25-resolver-conflitos) e **não são repetidas aqui**. Esta seção trata de como escrever o schema e as migrations.

### 8.1 Schema

**Obrigatório**

- Todo modelo novo tem `id Int @id @default(autoincrement())`, `createdAt DateTime @default(now())` e `updatedAt DateTime @updatedAt`, como os modelos existentes.
- Relações declaram a chave estrangeira (`<modelo>Id`) e o comportamento ao apagar (`onDelete`). A escolha de `onDelete: Cascade` apaga os registros filhos e precisa ser justificada na PR.
- Campos que identificam um registro e não podem se repetir (e-mail) usam `@unique`.
- Valores de lista fechada documentados em comentário no campo, como já é feito em `Animal.tipo`: `tipo String // "cao" | "gato"`.
- Toda mudança no schema que afete outro módulo ou os relatórios é registrada em [decisões técnicas](../docs/decisoes-tecnicas.md#61-quando-registrar) na mesma PR.

**Situação atual:** várias datas e valores são `String` (`dataAdesao`, `Contribuicao.valor`, `Contribuicao.data`, `dataVacinacao`). Isso dificulta ordenar, filtrar e somar (DT-14).

**Recomendado**, para campos **novos**: usar `DateTime` para datas e um tipo numérico para valores (`Decimal` para dinheiro, ou `Int` em centavos). Não converter os campos existentes sem decisão registrada, porque a mudança afeta o frontend e os dados já gravados.

**Exceção:** campos intencionalmente aproximados continuam como texto, como `Animal.idade` ("3 anos").

### 8.2 Migrations

**Obrigatório**

- Toda mudança no `schema.prisma` vem acompanhada da migration gerada, **no mesmo commit ou na mesma PR**.
- Gerar migrations sempre com `npx prisma migrate dev --name <nome>`. Não usar `prisma db push` no projeto, porque ele altera o banco sem criar migration.
- Não editar o `migration.sql` gerado à mão, salvo para corrigir uma migration que ainda não saiu do seu computador.
- Nome da migration em português, minúsculas, palavras separadas por `_`, começando com um verbo: `adiciona_campo_situacao_animal`, `cria_modelo_despesa`.
- Antes de abrir a PR: `npx prisma validate` e `npm run migrate` sem erros, partindo de um banco atualizado com a `develop`.

**Por quê:** o nome aparece no histórico e no banco de todos os desenvolvedores. Um nome que diz o que muda permite entender a evolução do schema sem abrir cada arquivo.

**Exceção:** as migrations existentes têm nomes em inglês (`expand_animal_fields`, `add_usuario`) e **não devem ser renomeadas**. Renomear a pasta de uma migration já aplicada faz o Prisma pedir para recriar o banco.

**Exemplos inadequados de nome:** `teste`, `update`, `migration1`, `ajustes_do_joao`.

**Atenção ao SQLite:** algumas alterações (tornar um campo obrigatório, mudar o tipo) fazem o Prisma recriar a tabela inteira, como em `20260617222620_expand_animal_fields`. Ao adicionar um campo obrigatório a uma tabela que já tem dados, informe um `@default` ou crie o campo como opcional. Confira o SQL gerado antes do commit.

### 8.3 Seed

**Situação atual:** `prisma/seed.js` cria o usuário `admin@sjpa.com` / `admin123` com `upsert`. Pode ser executado várias vezes sem duplicar o usuário (verificado).

**Obrigatório**

- O seed é idempotente: dados novos usam `upsert` ou checam a existência antes de criar.
- O seed contém **apenas dados fictícios**. Nunca dados reais de animais, pessoas ou doações da ONG.
- As credenciais do seed servem só para desenvolvimento. Em homologação e produção, o usuário admin padrão não pode existir com a senha `admin123`.
- Se o seed passar a criar novos dados, as credenciais ou instruções ficam neste documento.

**Recomendado:** dados de exemplo para testar telas (animais, colaboradores) entram no seed como funções separadas, para que cada grupo possa manter os seus.

### 8.4 Recomeçar com o banco vazio

```bash
# faça uma cópia do dev.db se quiser guardar os dados
npx prisma migrate reset
npx prisma generate
npm run seed
```

O `migrate reset` **apaga todos os dados locais** e aplica as migrations de novo. Use apenas no seu banco de desenvolvimento.

**Não verificado:** se o `migrate reset` executa o seed sozinho. O seed não está configurado no `prisma.config.ts`, então rode `npm run seed` manualmente.

---

## 9. Autenticação e autorização

### 9.1 Situação atual

| Aspecto | Como funciona hoje |
|---|---|
| Cadastro | `POST /auth/register` é público: **qualquer pessoa pode criar uma conta** |
| Login | `POST /auth/login` devolve `{ token, usuario }`. Senha conferida com `bcrypt` |
| Token | JWT assinado com `JWT_SECRET`, válido por 7 dias, com `id` e `email` no conteúdo |
| Segredo | Se `JWT_SECRET` não estiver definido, é usado `sjpa-dev-secret`, fixo no código |
| Proteção das rotas | **Nenhuma.** As rotas de animais, colaboradores e voluntários não exigem token, e o frontend não envia o token (guarda no `localStorage`) |
| Perfis de acesso | Não existem. Todo usuário tem o mesmo acesso |
| CORS | Aceita qualquer origem |

**Consequência:** qualquer pessoa que conheça o endereço da API consegue ler, alterar e apagar dados sem login (lacuna [L-06](#11-lacunas-conhecidas)). Por isso **a API não pode receber dados reais da ONG** enquanto isso não for resolvido (DT-05).

### 9.2 Regras que já valem

**Obrigatório**

- Senhas são gravadas apenas como hash `bcrypt` (campo `senhaHash`), nunca em texto puro.
- O hash nunca aparece em respostas nem em logs. Use `semSenha(usuario)`.
- O login responde a mesma mensagem (`Credenciais inválidas`, `401`) para e-mail inexistente e senha errada.
- Fora do desenvolvimento, `JWT_SECRET` é definido no ambiente com um valor longo e aleatório, diferente do padrão.
- Nenhuma PR remove as proteções acima.
- Uma rota nova que lide com dados pessoais ou financeiros indica na descrição da PR que **ainda é pública**, até existir o middleware da seção 9.3.

**Por quê:** a mesma mensagem para os dois erros de login impede descobrir quais e-mails estão cadastrados. Com o segredo padrão, que está no repositório público, qualquer pessoa consegue gerar um token válido.

### 9.3 Proposta de proteção das rotas

**Proposta, não implementada e pendente de decisão (DT-05).** Descrita aqui para orientar a discussão e a futura implementação pelos subgrupos:

1. Criar um middleware `autenticar` em `src/middlewares/autenticar.js`, que lê o cabeçalho `Authorization: Bearer <token>`, valida o JWT e guarda os dados em `req.usuario`. Sem token ou com token inválido, responde `401` com `{ erro }`.
2. Aplicar o middleware nas rotas de dados, no arquivo de rotas ou no `server.js`, mantendo `/auth/login` e `GET /` públicos.
3. Ajustar `frontend/lib/api.ts` para enviar o token, e redirecionar para o login ao receber `401`.
4. Definir se o cadastro continua aberto ou se só um administrador cria contas.
5. Se a ONG precisar de perfis diferentes (por exemplo, quem pode ver o financeiro), criar um middleware `autorizar(perfil)` que responde `403`.

Os itens 4 e 5 são **regras de negócio** e dependem da ONG. Não devem ser implementados por suposição.

Esboço, apenas para ilustrar o formato da proposta:

```js
// src/middlewares/autenticar.js — PROPOSTA, arquivo não existe
const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || "").split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Login necessário" });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Sessão expirada. Faça login novamente." });
  }
}
```

A proteção das rotas muda o contrato com o frontend e deve ser feita em uma única PR que altere backend e frontend juntos, com revisores dos grupos afetados.

---

## 10. Testes e validação antes da PR

**Situação atual:** o backend não tem testes automatizados nem ferramenta de testes escolhida (DT-06). A estratégia, os padrões de testes e a escolha da ferramenta fazem parte da [DOC-11](https://trello.com/c/aiQAFtur), que **ainda não foi iniciada**. Quando o documento de testes for integrado, esta seção será revista para apontar para ele.

Enquanto não houver testes, vale o [CONTRIBUTING, seção 6.3](../CONTRIBUTING.md#63-validações-antes-de-abrir).

**Obrigatório** em toda PR que altera `backend/`:

- `npm run dev` sobe sem erros.
- Cada rota criada ou alterada foi chamada pelo menos uma vez, no caso de sucesso **e** em pelo menos um caso de erro (campo obrigatório ausente, ID inexistente).
- Se o schema mudou: `npx prisma validate`, `npm run migrate` e `npx prisma generate` sem erros, e a migration está na PR.
- A seção "Como testar" da PR traz as chamadas usadas, com método, rota, corpo e resposta esperada.

Exemplo de registro em "Como testar":

```text
POST /animais  {"nome":"Rex","tipo":"cao"}      → 201, retorna o animal com id
POST /animais  {"nome":"Rex"}                   → 400, "Nome e tipo são obrigatórios"
GET  /animais/999                               → 404, "Animal não encontrado"
```

**Recomendado:** usar `curl`, a extensão REST Client do VS Code ou o Postman. As coleções do Postman (`*.postman_collection.json`) estão no `.gitignore` e não são versionadas.

**Recomendado:** escrever funções de validação puras (sem `req`, `res` nem Prisma), para que possam receber testes unitários quando a ferramenta for definida.

---

## 11. Lacunas conhecidas

Problemas encontrados na verificação de 10/10/2026. Estão registrados para orientar a priorização. **A correção é responsabilidade dos subgrupos** e deve seguir o fluxo normal de PR.

| ID | Lacuna | Como reproduzir | Comportamento esperado pelos padrões | Seção |
|---|---|---|---|---|
| L-01 | A aplicação abre o arquivo fixo `backend/dev.db` e ignora a `DATABASE_URL`, que só a CLI do Prisma usa | Usar `DATABASE_URL="file:../dev.db"` e rodar o seed | Aplicação e migrations usam o mesmo banco, configurado em um só lugar (DT-03) | 2.3 |
| L-02 | Erros inesperados devolvem `err.message`, que nos erros do Prisma inclui trecho do código e caminho dos arquivos | `POST /animais` com `{"nome":123,"tipo":"cao"}` | `400` para tipo inválido; `500` com mensagem genérica para erros reais | 5, 7.1 |
| L-03 | JSON malformado responde `500` | `POST /animais` com corpo `{bad json` | `400` | 7.1 |
| L-04 | Rota inexistente responde uma página HTML, não JSON | `GET /rota-inexistente` | `404` com `{ erro }` | 7.1 |
| L-05 | `PUT /colaboradores/:id` com e-mail de outro colaborador responde `500` | Atualizar o colaborador 2 com o e-mail do 1 | `409`, como no `POST` | 7.2 |
| L-06 | As rotas de dados não exigem autenticação; o cadastro de usuário é aberto; `JWT_SECRET` tem valor padrão no código | `GET /colaboradores` sem token | Proteção definida em DT-05 | 9 |
| L-07 | `POST /colaboradores/:id/contribuicoes` rejeita `valor` igual a `0` como ausente | Corpo com `"valor": 0` | Validar presença sem checagem "falsy" | 5.2 |
| L-08 | `PUT` aceita campo obrigatório vazio | `PUT /animais/1` com `{"nome":""}` → `200` | `400` | 5.2 |
| L-09 | ID não numérico na URL responde `500` | `GET /animais/abc` | `400` | 5.1 |
| L-10 | Requisição sem corpo responde `500` | `POST /animais` sem corpo | `400` | 5.1 |
| L-11 | O `PUT /colaboradores/:id` aceita `nome`, `email`, `telefone` e `dataAdesao` vazios ou ausentes sem validar | Ver código de `atualizar` | Mesmas validações do `criar` para os campos enviados | 5.2 |

**Lacunas de documentação**

- O README da raiz indicava `DATABASE_URL="file:../dev.db"` e não citava o `npx prisma generate`. Corrigido na mesma PR deste documento.
- Não há documento de contratos da API (formato de cada requisição e resposta). Hoje a referência é a lista de rotas do README da raiz e o próprio código.
- A versão mínima do Node não está definida (seção 2.1).

---

## 12. Documentos relacionados

| Documento | Uso |
|---|---|
| [README do projeto](../README.md) | Visão rápida, lista de rotas e execução do frontend |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Branches, commits, PR, revisão e regras de migrations entre grupos |
| [docs/visao-geral.md](../docs/visao-geral.md) | Contexto, módulos e campos de cada cadastro |
| [docs/estado-dos-modulos.md](../docs/estado-dos-modulos.md) | O que está pronto e integrado em cada módulo |
| [docs/entregas-e-proximos-passos.md](../docs/entregas-e-proximos-passos.md) | Prioridades do período |
| [docs/decisoes-tecnicas.md](../docs/decisoes-tecnicas.md) | Situação de cada decisão (IDs `DT-XX` citados aqui) — DOC-06 |
| [docs/arquitetura.md](../docs/arquitetura.md) | Componentes, camadas, percurso de uma operação e limites dos módulos — DOC-08 |
| [docs/trello.md](../docs/trello.md) | Organização dos cartões, critérios de conclusão e evidências — DOC-05 |
| [docs/uso-de-ia.md](../docs/uso-de-ia.md) e [AGENTS.md](../AGENTS.md) | Orientações para o uso de assistentes de IA no projeto — DOC-07 |
| Documento de testes | Estratégia, padrões e ferramenta de testes — [DOC-11](https://trello.com/c/aiQAFtur). **Ainda não existe.** |

**Alinhamento**

- **Arquitetura (DOC-08):** conferida em 10/10/2026. As seções 1 e 3 deste documento descrevem as mesmas camadas e não divergem dela. Se a arquitetura mudar, a seção 3 é revisada na mesma PR.
- **Testes (DOC-11):** pendente. Quando o documento de testes for integrado, revisar a seção 10 e a recomendação de funções de validação puras.
- Se houver divergência entre documentos, prevalece o que estiver registrado como decisão em [decisões técnicas](../docs/decisoes-tecnicas.md#66-evitar-divergência-entre-documentos), e este documento é ajustado.

---

## 13. Validação com os subgrupos

Os padrões deste documento partem do código existente, mas as regras marcadas como obrigatórias para código novo e as propostas precisam ser confirmadas pelos desenvolvedores que atuam no backend. A ausência de objeção não equivale a confirmação.

| Grupo | Responsáveis pelo backend | Pontos para conferir | Situação |
|---|---|---|---|
| Animais | Gustavo Lopes, João Marco Batista, João Victor Leal | Seções 2, 5, 6, 7 e 8; lacunas L-02, L-03, L-08 a L-10 | Pendente |
| Colaboradores | Lucas Tinoco, Lennon Rangel | Seções 2, 5, 6, 7 e 8; lacunas L-05, L-07, L-11 | Pendente |
| Financeiro | Allan Chang, Felipe Agapito | Seções 4, 5, 8.1 (tipos de data e valor) e 9 | Pendente |
| Documentação | Vitor Rosa, Lucas Ciampi, Gustavo Amaral | Documento completo, alinhamento com a arquitetura (DOC-08) e, depois, com testes (DOC-11) | Pendente |

Cada grupo registra a concordância ou os ajustes na PR deste documento ou no cartão do Trello. Sugestões de mudança depois da integração seguem o fluxo normal: uma PR alterando este arquivo, revisada pela Documentação.

---

## 14. Histórico e contribuições

### 14.1 Histórico de alterações

| Data | Versão | Alteração |
|---|---|---|
| 10/10/2026 | 1 | Criação do documento e verificação do passo a passo de execução |
| 12/10/2026 | 1.1 | Inclusão do guia de uso de IA (DOC-07) nos documentos relacionados; atualização das referências à DOC-10 na arquitetura e no guia de uso de IA |

### 14.2 Contribuições

Preenchida somente com participações confirmadas. O registro final da tarefa (PR, revisão, verificações e capturas) segue o modelo do [guia do Trello, seção 8](../docs/trello.md#8-critérios-de-conclusão-e-evidências).

| Integrante | Contribuição |
|---|---|
| | |

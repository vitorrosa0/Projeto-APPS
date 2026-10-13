# Frontend — Execução e Padrões de Desenvolvimento

Este documento explica como configurar e executar a aplicação web do SJPA e define os padrões para escrever código no frontend: estrutura do App Router, organização de pastas e componentes, formulários, integração com a API, estilização com Tailwind CSS, tratamento de estado e tipos TypeScript.

Ele vale para todos os subgrupos que alteram a pasta `frontend/` (Animais, Colaboradores e Financeiro). Antes de ler, conheça a [Visão Geral do Projeto](../docs/visao-geral.md), a [Arquitetura do Sistema](../docs/arquitetura.md) e o [Guia de Contribuição](../CONTRIBUTING.md).

Documento da **DOC-09**. A visão arquitetural do sistema, o percurso de ponta a ponta e as dependências compartilhadas estão na [arquitetura do sistema](../docs/arquitetura.md). Este documento detalha **como** configurar, executar e padronizar o código do frontend. Os IDs de decisão citados (DT-XX) remetem ao [registro de decisões técnicas](../docs/decisoes-tecnicas.md), onde deve ser conferida a situação de cada decisão.

> **Situação:** versão 1.1, proposta pela Documentação em 12/10/2026, a partir da inspeção do código e da execução do passo a passo descrita na [seção 2.6](#26-verificação-do-passo-a-passo), com correções documentais em 13/10/2026. Os padrões ainda precisam ser validados pelos subgrupos (ver [seção 10](#10-validação-com-os-subgrupos)).

## Como ler este documento

| Marcação | Significado |
|---|---|
| **Obrigatório** | Regra do projeto para código novo ou alterado. A PR que não cumprir a regra não é aprovada. |
| **Recomendado** | Boa prática. O revisor pode sugerir, mas não bloqueia a PR por isso. |
| **Proposta** | Algo que **ainda não existe** no projeto e depende de decisão. Não descreve funcionalidade implementada. |
| **Situação atual** | Como o código funciona hoje, verificado em 12/10/2026. |

Quando uma regra tem exceções, elas aparecem logo abaixo dela. As falhas e inconsistências encontradas no código atual são registradas com identificadores de lacunas (`LF-01`, `LF-02`...), permitindo rastreabilidade sem bloquear a entrega documental.

**Código existente:** os padrões de escrita de código valem para código **novo ou alterado**. Uma lacuna antiga em arquivo não modificado não exige, por si só, adequação a esses padrões na mesma PR. Isso não dispensa as verificações globais de lint e build da [seção 7.2](#72-validações-obrigatórias-atuais-antes-de-abrir-pull-request), conforme o Guia de Contribuição.

---

## Sumário

1. [Visão geral do frontend](#1-visão-geral-do-frontend)
2. [Configuração e execução](#2-configuração-e-execução)
   - [2.1 Pré-requisitos](#21-pré-requisitos)
   - [2.2 Scripts disponíveis](#22-scripts-disponíveis)
   - [2.3 Variáveis de ambiente](#23-variáveis-de-ambiente)
   - [2.4 Primeira execução](#24-primeira-execução)
   - [2.5 Operações do dia a dia](#25-operações-do-dia-a-dia)
   - [2.6 Verificação do passo a passo](#26-verificação-do-passo-a-passo)
3. [Organização e responsabilidades](#3-organização-e-responsabilidades)
   - [3.1 Páginas e rotas (App Router)](#31-páginas-e-rotas-app-router)
   - [3.2 Componentes e interface](#32-componentes-e-interface)
   - [3.3 Tipos TypeScript](#33-tipos-typescript)
   - [3.4 Chamadas à API (lib/api.ts)](#34-chamadas-à-api-libapits)
4. [Nomenclatura, responsabilidades e reaproveitamento](#4-nomenclatura-responsabilidades-e-reaproveitamento)
   - [4.1 Convenções de nomenclatura](#41-convenções-de-nomenclatura)
   - [4.2 Divisão de responsabilidades](#42-divisão-de-responsabilidades)
   - [4.3 Padrões para reaproveitamento de código](#43-padrões-para-reaproveitamento-de-código)
5. [Carregamento, erros, validações e campos opcionais](#5-carregamento-erros-validações-e-campos-opcionais)
   - [5.1 Estados de carregamento (Loading States)](#51-estados-de-carregamento-loading-states)
   - [5.2 Tratamento e exibição de erros](#52-tratamento-e-exibição-de-erros)
   - [5.3 Validação de formulários](#53-validação-de-formulários)
   - [5.4 Tratamento seguro de campos opcionais](#54-tratamento-seguro-de-campos-opcionais)
6. [Responsividade e acessibilidade](#6-responsividade-e-acessibilidade)
   - [6.1 Padrões de responsividade (Mobile-First)](#61-padrões-de-responsividade-mobile-first)
   - [6.2 Padrões de acessibilidade (a11y)](#62-padrões-de-acessibilidade-a11y)
   - [6.3 Exemplos adequados e inadequados](#63-exemplos-adequados-e-inadequados)
7. [Testes e validação antes da PR](#7-testes-e-validação-antes-da-pr)
   - [7.1 Estratégia de testes e diretrizes](#71-estratégia-de-testes-e-diretrizes)
   - [7.2 Validações obrigatórias atuais antes de abrir Pull Request](#72-validações-obrigatórias-atuais-antes-de-abrir-pull-request)
8. [Lacunas conhecidas](#8-lacunas-conhecidas)
9. [Documentos relacionados](#9-documentos-relacionados)
10. [Validação com os subgrupos](#10-validação-com-os-subgrupos)
11. [Histórico e contribuições](#11-histórico-e-contribuições)

---

## 1. Visão geral do frontend

| Item | Situação atual |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Biblioteca base | React 19.2.4 e React DOM 19.2.4 |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 4 (`@tailwindcss/postcss` 4, `tailwindcss` 4) |
| Biblioteca de ícones | `react-icons` 5.6.0 e `lucide-react` 1.17.0 |
| Porta padrão | `3000` (o backend Express roda na porta `3001`) |
| Comunicação com API | Utilitário centralizado `lib/api.ts` (REST com JSON) |

As decisões técnicas relativas à interface e sua stack constam na DT-01 do [registro de decisões técnicas](../docs/decisoes-tecnicas.md): Next.js com App Router, React, TypeScript e Tailwind CSS.

```text
frontend/
├── app/                     # Rotas e páginas do App Router
│   ├── (etapas)/            # Grupo de rotas das funcionalidades do sistema
│   │   ├── animais/         # Listagens e formulários de animais
│   │   ├── colaboradores/   # Listagem, cadastro e histórico de colaboradores
│   │   ├── voluntários/     # Listagem de voluntários e agenda local
│   │   ├── doacoes/         # Visão estática de doações e despesas (Financeiro)
│   │   ├── login/           # Tela de login
│   │   ├── cadastro/        # Tela de registro de usuários
│   │   └── recuperar-senha/ # Fluxo de recuperação de senha
│   ├── globals.css          # Importações de estilos e utilitários globais do Tailwind
│   └── layout.tsx           # Layout raiz com fontes e viewport
├── components/              # Componentes de interface compartilhados e específicos
├── lib/
│   └── api.ts               # Wrapper de fetch para requisições ao backend
├── public/                  # Arquivos estáticos (imagens, ícones)
├── eslint.config.mjs        # Configuração do ESLint 9
├── next.config.ts           # Configuração do Next.js
├── postcss.config.mjs       # Configuração do PostCSS
├── tailwind.config.ts       # Configuração de temas e fontes do Tailwind
├── tsconfig.json            # Configuração do compilador TypeScript
└── package.json             # Dependências e scripts do projeto
```

---

## 2. Configuração e execução

### 2.1 Pré-requisitos

- **Node.js** e **npm**. O ambiente foi verificado com **Node 22.14.0 (LTS) e npm 10.9.2** no Windows 11.
- **Versão do Node recomendada:** versão LTS recente (20 ou 22). O `package.json` não especifica a chave `engines`, mas versões antigas do Node não suportam as dependências do Next.js 16 e React 19.
- **Backend rodando (opcional para navegação estática, obrigatório para dados reais):** Para operações de login, cadastro ou consulta/modificação de animais, colaboradores e voluntários, a API Express deve estar em execução em `http://localhost:3001` conforme o [guia do backend](../backend/README.md).

### 2.2 Scripts disponíveis

Todos os comandos devem ser executados **dentro da pasta `frontend/`**.

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências do frontend |
| `npm run dev` | Inicia o servidor de desenvolvimento Next.js (Turbopack) em `http://localhost:3000` com hot-reload |
| `npm run build` | Compila a aplicação para produção e realiza checagens de tipos do TypeScript |
| `npm start` | Inicia o servidor Next.js em modo de produção (requer `npm run build` prévio) |
| `npm run lint` | Executa o linter ESLint sobre os arquivos do projeto |
| `npx tsc --noEmit` | Executa o compilador TypeScript exclusivamente para verificação de tipos, sem emitir arquivos |

### 2.3 Variáveis de ambiente

O utilitário `lib/api.ts` lê a URL base da API a partir da variável `NEXT_PUBLIC_API_URL`.

| Variável | Obrigatória | Padrão no código | Quem usa | Observação |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Não no desenvolvimento | `http://localhost:3001` | `lib/api.ts` | Prefixo exposto ao navegador para chamadas à API |

Se você precisar apontar para um backend em porta ou domínio diferente (por exemplo, `http://localhost:3002`), crie o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

> **Atenção: limitação conhecida de URL hardcoded no Login e Cadastro.**
> As telas `app/(etapas)/login/page.tsx` e `app/(etapas)/cadastro/page.tsx` realizam chamadas diretamente para `"http://localhost:3001/auth/..."` usando `fetch` nativo, sem passar por `lib/api.ts` nem respeitar a variável `NEXT_PUBLIC_API_URL` (lacuna [LF-01](#8-lacunas-conhecidas)). Caso o backend seja executado em outra porta, o login e o cadastro continuarão requisitando a porta 3001 até que sejam refatorados para usar `lib/api.ts`.

**Obrigatório**

- Toda variável de ambiente destinada a ser lida no navegador deve obrigatoriamente possuir o prefixo `NEXT_PUBLIC_`. Variáveis sem esse prefixo são acessíveis somente no ambiente de servidor do Next.js.
- Nunca versionar arquivos `.env.local` ou `.env` contendo chaves sensíveis.
- Sempre que uma nova variável for introduzida, atualizar esta tabela e registrar a adição no Guia de Contribuição e na descrição da PR.

### 2.4 Primeira execução

Para clonar e subir o frontend pela primeira vez:

```bash
cd frontend
npm install
npm run dev
```

Abra o navegador e acesse:

```text
http://localhost:3000
```

Para interagir com dados reais (animais, colaboradores e autenticação), abra outro terminal e execute o backend na pasta `backend/` seguindo as instruções de [backend/README.md](../backend/README.md).

### 2.5 Operações do dia a dia

| Situação | Ação / Comandos |
|---|---|
| Alteração de rotas ou componentes | Salvar o arquivo. O Turbopack (`next dev`) atualiza o navegador instantaneamente via Fast Refresh. |
| Erro de cache ou tipos corrompidos do Next.js | Pare o servidor, apague a pasta `.next/` (`rm -rf .next` ou no PowerShell: `Remove-Item -Recurse -Force .next`) e rode `npm run dev`. |
| Checar conformidade de código antes da PR | Execute `npm run lint` e `npx tsc --noEmit`. |
| A porta 3000 já está em uso por outro processo | O Next.js detecta automaticamente a ocupação e sugere iniciar na porta `3001` (ou passe `npm run dev -- -p 3002`). **Aviso:** não execute o frontend na porta 3001 para não conflitar com a porta padrão da API backend. |

### 2.6 Verificação do passo a passo

Em **12/10/2026**, a Documentação executou a verificação do ambiente e de todos os comandos do `package.json` em uma instalação local no Windows 11 com Node 22.14.0 e npm 10.9.2:

| Etapa / Comando | Resultado observado | Situação / Diagnóstico |
|---|---|---|
| `npm install` | Concluído com sucesso (sem erros de dependências). | Conforme. |
| `npm run dev` | Servidor subiu em `http://localhost:3000` via Turbopack (Next.js 16.2.4). Navegação funcional entre as telas. | Conforme. |
| `npm run lint` | Executou `eslint`, encontrando **4 problemas (2 erros e 2 avisos)**. | **Inconsistência identificada:**<br>1. Erros `react-hooks/set-state-in-effect` em `cadastrar/page.tsx` (linha 76) e `AnimalListPage.tsx` (linha 53) devido a `setState` síncrono disparado no corpo de `useEffect`.<br>2. Aviso `@typescript-eslint/no-unused-vars` em `voluntarios/agenda/page.tsx` (`toDateKey` não utilizado).<br>3. Aviso `@next/next/no-img-element` em `AnimalAvatar.tsx` (uso de `<img>` em vez de `<Image />`). |
| `npx tsc --noEmit` | Encontrou **3 erros de tipagem estrita** em `components/AnimalListPage.tsx`. | **Inconsistência identificada:** Erro `TS18048` nas linhas 67, 68 e 69 (`a.raca`, `a.setor` e `a.canil` são tipados como opcionais no tipo `Animal` e são acessados com `.toLowerCase()` sem operador de encadeamento opcional `?.`). |
| `npm run build` | Turbopack compila os módulos em ~6.6s, mas o build falha na etapa de `Running TypeScript` se a pasta `.next` contiver referências de cache residuais ou devido aos erros estritos do TypeScript apontados acima. | **Recomendação para subgrupos:** Limpar `.next` e sanar as inconsistências de tipagem em `AnimalListPage.tsx` para habilitar o build de produção completo. |

---

## 3. Organização e responsabilidades

### 3.1 Páginas e rotas (App Router)

O projeto adota o **Next.js App Router** (DT-01). Todas as rotas públicas da aplicação residem dentro do route group `app/(etapas)/`, permitindo agrupar as etapas e fluxos do sistema sem adicionar o segmento `(etapas)` à URL do navegador.

#### Estrutura de arquivos e convenções de rotas

| Caminho do arquivo | URL resultante | Papel |
|---|---|---|
| `app/page.tsx` | `/` | Raiz da aplicação. Redireciona o usuário para `/login`. |
| `app/(etapas)/home/page.tsx` | `/home` | Painel principal com visão geral e atalhos dos módulos. |
| `app/(etapas)/login/page.tsx` | `/login` | Formulário de autenticação. |
| `app/(etapas)/cadastro/page.tsx` | `/cadastro` | Formulário de registro de novos usuários. |
| `app/(etapas)/animais/caes/page.tsx` | `/animais/caes` | Listagem filtrada de cães. |
| `app/(etapas)/animais/gatos/page.tsx` | `/animais/gatos` | Listagem filtrada de gatos. |
| `app/(etapas)/animais/cadastrar/page.tsx` | `/animais/cadastrar` | Formulário de criação de animais (também usado para edição via query param `?id=`). |
| `app/(etapas)/colaboradores/page.tsx` | `/colaboradores` | Listagem de colaboradores. |
| `app/(etapas)/colaboradores/[id]/editar/page.tsx` | `/colaboradores/:id/editar` | Rota dinâmica para edição de colaborador e histórico de contribuições. |
| `app/(etapas)/voluntarios/lista/page.tsx` | `/voluntarios/lista` | Listagem de voluntários cadastrados. |
| `app/(etapas)/voluntarios/agenda/page.tsx` | `/voluntarios/agenda` | Agenda interativa de voluntários (estado local). |
| `app/(etapas)/doacoes/page.tsx` | `/doacoes` | Telas de doações e histórico mensal (dados estáticos). |
| `app/(etapas)/doacoes/[id]/page.tsx` | `/doacoes/:id` | Rota dinâmica para visualização do extrato mensal de doações. |

#### Client Components vs Server Components

**Situação atual:** quase todas as páginas utilizam a diretiva `"use client"` no topo do arquivo. Isso ocorre porque as telas misturam a lógica de apresentação com hooks de estado (`useState`), ciclo de vida (`useEffect`) e navegação (`useRouter`), além de realizarem requisições assíncronas no navegador via `fetch`.

**Obrigatório**

- Uma página só deve receber `"use client"` se manipular hooks (`useState`, `useEffect`, `useContext`), eventos de clique/mudança (`onClick`, `onChange`) ou APIs exclusivas do navegador (`window`, `localStorage`).
- O arquivo `page.tsx` de cada rota deve ser o ponto de entrada da tela e exportar por padrão uma função React (`export default function NomeDaPagina()`).
- Páginas não devem conter definições de regras de negócio de backend nem tentar acessar diretamente bancos de dados.

**Recomendado**

- **Preferir `<Link>` a botões imperativos para navegação:** Use sempre o componente `<Link href="...">` do Next.js para links entre telas em vez de `<button onClick={() => router.push(...)}>`. O componente `<Link>` otimiza a performance (faz prefetching automático da rota) e assegura acessibilidade semântica (permitindo abrir em nova aba e facilitando leitores de tela).
- Reservar `useRouter().push(...)` exclusivamente para navegações após ações assíncronas de formulários (ex.: redirecionar após sucesso no login ou após salvar um animal).

Exemplo **adequado** de link entre páginas:

```tsx
import Link from "next/link";

export function BotaoVoltar({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
    >
      Voltar para listagem
    </Link>
  );
}
```

Exemplo **inadequado** (anti-padrão de navegação imperativa desnecessária):

```tsx
// Inadequado: perde prefetch, acessibilidade nativa e semântica de link
<button onClick={() => router.push("/animais/caes")}>
  Ir para cães
</button>
```

---

### 3.2 Componentes e interface

A pasta `components/` centraliza a biblioteca de componentes visuais do sistema.

#### Separação de responsabilidades

1. **Componentes base / UI compartilhada:**
   - Componentes genéricos reutilizáveis por qualquer módulo:
     - `Header.tsx`: topo padrão com logo e botão condicional de voltar.
     - `BottomNav.tsx`: navegação móvel inferior e sidebar para telas desktop.
     - `InputGroup.tsx` e `SelectGroup.tsx`: campos padronizados de formulário com rótulo, borda e estados visuais.
     - `ConfirmModal.tsx`: modal para confirmação de ações destrutivas (ex.: exclusão).
     - `PageTitle.tsx`: padronização de títulos e cabeçalhos visuais das páginas.
     - `PawBackground.tsx`: elementos visuais decorativos.

2. **Componentes de domínio específicos:**
   - Componentes vinculados à regra visual de um domínio específico:
     - `AnimalListPage.tsx` e `AnimalAvatar.tsx`: componentes do módulo de Animais.
     - `VoluntarioRow.tsx`: componente de item de voluntário.
     - `DoacaoRow.tsx`, `NovaDoacaoModal.tsx`, `TotalDoacoes.tsx`, `MonthRow.tsx`, `DoacaoFinanceiraForm.tsx`, `DoacaoItensForm.tsx`: componentes do módulo Financeiro.

3. **Componentes co-localizados (exceção aceita):**
   - Na rota `app/(etapas)/voluntarios/agenda/`, componentes exclusivos do calendário e agendamento foram co-localizados dentro da própria pasta da rota (`AgendamentoDiaList.tsx`, `AgendarVoluntarioModal.tsx`, `CalendarioVoluntarios.tsx`, `LembreteModal.tsx`).
   - Essa organização é válida quando os componentes são exclusivos e não possuem utilidade em nenhum outro ponto da aplicação.

**Obrigatório**

- Cada componente deve declarar explicitamente a interface das suas propriedades (`Props`) no topo do arquivo (ex.: `interface HeaderProps { ... }`).
- Componentes não devem acessar `process.env` diretamente; se precisarem de URLs ou configurações de ambiente, devem utilizar utilitários compartilhados de `lib/` ou receber via Props.
- Evitar componentes gigantes com mais de 300 linhas que acumulam requisições, filtros, paginação e modais no mesmo arquivo. Divida o componente em partes menores e especializadas.

**Recomendado**

- Exportar o componente principal por padrão (`export default function ...`) e manter nomes em PascalCase consistentes com o nome do arquivo.
- Se o componente não precisa de interatividade no navegador, mantenha-o como Server Component (sem `"use client"`).

---

### 3.3 Tipos TypeScript

O projeto utiliza TypeScript estrito para assegurar robustez na troca de dados entre interface e backend (DT-01).

#### Situação atual e lacuna de dispersão (`LF-02`)

Atualmente, não existe uma pasta central `types/` no frontend. As interfaces de dados de domínio estão declaradas de forma descentralizada e, por vezes, duplicada:
- `Contribuicao`: declarada separadamente em `app/(etapas)/colaboradores/page.tsx` e em `app/(etapas)/colaboradores/[id]/editar/page.tsx`.
- `Item`: declarada em `components/DoacaoRow.tsx` e em `app/(etapas)/doacoes/[id]/page.tsx`.
- `Animal`: declarada e exportada a partir de `components/AnimalListPage.tsx`.
- `Agendamento` e `Lembrete`: declaradas em um arquivo isolado `app/(etapas)/voluntarios/agenda/types.ts`.

#### Padrão obrigatório para tipagem

**Obrigatório**

- **Não usar `any`:** Todo tipo de dado recebido da API ou passado por propriedade deve ter interface ou tipo explícito.
- **Tratamento seguro de campos opcionais:** Quando um campo do backend puder ser nulo ou indefinido (como `raca?: string`, `setor?: string`, `canil?: string` em `Animal`), o código deve utilizar encadeamento opcional (`?.`) ou coalescência nula (`??`) antes de invocar métodos de string/array como `.toLowerCase()`. O desrespeito a essa regra quebra a checagem `npx tsc --noEmit` com erro `TS18048`.

Exemplo **adequado** de acesso seguro a campos opcionais:

```typescript
// Adequado: previne erro de runtime e compila no TypeScript estrito
const filtroMatch =
  animal.nome.toLowerCase().includes(termo) ||
  animal.raca?.toLowerCase().includes(termo) ||
  animal.setor?.toLowerCase().includes(termo);
```

Exemplo **inadequado** (presente na lacuna atual de `AnimalListPage.tsx`):

```typescript
// Inadequado: gera erro TS18048 se raca for undefined
const filtroMatch = animal.raca.toLowerCase().includes(termo);
```

**Proposta:** Criar no futuro uma pasta `frontend/types/` reunindo arquivos como `animal.ts`, `colaborador.ts`, `voluntario.ts` e `doacao.ts`, centralizando as interfaces do domínio da aplicação e eliminando as duplicatas.

---

### 3.4 Chamadas à API (`lib/api.ts`)

A comunicação entre a interface do Next.js e a API Express é centralizada pelo utilitário `lib/api.ts`.

```typescript
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || `Erro ${res.status} na requisição`);
  }

  return res.status === 204 ? (undefined as T) : res.json();
}
```

#### Como consumir o utilitário `api<T>`

1. **Consulta GET com tipagem genérica:**
   ```typescript
   import { api } from "@/lib/api";
   import { Animal } from "@/components/AnimalListPage";

   const listaAnimais = await api<Animal[]>("/animais?tipo=cao");
   ```

2. **Criação POST / Atualização PUT:**
   ```typescript
   const animalCriado = await api<Animal>("/animais", {
     method: "POST",
     body: JSON.stringify(dadosFormulario),
   });
   ```

3. **Exclusão DELETE (retorno atual `200` com `{ mensagem }`):**
   ```typescript
   const resposta = await api<{ mensagem: string }>(`/animais/${id}`, {
     method: "DELETE",
   });
   ```

   As rotas de remoção de animais, colaboradores e voluntários retornam JSON com a mensagem de sucesso, conforme o [guia do backend, seção 6](../backend/README.md#6-respostas-e-códigos-http). O tratamento de `204` no utilitário permite respostas sem corpo, mas não descreve o contrato atual dessas rotas.

#### Regras e diretrizes

**Obrigatório**

- **Toda chamada à API Express deve usar o wrapper `api<T>`:** É proibido invocar `fetch("http://localhost:3001/...")` diretamente com URLs fixas nos componentes ou páginas.
- **Tratamento de exceções:** Chamadas à função `api<T>` devem ser sempre envolvidas em blocos `try/catch` (ou cadeias `.catch(...)`), capturando a mensagem de erro do backend (`err.message`) e exibindo feedback compreensível na interface para o usuário.

**Atenção: Lacuna de URL hardcoded no Login e Cadastro (`LF-01`)**
As páginas de `login/page.tsx` e `cadastro/page.tsx` usam `const API_URL = "http://localhost:3001"` e `fetch` nativo sem passar pelo `lib/api.ts`. Essa lacuna deve ser corrigida pelos subgrupos responsáveis, integrando o fluxo de autenticação ao padrão centralizado.

**Atenção: Situação do Token JWT nas requisições**
Hoje, o `lib/api.ts` **não** adiciona o cabeçalho `Authorization: Bearer <token>`. As telas de login e cadastro salvam o token no `localStorage`, mas ele não é lido pelo `lib/api.ts` nem exigido pelos endpoints do backend atual (que operam sem middleware de autenticação nas rotas de negócio). A inclusão do cabeçalho com token no `lib/api.ts` e a proteção das rotas permanecem como pendências arquiteturais registradas na [arquitetura](../docs/arquitetura.md).

#### Boas práticas para requisições em `useEffect`

Para evitar o erro de linter do React 19 / Next.js 16 (`react-hooks/set-state-in-effect`), não invoque `setCarregando(true)` de forma síncrona logo no início do corpo de um efeito caso o estado já possa ser inicializado como `true` no `useState(true)`.

Exemplo **adequado** de carregamento em componente cliente:

```tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function ListaExemplo() {
  const [dados, setDados] = useState<Item[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    api<Item[]>("/itens")
      .then((resposta) => {
        if (ativo) {
          setDados(resposta);
          setCarregando(false);
        }
      })
      .catch((err) => {
        if (ativo) {
          setErro(err.message);
          setCarregando(false);
        }
      });

    return () => {
      ativo = false; // Cancela atualização se o componente for desmontado
    };
  }, []);

  if (carregando) return <p>Carregando dados...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  return <ul>{dados.map((d) => <li key={d.id}>{d.nome}</li>)}</ul>;
}
```

---

## 4. Nomenclatura, responsabilidades e reaproveitamento

### 4.1 Convenções de nomenclatura

A consistência de nomes no frontend facilita a leitura, previne duplicações e assegura conformidade com o ecossistema Next.js, React e TypeScript.

#### Pastas e arquivos

| Elemento | Padrão | Exemplo | Motivo |
|---|---|---|---|
| Segmentos de rotas (`app/`) | `kebab-case` | `recuperar-senha`, `cadastrar`, `doacoes` | Padrão web para URLs amigáveis e consistência no App Router. |
| Arquivos de rota do Next.js | Reservado do Next.js | `page.tsx`, `layout.tsx`, `loading.tsx` | Convenção obrigatória da arquitetura App Router. |
| Componentes React (`components/`) | `PascalCase.tsx` | `AnimalListPage.tsx`, `ConfirmModal.tsx`, `InputGroup.tsx` | Alinhado à convenção padrão de componentes React e importação JSX. |
| Módulos utilitários (`lib/`) | `camelCase.ts` | `api.ts`, `formatters.ts` | Padrão comum para módulos e bibliotecas puras em TypeScript. |
| Arquivos de tipos (`types/`) | `camelCase.ts` | `animal.ts`, `colaborador.ts`, `types.ts` | Substantivo singular ou módulo temático em minúsculas. |

#### Identificadores no código

| Elemento | Padrão | Exemplo | Observação |
|---|---|---|---|
| Componentes | `PascalCase` | `function NovaDoacaoModal()`, `const Header = () =>` | Deve coincidir com o nome do arquivo. |
| Interfaces e Tipos | `PascalCase` | `interface Animal`, `type TipoAnimal` | Substantivo no singular representando o modelo. |
| Props de componentes | `<NomeDoComponente>Props` | `interface ConfirmModalProps`, `HeaderProps` | Sufixo `Props` explícito no topo do componente. |
| Variáveis e propriedades | `camelCase` | `nome`, `carregando`, `dataAdesao`, `filtroMatch` | Termos descritivos e precisos. |
| Funções e manipuladores | `camelCase` | `buscarAnimais()`, `validarCampos()` | Verbo indicando ação. |
| Handlers internos de eventos | Prefixo `handle` | `handleSubmit`, `handleExcluir`, `handleBack` | Ação disparada dentro do componente. |
| Callbacks passados via Props | Prefixo `on` | `onConfirm`, `onCancel`, `onBack`, `onChange` | Notificação enviada ao componente pai. |
| Constantes de escopo global | `SCREAMING_SNAKE_CASE` | `API_URL`, `TIPO_LABEL` | Valores fixos imutáveis definidos no nível do módulo. |

#### Idioma do código

- **Termos de negócio e domínio:** Devem ser escritos em **português** (`nome`, `raca`, `setor`, `canil`, `carregando`, `erro`, `colaborador`, `doacao`), mantendo paridade com o modelo do banco de dados (Prisma) e os contratos da API backend.
- **Convenções técnicas do ecossistema:** Permanecem em **inglês** (`handleSubmit`, `useEffect`, `useState`, `Props`, `onClick`, `params`).

> **Atenção: Lacuna de mistura de idiomas no Login e Cadastro (`LF-05`)**
> No código atual, `login/page.tsx` utiliza `identifier` e `password`, e `cadastro/page.tsx` utiliza `name` e `phone`. No momento de enviar a requisição ao backend, os campos são convertidos manualmente (`{ nome: name, email, telefone: phone, senha: password }`). Para código novo ou alterado, adote diretamente os nomes em português alinhados à API.

---

### 4.2 Divisão de responsabilidades

Para manter a base de código escalável e testável, cada camada do frontend possui responsabilidades estritas:

| Camada / Arquivo | O que faz | O que NÃO faz |
|---|---|---|
| **Páginas (`app/**/page.tsx`)** | - Define o ponto de entrada da rota.<br>- Lê parâmetros de rota (`params`, `searchParams`).<br>- Orquestra o layout geral da tela chamando componentes de UI.<br>- Gerencia o ciclo de carregamento e estado global da página. | - Não acumula centenas de linhas de JSX com modais e formulários misturados.<br>- Não acessa banco de dados diretamente.<br>- Não manipula URLs da API sem passar por `lib/api.ts`. |
| **Componentes de UI (`components/`)** | - Renderiza elementos visuais acessíveis e responsivos.<br>- Recebe dados e propaga eventos via props (`Props`).<br>- Gerencia apenas estado visual efêmero (ex.: dropdown aberto, aba ativa). | - Não faz requisições com URLs fixas soltas.<br>- Não depende de variáveis globais de ambiente (`process.env`).<br>- Não implementa validação de regras de persistência. |
| **Utilitários e Serviços (`lib/`)** | - Wrapper de rede `api.ts`.<br>- Funções puras de formatação (máscaras, moedas, datas).<br>- Lógica reutilizável sem dependência de JSX ou ciclo de vida de componentes. | - Não renderiza JSX nem manipula o DOM diretamente.<br>- Não acopla estado de componentes React. |
| **Tipos e Contratos (`types/`)** | - Declara interfaces de dados do backend.<br>- Fornece tipos discriminados e enums do domínio. | - Não contém código executável em tempo de execução. |

**Obrigatório**

- Uma página `page.tsx` não deve concentrar toda a interface e regras em um único arquivo monolítico. Quando uma tela ultrapassar ~250 linhas, extraia formulários, modais e listas para componentes específicos em `components/` (ou co-localizados na pasta da rota, se forem exclusivos dela).
- Componentes reutilizáveis devem ser o mais desacoplados possível, comunicando-se exclusivamente por propriedades e callbacks (`onAction`).

---

### 4.3 Padrões para reaproveitamento de código

Evitar código duplicado acelera a evolução do sistema e previne bugs decorrentes de manutenções parciais.

#### 1. Reaproveitamento de páginas/listagens via parametrização

O módulo de Animais estabeleceu um modelo exemplar de reaproveitamento com o componente `AnimalListPage`:
- Em vez de duplicar a tela para cães e gatos, as páginas `app/(etapas)/animais/caes/page.tsx` e `app/(etapas)/animais/gatos/page.tsx` apenas instanciam o mesmo componente passando a propriedade correspondente:
  ```tsx
  // app/(etapas)/animais/caes/page.tsx
  import AnimalListPage from "@/components/AnimalListPage";

  export default function CaesPage() {
    return <AnimalListPage titulo="Relação de Cães" tipo="cao" />;
  }
  ```
- **Recomendado:** Utilizar esse mesmo padrão de parametrização sempre que duas ou mais telas compartilharem a mesma estrutura de listagem, busca, cabeçalho e ações.

#### 2. Campos de formulário com design system compartilhado

Para garantir consistência visual e comportamento uniforme nos formulários:
- Use sempre os componentes `InputGroup` e `SelectGroup` em vez de tags `<input>` e `<select>` puras com dezenas de classes repetidas do Tailwind.
- Eles já encapsulam o espaçamento do rótulo, foco com cor da identidade visual (`#2DB38B`), bordas e bordas arredondadas padrão.

```tsx
// Adequado: reutiliza InputGroup com tipagem nativa extendida e name vinculado ao label
<InputGroup
  label="Nome do Animal"
  name="nome"
  placeholder="Digite o nome"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
  required
/>
```

#### 3. Modais genéricos de confirmação

Ações destrutivas (como remover animais, desativar colaboradores ou descartar edições) devem reutilizar obrigatoriamente o componente `ConfirmModal`:
- Não crie novos modais com HTML repetido apenas para confirmar uma exclusão.
- Parametrize `titulo`, `mensagem`, `labelConfirmar`, `onConfirm` e `onCancel`.

#### 4. Extração de funções puras de formatação

**Situação atual:** No módulo de doações e colaboradores, formatações de moeda (`R$`), datas e contadores são feitas inline diretamente na renderização JSX.

**Recomendado:** Criar e centralizar essas funções em `lib/formatters.ts`:

```typescript
// Proposta de lib/formatters.ts
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarData(dataISO: string): string {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}
```

---

## 5. Carregamento, erros, validações e campos opcionais

A experiência do usuário depende de como a interface lida com a espera, previne ações incorretas e reage a falhas na comunicação com a API.

---

### 5.1 Estados de carregamento (Loading States)

Operações assíncronas (como carregar listagens ou submeter formulários) devem fornecer feedback visual contínuo.

#### Carregamento inicial de páginas e listas

- **Inicialização correta:** Inicialize o estado como `true` diretamente no `useState(true)` quando os dados forem requisitados logo na montagem do componente.
- **Evitar cascading renders:** Não chame `setCarregando(true)` de forma síncrona dentro do corpo de um `useEffect`. Essa prática viola a regra do React 19 / ESLint 9 (`react-hooks/set-state-in-effect`).

```tsx
// Adequado: inicia carregando já como true e trata falhas com .catch
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState<string | null>(null);

useEffect(() => {
  let ativo = true;
  api<Animal[]>("/animais")
    .then((dados) => { if (ativo) setAnimais(dados); })
    .catch((err) => {
      if (ativo) setErro(err instanceof Error ? err.message : "Erro ao carregar animais");
    })
    .finally(() => { if (ativo) setCarregando(false); });
  return () => { ativo = false; };
}, []);
```

#### Bloqueio de botões durante envio de formulário

Durante a submissão de um formulário (`salvando` ou `carregando` ativo):
- Desabilite o botão principal (`disabled={salvando}`).
- Altere o texto do botão (ex.: de "Salvar" para "Salvando...") ou renderize um indicador visual (spinner).
- **Por quê:** Impede múltiplos cliques acidentais pelo usuário, prevenindo o envio de requisições POST duplicadas para a API.

Exemplo **adequado**:

```tsx
<button
  type="submit"
  disabled={salvando}
  className="w-full bg-[#2DB38B] text-white py-3 rounded-full font-bold hover:bg-[#25967A] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
>
  {salvando ? "Salvando..." : "Salvar Pet"}
</button>
```

---

### 5.2 Tratamento e exibição de erros

#### Proibição de alertas nativos do navegador (`window.alert()`)

**Obrigatório**

- **Não usar `alert()` no código:** O uso de `window.alert(...)` bloqueia a execução da interface, impede renderizações, prejudica a acessibilidade e não respeita a identidade visual do projeto.
- Código novo ou alterado que capturar exceções em blocos `try/catch` deve exibir o erro de forma contextual na interface.

> **Atenção: Lacuna de `alert()` no código atual (`LF-06`)**
> Em `animais/cadastrar/page.tsx` (linhas 102 e 143) e `voluntarios/cadastrar/page.tsx` (linha 47), erros de rede e salvamento são exibidos com `alert(err.message)`. Essas ocorrências devem ser substituídas por toasts ou mensagens inline conforme forem tocadas pelos subgrupos.

#### Padrões recomendados para exibição de erros

1. **Mensagens inline em formulários:**
   - Exiba um banner ou caixa de alerta visível logo acima ou abaixo dos campos afetados, como já adotado nas telas de login e cadastro:
   ```tsx
   {erro && (
     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
       {erro}
     </div>
   )}
   ```

2. **Toasts flutuantes não bloqueantes:**
   - Para confirmação de ações com sucesso ou falha global de envio, utilize o padrão de toast animado já adotado no cadastro de pets (`cadastrar/page.tsx`, linhas 155–163).

3. **Feedback de falha em listagens:**
   - Se uma consulta GET falhar, **não** silencie o erro apenas imprimindo no console (`console.error`). Guarde a mensagem em um estado `erro` e exiba um estado vazio amigável na tela com botão para tentar novamente.

---

### 5.3 Validação de formulários

A validação do frontend atua como primeira barreira para proporcionar retorno imediato ao usuário, mas não substitui a validação do backend, conforme a [arquitetura, seção 1.2](../docs/arquitetura.md#12-backend-api-e-regras-de-negócio).

#### Regras de validação no cliente

**Obrigatório**

- **Campos obrigatórios:** Verificar se o texto digitado não é composto apenas de espaços vazios (`valor.trim() !== ""`).
- **Sanitização antes do payload:** Campos vazios não devem ser enviados como strings com espaços soltos; trate valores vazios para `null` ou remova-os se forem opcionais.
- **Tipos de entrada corretos:** Utilize os atributos semânticos do HTML5 (`type="email"`, `type="tel"`, `type="number"`) nos componentes `InputGroup`.

Exemplo **adequado** de controle de formulário com validação síncrona:

```tsx
const [form, setForm] = useState({ nome: "", email: "" });
const [erro, setErro] = useState("");

const podeSubmeter = form.nome.trim() !== "" && form.email.trim() !== "";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!podeSubmeter) {
    setErro("Preencha todos os campos obrigatórios.");
    return;
  }
  setErro("");
  // chamada api(...)
};
```

---

### 5.4 Tratamento seguro de campos opcionais

Vários modelos do sistema possuem atributos opcionais que podem retornar `null` ou `undefined` do backend (ex.: `raca`, `setor`, `canil`, `idade`, `observacoes` em `Animal`; `telefone`, `informacoesAdicionais` em `Colaborador`).

#### Regra de ouro para propriedades opcionais

**Obrigatório**

- **Nunca invoque métodos diretamente sobre campos opcionais sem proteção.**
- A tentativa de executar `.toLowerCase()`, `.trim()` ou `.split()` em uma propriedade que pode vir indefinida gera a exceção de tempo de execução `TypeError: Cannot read properties of undefined` e quebra o TypeScript estrito (`TS18048`).

Exemplo do problema no filtro de busca atual (`AnimalListPage.tsx`):

```typescript
// INADEQUADO (quebra se raca, setor ou canil forem undefined):
const animaisFiltrados = animais.filter((a) =>
  a.nome.toLowerCase().includes(termo) ||
  a.raca.toLowerCase().includes(termo) ||
  a.setor.toLowerCase().includes(termo) ||
  a.canil.toLowerCase().includes(termo)
);
```

Forma **correta e segura** (usando encadeamento opcional `?.` ou coalescência nula `?? ""`):

```typescript
// ADEQUADO: seguro contra undefined e compatível com TypeScript estrito
const animaisFiltrados = animais.filter((a) =>
  a.nome.toLowerCase().includes(termo) ||
  (a.raca?.toLowerCase().includes(termo) ?? false) ||
  (a.setor?.toLowerCase().includes(termo) ?? false) ||
  (a.canil?.toLowerCase().includes(termo) ?? false)
);
```

#### Exibição visual de campos ausentes

Quando um campo opcional não tiver sido preenchido pelo usuário ou não existir no banco:
- Nunca exiba `null` ou `undefined` textualmente na tela.
- Utilize um valor de fallback legível, como `"-"` ou `"Não informado"`:

```tsx
<p className="text-sm text-gray-600">
  Setor: <span className="font-medium text-gray-900">{animal.setor || "Não informado"}</span>
</p>
```

---

## 6. Responsividade e acessibilidade

O sistema SJPA é utilizado em dois contextos principais: em dispositivos móveis no dia a dia do abrigo (por cuidadores e voluntários em baias e setores) e em desktops/notebooks para tarefas administrativas (gestão de cadastros, exportação e planejamento). Por isso, a interface deve ser responsiva e acessível por padrão.

---

### 6.1 Padrões de responsividade (Mobile-First)

O projeto adota a estratégia **mobile-first** utilizando utilitários do Tailwind CSS. O estilo base é pensado para telas compactas e os breakpoints progressivos adaptam a visualização para telas maiores.

#### Padrão estrutural de layout e compensação

A navegação principal do sistema (`components/BottomNav.tsx`) adota duas representações:
- **No mobile (< 768px):** Uma barra horizontal fixa na parte inferior da tela (`fixed bottom-0`).
- **No desktop (≥ 768px, breakpoint `md:`):** Uma sidebar lateral vertical fixa à esquerda com largura de `14rem` / `224px` (`w-56`).

Para que os elementos da página não fiquem escondidos sob a navegação, toda tela do sistema deve incluir as classes de compensação no seu container principal:

```tsx
// Container padrão de tela no sistema:
<div className="min-h-screen bg-white flex flex-col md:ml-56 pb-20 md:pb-0">
  {/* Conteúdo da página */}
</div>
```

- `pb-20`: Garante espaçamento inferior no mobile para que o conteúdo não seja sobreposto pelo `BottomNav`.
- `md:pb-0`: Remove a margem inferior no desktop.
- `md:ml-56`: Empurra o conteúdo horizontalmente no desktop para compensar a largura da sidebar esquerda (`w-56`).

#### Largura máxima e centralização de formulários

- Formulários e telas de entrada de dados devem ser contidos em um container centralizado (`max-w-md mx-auto` ou `max-w-lg mx-auto`) com preenchimento lateral (`px-4` ou `px-6`).
- **Por quê:** Evita que campos de entrada fiquem excessivamente esticados e desconfortáveis para digitação em monitores largos (widescreen).

---

### 6.2 Padrões de acessibilidade (a11y)

Garantir acessibilidade permite que pessoas que utilizam navegadores por teclado, leitores de tela ou tecnologias assistivas operem o sistema com autonomia.

#### 1. Rótulos em botões e elementos interativos baseados em ícones

**Obrigatório**

- Todo botão que contenha apenas um ícone (como botões de fechar, voltar, buscar ou ações de tabela) **deve possuir o atributo `aria-label`** descrevendo a ação em português.
- Leitores de tela anunciam apenas "botão" se o `aria-label` estiver ausente, tornando a interface incompreensível para pessoas cegas ou com baixa visão.

#### 2. Semântica de navegação: `<Link>` vs `<button>`

**Obrigatório**

- Transições entre rotas devem utilizar `<Link href="...">` do Next.js.
- **Não** utilize `<button onClick={() => router.push(...)}>` nem `<div>` com `onClick` para links estáticos. Links semânticos anunciam a natureza de âncora para leitores de tela e permitem atalhos nativos do navegador (ex.: abrir em nova guia com o botão do meio).

#### 3. Associação de formulários (`label` e `input`)

- Todo campo de entrada deve ter seu `<label>` textualmente explícito e associado ao `<input>` por meio do par `htmlFor="campo"` e `id="campo"`.
- Os componentes `InputGroup` e `SelectGroup` já implementam essa amarração nativamente. Utilize-os sempre que possível.

#### 4. Estados de foco visíveis (`focus-visible`)

- **Não remova o contorno de foco sem fornecer alternativa:** Classes como `outline-none` só são permitidas se acompanhadas de um indicador visual claro de foco (ex.: `focus:border-[#25967A] focus:ring-2 focus:ring-[#2DB38B]/20`).
- Usuários que navegam com a tecla `Tab` precisam enxergar claramente qual elemento possui o foco atual.

#### 5. Otimização e descrição de imagens

**Obrigatório**

- Utilizar sempre o componente `<Image />` do `next/image` em vez da tag nativa `<img>` (regra `@next/next/no-img-element`).
- O atributo `alt` deve descrever sucintamente o conteúdo da imagem (ex.: `alt="Foto de Rex, cão sem raça definida"`, `alt="Logo do SJPA"`). Evite `alt="foto"` ou `alt="imagem"`. Imagens meramente decorativas devem usar `alt=""` e `aria-hidden="true"`.

#### 6. Notificações acessíveis para leitores de tela

- Mensagens de confirmação temporárias (toasts) e alertas dinâmicos devem declarar `aria-live="polite"` ou `role="status"`.
- Isso instrui o leitor de tela a vocalizar a confirmação assim que o usuário concluir a ação, sem interromper bruscamente outras falas.

> **Atenção: Lacuna de idioma e metadados no layout raiz (`LF-07`)**
> No arquivo `app/layout.tsx`, a tag HTML ainda declara `lang="en"` e o título da aba está definido como `"Create Next App"`. O código da aplicação deve ser atualizado para `lang="pt-BR"` e o título ajustado para `"SJPA - Sistema de Gestão de Animais"`.

---

### 6.3 Exemplos adequados e inadequados

#### Exemplo 1: Botão de ícone

```tsx
// ADEQUADO: acessível para leitores de tela e teclado
<button
  onClick={onClose}
  aria-label="Fechar modal de doação"
  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg cursor-pointer"
>
  <MdClose size={20} aria-hidden="true" />
</button>

// INADEQUADO: botão silencioso para leitor de tela e foco invisível
<button
  onClick={onClose}
  className="outline-none"
>
  <MdClose size={20} />
</button>
```

#### Exemplo 2: Navegação entre páginas

```tsx
// ADEQUADO: semântica de link, acessível e com prefetch automático
import Link from "next/link";

<Link
  href="/animais/cadastrar"
  className="inline-flex items-center gap-2 bg-[#2DB38B] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#25967A] transition-colors"
>
  Cadastrar novo animal
</Link>

// INADEQUADO: simulação de link com div ou botão imperativo
<div
  onClick={() => router.push("/animais/cadastrar")}
  className="bg-[#2DB38B] text-white px-5 py-2.5 rounded-full cursor-pointer"
>
  Cadastrar novo animal
</div>
```

#### Exemplo 3: Imagens e avatares

```tsx
// ADEQUADO: otimizado pelo Next.js com alt descritivo
import Image from "next/image";

<Image
  src={animal.foto || "/placeholder-animal.png"}
  alt={`Foto de ${animal.nome}`}
  width={64}
  height={64}
  className="w-16 h-16 rounded-full object-cover"
/>

// INADEQUADO: img nativa sem alt descritivo (gera alerta de lint e prejudica LCP)
<img
  src={animal.foto}
  className="w-16 h-16 rounded-full"
/>
```

#### Exemplo 4: Estrutura responsiva da página

```tsx
// ADEQUADO: compensa sidebar no desktop e bottom-nav no mobile
<div className="min-h-screen bg-gray-50 flex flex-col md:ml-56 pb-20 md:pb-0">
  <Header title="Gestão de Voluntários" />
  <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:px-8">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Voluntários</h1>
    {/* Conteúdo responsivo */}
  </main>
  <BottomNav />
</div>

// INADEQUADO: sem compensação, o conteúdo fica ocultado sob a barra inferior no mobile
<div className="min-h-screen">
  <main className="p-4">
    {/* No mobile, os últimos elementos ficam escondidos atrás do BottomNav */}
  </main>
  <BottomNav />
</div>
```

---

## 7. Testes e validação antes da PR

### 7.1 Estratégia de testes e diretrizes

A estratégia e a política de testes estão propostas nos [Padrões de Testes e Política de Cobertura](../docs/testes.md) (DOC-11). A validação dos grupos e a infraestrutura correspondente continuam pendentes; a integração do documento não confirma sua adoção.

**Situação atual:** O frontend atualmente não possui dependências de testes instaladas nem scripts de teste no `package.json` (DT-06). A infraestrutura de testes será configurada em tarefas posteriores de implementação.

Consultar a DOC-11 para cada assunto, sem manter uma segunda cópia da política neste guia:

| Assunto | Referência na DOC-11 |
|---|---|
| Escrita e organização dos arquivos | [Seção 3 — Escrita e organização](../docs/testes.md#3-escrita-e-organização) |
| Isolamento de API, navegação e outras dependências | [Seção 4 — Independência, dados e dependências](../docs/testes.md#4-independência-dados-e-dependências) |
| Cenários e prioridades do frontend | [Seção 5.1 — Prioridades por camada](../docs/testes.md#51-prioridades-por-camada) |
| Ferramentas avaliadas e comandos dependentes de configuração | [Seção 6 — Ferramentas e comandos](../docs/testes.md#6-ferramentas-e-comandos) |
| Metas, escopo do relatório e adoção gradual | [Seção 7 — Política de cobertura](../docs/testes.md#7-política-de-cobertura) |
| Execução e evidências do autor e do revisor | [Seção 8 — Execução e evidências na PR](../docs/testes.md#8-execução-e-evidências-na-pr) |

---

### 7.2 Validações obrigatórias atuais antes de abrir Pull Request

Enquanto a infraestrutura de testes estiver pendente de implementação pelos subgrupos, aplicam-se as validações do [Guia de Contribuição, seção 6.3](../CONTRIBUTING.md#63-validações-antes-de-abrir).

**Exceção documental:** PRs exclusivamente de documentação dispensam as verificações da aplicação abaixo, conforme a seção 6.3 do Guia de Contribuição. Conferir conteúdo, links e formatação no preview do GitHub e registrar as verificações ou limitações na PR.

**Obrigatório** em toda PR que alterar código ou configuração da aplicação em `frontend/`:

1. **Execução local sem quebras:**
   - O comando `npm run dev` deve iniciar o servidor sem erros de compilação ou de importação.
2. **Checagem de tipagem estrita:**
   - Executar `npx tsc --noEmit` na pasta `frontend/` e certificar-se de que os arquivos alterados pela PR não introduzem novos erros de compilação TypeScript (atenção especial a campos opcionais e `TS18048`).
3. **Verificação de lint:**
   - Executar `npm run lint` na pasta `frontend/`, sem erros, conforme o Guia de Contribuição. As lacunas preexistentes da [seção 8](#8-lacunas-conhecidas) devem ser registradas; sua existência não dispensa o resultado exigido pela seção 6.3 do guia.
4. **Build de produção:**
   - Executar `npm run build` na pasta `frontend/`, sem erros, conforme o Guia de Contribuição. Iniciar o servidor de desenvolvimento ou executar `npx tsc --noEmit` não substitui essa verificação.
5. **Verificação funcional manual:**
   - O desenvolvedor deve testar visualmente no navegador a tela ou componente alterado em resolução móvel (simulando tela de celular com DevTools) e em resolução desktop.
   - Testar o fluxo de sucesso e pelo menos um cenário de exceção (ex.: erro de validação ou resposta de erro da API).
6. **Seção "Como testar" na descrição da PR:**
   - Registrar no corpo da PR os passos exatos para que os revisores da Documentação reproduzam a validação visual e funcional no navegador.

---

## 8. Lacunas conhecidas

Inconsistências e limitações identificadas durante a inspeção do código e verificação prática realizada em **12/10/2026**. Estão reunidas aqui para dar transparência ao projeto e direcionar as próximas entregas. **A correção dessas lacunas é responsabilidade dos respectivos subgrupos de desenvolvimento** e deve seguir o fluxo normal de branches e PRs.

| ID | Lacuna / Problema | Onde ocorre | Comportamento esperado pelos padrões | Seção |
|---|---|---|---|---|
| `LF-01` | URLs hardcoded da API (`http://localhost:3001`), ignorando `NEXT_PUBLIC_API_URL` e o wrapper `lib/api.ts` | `app/(etapas)/login/page.tsx` e `cadastro/page.tsx` | Usar `lib/api.ts` centralizado, permitindo configurar a porta e domínio via `.env.local` | 2.3, 3.4 |
| `LF-02` | Dispersão e duplicação de interfaces de domínio sem uma pasta central `types/` | `colaboradores/page.tsx`, `AnimalListPage.tsx`, `agenda/types.ts` | Centralizar contratos em `frontend/types/` (ex.: `animal.ts`, `colaborador.ts`) | 3.3 |
| `LF-03` | Erro de lint `react-hooks/set-state-in-effect` por disparo síncrono de `setState` no corpo de `useEffect` | `animais/cadastrar/page.tsx` (linha 76) e `AnimalListPage.tsx` (linha 53) | Inicializar estado diretamente no `useState(true)` ou tratar sincronização fora do corpo síncrono | 2.6, 5.1 |
| `LF-04` | Acesso a métodos de string sobre campos opcionais sem operador seguro `?.`, quebrando o `tsc` com `TS18048` | `components/AnimalListPage.tsx` (linhas 67–69: `raca`, `setor`, `canil`) | Usar `a.raca?.toLowerCase().includes(...) ?? false` para evitar quebra com `undefined` | 3.3, 5.4 |
| `LF-05` | Mistura de idiomas (inglês nos campos do form e português no payload) | `login/page.tsx` (`identifier`, `password`) e `cadastro/page.tsx` (`name`, `phone`) | Padronizar variáveis de formulário em português, alinhadas ao schema da API | 4.1 |
| `LF-06` | Uso do alerta nativo `window.alert()` para mensagens de erro | `animais/cadastrar/page.tsx` (linhas 102, 143) e `voluntarios/cadastrar/page.tsx` (linha 47) | Utilizar banners inline de erro ou toasts visuais não bloqueantes | 5.2 |
| `LF-07` | Metadados padrão do template Next.js (`lang="en"` e título `"Create Next App"`) | `app/layout.tsx` | Configurar `lang="pt-BR"` e título descritivo do sistema no `metadata` | 6.2 |
| `LF-08` | Ausência de envio de token JWT no `lib/api.ts` e rotas de frontend sem checagem de autenticação | `lib/api.ts` e páginas de `app/(etapas)/` | Implementar envio do token `Authorization: Bearer` e controle de acesso a rotas privadas | 3.4 |

---

## 9. Documentos relacionados

| Documento | Função e Relação |
|---|---|
| [Visão Geral do Projeto](../docs/visao-geral.md) | Contexto do sistema, objetivos institucionais, público-alvo e histórico do projeto. |
| [Guia de Contribuição](../CONTRIBUTING.md) | Regras de branches, convenções de commits, abertura de PRs e fluxo de revisão. |
| [Arquitetura do Sistema](../docs/arquitetura.md) | Visão das camadas de software, limites de módulos e percurso de ponta a ponta da requisição. |
| [Registro de Decisões Técnicas](../docs/decisoes-tecnicas.md) | Registro formal das decisões de arquitetura e tecnologia (DT-01 a DT-23). |
| [Estado dos Módulos](../docs/estado-dos-modulos.md) | Diagnóstico detalhado de maturidade de cada módulo funcional. |
| [Entregas e Próximos Passos](../docs/entregas-e-proximos-passos.md) | Planejamento e prioridades definidas para os ciclos de desenvolvimento. |
| [Guia do Backend](../backend/README.md) | Padrões para rotas, controllers, validação e persistência Prisma. |
| [Padrões de Testes e Política de Cobertura](../docs/testes.md) | Diretrizes para testes unitários com Vitest e React Testing Library, organização de arquivos e metas de cobertura. |

### Alinhamento documental

- **Arquitetura ([arquitetura.md](../docs/arquitetura.md)):** As camadas, limites de responsabilidade e o percurso descritos neste documento estão estritamente alinhados à arquitetura do sistema. Se uma refatoração alterar as fronteiras do frontend, ambos os documentos devem ser atualizados na mesma PR.
- **Backend ([backend/README.md](../backend/README.md)):** As portas padrão (3000 vs 3001) e o formato das requisições e respostas estão alinhados ao guia de desenvolvimento do backend.
- **Testes ([testes.md](../docs/testes.md)):** A seção 7.1 aponta para a DOC-11 como referência da política, organização, ferramentas e comandos propostos, sem duplicá-los. A validação e a configuração da infraestrutura continuam pendentes.
- **Decisões Técnicas ([decisoes-tecnicas.md](../docs/decisoes-tecnicas.md)):** Prevalece sempre o que estiver registrado no registro formal de decisões técnicas. Havendo divergência, aplica-se a regra de resolução de divergências do projeto ([decisões técnicas, seção 6.6](../docs/decisoes-tecnicas.md#66-evitar-divergência-entre-documentos)).

---

## 10. Validação com os subgrupos

Os padrões estabelecidos neste guia foram extraídos a partir da inspeção do código existente e das boas práticas consolidadas da stack. No entanto, as regras obrigatórias e as propostas de melhoria precisam ser validadas pelos integrantes que atuam no frontend em cada subgrupo.

> **Importante:** A ausência de manifestação não constitui aprovação tácita. Cada subgrupo deve revisar os tópicos que afetam suas telas e registrar sua concordância ou propor ajustes no cartão do Trello ou na PR correspondente.

### Roteiro de validação com os desenvolvedores

| Grupo | Integrantes atuantes no frontend | Pontos centrais para validação | Situação |
|---|---|---|---|
| **Animais** | Gustavo Lopes, João Marco Batista, João Victor Leal | Seções 3.1, 4.3 (reaproveitamento com `AnimalListPage`), 5.4 (campos opcionais na busca) e lacunas `LF-03`, `LF-04`, `LF-06`. | Pendente de validação |
| **Colaboradores** | Lucas Tinoco, Lennon Rangel | Seções 3.2, 4.3 (formatação de datas/valores), 5.3 (validações) e lacunas `LF-02`, `LF-06`. | Pendente de validação |
| **Financeiro** | Allan Chang, Felipe Agapito | Seções 3.2 (componentes de doações), 4.3 (formatação monetária) e planos para conexão com backend. | Pendente de validação |
| **Documentação** | Vitor Rosa, Lucas Ciampi, Gustavo Amaral | Coerência global do documento, validação dos comandos (seção 2.6) e alinhamento com a arquitetura e testes. | Pendente de validação |

### Como registrar a validação

1. Cada subgrupo deve ler as seções aplicáveis do documento.
2. Na Pull Request aberta pela frente de Documentação ou no cartão da tarefa no Trello, o revisor deve comentar expressando:
   - *"Concordo com os padrões estabelecidos"* ou
   - Apontar ressalvas e sugestões de ajuste, caso algum padrão conflite com as entregas em andamento.
3. Havendo consenso, o status da tabela acima será atualizado para "Validado".

---

## 11. Histórico e contribuições

### 11.1 Histórico de alterações

| Data | Versão | Autor principal | Descrição das alterações |
|---|---|---|---|
| 12/10/2026 | 1.0 | Gustavo Amaral | Elaboração inicial dos padrões de desenvolvimento do frontend, incluindo verificação prática de comandos, mapeamento de rotas, componentes, tipos, chamadas à API, responsividade, acessibilidade e levantamento das lacunas conhecidas. |
| 13/10/2026 | 1.1 | — | Correções do CR da DOC-12 com apoio de IA, a pedido de Lucas Ciampi: IDs de decisões e referência à validação do backend corrigidos; lint, build e exceção documental alinhados à seção 6.3 do Guia de Contribuição; contrato de DELETE corrigido; política de testes substituída por referências à DOC-11. Revisão humana e integração destas correções pendentes. |

### 11.2 Contribuições

O registro final das evidências (PR integrada, revisores participantes e capturas de tela) segue as diretrizes do [guia do Trello, seção 8](../docs/trello.md#8-critérios-de-conclusão-e-evidências).

| Integrante | Papel na tarefa |
|---|---|
| Gustavo Amaral | Elaboração do documento, levantamento técnico e verificação do ambiente |
| | Revisão e validação pelos subgrupos de desenvolvimento |

---

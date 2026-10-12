# Frontend — SJPA

Interface web do Sistema de Gestão de Animais do SJPA (Sociedade Juizforense de Proteção aos Animais), desenvolvida com Next.js (App Router), React, TypeScript e Tailwind CSS.

> 📖 **Guia Oficial de Padrões e Arquitetura:**
> Para consultar as diretrizes completas de desenvolvimento, estrutura de rotas, padrões de componentes, integração com a API, acessibilidade e lacunas conhecidas (DOC-09), acesse **[docs/padroes-frontend.md](../docs/padroes-frontend.md)**.

---

## 🚀 Tecnologias

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) com Turbopack
- **Biblioteca base:** [React 19](https://react.dev/) e React DOM 19
- **Linguagem:** [TypeScript 5](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Ícones:** [React Icons](https://react-icons.github.io/react-icons/) e [Lucide React](https://lucide.dev/)

---

## 🛠️ Como Executar Localmente

### 1. Pré-requisitos

- **Node.js:** Versão LTS (Node 20 ou Node 22 recomendadas).
- **npm:** 10 ou superior.
- **Backend:** A API Express do backend deve estar em execução em `http://localhost:3001` para operações de cadastro, login e gestão de dados reais. Consulte os [padrões do backend](../docs/padroes-backend.md).

### 2. Instalação e Execução

Acesse a pasta `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Abra o navegador em [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Variáveis de Ambiente

O utilitário central de requisições (`lib/api.ts`) consome a variável de ambiente `NEXT_PUBLIC_API_URL`.

Caso precise apontar para uma porta ou servidor diferente do padrão (`http://localhost:3001`), crie um arquivo `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Aviso:** Variáveis lidas no navegador pelo Next.js exigem obrigatoriamente o prefixo `NEXT_PUBLIC_`. Nunca versione arquivos `.env.local` contendo credenciais sensíveis.

---

## 📜 Scripts Disponíveis

Todos os comandos devem ser executados a partir da pasta `frontend/`:

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload (Turbopack) na porta 3000 |
| `npm run build` | Compila a aplicação para produção e valida a tipagem estrita do TypeScript |
| `npm start` | Inicia a aplicação em modo de produção (requer `npm run build` prévio) |
| `npm run lint` | Executa a verificação estática de código com ESLint 9 |
| `npx tsc --noEmit` | Executa exclusivamente o checador de tipos do TypeScript sem gerar arquivos |

---

## 📂 Estrutura de Pastas

```text
frontend/
├── app/                     # Rotas e páginas (App Router)
│   ├── (etapas)/            # Route group para organização das etapas/módulos
│   │   ├── animais/         # Listagens e cadastro de animais
│   │   ├── colaboradores/   # Listagem e edição de colaboradores
│   │   ├── voluntários/     # Listagem e agenda interativa de voluntários
│   │   ├── doacoes/         # Módulo financeiro de doações (interface)
│   │   ├── login/           # Tela de autenticação
│   │   └── cadastro/        # Registro de novos usuários
│   ├── globals.css          # Estilos globais e utilitários Tailwind
│   └── layout.tsx           # Layout raiz da aplicação
├── components/              # Biblioteca de componentes UI compartilhados
├── lib/                     # Utilitários (api.ts para chamadas REST ao backend)
├── public/                  # Arquivos estáticos (logo, ícones)
├── tailwind.config.ts       # Configurações de tema do Tailwind
├── tsconfig.json            # Configuração do TypeScript
└── package.json             # Dependências e scripts
```

---

## 📌 Padrões de Código e Contribuição

Antes de submeter Pull Requests alterando o frontend, certifique-se de:
1. Executar `npm run lint` e garantir que não há erros de ESLint (como `react-hooks/set-state-in-effect`).
2. Executar `npx tsc --noEmit` para garantir que campos opcionais possuem tratamento seguro (`?.`).
3. Utilizar o wrapper centralizado `api<T>` de `lib/api.ts` (nunca chamadas com URLs fixas hardcoded).
4. Conferir os padrões detalhados de formulários, acessibilidade e responsividade no documento completo em **[docs/padroes-frontend.md](../docs/padroes-frontend.md)**.

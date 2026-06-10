# SJPA - Sistema de Gestão dos Animais

Esta é a interface do projeto **SJPA**, uma aplicação voltada para a gestão e proteção de animais, desenvolvida como parte das Práticas Extensionistas e Projeto Integrador.

## Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias:

- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **React Icons**

## Funcionalidades Implementadas

Atualmente, o projeto conta com o fluxo completo de autenticação e visualização inicial:

- **Home:** Tela principal com visão geral do sistema.
- **Login:** Autenticação de usuários cadastrados.
- **Cadastro:** Registro de novos usuários com validação de campos.
- **Recuperação de Senha:** Fluxo completo para solicitação de nova senha e confirmação de envio de link.
- **Gestão de Animais:** Listagem e categorização (Cães/Gatos) de animais.
- **Interface Responsiva:** Otimizada para dispositivos móveis com menu inferior (`BottomNav`) e cabeçalho dinâmico.

## Como Executar o Projeto

1. **Clone o repositório:**
   ```
   git clone <url-do-repositorio>
   ```

2. **Acesse a pasta do frontend:**
   ```
   cd frontend
   ```

3. **Instale as dependências:**
   ```
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```
   npm run dev
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```
## Notas de Desenvolvimento

- O projeto utiliza a convenção `page.tsx` dentro de pastas para definição de rotas.
- Componentes de interface estão sendo padronizados para garantir consistência visual em todas as etapas.
- A navegação é gerida pelo hook `useRouter` do Next.js.

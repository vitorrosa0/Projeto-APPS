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
- **Doações:** Listagem por mês e cadastro de novas doações.
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

5. Rode os testes (Vitest + Testing Library):
   ```
   npm test
   ```
   Use `npm run test:watch` para reexecutar os testes a cada alteração.

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


## Animais — ANI-02, ANI-03, ANI-05, ANI-10 e ANI-12

Implementação local para revisão de João Marco; não registra aprovação ou integração.

- Raça é opcional no cadastro/edição, recuperada na ficha, busca, lista e CSV.
- Fotos: decisão confirmada pelo solicitante em 26/11/2026 para desenvolvimento: arquivos em `backend/uploads/animais`, referência no campo `Animal.foto` já existente. Nenhuma migration nova. Fazer backup do banco **e** dessa pasta; hospedagem precisará de volume persistente e definição do backup.
- Upload usa os próprios `POST /animais` e `PUT /animais/:id`: propriedade `foto` como data URL base64 de JPEG, PNG ou WebP (até 5 MiB). O backend valida MIME, assinatura e tamanho antes de gravar. Omitir `foto` preserva a anterior; `foto: null` remove. O arquivo é servido por `GET /animais/fotos/:arquivo`. O arquivo anterior só é removido depois da gravação bem-sucedida no banco; arquivos novos são limpos se a gravação falhar. A codificação em JSON evita salvar o animal e a foto em operações independentes.
- Nome e tipo são obrigatórios no frontend e na API. Datas de vacinação precisam ser válidas, não futuras e acompanhadas de status Completa/Incompleta. Registros antigos sem data continuam aceitos; não foi criada exigência de data ausente na documentação.
- Termos confirmados pelo solicitante: animal, Cão e Gato. Estilos do formulário foram ajustados somente em Animais.
- Ficha: `/animais/detalhes?id=<id>`, acessível pelo nome na lista, com todos os dados, foto/avatar, edição, exclusão e estados de carregamento/erro/inexistente.

### Verificações reproduzíveis

Preparar o banco local com `DATABASE_URL="file:./dev.db"`, `npx prisma migrate deploy` e `npx prisma generate` no backend. Não executar os testes com dados reais da ONG. Os testes de API usam o banco **local** de desenvolvimento, criam animais fictícios e removem seus próprios registros ao terminar.

Com Node 24 (ambiente usado na validação), sem instalar executor novo nem alterar os scripts de ANI-13/ANI-14:

```text
cd backend
node --test tests/animais.test.cjs
cd ../frontend
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

O teste de navegador `frontend/scripts/verificar-animais.mjs` usa Playwright com Chrome instalado e os dois servidores de desenvolvimento em execução. Playwright não foi adicionado às dependências do projeto: disponibilizar o pacote separadamente e definir `ANIMAIS_PLAYWRIGHT_MODULE` com o caminho absoluto para o arquivo index.mjs do pacote (ou disponibilizá-lo na resolução de módulos). Executar `node frontend/scripts/verificar-animais.mjs` da raiz. Aceita `ANIMAIS_FRONTEND_URL`, `ANIMAIS_API_URL` e `ANIMAIS_SCREENSHOTS`; as capturas vão por padrão à pasta temporária do sistema. O teste usa dados fictícios, limpa seus animais e verifica telas móveis/desktop, cadastro, edição, foto após reload, busca, download CSV, falha de salvamento, remoção, navegação rápida entre IDs, avatar sem foto, exclusão e foco do modal.

### Pontos de integração e pendências

- Gustavo: revisar formulário extraído para `AnimalForm.tsx`, `AnimalListPage.tsx` e o rótulo de tipo em `lib/animais.ts`; preservar ANI-01 e ANI-07. Não foram implementadas ANI-06, M08 ou M11.
- João Victor: o model e as migrations de Animal não mudaram. Integrar ANI-11 à seção reservada na ficha, reutilizando `animal.id`; os controllers/rotas de Animais serão pontos compartilhados. A revisão do trabalho dele cabe a João Marco.
- `ConfirmModal.tsx` é compartilhado: o novo comportamento de Esc, retenção e restauração de foco é optativo (`acessivel`), ativado em Animais. Outros módulos mantêm o comportamento anterior. Comunicar esse ponto aos demais subgrupos na revisão; nenhuma mensagem externa foi enviada.
- A infraestrutura geral de testes fica para ANI-13/ANI-14. Os testes acima são específicos destes cartões.
- Histórico de entradas/saídas ausente na base `animais/main` consultada: o teste conjunto cadastro → upload → entrada → saída → CSV continua pendente da ANI-11.

### Resultados locais em 26/11/2026

- Quatro testes de API aprovados, incluindo falha simulada no banco: foto anterior preservada e novo arquivo limpo. Dois testes de utilitários/frontend aprovados.
- Chrome headless: fluxos móveis e desktop aprovados, incluindo reload, CSV e navegação rápida entre IDs, sem erros JavaScript. Dados fictícios removidos ao final.
- `npm run lint`: zero erros e nenhum aviso em Animais; aviso preexistente `toDateKey` não utilizado em Voluntários/agenda.
- `npx tsc --noEmit`, `npm run build` e `git diff --check`: aprovados. Os dois `npm run dev` iniciaram normalmente.
- Cinco migrations existentes aplicadas no banco local novo e Prisma Client gerado; nenhuma migration criada ou alterada.
- O Node 24 emite aviso de detecção de módulo ao importar os utilitários TypeScript no teste; a execução passa. Nenhuma configuração geral foi alterada para suprimir o aviso.


### Integração com ANI-14

A suíte Vitest/Testing Library da ANI-14 foi integrada da branch do grupo. Os testes adicionais de validação e CSV usam agora esse executor; as expectativas de CSV acompanham o termo Cão da ANI-10, e a lista verifica também o texto acessível do link da ficha. Os registros anteriores descrevem a validação antes dessa integração.

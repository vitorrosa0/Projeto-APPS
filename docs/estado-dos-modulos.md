## 1. Visão Geral

Este documento mapeia o estado atual de desenvolvimento e integração dos módulos do sistema SJPA: **Animais**, **Colaboradores** e **Financeiro**. O foco é identificar o que está concluído, parcialmente implementado ou pendente.

**Glossário de Status de Implementação:**
As tabelas de estado (seção 2) estão divididas nas seguintes colunas:
- **Funcionalidade / Tela:** O recurso que foi mapeado no sistema.
- **Status de Implementação:** Avalia se o código daquela funcionalidade já foi escrito. Pode ser:
  - *Concluído:* O código (front ou back) foi totalmente escrito.
  - *Parcial / Frontend Estático:* Existe parte do código ou apenas a interface visual, sem lógica ou backend.
  - *Pendente:* O código sequer foi iniciado.
- **Funcional e Integrado?:** Indica se a funcionalidade já foi testada na prática de ponta a ponta (frontend consumindo a API com sucesso).
- **Problemas Conhecidos / Dependências:** Aponta o que está travando o desenvolvimento (ex: alinhamento com a ONG ou com outro subgrupo).

---

## 2. Estado dos Módulos

### 2.1 Módulo: Animais
**Responsáveis (Subgrupo):** Gustavo Lopes, João Marco Batista, João Victor Leal  

- **Frontend:** Telas de listagem (separada para cães/gatos) e modais construídos. Funcionalidade de exportação para CSV funcional. Faltam telas para registro de entrada/saída.
- **Backend:** CRUD completo implementado (`/animais`), com filtros e integração ao Prisma (SQLite). Falta lógica e tabelas para histórico de abrigamento (entrada/saída).
- **Integração:** Completamente integrado nas funcionalidades existentes (CRUD básico e listagem).
- **Testes:** **[PENDENTE]** Não há testes unitários, de integração ou E2E implementados até o momento.

| Funcionalidade / Tela | Status de Implementação | Funcional e Integrado? | Problemas Conhecidos / Dependências |
| :--- | :--- | :--- | :--- |
| **Listagem e CRUD Básico** | Concluído | **Sim** | **[PENDENTE]** Validar com a ONG se os campos de cadastro são suficientes. |
| **Exportação (CSV)** | Concluído | **Sim** (Recém-implementado) | Nenhuma dependência imediata. |
| **Registro de Entrada/Saída** | Pendente | Não aplicável | Faltam telas, rotas e tabelas no banco de dados. |

### 2.2 Módulo: Colaboradores (e Voluntários)
**Responsáveis (Subgrupo):** Lucas Tinoco, Lennon Rangel  

- **Frontend:** Telas de listagem, cadastro e edição de colaboradores e voluntários concluídas. Visão de histórico de contribuições disponível.
- **Backend:** Rotas e controllers de colaboradores e voluntários implementados. Rotas de registro de contribuições criadas.
- **Integração:** Frontend se comunica corretamente com a API para criar/listar colaboradores e contribuições. Faltam integrações para a agenda de voluntários.
- **Testes:** **[PENDENTE]** Não há testes unitários, de integração ou E2E implementados até o momento.

| Funcionalidade / Tela | Status de Implementação | Funcional e Integrado? | Problemas Conhecidos / Dependências |
| :--- | :--- | :--- | :--- |
| **CRUD de Colaboradores** | Concluído | **Sim** | Nenhuma. |
| **Histórico de Contribuições** | Concluído | **Sim** | **[PENDENTE]** Relacionar contribuições de colaboradores fixos com doações avulsas (Finanças). |
| **Cadastro de Voluntários** | Parcial | **Não** (Requer revisão final) | **[PENDENTE]** Validar exatamente com a ONG as diferenças de perfil. |
| **Agenda de Voluntários** | Pendente | Não aplicável | Falta interface de agenda (motivos e lembretes) e rotas da API. |

### 2.3 Módulo: Financeiro
**Responsáveis (Subgrupo):** Allan Chang, Felipe Agapito  

- **Frontend:** Telas e modais de Doações (dinheiro e itens) e totais foram criadas, mas ainda com dados estáticos (mockados). Tela de Despesas pendente.
- **Backend:** **[PENDENTE]** Nenhuma rota, controller ou tabela de banco de dados foi criada para gerenciar doações avulsas ou despesas.
- **Integração:** **[PENDENTE]** Nenhuma integração realizada (o módulo roda isolado no front).
- **Testes:** **[PENDENTE]** Não há testes unitários, de integração ou E2E implementados até o momento.

| Funcionalidade / Tela | Status de Implementação | Funcional e Integrado? | Problemas Conhecidos / Dependências |
| :--- | :--- | :--- | :--- |
| **Tela de Doações/Receitas** | Frontend Estático (Mock) | **Não** | Apenas interface construída. Falta back e integração. |
| **Tela de Despesas** | Pendente | Não aplicável | **[PENDENTE]** Definir categorias de despesa reais usadas pela ONG. |
| **Relatórios Financeiros** | Pendente | Não aplicável | Depende da construção completa das rotas de Despesas e Doações. |

---

## 3. Problemas Conhecidos e Dependências Cruzadas

Para garantir o avanço unificado do projeto, mapeamos os seguintes gargalos e dependências entre os grupos e a ONG:

### 3.1 Grupo Animais
- **Mapear Fluxo de Entrada/Saída:** Agendar uma conversa com a ONG para entender como registram adoções, óbitos, fugas e resgates. Após isso, desenhar as telas e rotas de histórico de abrigamento.
- **Validar Campos de Cadastro:** Confirmar com a responsável do abrigo se os dados atuais (vacinação, comportamento, idade, foto, etc.) atendem à rotina diária ou se algo crítico ficou de fora.
- **Checar Estrutura Física do Abrigo:** Revisar e validar a lista fixa de Setores (A a I) e Canis/Baias no frontend para que ela reflita exatamente a disposição real da instituição hoje.

### 3.2 Grupo Colaboradores (e Voluntários)
- **Definir Perfis com a ONG:** Esclarecer as diferenças práticas entre um "Colaborador" (fixo) e um "Voluntário" (esporádico), focando no que a ONG precisa saber sobre cada um.
- **Finalizar a Agenda de Voluntários:** A partir da validação de perfis, criar a interface e as rotas para marcação de presenças, atividades realizadas (banho, passeio) e lembretes.
- **Alinhamento com o Financeiro:** Definir em conjunto com o grupo Financeiro se a tabela `Contribuicao` continuará separada de `Doacao` ou se farão um modelo unificado de receitas no banco de dados.

### 3.3 Grupo Financeiro
- **Levantar Categorias de Despesas:** Conversar com a ONG para listar as categorias fixas e variáveis de gastos (ex: clínicas veterinárias, luz, ração, folha de pagamento).
- **Resolver a Dependência de Receitas:** Acordar o formato do banco de dados com o grupo Colaboradores para consolidar as entradas de dinheiro num único fluxo para os relatórios.
- **Construir o Backend:** Sair da interface estática (mockada) no front criando os models no Prisma (como `Despesa` e talvez `DoacaoAvulsa`) e desenvolvendo a API (`rotas` e `controllers`).
- **Definir Relatórios:** Entender quais indicadores, balanços e formatos de prestação de contas a ONG mais precisa extrair mensalmente do sistema.
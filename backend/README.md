# Backend

> O guia completo do backend (DOC-10) está na branch `documentacao/main`. Ao trazer a `develop` para esta branch, junte esta seção de testes à seção 10 desse guia.

## Testes

Os testes usam o executor nativo do Node (`node:test`) e o [Supertest](https://github.com/forwardemail/supertest) para enviar requisições à aplicação Express.

### Pré-requisitos

```bash
cd backend
npm install
npx prisma generate   # necessário uma vez após clonar ou mudar o schema
```

### Comandos

| Comando | O que executa |
|---|---|
| `npm test` | Todas as suítes (unitárias e de integração). |
| `npm run test:unit` | Só `tests/unit/`, sem banco. |
| `npm run test:integration` | Só `tests/integration/`, com banco. |

### Banco e fotos de teste

`tests/run.cjs` cria, a cada execução, uma pasta temporária com um banco SQLite novo (aplicando as migrations com `prisma migrate deploy`) e uma pasta de fotos. Ao terminar, apaga tudo. O `dev.db` e a pasta `uploads/` nunca são usados pelos testes.

Isso funciona porque `src/prisma.js` aceita `SQLITE_PATH` e `src/animalPhotos.js` aceita `UPLOADS_DIR`. Sem essas variáveis, o comportamento é o mesmo de antes. A aplicação fica em `src/app.js`, separada do `listen` em `src/server.js`, para que os testes a usem sem abrir a porta.

As suítes de integração rodam em série (`--test-concurrency=1`), porque compartilham o banco temporário. Cada teste limpa os animais antes de começar.

### Organização

```text
tests/
  run.cjs                       # prepara o ambiente e executa as suítes
  unit/                         # sem banco
  integration/                  # aplicação Express + banco temporário
  helpers/                      # fábricas e limpeza compartilhadas
```

## Dados de exemplo

`npm run seed` cria o usuário admin e seis animais fictícios (três cães e três gatos). Pode ser executado mais de uma vez: só cria o que ainda não existe.

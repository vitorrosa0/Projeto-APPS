// =============================================================
// CONEXÃO COM O BANCO DE DADOS
//
// ATUAL: SQLite com adapter (para desenvolvimento/protótipo)
//
// Para migrar para PostgreSQL:
//   1. Instale o cliente Postgres:  npm install pg
//   2. Remova as linhas marcadas com [SQLITE]
//   3. Descomente as linhas marcadas com [POSTGRESQL]
//   4. Atualize o .env com sua DATABASE_URL do PostgreSQL
// =============================================================

const { PrismaClient } = require("@prisma/client");

// [SQLITE] - Remover ao migrar para PostgreSQL
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");
const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });
// [/SQLITE]

// [POSTGRESQL] - Descomente ao migrar para PostgreSQL
// require("dotenv").config();
// const prisma = new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL,
// });
// [/POSTGRESQL]

module.exports = prisma;

// =============================================================
// CONFIGURAÇÃO DO PRISMA
//
// ATUAL: SQLite (arquivo local dev.db)
//
// Para migrar para PostgreSQL:
//   1. Altere o datasource.url abaixo para process.env["DATABASE_URL"]
//   2. No .env, defina:
//      DATABASE_URL="postgresql://usuario:senha@host:5432/sjpa"
// =============================================================

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // MIGRAÇÃO: substitua pelo process.env["DATABASE_URL"] quando for para PostgreSQL
    url: process.env["DATABASE_URL"],
  },
});

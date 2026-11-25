-- CreateTable
CREATE TABLE "Doacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "valorCentavos" INTEGER,
    "data" TEXT NOT NULL,
    "colaboradorId" INTEGER,
    "doadorNome" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Doacao_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DoacaoItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doacaoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    CONSTRAINT "DoacaoItem_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "Doacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoria" TEXT NOT NULL,
    "valorCentavos" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

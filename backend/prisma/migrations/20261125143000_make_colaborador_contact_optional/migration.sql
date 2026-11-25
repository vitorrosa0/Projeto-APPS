PRAGMA defer_foreign_keys=ON;

CREATE TABLE "new_Colaborador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "dataAdesao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "informacoesAdicionais" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Colaborador" (
    "id",
    "nome",
    "email",
    "telefone",
    "dataAdesao",
    "status",
    "informacoesAdicionais",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "nome",
    "email",
    "telefone",
    "dataAdesao",
    "status",
    "informacoesAdicionais",
    "createdAt",
    "updatedAt"
FROM "Colaborador";

CREATE TABLE "new_Contribuicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colaboradorId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contribuicao_colaboradorId_fkey"
        FOREIGN KEY ("colaboradorId") REFERENCES "new_Colaborador" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Contribuicao" (
    "id",
    "colaboradorId",
    "tipo",
    "valor",
    "data",
    "createdAt"
)
SELECT
    "id",
    "colaboradorId",
    "tipo",
    "valor",
    "data",
    "createdAt"
FROM "Contribuicao";

DROP TABLE "Contribuicao";
DROP TABLE "Colaborador";
ALTER TABLE "new_Colaborador" RENAME TO "Colaborador";
ALTER TABLE "new_Contribuicao" RENAME TO "Contribuicao";
CREATE UNIQUE INDEX "Colaborador_email_key" ON "Colaborador"("email");

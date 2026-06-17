-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "raca" TEXT,
    "idade" TEXT,
    "sexo" TEXT,
    "setor" TEXT,
    "canil" TEXT,
    "cor" TEXT,
    "temperamento" TEXT,
    "vacinacao" TEXT,
    "dataVacinacao" TEXT,
    "foto" TEXT,
    "outros" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Animal" ("canil", "createdAt", "id", "idade", "nome", "raca", "setor", "tipo", "updatedAt") SELECT "canil", "createdAt", "id", "idade", "nome", "raca", "setor", "tipo", "updatedAt" FROM "Animal";
DROP TABLE "Animal";
ALTER TABLE "new_Animal" RENAME TO "Animal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

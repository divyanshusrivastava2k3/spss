-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ngoName" TEXT NOT NULL DEFAULT 'Hope NGO',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "faviconUrl" TEXT NOT NULL DEFAULT '',
    "secondaryColor" TEXT NOT NULL DEFAULT '#1d4ed8',
    "aboutText" TEXT NOT NULL DEFAULT 'We are a non-profit organization dedicated to helping those in need.',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@ngo.org',
    "contactPhone" TEXT NOT NULL DEFAULT '+1234567890',
    "address" TEXT NOT NULL DEFAULT '123, Hope Street, City, Country'
);
INSERT INTO "new_Settings" ("aboutText", "address", "contactEmail", "contactPhone", "id", "logoUrl", "ngoName", "primaryColor", "secondaryColor") SELECT "aboutText", "address", "contactEmail", "contactPhone", "id", "logoUrl", "ngoName", "primaryColor", "secondaryColor" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

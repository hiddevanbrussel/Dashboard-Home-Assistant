-- Server-side integration secrets (Immich, Music Assistant, Pexels, Valetudo).
-- Replaces browser localStorage for API keys and passwords.
CREATE TABLE "IntegrationCredential" (
    "kind" TEXT NOT NULL PRIMARY KEY,
    "encrypted" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

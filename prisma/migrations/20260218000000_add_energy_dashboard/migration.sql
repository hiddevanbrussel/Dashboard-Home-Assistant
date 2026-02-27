-- CreateTable
CREATE TABLE "EnergyDashboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "layout" TEXT,
    "widgets" TEXT,
    "background" TEXT,
    "backgroundLight" TEXT,
    "backgroundDark" TEXT,
    "welcomeTitle" TEXT,
    "welcomeSubtitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

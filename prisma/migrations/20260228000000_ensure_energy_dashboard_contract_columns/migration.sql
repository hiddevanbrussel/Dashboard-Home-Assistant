-- Recreate EnergyDashboard with full schema including contract columns
-- Handles case where 20260219000000_add_energy_contract_config was not applied correctly

CREATE TABLE "EnergyDashboard_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "layout" TEXT,
    "widgets" TEXT,
    "background" TEXT,
    "backgroundLight" TEXT,
    "backgroundDark" TEXT,
    "welcomeTitle" TEXT,
    "welcomeSubtitle" TEXT,
    "costPerKwh" REAL,
    "networkFeesPerDay" REAL,
    "fixedDeliveryCostMonth" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Copy existing data (works when source has 10 columns; new columns get NULL)
INSERT INTO "EnergyDashboard_new" ("id", "layout", "widgets", "background", "backgroundLight", "backgroundDark", "welcomeTitle", "welcomeSubtitle", "costPerKwh", "networkFeesPerDay", "fixedDeliveryCostMonth", "createdAt", "updatedAt")
SELECT "id", "layout", "widgets", "background", "backgroundLight", "backgroundDark", "welcomeTitle", "welcomeSubtitle", NULL, NULL, NULL, "createdAt", "updatedAt" FROM "EnergyDashboard";

DROP TABLE "EnergyDashboard";

ALTER TABLE "EnergyDashboard_new" RENAME TO "EnergyDashboard";

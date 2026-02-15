-- CreateTable
CREATE TABLE "RoomDashboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "areaId" TEXT NOT NULL,
    "name" TEXT,
    "layout" TEXT,
    "widgets" TEXT,
    "background" TEXT,
    "welcomeTitle" TEXT,
    "welcomeSubtitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomDashboard_areaId_key" ON "RoomDashboard"("areaId");

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "pointsCost" INTEGER NOT NULL DEFAULT 10,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RewardClaim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rewardId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "pointsSpent" INTEGER NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

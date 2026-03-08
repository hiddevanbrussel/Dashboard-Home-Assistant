-- Recreate RewardClaim with nullable rewardId and optional reason field
-- (SQLite does not support ALTER COLUMN, so we recreate the table)

CREATE TABLE "RewardClaim_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rewardId" TEXT,
    "childId" TEXT NOT NULL,
    "pointsSpent" INTEGER NOT NULL,
    "reason" TEXT,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "RewardClaim_new" ("id", "rewardId", "childId", "pointsSpent", "claimedAt")
SELECT "id", "rewardId", "childId", "pointsSpent", "claimedAt" FROM "RewardClaim";

DROP TABLE "RewardClaim";

ALTER TABLE "RewardClaim_new" RENAME TO "RewardClaim";

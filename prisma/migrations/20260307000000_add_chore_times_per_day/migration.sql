-- AlterTable: add timesPerDay column to Chore
ALTER TABLE "Chore" ADD COLUMN "timesPerDay" INTEGER NOT NULL DEFAULT 1;

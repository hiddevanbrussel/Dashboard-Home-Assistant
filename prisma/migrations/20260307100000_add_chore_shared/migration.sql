-- AlterTable: add shared column to Chore
ALTER TABLE "Chore" ADD COLUMN "shared" BOOLEAN NOT NULL DEFAULT false;

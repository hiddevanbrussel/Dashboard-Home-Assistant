-- Add penalty column to Chore table
ALTER TABLE "Chore" ADD COLUMN "penalty" BOOLEAN NOT NULL DEFAULT false;

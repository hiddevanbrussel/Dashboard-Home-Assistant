-- Add points to ChoreCompletion so earned points persist when chore is deleted
ALTER TABLE "ChoreCompletion" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;

-- Backfill: set points from Chore for existing completions (base id = part before ":" or full choreId)
UPDATE "ChoreCompletion" SET "points" = (
  SELECT c."points" FROM "Chore" c
  WHERE c."id" = CASE
    WHEN instr("ChoreCompletion"."choreId", ':') > 0
    THEN substr("ChoreCompletion"."choreId", 1, instr("ChoreCompletion"."choreId", ':') - 1)
    ELSE "ChoreCompletion"."choreId"
  END
  LIMIT 1
) WHERE "points" = 0;

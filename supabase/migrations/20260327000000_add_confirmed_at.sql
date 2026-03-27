ALTER TABLE "public"."assetsAssignment"
ADD COLUMN IF NOT EXISTS "confirmedAt" timestamp without time zone;

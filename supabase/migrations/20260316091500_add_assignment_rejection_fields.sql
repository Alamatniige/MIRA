ALTER TABLE "public"."assetsAssignment"
ADD COLUMN IF NOT EXISTS "rejectedAt" timestamp without time zone,
ADD COLUMN IF NOT EXISTS "rejectedByUserId" uuid,
ADD COLUMN IF NOT EXISTS "rejectionReason" text;

CREATE INDEX IF NOT EXISTS "assetsAssignment_rejectedAt_idx"
ON "public"."assetsAssignment" ("rejectedAt");

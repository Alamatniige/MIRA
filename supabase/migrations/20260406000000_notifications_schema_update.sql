-- Update notifications table structure to match MIRA Asset Management requirements
-- Migration: 20260406000000_notifications_schema_update

-- 1. Clear old data immediately to allow adding NOT NULL columns without defaults
TRUNCATE TABLE "notifications";

-- 2. Rename existing columns
ALTER TABLE "notifications" RENAME COLUMN "read" TO "is_read";
ALTER TABLE "notifications" RENAME COLUMN "description" TO "message";

-- 3. Add new mandatory relational columns
-- Adding as NOT NULL directly since the table is now empty
ALTER TABLE "notifications" 
ADD COLUMN "recipient_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
ADD COLUMN "actor_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
ADD COLUMN "asset_id" UUID NOT NULL REFERENCES "assets"("id") ON DELETE CASCADE;

-- 4. Add performance indexes for recipient filtering and chronology
CREATE INDEX IF NOT EXISTS "idx_notifications_recipient_id" ON "notifications" ("recipient_id");
CREATE INDEX IF NOT EXISTS "idx_notifications_created_at" ON "notifications" ("createdAt");

-- 5. Clean up redundant/old columns
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "performedBy";

-- Make notifications.asset_id nullable with SET NULL on parent delete.
-- This preserves audit-trail notifications even when the referenced asset is deleted.
-- Migration: 20260407000000_notifications_asset_nullable

-- Drop existing FK constraint added in 20260406000000
ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "notifications_asset_id_fkey";

-- Allow NULL so deletion notifications can be created (and survive asset deletion)
ALTER TABLE "notifications" ALTER COLUMN "asset_id" DROP NOT NULL;

-- Re-add FK with SET NULL so notifications survive when the asset is deleted
ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_asset_id_fkey"
  FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL;

-- Migration: Add assignmentStatus field to assets table and normalize currentStatus values
-- Date: 2026-03-24

-- Phase 1: Normalize existing currentStatus values to new canonical set
-- GOOD / AVAILABLE → 'Good'
UPDATE assets
SET "currentStatus" = 'Good'
WHERE lower(trim(replace(replace("currentStatus", '_', ' '), '-', ' '))) IN ('good', 'available');

-- UNDER_MAINTENANCE / UNDER MAINTENANCE / MAINTENANCE → 'Under Maintenance'
UPDATE assets
SET "currentStatus" = 'Under Maintenance'
WHERE lower(trim(replace(replace("currentStatus", '_', ' '), '-', ' '))) IN ('under maintenance', 'maintenance');

-- NOTE: 'DAMAGED' rows are left as-is — to be updated manually in the database.

-- Phase 2: Add the new assignmentStatus column (default: Available)
ALTER TABLE assets
ADD COLUMN IF NOT EXISTS "assignmentStatus" TEXT NOT NULL DEFAULT 'Available';

-- Phase 3: Backfill assignmentStatus from existing assignment data

-- Assets with active PENDING assignments (not returned, not rejected, not acknowledged) → Pending
UPDATE assets
SET "assignmentStatus" = 'Pending', "isAssigned" = true
WHERE id IN (
    SELECT DISTINCT "assetId"
    FROM "assetsAssignment"
    WHERE "returnedDate" IS NULL
      AND "rejectedAt" IS NULL
      AND acknowledged = false
);

-- Assets with active CONFIRMED assignments (not returned, not rejected, acknowledged) → Approved
-- Takes precedence over Pending in case of data inconsistency
UPDATE assets
SET "assignmentStatus" = 'Approved', "isAssigned" = true
WHERE id IN (
    SELECT DISTINCT "assetId"
    FROM "assetsAssignment"
    WHERE "returnedDate" IS NULL
      AND "rejectedAt" IS NULL
      AND acknowledged = true
);

-- Assets under maintenance → Unavailable (highest precedence; frees the isAssigned flag)
UPDATE assets
SET "assignmentStatus" = 'Unavailable', "isAssigned" = false
WHERE "currentStatus" = 'Under Maintenance';

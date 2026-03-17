-- Reports Location Schema Migration
-- Adds floor level ordering, floor-room FK, and canvas position columns
-- to support the dynamic floor map visualization on the reports page.

-- 1. Add level ordering to assetFloor (Ground=1, 2nd=2, etc.)
ALTER TABLE "public"."assetFloor"
  ADD COLUMN IF NOT EXISTS "level" integer;

-- 2. Link rooms to a specific floor
ALTER TABLE "public"."assetRoom"
  ADD COLUMN IF NOT EXISTS "floorId" bigint
    REFERENCES "public"."assetFloor"("id")
    ON UPDATE CASCADE
    ON DELETE SET NULL;

-- 3. Canvas layout positions for dynamic floor plan rendering
--    Defaults keep existing rooms visible at a sensible starting point
--    until an admin positions them from the Asset page.
ALTER TABLE "public"."assetRoom"
  ADD COLUMN IF NOT EXISTS "x"      integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS "y"      integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS "width"  integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS "height" integer NOT NULL DEFAULT 80;

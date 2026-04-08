-- Migration: Add permittedPages to roles
ALTER TABLE "public"."roles" ADD COLUMN "permittedPages" jsonb DEFAULT '[]'::jsonb NOT NULL;

-- Ensure Admin role has access to all existing modules implicitly, or we can seed them:
UPDATE "public"."roles" SET "permittedPages" = '["Dashboard", "Assets", "Assignments", "Reports", "Users"]'::jsonb WHERE "roleName" = 'Admin';

-- Make notifications.actor_id nullable to align with FK ON DELETE SET NULL
ALTER TABLE "public"."notifications"
ALTER COLUMN "actor_id" DROP NOT NULL;

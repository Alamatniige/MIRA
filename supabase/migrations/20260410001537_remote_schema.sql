alter table "public"."assetRoom" drop constraint "assetRoom_floorId_fkey";

alter table "public"."assets" drop constraint "assets_assetType_fkey";

alter table "public"."assets" drop constraint "assets_floor_fkey";

alter table "public"."assets" drop constraint "assets_room_fkey";

alter table "public"."assets" drop constraint "fk_assets_asset_type_rel";

alter table "public"."assets" drop constraint "fk_assets_floor_rel";

alter table "public"."assets" drop constraint "fk_assets_room_rel";

alter table "public"."assetsAssignment" drop constraint "assetsAssignment_assetId_fkey";

alter table "public"."assetsAssignment" drop constraint "assetsAssignment_issuedByUserId_fkey";

alter table "public"."assetsAssignment" drop constraint "assetsAssignment_userId_users_id_fk";

alter table "public"."asssetStatusHistory" drop constraint "asssetStatusHistory_assetId_assets_id_fk";

alter table "public"."asssetStatusHistory" drop constraint "asssetStatusHistory_updatedBy_users_id_fk";

alter table "public"."issueReports" drop constraint "issueReports_assetId_assets_id_fk";

alter table "public"."issueReports" drop constraint "issueReports_reportedBy_users_id_fk";

alter table "public"."notifications" drop constraint "notifications_actor_id_fkey";

alter table "public"."notifications" drop constraint "notifications_asset_id_fkey";

alter table "public"."notifications" drop constraint "notifications_recipient_id_fkey";

alter table "public"."password_reset_otps" drop constraint "password_reset_otps_user_id_fkey";

alter table "public"."qrCodes" drop constraint "qrCodes_assetId_assets_id_fk";

alter table "public"."users" drop constraint "fk_users_role";

alter table "public"."users" drop constraint "users_roleId_fkey";

alter table "public"."roles" add column "permittedPages" jsonb default '[]'::jsonb;

alter table "public"."assetRoom" add constraint "assetRoom_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES public."assetFloor"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."assetRoom" validate constraint "assetRoom_floorId_fkey";

alter table "public"."assets" add constraint "assets_assetType_fkey" FOREIGN KEY ("assetType") REFERENCES public."assetType"(id) not valid;

alter table "public"."assets" validate constraint "assets_assetType_fkey";

alter table "public"."assets" add constraint "assets_floor_fkey" FOREIGN KEY (floor) REFERENCES public."assetFloor"(id) not valid;

alter table "public"."assets" validate constraint "assets_floor_fkey";

alter table "public"."assets" add constraint "assets_room_fkey" FOREIGN KEY (room) REFERENCES public."assetRoom"(id) not valid;

alter table "public"."assets" validate constraint "assets_room_fkey";

alter table "public"."assets" add constraint "fk_assets_asset_type_rel" FOREIGN KEY ("assetType") REFERENCES public."assetType"(id) not valid;

alter table "public"."assets" validate constraint "fk_assets_asset_type_rel";

alter table "public"."assets" add constraint "fk_assets_floor_rel" FOREIGN KEY (floor) REFERENCES public."assetFloor"(id) not valid;

alter table "public"."assets" validate constraint "fk_assets_floor_rel";

alter table "public"."assets" add constraint "fk_assets_room_rel" FOREIGN KEY (room) REFERENCES public."assetRoom"(id) not valid;

alter table "public"."assets" validate constraint "fk_assets_room_rel";

alter table "public"."assetsAssignment" add constraint "assetsAssignment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public.assets(id) not valid;

alter table "public"."assetsAssignment" validate constraint "assetsAssignment_assetId_fkey";

alter table "public"."assetsAssignment" add constraint "assetsAssignment_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."assetsAssignment" validate constraint "assetsAssignment_issuedByUserId_fkey";

alter table "public"."assetsAssignment" add constraint "assetsAssignment_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES public.users(id) not valid;

alter table "public"."assetsAssignment" validate constraint "assetsAssignment_userId_users_id_fk";

alter table "public"."asssetStatusHistory" add constraint "asssetStatusHistory_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES public.assets(id) not valid;

alter table "public"."asssetStatusHistory" validate constraint "asssetStatusHistory_assetId_assets_id_fk";

alter table "public"."asssetStatusHistory" add constraint "asssetStatusHistory_updatedBy_users_id_fk" FOREIGN KEY ("updatedBy") REFERENCES public.users(id) not valid;

alter table "public"."asssetStatusHistory" validate constraint "asssetStatusHistory_updatedBy_users_id_fk";

alter table "public"."issueReports" add constraint "issueReports_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES public.assets(id) not valid;

alter table "public"."issueReports" validate constraint "issueReports_assetId_assets_id_fk";

alter table "public"."issueReports" add constraint "issueReports_reportedBy_users_id_fk" FOREIGN KEY ("reportedBy") REFERENCES public.users(id) not valid;

alter table "public"."issueReports" validate constraint "issueReports_reportedBy_users_id_fk";

alter table "public"."notifications" add constraint "notifications_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."notifications" validate constraint "notifications_actor_id_fkey";

alter table "public"."notifications" add constraint "notifications_asset_id_fkey" FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE SET NULL not valid;

alter table "public"."notifications" validate constraint "notifications_asset_id_fkey";

alter table "public"."notifications" add constraint "notifications_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_recipient_id_fkey";

alter table "public"."password_reset_otps" add constraint "password_reset_otps_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."password_reset_otps" validate constraint "password_reset_otps_user_id_fkey";

alter table "public"."qrCodes" add constraint "qrCodes_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES public.assets(id) not valid;

alter table "public"."qrCodes" validate constraint "qrCodes_assetId_assets_id_fk";

alter table "public"."users" add constraint "fk_users_role" FOREIGN KEY ("roleId") REFERENCES public.roles(id) not valid;

alter table "public"."users" validate constraint "fk_users_role";

alter table "public"."users" add constraint "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) not valid;

alter table "public"."users" validate constraint "users_roleId_fkey";



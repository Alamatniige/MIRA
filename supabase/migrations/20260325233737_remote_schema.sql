drop index if exists "public"."assetsAssignment_rejectedAt_idx";

alter table "public"."assetFloor" alter column "level" set data type bigint using "level"::bigint;

alter table "public"."users" drop column "assetCount";

alter table "public"."users" add column "avatarUrl" text;

alter table "public"."users" alter column "assetsCount" drop default;

alter table "public"."users" alter column "assetsCount" drop not null;

CREATE INDEX "idx_issueReports_asset_id" ON public."issueReports" USING btree ("assetId");

CREATE INDEX "idx_issueReports_reported_by" ON public."issueReports" USING btree ("reportedBy");



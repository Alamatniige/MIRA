drop index if exists "public"."assetsAssignment_rejectedAt_idx";


  create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "type" text not null,
    "title" text not null,
    "description" text not null,
    "read" boolean not null default false,
    "createdAt" timestamp with time zone,
    "performedBy" text not null default ''::text
      );


alter table "public"."assetsAssignment" add column "issuedByNameSnapshot" text;

alter table "public"."assetsAssignment" add column "issuedByUserId" uuid;

alter table "public"."assetsAssignment" add column "notes" text;

CREATE INDEX "idx_assetsAssignment_issuedByUserId" ON public."assetsAssignment" USING btree ("issuedByUserId");

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."assetsAssignment" add constraint "assetsAssignment_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."assetsAssignment" validate constraint "assetsAssignment_issuedByUserId_fkey";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";



alter table "public"."issueReports" add column "image" text;


  create policy "reports Auth Upload Access"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'reports'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "reports Public Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'reports'::text));




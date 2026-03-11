-- Set up storage policies for the "asset" bucket

-- 1. Create the bucket if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
VALUES ('asset', 'asset', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to all files in the "asset" bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'asset' );

-- 3. Allow authenticated users to upload files to the "asset" bucket
CREATE POLICY "Auth Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'asset'
    AND auth.role() = 'authenticated'
);

-- Note: The Go API currently uses the Service Role Key to upload, 
-- which bypasses RLS policies entirely. But if you want to allow
-- users to directly interact later without Service Role, this is good.
-- To allow ANY upload (including from anonymous API requests if needed):
-- CREATE POLICY "Anon Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'asset');

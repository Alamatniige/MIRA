-- Set up storage policies for the "avatar" bucket

-- 1. Create the bucket if it doesn't exist yet and keep it public for avatarUrl rendering
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatar', 'avatar', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public;

-- 2. Allow public read access to all files in the "avatar" bucket
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
CREATE POLICY "Avatar Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatar');

-- 3. Allow authenticated users to upload files to the "avatar" bucket
DROP POLICY IF EXISTS "Avatar Auth Upload Access" ON storage.objects;
CREATE POLICY "Avatar Auth Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatar'
    AND auth.role() = 'authenticated'
);

-- Note: The Go API uploads with the Service Role Key, which bypasses RLS.
-- The policies above mainly matter if clients later upload directly to Storage.
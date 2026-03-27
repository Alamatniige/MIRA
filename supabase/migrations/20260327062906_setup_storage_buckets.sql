-- Create 'asset' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('asset', 'asset', true)
ON CONFLICT (id) DO NOTHING;

-- Create 'reports' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

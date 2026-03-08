====================================================================================================================================
# API FOLDER ENV
====================================================================================================================================
# env.local ========================================================================================================================

# Local Supabase (run: supabase start)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Supabase Client (for storage / non-auth features)
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
SUPABASE_SERVICE_ROLE_KEY="sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz"

# JWT signing secret — must match across all deployments
JWT_SECRET="mira-local-dev-secret-at-least-32-chars!"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

# env.production ===================================================================================================================

# Cloud Connection Supabase
DATABASE_URL="postgresql://postgres.efdhhuibnmebekqkjjom:Demon-Vape123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"

# Supabase Client Initialization

UPABASE_URL="https://efdhhuibnmebekqkjjom.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZGhodWlibm1lYmVrcWtqam9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjcxNzksImV4cCI6MjA4Njg0MzE3OX0.Wg1cuKTKllemkyfD92dn5cv0XUwkG-NDbcUUe2J3HDw"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZGhodWlibm1lYmVrcWtqam9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI2NzE3OSwiZXhwIjoyMDg2ODQzMTc5fQ.hhYUWOy1nuk7i4QB44zbSxX-uZeTgFSFx1-nMOW0VVU"

# JWT signing secret — use a strong random value in production!
JWT_SECRET="REPLACE_WITH_STRONG_RANDOM_SECRET_IN_PRODUCTION"




====================================================================================================================================
# WEB FOLDER ENV
====================================================================================================================================
# .env.local =======================================================================================================================
NEXT_PUBLIC_API_URL = 'http://localhost:8080'
SENDGRID_API_KEY = "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"



====================================================================================================================================
# MOBILE FOLDER ENV
====================================================================================================================================
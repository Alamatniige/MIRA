# Local Supabase Setup & Sync Guide

This guide explains how to connect your local development environment to the production Supabase database, pull the latest schemas, and clone the production data into your local Docker database.

## Prerequisites
1. Docker Desktop installed and running.
2. Supabase CLI installed.
3. Access to the Supabase Project on the Supabase Dashboard (you need the Project ID and the Database Password).

## Step 1: Link Your Local Project
Link your local repository to the remote Supabase project.

```bash
supabase link --project-ref <your-project-id>
```
*You can find your Project ID in the Supabase Dashboard settings.*

## Step 2: Set Your Database Password Environment Variable
Since you are using Windows PowerShell, you need to set your database password to authorize the pull command. This prevents `403 Forbidden` errors.

```powershell
$env:SUPABASE_DB_PASSWORD="<your_production_password>"
```

## Step 3: Pull the Latest Database Schema
Download the latest tables, columns, and remote schema changes from production into a new local migration file in `supabase/migrations/`.

```bash
supabase db pull
```
*Note: If you run into a migration history mismatch, run `supabase migration repair --status reverted <migration_id>` as suggested by the error prompt before running `db pull` again.*

## Step 4: Dump Production Data to Seed File
Download all the actual records (data) from the production tables and save them to your local `seed.sql` file. This ensures your local database will be populated with real data.

```bash
supabase db dump --data-only -f supabase/seed.sql
```
*Important: Always use the `-f supabase/seed.sql` flag instead of `>` in Windows PowerShell to avoid UTF-16 encoding issues.*

## Step 5: Start or Reset Your Local Database
Now that you have the latest schema (migrations) and data (seed.sql), recreate your local database.

If your local database is already running, reset it:
```bash
supabase db reset
```

If your local database is not running, start it:
```bash
supabase start
```

This will:
1. Re-create your local database tables using the latest migrations.
2. Automatically run your `seed.sql` file, instantly filling your local database with the cloned production data.

## Step 6: Configure Environment Variables
Ensure your `.env.local` files (in both the `/api` backend and `/web` frontend) point to your local Supabase URLs and keys, not the production ones.

When you run `supabase status` (or after `supabase start`), it will output your local API URL and keys:

**Example API `.env.local`**
```env
# Supabase Client (for storage / non-auth features)
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="<your-local-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-local-service-role-key>"
```

## Step 7: Storage Buckets (Manual Step)
The `supabase db pull` and `db dump` commands pull database schemas and rows, but they **do not** automatically recreate Storage Buckets or pull the files inside of them.

If you are using Storage (e.g., for asset images):
1. Open your local Supabase Studio (`http://127.0.0.1:54323`).
2. Go to **Storage**.
3. Create a new bucket with the **exact same name** as your production bucket (e.g., `assets`).
4. Set the bucket to Public if it is public in production.

## Step 8: Commit to GitHub
Make sure to commit the newly generated files to GitHub so your team can use them:
```bash
git add supabase/migrations/<new_migration_file>.sql
git add supabase/seed.sql
git commit -m "chore: sync latest prod schema and update seed data"
git push
```
Your team members only need to `git pull` and run `supabase db reset` to get perfectly synced!

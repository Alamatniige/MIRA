param (
    [Parameter(Position = 0)]
    [string]$ProjectRef,

    [Parameter(Position = 1)]
    [object]$DBPassword
)

Write-Host "`nStarting Supabase Local Sync..." -ForegroundColor Cyan

# 1. Prerequisite Checks
Write-Host "Checking prerequisites..." -ForegroundColor Gray

# Check Supabase CLI
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Supabase CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

docker info > $null 2>&1
if ($LastExitCode -ne 0) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# 2. Get Credentials if not provided
if (-not $ProjectRef) {
    $ProjectRef = Read-Host "Enter your Supabase Project Reference ID"
}

# Handle DBPassword (read it as plain text)
if (-not $DBPassword) {
    $DBPassword = Read-Host "Enter your Database Password"
}

# Always convert to plain string (in case $DBPassword was passed as object/SecureString)
if ($DBPassword -is [System.Security.SecureString]) {
    $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DBPassword)
    try {
        $DBPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
} else {
    $DBPassword = $DBPassword.ToString()
}

$env:SUPABASE_DB_PASSWORD = $DBPassword

# 3. Execution Steps
try {
    # Step 1: Link Project
    Write-Host "`nLinking to project: $ProjectRef..." -ForegroundColor Yellow
    supabase link --project-ref $ProjectRef --password ("$DBPassword")
    if ($LastExitCode -ne 0) { throw "Failed to link project." }

    # Step 2: Pull Latest Schema
    Write-Host "`nPulling latest database schema..." -ForegroundColor Yellow
    supabase db pull
    if ($LastExitCode -ne 0) { 
        Write-Host "Schema pull failed. You might need to repair migration history." -ForegroundColor DarkYellow
        $repair = Read-Host "Try auto-repairing migration history? (y/n)"
        if ($repair -eq "y") {
            $migrationIds = Read-Host "Enter the migration ID(s) (separated by comma, e.g. 20260316091500, 20260406000000)"
            $ids = $migrationIds -split ','
            foreach ($id in $ids) {
                $trimmedId = $id.Trim()
                if ($trimmedId) {
                    Write-Host "Repairing migration: $trimmedId..." -ForegroundColor Cyan
                    supabase migration repair --status applied $trimmedId
                }
            }
            Write-Host "Retrying db pull..."
            supabase db pull
        }
    }

    # Step 3: Dump Production Data (Public Schema Only)
    # This avoids conflicts with storage buckets and auth settings by only pulling your public data
    Write-Host "`nFetching public production data into seed.sql..." -ForegroundColor Yellow
    supabase db dump --data-only --schema public -f supabase/seed.sql
    if ($LastExitCode -ne 0) { throw "Failed to dump data." }

    # Step 4: Reset Local Database
    Write-Host "`nResetting local database with fresh schema and data..." -ForegroundColor Yellow
    supabase db reset
    if ($LastExitCode -ne 0) {
        Write-Host "Reset failed. Trying to start instead..." -ForegroundColor DarkYellow
        supabase start
    }

    Write-Host "`nSupabase Local Sync completed successfully!" -ForegroundColor Green
    Write-Host "You can now access your local Supabase Studio at http://127.0.0.1:54323" -ForegroundColor Gray

}
catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    # Clear password from env for safety
    $env:SUPABASE_DB_PASSWORD = ""
}

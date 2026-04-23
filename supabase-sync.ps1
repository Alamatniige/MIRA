param (
    [Parameter(Position = 0)]
    [string]$ProjectRef = "efdhhuibnmebekqkjjom",   # <-- Pre-set your project ref here

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
# ProjectRef is pre-set in the param block above; only prompt if somehow empty
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
    }
    finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}
else {
    $DBPassword = $DBPassword.ToString()
}

$env:SUPABASE_DB_PASSWORD = $DBPassword

# 3. Execution Steps
try {
    # Step 0: Tear down existing local Supabase containers for a clean run
    Write-Host "`nStopping and removing existing Supabase containers..." -ForegroundColor Yellow
    supabase stop --no-backup 2>$null
    # Force-remove any lingering supabase containers via Docker directly
    $containers = docker ps -a --filter "name=supabase" --format "{{.Names}}" 2>$null
    if ($containers) {
        $containers | ForEach-Object {
            Write-Host "  Removing container: $_" -ForegroundColor DarkGray
            docker rm -f $_ 2>$null
        }
    }

    # Step 1: Link Project
    Write-Host "`nLinking to project: $ProjectRef..." -ForegroundColor Yellow
    supabase link --project-ref $ProjectRef --password ("$DBPassword")
    if ($LastExitCode -ne 0) { throw "Failed to link project." }

    # Step 2: Clear stale local migrations before pulling
    Write-Host "`nClearing local migrations folder..." -ForegroundColor Yellow
    $migrationsPath = Join-Path $PSScriptRoot "supabase\migrations"
    if (Test-Path $migrationsPath) {
        Remove-Item "$migrationsPath\*" -Recurse -Force
        Write-Host "  Cleared: $migrationsPath" -ForegroundColor DarkGray
    }

    # Step 3: Pull Latest Schema (capture output to auto-detect repair IDs)
    Write-Host "`nPulling latest database schema..." -ForegroundColor Yellow
    $pullOutput = supabase db pull --password "$DBPassword" 2>&1
    $pullOutput | ForEach-Object { Write-Host $_ }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "`nSchema pull failed. Scanning output for migration IDs to auto-repair..." -ForegroundColor DarkYellow

        # Parse every migration ID that the CLI suggests repairing
        $repairIds = $pullOutput |
            Select-String -Pattern 'migration repair --status reverted (\d+)' |
            ForEach-Object { $_.Matches[0].Groups[1].Value } |
            Select-Object -Unique

        if ($repairIds) {
            Write-Host "Found $($repairIds.Count) migration(s) to revert:" -ForegroundColor Cyan
            foreach ($id in $repairIds) {
                Write-Host "  Repairing: $id..." -ForegroundColor DarkGray
                supabase migration repair --status reverted $id
            }

            Write-Host "`nRetrying db pull after repair..." -ForegroundColor Yellow
            supabase db pull --password "$DBPassword"
            if ($LASTEXITCODE -ne 0) { throw "Schema pull failed even after auto-repair." }
        }
        else {
            throw "Schema pull failed and no repair suggestions were found in the output."
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

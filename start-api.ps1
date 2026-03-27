param (
    [Parameter(Position=0)]
    [ValidateSet("local", "production")]
    [string]$EnvName
)

if (-not $EnvName) {
    Write-Host "--- API Environment Selection ---" -ForegroundColor Cyan
    Write-Host "1. Local (Default)" -ForegroundColor White
    Write-Host "2. Production" -ForegroundColor White
    $choice = Read-Host "Select option (1-2)"
    
    if ($choice -eq "2") {
        $EnvName = "production"
    } else {
        $EnvName = "local"
    }
}

$env:APP_ENV = $EnvName
Write-Host "`n🚀 Starting API in $EnvName mode..." -ForegroundColor Green

# Change directory to API
if (Test-Path ".\api") {
    Set-Location -Path .\api
}

# Run the API
if (Get-Command air -ErrorAction SilentlyContinue) {
    Write-Host "Running with hot-reload (air)..." -ForegroundColor Yellow
    air
} else {
    Write-Host "Running standard Go server..." -ForegroundColor Yellow
    go run .\cmd\server\main.go
}


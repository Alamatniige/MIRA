param (
    [Parameter(Position=0)]
    [ValidateSet("local", "production")]
    [string]$env = "local"
)

Write-Host "Starting API in $env mode..." -ForegroundColor Cyan

# Set environment variable
$env:APP_ENV = $env

# Change directory to API
Set-Location -Path .\api

# Run the API
if (Get-Command air -ErrorAction SilentlyContinue) {
    Write-Host "Running with hot-reload (air)..." -ForegroundColor Yellow
    air
} else {
    Write-Host "Running standard Go server..." -ForegroundColor Yellow
    go run .\cmd\server\main.go
}

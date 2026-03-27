Write-Host "--- MIRA Flutter Environment Selection ---" -ForegroundColor Cyan
Write-Host "1. PC / Android Emulator (10.0.2.2:8080) [Default]" -ForegroundColor White
Write-Host "2. Ige Mobile" -ForegroundColor White
Write-Host "3. Rim Burat " -ForegroundColor White
Write-Host "4. Chrome" -ForegroundColor White
$choice = Read-Host "Select option (1-4)"

Write-Host ""

# Change directory to mobile
if (Test-Path "mobile") {
    Write-Host "Navigating to mobile directory..." -ForegroundColor Yellow
    Set-Location -Path "mobile"
}
else {
    Write-Host "Warning: mobile directory not found in the current path." -ForegroundColor Red
}

switch ($choice) {
    "2" {
        Write-Host "Running on Mobile Device 1..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://192.168.1.8:8080
    }
    "3" {
        Write-Host "Running on Mobile Device 2..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://192.168.1.29:8080
    }
    "4" {
        Write-Host "Running on chrome..." -ForegroundColor Green
        flutter run -d chrome --web-port=3000 --dart-define=API_BASE_URL=http://localhost:8080
    }
    default {
        Write-Host "Running on PC / Android Emulator..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
    }
}

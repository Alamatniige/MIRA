Write-Host "--- MIRA Flutter Environment Selection ---" -ForegroundColor Cyan
Write-Host "1. PC / Android Emulator (10.0.2.2:8080) [Default]" -ForegroundColor White
Write-Host "2. Ige Mobile" -ForegroundColor White
Write-Host "3. Rim Burat " -ForegroundColor White
Write-Host "5. Dynamic Device IP Scan" -ForegroundColor White
$choice = Read-Host "Select option (1-5)"

Write-Host ""

# Find adb.exe path early
$adbCommand = "adb"
if (-not (Get-Command $adbCommand -ErrorAction SilentlyContinue)) {
    $adbCommand = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
}

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
        flutter run --dart-define=API_BASE_URL=http://192.168.1.110:8080
    }
    "3" {
        Write-Host "Running on Mobile Device 2..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://192.168.1.22:8080
    }
    "4" {
        Write-Host "Running on chrome..." -ForegroundColor Green
        flutter run -d chrome --web-port=3000 --dart-define=API_BASE_URL=http://localhost:8080
    }
    "5" {
        Write-Host "Scanning for Computer's LAN IP..." -ForegroundColor Yellow
        $pcIp = & "../get-pc-ip.ps1"
        if ($pcIp) {
            Write-Host "Running on Mobile Device using PC IP: $pcIp" -ForegroundColor Green
            
            if (Test-Path $adbCommand) {
                Write-Host "Setting up ADB reverse for localhost mapping (Extra Reliability)..." -ForegroundColor Cyan
                & $adbCommand reverse tcp:8080 tcp:8080 2>$null
            } else {
                Write-Host "Warning: adb.exe not found. Port reversal skipped. If the app fails, ensure your phone is on the same Wi-Fi as your PC." -ForegroundColor Yellow
            }
            
            # Using the PC's IP address for the API_BASE_URL
            flutter run --dart-define=API_BASE_URL=http://$($pcIp):8080
        } else {
            Write-Host "Failed to get a valid PC IP address." -ForegroundColor Red
        }
    }
    default {
        Write-Host "Running on PC / Android Emulator..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
    }
}

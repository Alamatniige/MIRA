#!/usr/bin/env powershell
# Development build and run commands

Write-Host "MIRA Flutter Development Commands" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Select an option:" -ForegroundColor Cyan
Write-Host "1) Run on Android Emulator (local API)" -ForegroundColor White
Write-Host "2) Run on Physical Phone (local network)" -ForegroundColor White
Write-Host "3) Run on Chrome/Web (local API)" -ForegroundColor White
Write-Host "4) Custom IP for Physical Phone" -ForegroundColor White
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Running on Android Emulator with local API (10.0.2.2:8080)..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
    }
    "2" {
        $ip = Read-Host "Enter your PC LAN IP (e.g., 192.168.1.8)"
        Write-Host "Running on Physical Phone with local API ($ip`:8080)..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://$ip`:8080
    }
    "3" {
        Write-Host "Running on Chrome with local API (http://localhost:8080)..." -ForegroundColor Green
        flutter run -d chrome --web-port 3000 --dart-define=API_BASE_URL=http://localhost:8080
    }
    "4" {
        $ip = Read-Host "Enter your PC LAN IP"
        $port = Read-Host "Enter port (default 8080)"
        if ([string]::IsNullOrWhiteSpace($port)) { $port = "8080" }
        Write-Host "Running with custom API ($ip`:$port)..." -ForegroundColor Green
        flutter run --dart-define=API_BASE_URL=http://$ip`:$port
    }
    default {
        Write-Host "Invalid option" -ForegroundColor Red
    }
}

# get-device-ip.ps1
# Script to extract the IP address of a connected Android device via ADB

# Try to find adb.exe
$adbPath = "adb"
if (-not (Get-Command $adbPath -ErrorAction SilentlyContinue)) {
    $adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
}

if (-not (Test-Path $adbPath)) {
    Write-Host "Error: adb.exe not found. Please ensure Android SDK is installed or adb is in your PATH." -ForegroundColor Red
    exit 1
}

# Get list of connected devices
$devices = & $adbPath devices | Select-String -Pattern "\tdevice$"

if ($devices.Count -eq 0) {
    Write-Host "No devices connected." -ForegroundColor Yellow
    exit 0
}

$deviceId = ""
if ($devices.Count -eq 1) {
    $deviceId = $devices[0].ToString().Split("`t")[0]
} else {
    Write-Host "Multiple devices found:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $devices.Count; $i++) {
        Write-Host "$($i + 1). $($devices[$i].ToString().Split("`t")[0])"
    }
    $choice = Read-Host "Select device (1-$($devices.Count))"
    if ([int]::TryParse($choice, [ref]$index) -and $index -ge 1 -and $index -le $devices.Count) {
        $deviceId = $devices[$index - 1].ToString().Split("`t")[0]
    } else {
        Write-Host "Invalid selection." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Extracting IP address for device: $deviceId..." -ForegroundColor Cyan

# Try different interfaces (wlan0 is typical for Wi-Fi)
$interfaces = @("wlan0", "eth0", "p2p0")
$ipAddress = ""

foreach ($iface in $interfaces) {
    $output = & $adbPath -s $deviceId shell ip addr show $iface 2>$null
    if ($output) {
        $ipMatch = $output | Select-String -Pattern "inet\s+([0-9.]+)"
        if ($ipMatch) {
            $ipAddress = $ipMatch.Matches[0].Groups[1].Value
            break
        }
    }
}

if ($ipAddress) {
    Write-Host "Device IP Address: $ipAddress" -ForegroundColor Green
    return $ipAddress
} else {
    Write-Host "Could not find IP address. Is the device connected to Wi-Fi?" -ForegroundColor Red
    exit 1
}

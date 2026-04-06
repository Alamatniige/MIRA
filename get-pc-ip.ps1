# get-pc-ip.ps1
# Script to get the computer's local IPv4 address (prioritizing 192.168.x.x or other LAN IPs)

$allIps = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*" 
} | Select-Object -ExpandProperty IPAddress

# Prefer 192.168.* addresses (most common for home/office LAN)
$pcIp = $allIps | Where-Object { $_ -like "192.168.*" } | Select-Object -First 1

# If not found, try 10.* or 172.16-31.* (other private ranges)
if (-not $pcIp) {
    $pcIp = $allIps | Where-Object { $_ -like "10.*" -or $_ -match "^172\.(1[6-9]|2[0-9]|3[0-1])\." } | Select-Object -First 1
}

# If still not found, just take anything that isn't 127.0.0.1 or 169.254.*
if (-not $pcIp) {
    $pcIp = $allIps | Where-Object { $_ -notlike "127.*" -and $_ -notlike "169.254.*" } | Select-Object -First 1
}

if ($pcIp) {
    return $pcIp
} else {
    # Final fallback to ipconfig
    $pcIp = (ipconfig | Select-String "IPv4 Address" | Select-String -Pattern "192\.168\." | Select-Object -First 1).ToString().Split(":")[1].Trim()
    if ($pcIp) {
        return $pcIp
    }
    Write-Host "Error: Could not find a valid local IP address." -ForegroundColor Red
    exit 1
}

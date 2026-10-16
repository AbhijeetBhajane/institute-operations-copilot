$dest = "C:\Users\Abhijeet\nodejs"
if (-not (Test-Path $dest)) {
    Write-Host "Downloading Node.js standalone zip..."
    $zipPath = Join-Path $env:TEMP "node-v20.18.0-win-x64.zip"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip" -OutFile $zipPath
    Write-Host "Extracting Node.js..."
    Expand-Archive -Path $zipPath -DestinationPath "$env:TEMP\node_extract" -Force
    Move-Item -Path "$env:TEMP\node_extract\node-v20.18.0-win-x64" -Destination $dest -Force
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    Remove-Item "$env:TEMP\node_extract" -Recurse -Force -ErrorAction SilentlyContinue
}

$cur = [Environment]::GetEnvironmentVariable("Path", "User")
if ($cur -notmatch "C:\\Users\\Abhijeet\\nodejs") {
    $new = "C:\Users\Abhijeet\nodejs;" + $cur
    [Environment]::SetEnvironmentVariable("Path", $new, "User")
    Write-Host "Updated User Path with C:\Users\Abhijeet\nodejs"
}

$env:Path = "C:\Users\Abhijeet\nodejs;" + $env:Path
Write-Host "Node version:"
& "C:\Users\Abhijeet\nodejs\node.exe" -v
Write-Host "NPM version:"
& "C:\Users\Abhijeet\nodejs\npm.cmd" -v

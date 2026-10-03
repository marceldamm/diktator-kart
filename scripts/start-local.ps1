param([switch]$CheckOnly, [switch]$NoBrowser, [switch]$AsJson, [int]$Port = 4173, [string]$ProjectRoot = '')
$ErrorActionPreference = 'Stop'
if (-not $ProjectRoot) { $ProjectRoot = Split-Path -Parent $PSScriptRoot }
$project = (Resolve-Path -LiteralPath $ProjectRoot).Path
Set-Location -LiteralPath $project

function SameFolder([string]$Other) {
    if (-not $Other) { return $false }
    return [IO.Path]::GetFullPath($Other).TrimEnd('\', '/') -eq $project.TrimEnd('\', '/')
}
function ServerIdentity([string]$TargetUrl) {
    try { return (Invoke-WebRequest -Uri ($TargetUrl + '__diktator/status') -TimeoutSec 2 -UseBasicParsing).Content | ConvertFrom-Json } catch { return $null }
}
function Busy([int]$Candidate) {
    $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Candidate)
    try { $probe.Start(); return $false }
    catch [System.Net.Sockets.SocketException] { return $true }
    finally { $probe.Stop() }
}
function OpenGame([string]$TargetUrl) {
    $chromePaths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe")
    $chrome = $chromePaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if ($chrome) { Start-Process -FilePath $chrome -ArgumentList @('--new-window', $TargetUrl) }
    else { Start-Process $TargetUrl }
}
try {
    if (-not (Test-Path -LiteralPath 'project-state.json')) { throw 'This is an old/unconfigured checkout. Say Projektstart in Codex; do not start the old game.' }
    $state = Get-Content 'project-state.json' -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($state.projectId -ne 'diktator-kart-babylon' -or $state.engine -ne 'babylonjs' -or -not (Test-Path -LiteralPath 'src/main.ts')) { throw 'Only the active Babylon project may be started.' }
    $branch = (& git.exe branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or $branch -match '^(archive/|legacy-)') { throw 'Historical/archive checkouts are read-only and cannot be started.' }
    & git.exe merge-base --is-ancestor $state.minimumSourceCommit HEAD
    if ($LASTEXITCODE -ne 0) { throw 'This checkout predates the shared Claude/Babylon foundation. Run Projektstart.' }
    $selectedPort = $null; $reuse = $false
    for ($candidate = $Port; $candidate -lt $Port + 20; $candidate++) {
        $candidateUrl = "http://127.0.0.1:$candidate/"
        if (-not (Busy $candidate)) { if (-not $selectedPort) { $selectedPort = $candidate }; continue }
        $identity = ServerIdentity $candidateUrl
        if ($identity -and $identity.mode -eq 'dev' -and $identity.projectId -eq $state.projectId -and $identity.minimumSourceCommit -eq $state.minimumSourceCommit -and (SameFolder $identity.root)) {
            $selectedPort = $candidate; $reuse = $true; break
        }
        if (-not $AsJson) { Write-Host "Port $candidate belongs to another/unidentified server; it will not be used or stopped." }
    }
    if (-not $selectedPort) { throw 'No free game port found. Ask Codex to inspect the servers.' }
    $url = "http://127.0.0.1:$selectedPort/"
    $result = [ordered]@{ root = $project; branch = $branch; edition = $state.edition; port = $selectedPort; url = $url; reuse = $reuse }
    if ($AsJson) { $result | ConvertTo-Json } else { Write-Host "$($state.edition) | $branch | $project"; Write-Host "Spiel: $url" }
    if ($CheckOnly) { exit 0 }
    if ($reuse) { if (-not $NoBrowser) { OpenGame $url }; exit 0 }
    $hash = (Get-FileHash -LiteralPath 'package-lock.json' -Algorithm SHA256).Hash
    $savedHash = if (Test-Path -LiteralPath '.tools/dependency-lock.sha256') { (Get-Content '.tools/dependency-lock.sha256' -Raw).Trim() } else { '' }
    if (-not (Test-Path -LiteralPath 'node_modules/vite/bin/vite.js') -or $savedHash -ne $hash) {
        Write-Host 'Installiere die im Lockfile festgelegten kostenlosen Abhaengigkeiten ...'
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'npm ci failed. Check internet/npm access.' }
        $null = New-Item -ItemType Directory -Force -Path '.tools'
        Set-Content -LiteralPath '.tools/dependency-lock.sha256' -Value $hash -Encoding ASCII
    }
    $openBrowser = $null
    if (-not $NoBrowser) {
        $openBrowser = Start-Job -ArgumentList $url, $project -ScriptBlock {
            param($targetUrl, $expectedRoot)
            for ($attempt = 0; $attempt -lt 100; $attempt++) {
                try {
                    $identity = (Invoke-WebRequest -Uri ($targetUrl + '__diktator/status') -TimeoutSec 2 -UseBasicParsing).Content | ConvertFrom-Json
                    if ($identity.mode -eq 'dev' -and $identity.projectId -eq 'diktator-kart-babylon' -and [IO.Path]::GetFullPath($identity.root).TrimEnd('\', '/') -eq $expectedRoot.TrimEnd('\', '/')) {
                        $paths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe")
                        $chromePath = $paths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
                        if ($chromePath) { Start-Process -FilePath $chromePath -ArgumentList @('--new-window', $targetUrl) } else { Start-Process $targetUrl }
                        return
                    }
                } catch { }
                Start-Sleep -Milliseconds 500
            }
            throw 'The project server did not become ready.'
        }
    }
    try {
        Write-Host 'Dieses Fenster offen lassen. Strg+C beendet diesen Spielserver.'
        & node.exe '.\node_modules\vite\bin\vite.js' --host 127.0.0.1 --port $selectedPort --strictPort
        if ($LASTEXITCODE -ne 0) { throw "Vite stopped with code $LASTEXITCODE." }
    } finally {
        if ($openBrowser) { Stop-Job $openBrowser -ErrorAction SilentlyContinue; Remove-Job $openBrowser -Force -ErrorAction SilentlyContinue }
    }
} catch { Write-Host "Startfehler: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }

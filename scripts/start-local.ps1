param([switch]$CheckOnly)
$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$url = 'http://127.0.0.1:4173/'

Set-Location -LiteralPath $project
try {
    if (-not (Test-Path -LiteralPath $chrome)) {
        throw 'Google Chrome wurde am erwarteten Pfad nicht gefunden.'
    }
    if (-not (Test-Path -LiteralPath 'node_modules\vite\bin\vite.js')) {
        Write-Host 'Installiere kostenlose Projektabhaengigkeiten mit npm ci ...'
        & npm.cmd ci --offline=false
        if ($LASTEXITCODE -ne 0) { throw 'npm ci ist fehlgeschlagen. Internetverbindung und npm-Zugriff pruefen.' }
    }
    $connection = [System.Net.Sockets.TcpClient]::new()
    $portBusy = $false
    try {
        $connection.Connect('127.0.0.1', 4173)
        $portBusy = $true
    } catch [System.Net.Sockets.SocketException] {
        $portBusy = $false
    } finally {
        $connection.Dispose()
    }
    if ($portBusy) {
        $page = Invoke-WebRequest -Uri $url -TimeoutSec 3 -UseBasicParsing
        $servedManifest = (Invoke-WebRequest -Uri ($url + 'assets/manifest.json') -TimeoutSec 3 -UseBasicParsing).Content | ConvertFrom-Json
        $localManifest = Get-Content -LiteralPath 'public/assets/manifest.json' -Raw | ConvertFrom-Json
        if ($page.Content -match '<title>Diktator Kart' -and $servedManifest.name -eq $localManifest.name -and $servedManifest.schemaVersion -eq $localManifest.schemaVersion) {
            Write-Host 'Diktator Kart laeuft bereits. Oeffne den vorhandenen Spielserver.'
            if (-not $CheckOnly) { Start-Process -FilePath $chrome -ArgumentList @('--new-window', $url) }
            exit 0
        }
        throw 'Port 4173 ist bereits belegt. Bitte zuerst den anderen lokalen Server beenden.'
    }
    if ($CheckOnly) { Write-Host 'Startvorbereitung erfolgreich; Port 4173 ist frei.'; exit 0 }

    $openChrome = Start-Job -ArgumentList $url, $chrome -ScriptBlock {
        param($targetUrl, $chromePath)
        for ($attempt = 0; $attempt -lt 60; $attempt++) {
            try {
                $reply = Invoke-WebRequest -Uri $targetUrl -TimeoutSec 2 -UseBasicParsing
                if ($reply.StatusCode -eq 200) {
                    Start-Process -FilePath $chromePath -ArgumentList @('--new-window', $targetUrl)
                    return
                }
            } catch { }
            Start-Sleep -Milliseconds 500
        }
    }
    try {
        Write-Host 'Starte Diktator Kart. Chrome oeffnet sich automatisch.'
        Write-Host 'Dieses Fenster offen lassen. Strg+C beendet den lokalen Server.'
        & node.exe '.\node_modules\vite\bin\vite.js' --host 127.0.0.1 --port 4173 --strictPort
        if ($LASTEXITCODE -ne 0) { throw "Vite wurde mit Fehlercode $LASTEXITCODE beendet." }
    } finally {
        Stop-Job $openChrome -ErrorAction SilentlyContinue
        Remove-Job $openChrome -Force -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "Startfehler: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

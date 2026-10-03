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
        throw 'Port 4173 ist bereits belegt. Bitte zuerst den anderen lokalen Server beenden.'
    }

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
        Write-Host 'Starte Diktator Kart M1. Chrome oeffnet sich automatisch.'
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

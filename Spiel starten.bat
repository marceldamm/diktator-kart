@echo off
setlocal

REM In den Ordner wechseln, in dem diese BAT-Datei liegt
cd /d "%~dp0"

REM ------------------------------------------------------------
REM Pruefen, ob Node.js vorhanden ist
REM ------------------------------------------------------------

where node.exe >nul 2>nul
if errorlevel 1 goto install_node

REM ------------------------------------------------------------
REM Pruefen, ob npm vorhanden ist
REM ------------------------------------------------------------

where npm.cmd >nul 2>nul
if errorlevel 1 goto install_node

REM ------------------------------------------------------------
REM Node.js Version pruefen
REM Mindestens Version 22 erforderlich
REM ------------------------------------------------------------

for /f "tokens=1 delims=v." %%V in ('node --version') do set NODE_MAJOR=%%V

if %NODE_MAJOR% LSS 22 (
    echo.
    echo Diktator Kart benoetigt Node.js Version 22 oder neuer.
    echo Installierte Version:
    node --version
    echo.
    goto install_node
)

REM ------------------------------------------------------------
REM Pruefen, ob der client-Ordner vorhanden ist
REM ------------------------------------------------------------

if not exist "%~dp0client" (
    echo.
    echo FEHLER:
    echo Der Ordner "client" wurde nicht gefunden.
    echo.
    echo Erwarteter Pfad:
    echo %~dp0client
    echo.
    pause
    exit /b 1
)

REM ------------------------------------------------------------
REM Pruefen, ob package.json vorhanden ist
REM ------------------------------------------------------------

if not exist "%~dp0client\package.json" (
    echo.
    echo FEHLER:
    echo Die Datei client\package.json wurde nicht gefunden.
    echo.
    echo Erwarteter Pfad:
    echo %~dp0client\package.json
    echo.
    echo Bitte pruefen, ob das komplette Projekt entpackt wurde.
    echo.
    pause
    exit /b 1
)

REM ------------------------------------------------------------
REM Abhaengigkeiten installieren, falls Vite noch nicht vorhanden ist
REM ------------------------------------------------------------

if not exist "%~dp0client\node_modules\vite\bin\vite.js" (
    echo.
    echo Erforderliche Spieldateien werden einmalig installiert...
    echo.

    pushd "%~dp0client"

    call npm.cmd install --no-audit --no-fund

    if errorlevel 1 (
        popd
        goto install_failed
    )

    popd

    echo.
    echo Installation erfolgreich abgeschlossen.
    echo.
)

REM ------------------------------------------------------------
REM Diktator Kart starten
REM ------------------------------------------------------------

echo.
echo Diktator Kart wird gestartet...
echo.

start "Diktator Kart Server" /min cmd.exe /c "cd /d ""%~dp0client"" && npm.cmd run dev -- --host 127.0.0.1"

REM ------------------------------------------------------------
REM Kurz warten, damit der Webserver Zeit zum Starten hat
REM ------------------------------------------------------------

timeout /t 3 /nobreak >nul

REM ------------------------------------------------------------
REM Spiel im Standardbrowser oeffnen
REM ------------------------------------------------------------

start "" "http://127.0.0.1:5173/"

exit /b 0


REM ============================================================
REM Node.js installieren
REM ============================================================

:install_node

echo.
echo Node.js 22 oder neuer wurde nicht gefunden.
echo.

where winget.exe >nul 2>nul

if errorlevel 1 (
    echo Node.js kann nicht automatisch installiert werden.
    echo.
    echo Bitte Node.js 22 oder neuer manuell installieren:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js wird jetzt mit winget installiert.
echo Windows kann nach einer Bestaetigung fragen.
echo.

winget install --id OpenJS.NodeJS.LTS --exact --accept-source-agreements --accept-package-agreements

if errorlevel 1 goto install_failed

echo.
echo Node.js wurde erfolgreich installiert.
echo.
echo WICHTIG:
echo Bitte dieses Fenster jetzt schliessen.
echo.
echo Danach "Spiel starten.bat" erneut doppelklicken,
echo damit Windows die neue Node.js Installation erkennt.
echo.

pause
exit /b 0


REM ============================================================
REM Fehlerbehandlung
REM ============================================================

:install_failed

echo.
echo ============================================================
echo FEHLER
echo ============================================================
echo.
echo Die Installation der benoetigten Dateien ist fehlgeschlagen.
echo.
echo Bitte pruefen:
echo.
echo - Besteht eine Internetverbindung?
echo - Ist Node.js korrekt installiert?
echo - Ist npm verfuegbar?
echo - Ist die Datei client\package.json vorhanden?
echo.
echo Projektordner:
echo %~dp0
echo.
echo Node.js Version:
node --version 2>nul
echo.
echo npm Version:
npm --version 2>nul
echo.
echo ============================================================
echo.

pause
exit /b 1
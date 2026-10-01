@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 goto install_node

where npm.cmd >nul 2>nul
if errorlevel 1 goto install_node

for /f "tokens=1 delims=v." %%V in ('node --version') do set NODE_MAJOR=%%V
if %NODE_MAJOR% LSS 22 (
    echo Diktator Kart benoetigt Node.js Version 22 oder neuer.
    goto install_node
)

if not exist "client\node_modules\vite\bin\vite.js" (
    echo Erforderliche Spieldateien werden einmalig installiert...
    call npm.cmd --prefix client install --no-audit --no-fund
    if errorlevel 1 goto install_failed
)

echo Diktator Kart wird gestartet...
start "Diktator Kart Server" /min cmd.exe /c "cd /d ""%~dp0client"" && npm.cmd run dev -- --host 127.0.0.1"
timeout /t 3 /nobreak >nul
start "" http://127.0.0.1:5173/
exit /b 0

:install_node
where winget.exe >nul 2>nul
if errorlevel 1 (
    echo Node.js 22 oder neuer fehlt. Bitte von https://nodejs.org/ installieren.
    echo.
    pause
    exit /b 1
)

echo Node.js wird mit winget installiert. Windows kann nach einer Bestaetigung fragen.
winget install --id OpenJS.NodeJS.LTS --exact --accept-source-agreements --accept-package-agreements
if errorlevel 1 goto install_failed

echo Node.js wurde installiert. Bitte dieses Fenster schliessen und
echo "Spiel starten.bat" erneut doppelklicken, damit PATH aktualisiert wird.
pause
exit /b 0

:install_failed
echo.
echo Installation fehlgeschlagen. Pruefe deine Internetverbindung und versuche es erneut.
pause
exit /b 1

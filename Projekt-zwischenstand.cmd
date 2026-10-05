@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\team-workflow.ps1" -Action Checkpoint
if errorlevel 1 (
  echo.
  echo Bitte Codex sagen: Zwischenstand sichern. Pruefe die Dateien und bewahre alles ohne Aenderung an main.
  pause
  exit /b 1
)
echo.
echo Der Zwischenstand ist auf deinem Arbeitsbranch gespeichert. GitHub main blieb unveraendert.
pause

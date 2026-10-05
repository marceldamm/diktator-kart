@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\team-workflow.ps1" -Action Finish
if errorlevel 1 (
  echo.
  echo Bitte Codex sagen: Projektabschluss. Pruefe, dokumentiere und veroeffentliche beide Arbeitsstaende sicher.
  pause
  exit /b 1
)
echo.
echo Der gepruefte Stand wurde auf GitHub main veroeffentlicht.
echo Dein Arbeitsbranch bleibt als nachvollziehbare Sicherung erhalten.
pause

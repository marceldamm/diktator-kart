@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\team-workflow.ps1" -Action Start
if errorlevel 1 (
  echo.
  echo Bitte Codex sagen: Projektstart. Loese den gemeldeten Fall ohne Datenverlust.
  pause
  exit /b 1
)
echo.
echo Bereit. In Codex: Projektstart. Danach deine Aufgabe nennen.
echo Das Spiel startest du mit Diktator-Kart-starten.cmd.
pause

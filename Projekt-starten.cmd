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
echo Bereit. In Codex: Projekt Start. Danach deine Aufgabe nennen.
echo Zum Speichern waehrend der Arbeit: Zwischenstand sichern.
echo Zum geprueften gemeinsamen Abschluss: Projektabschluss.
echo Das Spiel startest du mit Diktator-Kart-starten.cmd.
pause

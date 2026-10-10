@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\team-workflow.ps1" -Action Checkpoint
if errorlevel 1 (
  echo.
  echo Bitte Codex sagen: Zwischenstand sichern. Die KI prueft die eigenen Dateien und sichert nur diese auf main.
  pause
  exit /b 1
)
echo.
echo Der Zwischenstand wurde auf dem gemeinsamen main gespeichert. Weitere lokale Aenderungen blieben unangetastet.
pause

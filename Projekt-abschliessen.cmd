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
echo Der gepruefte Arbeitsbranch ist auf GitHub gesichert.
echo Codex muss den Pull Request, den Actions-Check und den Merge nach main noch abschliessen.
pause

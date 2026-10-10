@echo off
setlocal
rem Exportiert die gespeicherten Posen aus art-source\*-im-kart.blend nach public\assets\models\<name>-driver.glb
rem und erneuert die Fahrerwahl-Figuren (<name>-stand.glb) und Kopf-Symbole (public\assets\portraits).
rem Vorher in Blender speichern (Strg+S). Danach im Spiel neu laden (F5).
set "BLENDER="
for /d %%D in ("%ProgramFiles%\Blender Foundation\Blender*") do if exist "%%~D\blender.exe" set "BLENDER=%%~D\blender.exe"
if not defined BLENDER (
  echo Blender wurde unter "%ProgramFiles%\Blender Foundation" nicht gefunden.
  pause
  exit /b 1
)
echo Verwende %BLENDER%
"%BLENDER%" --background --factory-startup --python "%~dp0export_driver_kart_pose.py" -- all
if not errorlevel 1 "%BLENDER%" --background --factory-startup --python "%~dp0export_driver_stand.py" -- all
rem Kleinere Dateien, schnellerer Spielstart (meshopt-Kompression, siehe art-source\optimize_assets.mjs).
if not errorlevel 1 node "%~dp0optimize_assets.mjs" drivers
if errorlevel 1 (
  echo.
  echo Export fehlgeschlagen. Bitte das Fenster an Claude oder Codex schicken.
  pause
  exit /b 1
)
echo.
echo Fertig: Fahrer in public\assets\models\*-driver.glb geschrieben. Im Spiel F5 druecken.
pause

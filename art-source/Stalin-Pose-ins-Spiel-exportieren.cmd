@echo off
setlocal
rem Exportiert die gespeicherte Pose aus art-source\stalin-im-kart.blend nach public\assets\models\stalin-driver.glb.
rem Vorher in Blender speichern (Strg+S). Danach im Spiel neu laden (F5).
set "BLENDER="
for /d %%D in ("%ProgramFiles%\Blender Foundation\Blender*") do if exist "%%~D\blender.exe" set "BLENDER=%%~D\blender.exe"
if not defined BLENDER (
  echo Blender wurde unter "%ProgramFiles%\Blender Foundation" nicht gefunden.
  pause
  exit /b 1
)
echo Verwende %BLENDER%
"%BLENDER%" --background --factory-startup --python "%~dp0export_stalin_kart_pose.py"
if errorlevel 1 (
  echo.
  echo Export fehlgeschlagen. Bitte das Fenster an Claude oder Codex schicken.
  pause
  exit /b 1
)
echo.
echo Fertig: public\assets\models\stalin-driver.glb wurde geschrieben. Im Spiel F5 druecken.
pause

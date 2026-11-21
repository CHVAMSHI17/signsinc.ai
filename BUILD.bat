@echo off
cd /d "%~dp0"
if not exist node_modules (call npm install)
call npm run build
echo.
echo Done. Open dist\index.html by double-clicking it.
pause

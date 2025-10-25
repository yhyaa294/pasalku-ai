@echo off
:: Qoder IDE Quick Recovery Launcher
:: Pasalku AI Project

echo.
echo ========================================
echo   Qoder IDE Recovery Tool
echo   Pasalku AI v1.0.0
echo ========================================
echo.

echo Choose your recovery option:
echo.
echo [1] Diagnose Issues (Check what's broken)
echo [2] Automated Recovery (Fix automatically)
echo [3] Test MCP Server
echo [4] Start Development Server
echo [5] Open Recovery Guide
echo [6] Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto diagnose
if "%choice%"=="2" goto recover
if "%choice%"=="3" goto test_mcp
if "%choice%"=="4" goto start_dev
if "%choice%"=="5" goto open_guide
if "%choice%"=="6" goto end

:diagnose
echo.
echo Running diagnostic...
powershell -ExecutionPolicy Bypass -File ".\diagnose-qoder-issues.ps1"
pause
goto menu

:recover
echo.
echo Starting automated recovery...
powershell -ExecutionPolicy Bypass -File ".\recover-qoder-project.ps1"
pause
goto menu

:test_mcp
echo.
echo Testing MCP Server...
powershell -ExecutionPolicy Bypass -File ".\start-mcp.ps1"
pause
goto menu

:start_dev
echo.
echo Starting development server...
call npm run dev
pause
goto menu

:open_guide
echo.
echo Opening recovery guide...
start QODER_QUICKSTART.md
pause
goto menu

:menu
cls
goto :eof

:end
echo.
echo Recovery tool closed.
echo.
pause

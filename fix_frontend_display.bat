@echo off
echo ========================================
echo   FIXING FRONTEND DISPLAY ISSUE
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Deleting .next folder...
if exist .next (
    rmdir /s /q .next
    echo .next folder deleted
) else (
    echo .next folder not found, skipping...
)

echo.
echo Step 2: Deleting node_modules/.cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo Cache deleted
)

echo.
echo Step 3: Installing dependencies...
call npm install

echo.
echo Step 4: Starting dev server...
echo.
echo ========================================
echo   Starting Next.js on http://localhost:5000
echo ========================================
echo.

call npm run dev

pause

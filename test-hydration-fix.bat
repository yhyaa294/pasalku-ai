@echo off
echo ========================================
echo PASALKU.AI HYDRATION ERROR FIX TEST
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Starting development server...
echo.
echo ========================================
echo TESTING INSTRUCTIONS:
echo ========================================
echo 1. Open browser to http://localhost:3000
echo 2. Check browser console for hydration errors
echo 3. Visit http://localhost:3000/hydration-test for detailed test
echo 4. Landing page should load without "white screen"
echo 5. All animations should work smoothly
echo.
echo Press Ctrl+C to stop the server when testing is complete
echo ========================================
echo.

call npm run dev

pause
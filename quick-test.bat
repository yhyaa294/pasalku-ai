@echo off
echo ========================================
echo QUICK HYDRATION FIX VERIFICATION
echo ========================================
echo.

echo Checking if Next.js can build without errors...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ BUILD FAILED - There are still issues
    pause
    exit /b 1
)

echo.
echo ✅ BUILD SUCCESSFUL!
echo.
echo Starting development server on port 5000...
echo Open http://localhost:5000 in your browser
echo.
echo Look for these SUCCESS indicators:
echo ✅ Page loads immediately (no white screen)
echo ✅ No "Hydration failed" errors in console
echo ✅ All content visible and interactive
echo.
echo Press Ctrl+C when done testing
echo.

call npm run dev
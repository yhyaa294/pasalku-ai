@echo off
echo ========================================
echo   FIXING BACKEND DEPENDENCIES
echo ========================================
echo.

cd /d "%~dp0backend"

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing missing packages...
echo.

pip install psycopg2-binary --no-cache-dir
pip install email-validator --no-cache-dir  
pip install python-multipart --no-cache-dir

echo.
echo ========================================
echo   DEPENDENCIES FIXED!
echo ========================================
echo.
echo Now you can run the backend with:
echo   cd backend
echo   python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
echo.
pause

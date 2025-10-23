@echo off
REM Comprehensive startup script for Pasalku.ai development environment

echo 🚀 Starting Pasalku.ai Development Environment...
echo.

REM Start Backend Server
echo 🔧 Starting Backend Server (FastAPI) on port 8000...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate.bat && python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Test backend health
echo 🧪 Testing backend health endpoint...
curl -s http://localhost:8000/health >nul
if %errorlevel% equ 0 (
    echo ✅ Backend server is running successfully
) else (
    echo ❌ Backend server failed to start
)

echo.

REM Start Frontend Server
echo 🎨 Starting Frontend Server (Next.js) on port 3000...
start "Frontend Server" cmd /k "npm run dev"

REM Wait a moment for frontend to start
timeout /t 5 /nobreak >nul

REM Test frontend accessibility
echo 🧪 Testing frontend server...
curl -s http://localhost:3000 >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running successfully
) else (
    echo ❌ Frontend server failed to start
)

echo.
echo 🎉 Development environment is ready!
echo.
echo 📍 Backend API: http://localhost:8000
echo 📍 Frontend App: http://localhost:3000
echo 📍 API Documentation: http://localhost:8000/docs
echo.
echo 💡 To stop servers, close the terminal windows or press Ctrl+C
echo.
pause

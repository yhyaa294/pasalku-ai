@echo off
REM Setup script for Pasalku.ai development environment (Windows)

echo 🚀 Setting up Pasalku.ai development environment...

REM Create Python virtual environment for backend
echo 📦 Creating Python virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate.bat

REM Install backend dependencies
echo 🔧 Installing backend dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Check if installation was successful
if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed successfully
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Go back to root directory
cd ..

REM Install frontend dependencies
echo 🎨 Installing frontend dependencies...
npm install

REM Check if installation was successful
if %errorlevel% equ 0 (
    echo ✅ Frontend dependencies installed successfully
) else (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🎉 Development environment setup complete!
echo.
echo To start development:
echo 1. Backend: cd backend ^&^& venv\Scripts\activate.bat ^&^& python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
echo 2. Frontend: npm run dev (in another terminal)
echo.
pause

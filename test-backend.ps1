# Backend Test Script
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Testing Backend Server" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Navigate to backend directory
Set-Location backend

# Check if virtual environment exists
if (!(Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
.\.venv\Scripts\Activate.ps1

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Green
pip list | Select-String "fastapi"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Check if .env exists
Set-Location ..
if (!(Test-Path ".env")) {
    Write-Host "WARNING: .env file not found in root. Using defaults." -ForegroundColor Yellow
}

Write-Host "`nStarting FastAPI server on port 8000..." -ForegroundColor Green
Write-Host "API Docs will be available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

Set-Location backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

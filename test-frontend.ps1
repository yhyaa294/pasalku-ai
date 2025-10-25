# Frontend Test Script
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Testing Frontend Server" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "ERROR: node_modules not found. Run 'npm install' first." -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "WARNING: .env file not found. Using defaults." -ForegroundColor Yellow
}

Write-Host "`nStarting Next.js development server on port 5000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm run dev

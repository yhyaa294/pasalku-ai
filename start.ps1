# Script untuk menjalankan full-stack application di Windows

Write-Host "🚀 Starting Pasalku.ai Full-Stack Application..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

# Function to cleanup background processes
function Cleanup {
    Write-Host "🛑 Stopping all services..." -ForegroundColor Red
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    exit 0
}

# Set trap to cleanup on exit
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🐍 Setting up Python backend..." -ForegroundColor Yellow
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Set-Location ..

Write-Host "⚡ Starting backend server..." -ForegroundColor Yellow
Start-Job -ScriptBlock {
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
}

Write-Host "🎨 Starting frontend development server..." -ForegroundColor Yellow
npm run dev

# Wait for user input to exit
Write-Host "Press any key to stop all services..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

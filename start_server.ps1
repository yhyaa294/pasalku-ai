# PowerShell script untuk menjalankan server Pasalku.ai
Write-Host "🚀 MENJALANKAN SERVER PASALKU.AI..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Masuk ke direktori backend
Set-Location backend

# Cek apakah virtual environment ada
if (-not (Test-Path "venv")) {
    Write-Host "📦 Membuat virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Aktifkan virtual environment
Write-Host "🔧 Mengaktifkan virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies jika perlu
if (-not (Test-Path "venv\Lib\site-packages")) {
    Write-Host "📚 Install dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Jalankan server
Write-Host "⚡ Menjalankan server di port 8000..." -ForegroundColor Green
Write-Host "🔗 Akses server di: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 API Docs di: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Red
Write-Host ""

python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

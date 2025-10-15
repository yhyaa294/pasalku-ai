# Pasalku AI Backend Server Starter
Write-Host "Starting Pasalku AI Backend Server..." -ForegroundColor Green

# Set Python path
$env:PYTHONPATH = $PWD
Write-Host "PYTHONPATH set to: $PWD" -ForegroundColor Cyan

# Run the server
python -m uvicorn backend.server:app --host 0.0.0.0 --port 8000 --reload

# PowerShell script to run FastAPI server
# Activate virtual environment
& ".\backend\venv\Scripts\Activate.ps1"

# Run the FastAPI server
python -m uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000

@echo off
echo Starting Backend Server...
cd backend
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
) else (
    python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
)

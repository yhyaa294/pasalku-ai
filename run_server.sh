#!/bin/bash
# Activate virtual environment
source backend/venv/Scripts/activate

# Run the FastAPI server
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000

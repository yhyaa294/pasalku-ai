#!/bin/bash
# Script untuk menjalankan full-stack application

echo "🚀 Starting Pasalku.ai Full-Stack Application..."
echo "=================================================="

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

echo "📦 Installing frontend dependencies..."
npm install

echo "🐍 Setting up Python backend..."
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cd ..

echo "⚡ Starting backend server..."
cd backend
source venv/Scripts/activate
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
cd ..

echo "🎨 Starting frontend development server..."
npm run dev

# Wait for all background processes
wait

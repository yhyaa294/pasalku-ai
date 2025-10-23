#!/bin/bash
# Comprehensive startup script for Pasalku.ai development environment

echo "🚀 Starting Pasalku.ai Development Environment..."
echo ""

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $1 is in use (service running)"
        return 0
    else
        echo "❌ Port $1 is not in use"
        return 1
    fi
}

# Start Backend Server in background
echo "🔧 Starting Backend Server (FastAPI) on port 8000..."
cd backend
source venv/bin/activate
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Test backend health
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ Backend server is running successfully"
    echo "📍 Backend API: http://localhost:8000"
    echo "📍 API Documentation: http://localhost:8000/docs"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Go back to root directory
cd ..

echo ""

# Start Frontend Server in background
echo "🎨 Starting Frontend Server (Next.js) on port 3000..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 5

# Test frontend accessibility
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend server is running successfully"
    echo "📍 Frontend App: http://localhost:3000"
else
    echo "❌ Frontend server failed to start"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📍 Backend API: http://localhost:8000"
echo "📍 Frontend App: http://localhost:3000"
echo "📍 API Documentation: http://localhost:8000/docs"
echo ""
echo "💡 To stop servers:"
echo "   - Frontend: kill $FRONTEND_PID"
echo "   - Backend: kill $BACKEND_PID"
echo "   - Or press Ctrl+C to stop this script"
echo ""

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $FRONTEND_PID 2>/dev/null; kill $BACKEND_PID 2>/dev/null; exit 0" INT
wait

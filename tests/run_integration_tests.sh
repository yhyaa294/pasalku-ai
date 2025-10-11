#!/bin/bash

# Integration Test Runner untuk Pasalku.ai
# Script ini akan menjalankan backend server dan menjalankan comprehensive integration tests

set -e

echo "🚀 Starting Pasalku.ai Integration Test Suite"
echo "==============================================="

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up..."
    if [ ! -z "$SERVER_PID" ]; then
        echo "Stopping backend server (PID: $SERVER_PID)..."
        kill -TERM $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
    fi
    exit $1
}

# Trap signals
trap 'cleanup 130' INT TERM

# Check if backend directory exists and has requirements
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Check if required files exist
if [ ! -f "backend/server.py" ]; then
    echo "❌ backend/server.py not found!"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "❌ .env file not found! Please configure environment variables first."
    exit 1
fi

# Start backend server in background
echo ""
echo "🔧 Starting backend server..."
cd backend

# Check if port 5000 is already in use
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5000 is already in use. Please stop any running servers on port 5000."
    echo "💡 Find process: lsof -ti:5000 | xargs kill -9"
    exit 1
fi

# Start server with background process capture
python server.py &
SERVER_PID=$!

echo "✅ Backend server started (PID: $SERVER_PID)"
cd ..

# Wait for server to start (give it more time)
echo ""
echo "⏳ Waiting for server to fully start..."
for i in {1..30}; do
    if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
        echo "✅ Server is responsive!"
        break
    fi

    if [ $i -eq 30 ]; then
        echo "❌ Server failed to start within 60 seconds"
        cleanup 1
    fi

    echo -n "."
    sleep 2
done

echo ""
echo "🧪 Running integration tests..."
echo ""

# Run the integration tests
python tests/integration_test.py
TEST_EXIT_CODE=$?

echo ""
echo "🛑 Shutting down test server..."
cleanup $TEST_EXIT_CODE
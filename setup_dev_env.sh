#!/bin/bash
# Setup script for Pasalku.ai development environment

echo "🚀 Setting up Pasalku.ai development environment..."

# Create Python virtual environment for backend
echo "📦 Creating Python virtual environment..."
cd backend
python -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Go back to root directory
cd ..

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "🎉 Development environment setup complete!"
echo ""
echo "To start development:"
echo "1. Backend: cd backend && source venv/bin/activate && python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload"
echo "2. Frontend: npm run dev (in another terminal)"

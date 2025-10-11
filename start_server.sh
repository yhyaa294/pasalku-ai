#!/bin/bash
echo "🚀 MENJALANKAN SERVER PASALKU.AI..."
echo "=================================="

# Masuk ke direktori backend
cd backend

# Cek apakah virtual environment ada
if [ ! -d "venv" ]; then
    echo "📦 Membuat virtual environment..."
    python -m venv venv
fi

# Aktifkan virtual environment
echo "🔧 Mengaktifkan virtual environment..."
source venv/Scripts/activate

# Install dependencies jika perlu
if [ ! -d "venv/Lib/site-packages" ]; then
    echo "📚 Install dependencies..."
    pip install -r requirements.txt
fi

# Jalankan server
echo "⚡ Menjalankan server di port 8000..."
echo "🔗 Akses server di: http://localhost:8000"
echo "📖 API Docs di: http://localhost:8000/api/docs"
echo ""
echo "Tekan Ctrl+C untuk menghentikan server"
echo ""

python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

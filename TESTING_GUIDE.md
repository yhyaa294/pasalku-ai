# Testing Guide - Pasalku AI

## Perbaikan yang Telah Dilakukan

### 1. **Konfigurasi Frontend**
- ✅ Menghapus konflik `next.config.js` (duplikat)
- ✅ Mengupdate `next.config.mjs` dengan konfigurasi lengkap termasuk Sentry
- ✅ Memperbaiki `.eslintrc.json` yang kosong dengan konfigurasi proper

### 2. **Environment Variables**
- ✅ Membuat `.env.example` sebagai template
- ✅ Membuat `.env` untuk development lokal dengan nilai default

### 3. **Backend Dependencies**
- ✅ Memperbaiki versi `boto3` dan `botocore` yang tidak tersedia
- ✅ Menghapus `deeptranslate` yang tidak ada di PyPI
- ✅ Mengupdate versi dependencies document processing ke versi fleksibel

### 4. **Test Scripts**
- ✅ Membuat `test-frontend.ps1` untuk testing frontend
- ✅ Membuat `test-backend.ps1` untuk testing backend

## Cara Testing

### A. Testing Backend

1. **Menggunakan Script PowerShell** (Recommended):
   ```powershell
   .\test-backend.ps1
   ```

2. **Manual**:
   ```powershell
   # Navigate to backend
   cd backend
   
   # Activate virtual environment
   .\.venv\Scripts\Activate.ps1
   
   # Install dependencies (if not done)
   pip install -r requirements.txt
   
   # Run server
   python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Verifikasi Backend**:
   - Buka browser: http://localhost:8000/health
   - API Docs: http://localhost:8000/docs
   - Expected response: `{"status": "healthy", ...}`

### B. Testing Frontend

1. **Menggunakan Script PowerShell** (Recommended):
   ```powershell
   .\test-frontend.ps1
   ```

2. **Manual**:
   ```powershell
   # Dari root directory
   npm run dev
   ```

3. **Verifikasi Frontend**:
   - Buka browser: http://localhost:5000
   - Pastikan halaman home muncul tanpa error
   - Check console browser untuk error JavaScript

### C. Testing Integration (Frontend + Backend)

1. **Terminal 1 - Backend**:
   ```powershell
   .\test-backend.ps1
   ```

2. **Terminal 2 - Frontend**:
   ```powershell
   .\test-frontend.ps1
   ```

3. **Verifikasi**:
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:8000/docs
   - Test chat feature atau fitur lain yang menggunakan API

## Troubleshooting

### Frontend Issues

**Error: Module not found**
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

**Error: Port 5000 already in use**
```powershell
# Check what's using the port
netstat -ano | findstr :5000
# Kill the process or change port in package.json
```

### Backend Issues

**Error: No module named 'fastapi'**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Error: Database connection failed**
- Check `.env` file exists in root directory
- Database defaults to SQLite (`sql_app.db`) untuk local dev
- Untuk production, set `DATABASE_URL` ke PostgreSQL

**Error: Import errors dari routers**
```powershell
# Make sure you're in backend directory and venv is activated
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app:app --reload
```

## Environment Variables yang Diperlukan

### Minimal (Untuk Testing Lokal):
```env
ENVIRONMENT=development
DATABASE_URL=sqlite:///sql_app.db
SECRET_KEY=local-dev-secret-key
```

### Optional (Untuk Fitur Lengkap):
- `ARK_API_KEY` - BytePlus Ark AI service
- `GROQ_API_KEY` - Groq AI fallback
- `CLERK_SECRET_KEY` - Authentication
- `STRIPE_SECRET_KEY` - Payment processing
- Dan lainnya (lihat `.env.example`)

## Build untuk Production

### Frontend:
```powershell
npm run build
npm start
```

### Backend:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## Next Steps

Setelah testing berhasil:

1. ✅ Setup environment variables yang lengkap
2. ✅ Configure database (PostgreSQL untuk production)
3. ✅ Setup authentication (Clerk)
4. ✅ Setup payment integration (Stripe)
5. ✅ Deploy ke production (Vercel + Railway)

## Catatan Penting

- ⚠️ Jangan commit file `.env` ke git (sudah ada di `.gitignore`)
- ⚠️ Untuk production, gunakan nilai yang secure untuk `SECRET_KEY`
- ⚠️ Database default menggunakan SQLite untuk development
- ⚠️ Beberapa fitur memerlukan API keys eksternal (AI, Auth, Payment)

## Support

Jika menemukan masalah:
1. Check logs di terminal
2. Check browser console (F12)
3. Verifikasi semua dependencies terinstall
4. Pastikan `.env` file ada dan berisi nilai yang benar

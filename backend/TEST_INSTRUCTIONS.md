# 🚀 QUICK START - Live Contextual Tutor Testing

## Prerequisites
```powershell
# Activate Python virtual environment
cd backend
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# or
source venv/bin/activate     # Unix/Mac
```

## Step 1: Start Backend Server

```powershell
cd backend
python server.py
```

Server will start on: **http://localhost:8000**

## Step 2: Test API Endpoints

### Option A: Run automated test script
```powershell
python test_terms_api.py
```

### Option B: Manual testing with curl/Postman

**1. Detect Terms in Text:**
```bash
curl -X POST http://localhost:8000/api/terms/detect \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Perusahaan melakukan wanprestasi dengan tidak memberikan pesangon. Anda bisa kirim somasi terlebih dahulu."
  }'
```

**2. Get Term Details:**
```bash
curl http://localhost:8000/api/terms/term/wanprestasi
```

**3. Search Terms:**
```bash
curl "http://localhost:8000/api/terms/search?q=kontrak"
```

**4. Get Categories:**
```bash
curl http://localhost:8000/api/terms/categories
```

## Step 3: Check API Documentation

Open in browser: **http://localhost:8000/api/docs**

Interactive Swagger UI with all endpoints documented.

## Expected Results

### Detect Terms Response:
```json
{
  "detected_terms": [
    {
      "term": "wanprestasi",
      "start_pos": 23,
      "end_pos": 34,
      "category": "Hukum Perdata",
      "definition_simple": "Ingkar janji dalam kontrak",
      "analogy": "Seperti kamu pesan barang online...",
      "related_articles": ["Pasal 1238 KUHPerdata"]
    },
    {
      "term": "somasi",
      "start_pos": 88,
      "end_pos": 94,
      ...
    }
  ]
}
```

## Troubleshooting

### Error: "Module not found"
```powershell
pip install -r requirements.txt
```

### Error: "Port already in use"
```powershell
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Error: "Database connection failed"
Check `.env` file has correct database credentials.

## Next Steps

✅ Backend API working
🔜 Integrate into frontend chat
🔜 Add more legal terms (50+ terms)
🔜 Deploy to production

---

**Need help?** Check `docs/LIVE_CONTEXTUAL_TUTOR_IMPLEMENTATION.md`

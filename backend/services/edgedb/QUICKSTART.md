# 🚀 EdgeDB Quick Start Guide

## Langkah-langkah Setup EdgeDB untuk Pasalku.ai

### ✅ Step 1: Install EdgeDB Server

**Option A: Windows (Recommended)**

1. Download EdgeDB installer dari: https://www.edgedb.com/download
2. Jalankan installer
3. Follow installation wizard

**Option B: Using PowerShell (If you have scoop)**

```powershell
scoop install edgedb
```

### ✅ Step 2: Verify Installation

```powershell
edgedb --version
```

Harus muncul output seperti: `EdgeDB CLI X.X.X`

### ✅ Step 3: Initialize Project

```powershell
# Masuk ke folder backend/edgedb
cd backend/edgedb

# Initialize EdgeDB project
edgedb project init
```

Akan muncul prompt:
- **Database name**: Ketik `pasalku_knowledge_graph`
- **Create instance?**: Pilih `y` (yes)

### ✅ Step 4: Create Migration

```powershell
# Generate migration dari schema
edgedb migration create

# Ketika diminta, beri nama: "initial_schema"
```

### ✅ Step 5: Apply Migration

```powershell
edgedb migrate
```

### ✅ Step 6: Test Connection

```powershell
# Test dengan EdgeDB REPL
edgedb

# Di REPL, coba query:
SELECT 1;

# Keluar dengan: \q
```

### ✅ Step 7: Test Python Connection

```powershell
# Pastikan virtual environment aktif
cd ..  # kembali ke backend/
python edgedb/connection.py
```

Expected output:
```
Testing EdgeDB connection...
✅ EdgeDB connection test passed

Getting database info...

📊 Database Statistics:
  legal_documents: 0
  articles: 0
  court_cases: 0
  legal_topics: 0
  total_items: 0
  status: connected
  timestamp: 2025-10-15T...
```

### ✅ Step 8: Run Full Test Suite

```powershell
python edgedb/test_edgedb.py
```

Ini akan:
1. Test connection
2. Create sample legal data
3. Test search operations
4. Show summary

---

## 🔧 Troubleshooting

### Issue: "edgedb: command not found"

**Solution:**
- EdgeDB belum terinstall
- Install dari https://www.edgedb.com/download

### Issue: "No project initialized"

**Solution:**
```powershell
cd backend/edgedb
edgedb project init
```

### Issue: "Migration required"

**Solution:**
```powershell
edgedb migration create
edgedb migrate
```

### Issue: Python Connection Error

**Solution:**
```powershell
# Install edgedb Python package
pip install edgedb

# Check .env file
# Add: EDGEDB_DSN=edgedb://edgedb@localhost:5656/pasalku_knowledge_graph
```

---

## 📋 Next Steps After Setup

1. ✅ **Populate with Real Data**
   - Import UU Indonesia
   - Import sample putusan pengadilan
   - Create legal topics

2. ✅ **Integrate with FastAPI**
   - Add EdgeDB to startup events
   - Create API endpoints

3. ✅ **Test Semantic Search**
   - Search for legal documents
   - Citation extraction

---

## 📚 Useful Commands

```powershell
# Check EdgeDB status
edgedb instance status

# Start EdgeDB instance
edgedb instance start

# Stop EdgeDB instance
edgedb instance stop

# Open EdgeDB UI
edgedb ui

# Run query from command line
edgedb query "SELECT LegalDocument { title } LIMIT 5"

# Dump database
edgedb dump pasalku_knowledge_graph.dump

# Restore database
edgedb restore pasalku_knowledge_graph.dump
```

---

## 🎯 Ready to Use!

Setelah semua langkah di atas selesai, EdgeDB Knowledge Graph siap digunakan untuk:

✅ Menyimpan peraturan perundang-undangan  
✅ Relasi pasal-pasal hukum  
✅ Putusan pengadilan & yurisprudensi  
✅ Semantic search & citation tracking  
✅ AI-powered legal analysis  

**Next:** Lanjut ke Todo #2 - Dual AI Consensus Engine! 🚀

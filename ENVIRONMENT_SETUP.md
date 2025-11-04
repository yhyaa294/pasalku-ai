# 🔧 ENVIRONMENT SETUP GUIDE - PASALKU.AI

**Priority: CRITICAL**  
**Estimated Time: 2-4 hours**

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah memiliki akun dan API keys dari:

1. **BytePlus Ark** - https://console.byteplus.com/
2. **Groq** - https://console.groq.com/
3. **Clerk** - https://dashboard.clerk.com/
4. **Stripe** - https://dashboard.stripe.com/
5. **MongoDB Atlas** (optional untuk production) - https://cloud.mongodb.com/

## 🚀 Quick Start (5 Minutes)

### Step 1: Copy Environment File

```bash
# Copy example file
cp .env.example .env
```

### Step 2: Edit .env File

Buka file `.env` dan isi minimal keys berikut untuk development:

```bash
# AI Services (REQUIRED)
ARK_API_KEY=your_byteplus_ark_key_here
GROQ_API_KEY=your_groq_key_here

# Authentication (REQUIRED untuk user login)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Database (SQLite default untuk development)
DATABASE_URL=sqlite:///sql_app.db
```

### Step 3: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Step 4: Run Database Migration

```bash
cd backend
python -m alembic upgrade head
```

### Step 5: Start Development Servers

```bash
# Terminal 1 - Frontend (dari root directory)
npm run dev

# Terminal 2 - Backend
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

✅ **Done!** Aplikasi seharusnya berjalan di:
- Frontend: http://localhost:5000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🔑 Detailed API Keys Setup

### 1. BytePlus Ark (Primary AI)

**Cara Mendapatkan:**
1. Daftar di https://console.byteplus.com/
2. Buat project baru
3. Navigate ke API Keys section
4. Generate API key
5. Copy `ARK_API_KEY`

**Di .env:**
```bash
ARK_API_KEY=ark_xxxxxxxxxxxxxxxxxxxxx
ARK_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
ARK_MODEL_ID=ep-20250830093230-swczp
ARK_REGION=ap-southeast
```

**Test Connection:**
```bash
cd backend
python test_byteplus.py
```

### 2. Groq (Fallback AI)

**Cara Mendapatkan:**
1. Daftar di https://console.groq.com/
2. Navigate ke API Keys
3. Create new API key
4. Copy key

**Di .env:**
```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

**Test Connection:**
```bash
cd backend
python test_ai_connection.py
```

### 3. Clerk (Authentication)

**Cara Mendapatkan:**
1. Daftar di https://dashboard.clerk.com/
2. Buat application baru
3. Copy kedua keys dari dashboard

**Di .env:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Konfigurasi Clerk:**
1. Set redirect URLs di Clerk dashboard:
   - Sign in: `http://localhost:5000/login`
   - Sign up: `http://localhost:5000/register`
   - After sign in: `http://localhost:5000/dashboard`

### 4. Stripe (Payments)

**Cara Mendapatkan:**
1. Daftar di https://dashboard.stripe.com/
2. Gunakan Test Mode keys untuk development
3. Copy kedua keys

**Di .env:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxxxxxxxxxx
```

**Setup Products:**
1. Create products di Stripe dashboard
2. Create pricing plans (Professional, Enterprise)
3. Copy Price IDs

**Test Payment:**
```bash
# Gunakan test card
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

### 5. MongoDB (Optional - Production)

**Development:** SQLite sudah cukup  
**Production:** Gunakan MongoDB Atlas

**Cara Setup MongoDB Atlas:**
1. Daftar di https://cloud.mongodb.com/
2. Create cluster (pilih free tier)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 untuk development)
5. Get connection string

**Di .env:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pasalku_ai
MONGO_DB_NAME=pasalku_ai_conversation_archive
```

### 6. Sentry (Error Tracking - Optional)

**Cara Mendapatkan:**
1. Daftar di https://sentry.io/
2. Create project (Next.js)
3. Copy DSN

**Di .env:**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
SENTRY_ORG=pasalkuai
SENTRY_PROJECT=pasalku-ai
```

### 7. Checkly (Monitoring - Optional)

**Cara Mendapatkan:**
1. Daftar di https://app.checklyhq.com/
2. Create account
3. Get API key dari Settings

**Di .env:**
```bash
CHECKLY_ACCOUNT_ID=xxxxxxxxxxxxx
CHECKLY_API_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

## 📊 Complete .env Template

### Minimal (Development)

```bash
# Application
ENVIRONMENT=development
NEXT_PUBLIC_APP_URL=http://localhost:5000

# AI Services (REQUIRED)
ARK_API_KEY=your_ark_key
GROQ_API_KEY=your_groq_key

# Auth (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Database (SQLite untuk development)
DATABASE_URL=sqlite:///sql_app.db

# Secret Key
SECRET_KEY=your-secret-key-change-in-production
```

### Full Production

```bash
# ==============================================
# Application Settings
# ==============================================
ENVIRONMENT=production
DEBUG=false
NEXT_PUBLIC_APP_URL=https://pasalku.ai

# ==============================================
# AI Services
# ==============================================
ARK_API_KEY=your_production_ark_key
ARK_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
ARK_MODEL_ID=ep-20250830093230-swczp
ARK_REGION=ap-southeast

GROQ_API_KEY=your_production_groq_key

# ==============================================
# Databases
# ==============================================
# Neon PostgreSQL (Production)
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/pasalku_ai

# MongoDB (Conversation Archive)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pasalku_ai
MONGO_DB_NAME=pasalku_ai_conversation_archive

# Supabase (Realtime)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
SUPABASE_JWT_SECRET=xxxxx

# Turso (Edge Cache)
TURSO_AUTH_TOKEN=xxxxx
TURSO_DATABASE_URL=libsql://xxxxx.turso.io

# EdgeDB (Knowledge Graph)
EDGEDB_INSTANCE=xxxxx
EDGEDB_SECRET_KEY=xxxxx

# ==============================================
# Security & Authentication
# ==============================================
SECRET_KEY=super-secure-random-string-at-least-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# ==============================================
# Payments (Stripe)
# ==============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxx

# ==============================================
# Monitoring & Analytics
# ==============================================
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx
SENTRY_ORG=pasalkuai
SENTRY_PROJECT=pasalku-ai

CHECKLY_ACCOUNT_ID=xxxxx
CHECKLY_API_KEY=xxxxx

NEXT_PUBLIC_STATSIG_CLIENT_KEY=xxxxx
STATSIG_SERVER_API_KEY=xxxxx

# ==============================================
# Additional Services
# ==============================================
RESEND_API_KEY=re_xxxxx
SMS_API_KEY=xxxxx
SMS_PROVIDER=twilio

INNGEST_EVENT_KEY=xxxxx
INNGEST_SIGNING_KEY=xxxxx
```

---

## 🗄️ Database Setup

### Development (SQLite)

SQLite sudah dikonfigurasi by default. Cukup run migration:

```bash
cd backend
python -m alembic upgrade head
```

### Production (PostgreSQL)

**Menggunakan Neon (Recommended):**

1. Daftar di https://neon.tech/
2. Create project
3. Copy connection string
4. Update `.env`:

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/pasalku_ai
```

5. Run migration:

```bash
cd backend
python -m alembic upgrade head
```

**Verify Database:**

```bash
cd backend
python simple_db_test.py
```

---

## ✅ Verification Checklist

Setelah setup, jalankan tests berikut:

### 1. Backend Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy", ...}
```

### 2. AI Connection Test

```bash
cd backend
python test_ai_connection.py
# Expected: Both ARK and Groq should connect successfully
```

### 3. Database Test

```bash
cd backend
python simple_db_test.py
# Expected: Database connection successful
```

### 4. Frontend Build Test

```bash
npm run build
# Expected: Build successful without errors
```

### 5. Authentication Test

```bash
# Open http://localhost:5000
# Click "Sign In" atau "Sign Up"
# Expected: Clerk modal should appear
```

### 6. Payment Test

```bash
# Navigate to /pricing
# Click "Subscribe" untuk Professional plan
# Expected: Stripe checkout should open
```

---

## 🐛 Troubleshooting

### Error: "ARK_API_KEY not found"

**Solution:**
1. Check `.env` file ada di root directory
2. Pastikan key tidak ada spasi: `ARK_API_KEY=value` (bukan `ARK_API_KEY = value`)
3. Restart server setelah update `.env`

### Error: "Database connection failed"

**Solution:**
```bash
# Check database file exists
ls -la backend/sql_app.db

# Run migration again
cd backend
python -m alembic upgrade head
```

### Error: "Clerk authentication failed"

**Solution:**
1. Verify keys di `.env` match dengan Clerk dashboard
2. Check redirect URLs configured di Clerk
3. Clear browser cache dan cookies

### Error: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
npm install
cd backend
pip install -r requirements.txt
```

### Port Already in Use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 🔐 Security Best Practices

### ⚠️ NEVER commit .env to Git

`.env` file sudah ada di `.gitignore`. Verify:

```bash
git status
# .env should NOT appear in changes
```

### ✅ Use Strong Secret Keys

Generate secure keys:

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### ✅ Separate Dev & Production Keys

- Development: Use test/sandbox keys
- Production: Use live keys with restricted permissions

### ✅ Rotate Keys Regularly

- Rotate secret keys setiap 90 hari
- Rotate API keys jika ada suspicion of leak

---

## 📝 Next Steps

Setelah environment setup selesai:

1. ✅ Test semua API endpoints: http://localhost:8000/docs
2. ✅ Run comprehensive tests: `npm run test`
3. ✅ Check TODO.md untuk next action items
4. ✅ Start implementing frontend enhancements

---

## 📞 Support

**Documentation:**
- Main README: [README.md](./README.md)
- TODO List: [TODO.md](./TODO.md)
- Analysis Summary: [ANALYSIS_SUMMARY.md](./ANALYSIS_SUMMARY.md)

**Need Help?**
- Check backend logs: `backend/server.log`
- Check frontend logs: Browser DevTools Console
- Run diagnostic: `python backend/verify_system.py`

---

**Last Updated:** November 5, 2025  
**Status:** ✅ Complete  
**Priority:** 🚨 CRITICAL

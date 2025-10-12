# Pasalku.ai Quick Start Guide

## 🚀 Get Started in 10 Minutes

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (via Neon)
- MongoDB (via MongoDB Atlas)
- Clerk account
- BytePlus Ark API key

---

## Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/yhyaa294/pasalku-ai.git
cd pasalku-ai-3

# Install Python dependencies
pip install -r backend/requirements.txt

# Install Node dependencies (for monitoring)
npm install
```

---

## Step 2: Configure Environment Variables

Create `.env` file in root directory:

```env
# === CRITICAL: Authentication ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

# === CRITICAL: AI Engine ===
ARK_API_KEY=your_ark_api_key
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_MODEL_ID=ep-20241211161256-d6pjl

# === CRITICAL: Databases ===
# Neon PostgreSQL Instance 1 (User Data)
DATABASE_URL=postgresql://user:password@host/db

# Neon PostgreSQL Instance 2 (Session Data)
DATABASE_URL_NEON_2=postgresql://user:password@host/db

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster/
MONGO_DB_NAME=pasalku_ai

# === OPTIONAL: Additional Services ===
# Turso (Edge Cache)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token

# EdgeDB (Knowledge Graph)
EDGEDB_INSTANCE=your_instance
EDGEDB_SECRET_KEY=your_key

# Supabase (Realtime)
PASALKU_AI_SUPABASE_URL=https://your-project.supabase.co
PASALKU_AI_PASALKU_AISUPABASE_ANON_KEY=your_key

# === OPTIONAL: Monitoring ===
SENTRY_DSN=https://your-sentry-dsn
CHECKLY_API_KEY=your_key
CHECKLY_ACCOUNT_ID=your_id

# === OPTIONAL: Payments ===
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

## Step 3: Setup Databases

```bash
# Run automated database setup
python backend/scripts/setup_databases.py

# This will:
# ✓ Create PostgreSQL tables via Alembic
# ✓ Create MongoDB collections and indexes
# ✓ Setup Turso cache tables
# ✓ Verify all connections
```

**Expected Output:**
```
============================================================
Pasalku.ai Database Setup
============================================================
Setting up PostgreSQL tables...
✓ PostgreSQL tables created successfully

Setting up MongoDB collections and indexes...
  Created collection: chat_transcripts
  Created collection: document_analyses
  ...
✓ MongoDB setup completed successfully

Setting up Turso tables...
✓ Turso tables created successfully

Verifying all database connections...
✓ PostgreSQL (Neon) connected
✓ MongoDB connected
✓ Turso connected
✓ EdgeDB connected

============================================================
✓ Database setup completed successfully!
============================================================
```

---

## Step 4: Run Backend Server

```bash
# Development mode
cd backend
uvicorn app:app --reload --port 8001

# Or use the start script
python -m uvicorn app:app --reload --port 8001
```

**Server should start at**: `http://localhost:8001`

**Verify it's running:**
```bash
curl http://localhost:8001/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "uptime": 12.34,
  "services": {
    "api": "operational",
    "port": "8001"
  }
}
```

---

## Step 5: Test API Endpoints

### 1. Check Detailed Health
```bash
curl http://localhost:8001/api/health/detailed
```

### 2. Test Authentication (requires Clerk token)
```bash
curl -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
     http://localhost:8001/api/auth/me
```

### 3. Test AI Chat
```bash
curl -X POST http://localhost:8001/api/chat/message \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Apa itu Pasal 362 KUHP?",
    "persona": "default"
  }'
```

---

## Step 6: Access API Documentation

Open your browser:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

You can test all endpoints directly from Swagger UI!

---

## Step 7: Setup Monitoring (Optional)

### Checkly Monitoring
```bash
# Install Checkly CLI
npm install -g checkly

# Login
checkly login

# Deploy monitors
cd monitoring
checkly deploy
```

### Sentry Error Tracking
Sentry is automatically configured if `SENTRY_DSN` is set in `.env`

---

## 🧪 Testing

### Run All Tests
```bash
pytest backend/tests/
```

### Test Specific Module
```bash
pytest backend/tests/test_auth.py
pytest backend/tests/test_chat.py
```

### Test Database Connections
```bash
python backend/test_db_connections.py
```

---

## 📱 Frontend Setup (Next.js)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 🔧 Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
1. Verify environment variables are correct
2. Check if database server is accessible
3. Verify SSL/TLS settings
4. Check firewall rules

```bash
# Test connection manually
python -c "
from backend.database import get_db_connections
db = get_db_connections()
print('Connection successful!')
"
```

### Issue: Clerk Authentication Failed
**Solution:**
1. Verify Clerk keys are correct
2. Check if keys are for correct environment (dev/prod)
3. Ensure JWT token is valid

### Issue: Ark AI Not Responding
**Solution:**
1. Verify ARK_API_KEY is correct
2. Check ARK_BASE_URL and ARK_MODEL_ID
3. Test API key directly:

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Authorization: Bearer YOUR_ARK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ep-20241211161256-d6pjl",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Issue: MongoDB Connection Timeout
**Solution:**
1. Check if IP is whitelisted in MongoDB Atlas
2. Verify connection string format
3. Test connection:

```bash
python -c "
from pymongo import MongoClient
client = MongoClient('YOUR_MONGODB_URI')
client.admin.command('ping')
print('MongoDB connected!')
"
```

---

## 🎯 Quick Feature Test Checklist

After setup, test these features:

- [ ] Health check endpoints working
- [ ] User can register via Clerk
- [ ] User can login
- [ ] User profile loads
- [ ] AI chat responds to queries
- [ ] Chat sessions are saved
- [ ] Citations are extracted
- [ ] Database connections verified
- [ ] Monitoring is active (if configured)

---

## 📊 System Status Check

Run this command to check all systems:

```bash
# Check all services
curl http://localhost:8001/api/health/detailed | jq
```

**Expected Status:**
- ✅ PostgreSQL: connected
- ✅ MongoDB: connected
- ✅ Turso: connected (if configured)
- ✅ EdgeDB: connected (if configured)
- ✅ Ark AI: configured
- ✅ Clerk: configured

---

## 🚀 Deploy to Production

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Vercel Deployment (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 📚 Next Steps

1. **Read Full Documentation**: See `docs/IMPLEMENTATION_GUIDE.md`
2. **Understand Architecture**: See `docs/DATABASE_ARCHITECTURE.md`
3. **Setup Monitoring**: See `monitoring/README.md`
4. **Implement Fase 2**: Follow roadmap in `IMPLEMENTATION_GUIDE.md`

---

## 🆘 Need Help?

- **Documentation**: `/docs` directory
- **API Reference**: http://localhost:8001/docs
- **Issues**: GitHub Issues
- **Email**: support@pasalku.ai

---

## ✅ Success!

If you can:
1. ✅ Access health endpoint
2. ✅ Login with Clerk
3. ✅ Send message to AI
4. ✅ See response with citations

**Congratulations! Pasalku.ai is running successfully! 🎉**

---

**Quick Links:**
- API Docs: http://localhost:8001/docs
- Health Check: http://localhost:8001/api/health
- Frontend: http://localhost:3000
- Database Setup: `python backend/scripts/setup_databases.py`

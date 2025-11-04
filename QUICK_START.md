# 🚀 Quick Start Guide - Pasalku AI

## Prerequisites
- Node.js 18+ installed
- Python 3.11+ installed
- npm or pnpm installed

---

## 🎯 Cara Cepat Memulai

### 1. Frontend (Next.js) - READY ✅

```bash
# Install dependencies (sudah selesai)
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:5000
```

**Status**: ✅ RUNNING di port 5000

---

### 2. Backend (FastAPI) - NEEDS FIX ⚠️

**Current Issue**: Import errors (`ModuleNotFoundError: No module named 'backend'`)

**Temporary Solution**:

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run dengan module mode
python -m uvicorn server:app --reload --port 8000

# OR set PYTHONPATH
$env:PYTHONPATH="C:\Users\YAHYA\pasalku-ai-3"
python server.py
```

**Note**: Frontend API chat endpoint (`/api/chat`) sudah berfungsi tanpa backend Python karena ada mock responses built-in.

---

## 🎨 Halaman yang Sudah Siap

### 1. Landing Page
**URL**: http://localhost:5000/
**Features**:
- Modern hero section
- Features showcase
- Pricing section
- FAQ
- Testimonials
- CTA sections

### 2. Chat Interface ⭐ NEW
**URL**: http://localhost:5000/chat
**Features**:
- Real-time messaging UI
- Beautiful gradient design
- Auto-scroll
- Loading states
- Error handling
- AI integration ready

### 3. Dashboard
**URL**: http://localhost:5000/dashboard
**Features**:
- User analytics
- Session history
- Settings

---

## 🔑 Authentication Setup

### Clerk Keys (Already Configured)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

**Protected Routes**:
- `/dashboard/*`
- `/chat/*`
- `/api/chat/*`

---

## 🤖 AI Services Status

### BytePlus Ark (Primary)
```env
ARK_API_KEY="-863f6a1b-e0ed-4cff-a198-26b92dec48c2"
ARK_BASE_URL="https://ark.ap-southeast.bytepluses.com/api/v3"
ARK_MODEL_ID="ep-20250830093230-swczp"
```
✅ Configured

### Groq (Fallback)
```env
GROQ_API_KEY="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"
```
✅ Configured

### Google Gemini
```env
GEMINI_API_KEY="AIzaSyAQ7oT9Mjg2P58LGvF9s5Q1E8xALtyfkJQ"
```
✅ Configured

**Test AI Connection**:
```bash
python test_ai_connection.py
```

---

## 🗄️ Database

### Development (SQLite)
```env
DATABASE_URL="sqlite:///./backend/sql_app.db"
```

### Production (Neon PostgreSQL)
```env
DATABASE_URL="postgresql://neondb_owner:npg_6hrEmRXv4loC@ep-bitter-mud-addfe0aq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Migrations**:
```bash
cd backend
alembic upgrade head
```

---

## 🧪 Testing Chat Interface

### Manual Test Steps:

1. **Start Frontend**:
   ```bash
   npm run dev
   ```

2. **Open Chat**:
   - Go to http://localhost:5000/chat
   
3. **Test Messages**:
   - Type: "Halo, apa itu Pasalku AI?"
   - Type: "Bagaimana cara konsultasi hukum?"
   - Type: "Test fitnah online"

4. **Expected Behavior**:
   - Message appears instantly
   - Loading indicator shows
   - AI response arrives (from mock or real API)
   - Smooth scrolling

---

## 🐛 Known Issues & Fixes

### Issue 1: Backend Import Errors ⚠️
**Problem**: `ModuleNotFoundError: No module named 'backend'`

**Quick Fix**:
```bash
# Run dengan PYTHONPATH
cd backend
$env:PYTHONPATH="C:\Users\YAHYA\pasalku-ai-3"
python -m uvicorn server:app --reload --port 8000
```

**Permanent Fix** (TODO):
- Refactor all imports di backend
- Use consistent relative imports

### Issue 2: Sentry Warning
**Problem**: `@sentry/nextjs` warning tentang `onRequestError` hook

**Fix**: Add to `instrumentation.ts`:
```typescript
export function onRequestError(err: unknown, request: Request) {
  Sentry.captureRequestError(err, request)
}
```

### Issue 3: Next.js Config Warnings
**Problem**: Invalid config keys

**Fix**: Update `next.config.js`:
```javascript
// Remove deprecated keys
// - swcMinify
// - i18n config (use App Router i18n instead)
```

---

## 📊 Performance Metrics

- **Frontend Build Time**: ~26 seconds
- **Hot Reload**: <2 seconds
- **Page Load**: <1 second
- **API Response**: <500ms (mock), <2s (real AI)

---

## 🎯 Next Steps

### Priority 1: Fix Backend
- [ ] Refactor import statements
- [ ] Test backend endpoints
- [ ] Integrate with frontend

### Priority 2: UI Polish
- [ ] Add animations
- [ ] Improve mobile responsiveness
- [ ] Add loading skeletons

### Priority 3: Features
- [ ] File upload di chat
- [ ] Voice input
- [ ] Export chat history
- [ ] Multi-language support

### Priority 4: Deploy
- [ ] Deploy frontend ke Vercel
- [ ] Deploy backend ke Railway
- [ ] Setup CI/CD
- [ ] Configure production env

---

## 💡 Tips

### Development Workflow:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (when fixed)
cd backend
python -m uvicorn server:app --reload

# Terminal 3: Testing
python test_ai_connection.py
```

### Hot Module Replacement:
- Frontend: Auto-reload on file save
- Backend: Use `--reload` flag
- Env changes: Restart required

---

## 📞 Support

**Issues?**
- Check logs di terminal
- Review `.env` configuration
- Test dengan `npm run build` untuk production build
- Clear cache: `rm -rf .next node_modules && npm install`

---

**Last Updated**: November 3, 2025
**Status**: ✅ Frontend Ready | ⚠️ Backend Needs Fix
**Next Milestone**: Backend refactoring & full integration test

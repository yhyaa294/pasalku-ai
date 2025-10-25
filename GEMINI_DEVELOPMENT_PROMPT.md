# 🤖 PROMPT UNTUK GEMINI CLI - PASALKU.AI DEVELOPMENT

## 📋 CONTEXT PROJECT

**Nama Project:** Pasalku.ai  
**Tujuan Utama:** Platform konsultasi hukum berbasis AI untuk Indonesia  
**Tech Stack:**
- **Frontend:** Next.js 15.5.6 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy
- **Deployment Target:** Vercel (frontend) + Railway/Render (backend)
- **Repository:** github.com/yhyaa294/pasalku-ai

---

## 🎯 TUJUAN UTAMA PROJECT

### Fitur Konsultasi Hukum (CORE FEATURE):
1. **4-Step Consultation Flow:**
   - Step 1: User bertanya dalam bahasa natural (Indonesia)
   - Step 2: AI menganalisis & mencari informasi dari database hukum
   - Step 3: AI memberikan jawaban lengkap dengan referensi pasal
   - Step 4: User bisa lanjut pertanyaan atau simpan konsultasi

2. **Stateful Consultation:**
   - Setiap sesi konsultasi disimpan di database
   - User bisa lihat riwayat konsultasi
   - AI ingat context percakapan sebelumnya

3. **Authentication & Authorization:**
   - Register/Login menggunakan JWT token
   - Role-based access: public, premium, professional
   - Free tier: 5 konsultasi/bulan
   - Premium: unlimited konsultasi

---

## 📁 STRUKTUR FILE PENTING

### Frontend (Next.js):
```
app/
├── page.tsx                          # Landing page (SUDAH MENGGUNAKAN PSYCHOLOGY COMPONENTS)
├── konsultasi/page.tsx               # Halaman konsultasi utama
├── dashboard/page.tsx                # Dashboard user
├── login/page.tsx                    # Login page
├── register/page.tsx                 # Register page
├── api/                              # API routes (proxy ke backend)
│   ├── auth/                         # Authentication endpoints
│   ├── consultation/                 # Consultation endpoints
│   └── ...

components/
├── enhanced-navigation.tsx           # Navigation bar dengan dark mode
├── hero-section-psychology.tsx       # Hero section (AKTIF)
├── problem-statement-section-psychology.tsx  # Problem statement (AKTIF)
├── features-section-psychology.tsx   # Features showcase (AKTIF)
├── pricing-section-psychology.tsx    # Pricing plans (AKTIF)
├── how-it-works-section.tsx          # How it works
├── enhanced-footer.tsx               # Footer
├── EnhancedChatInterface.tsx         # Chat interface untuk konsultasi
└── dark-mode-toggle.tsx              # Dark mode toggle
```

### Backend (FastAPI):
```
backend/
├── app.py                            # Main FastAPI application
├── models/
│   ├── user.py                       # User model
│   ├── consultation.py               # Consultation model
│   └── ...
├── routes/
│   ├── auth.py                       # Authentication routes
│   ├── consultation.py               # Consultation routes
│   └── ...
├── services/
│   ├── ai_service.py                 # AI/LLM integration
│   ├── legal_db_service.py           # Legal database queries
│   └── ...
└── requirements.txt                  # Python dependencies
```

---

## ⚠️ RULES YANG HARUS DIPATUHI

### 1. JANGAN UBAH KOMPONEN YANG SUDAH BENAR:
- ✅ `hero-section-psychology.tsx` - SUDAH FIX
- ✅ `problem-statement-section-psychology.tsx` - SUDAH FIX
- ✅ `features-section-psychology.tsx` - SUDAH FIX
- ✅ `pricing-section-psychology.tsx` - SUDAH FIX
- ✅ `app/page.tsx` - SUDAH MENGGUNAKAN KOMPONEN PSYCHOLOGY

**JIKA DIMINTA FIX TAMPILAN LANDING:**
- Cek dulu apakah `app/page.tsx` sudah import dari komponen `-psychology`
- JANGAN buat komponen baru dengan nama berbeda
- JANGAN ubah komponen yang sudah ada kecuali diminta spesifik

### 2. HYDRATION ERROR PREVENTION:
```typescript
// ✅ BENAR: Gunakan ClientOnlyWrapper untuk konten dinamis
<ClientOnlyWrapper>
  {isMounted && <DynamicContent />}
</ClientOnlyWrapper>

// ✅ BENAR: Dynamic import dengan ssr: false
const Component = dynamic(() => import('@/components/Component'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
});

// ❌ SALAH: Render konten berbeda di server & client
{isClient ? <ClientContent /> : <ServerContent />}

// ❌ SALAH: Gunakan Math.random() atau Date.now() langsung di render
```

### 3. DARK MODE COMPATIBILITY:
```typescript
// ✅ BENAR: Selalu sertakan dark mode classes
<div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100">

// ❌ SALAH: Hanya light mode
<div className="bg-white text-gray-900">
```

### 4. TYPESCRIPT STRICT MODE:
- Semua component harus typed dengan interface/type
- Jangan gunakan `any` kecuali benar-benar perlu
- Export component dengan named export DAN default export jika digunakan dynamic import

### 5. API ROUTING:
```typescript
// ✅ BENAR: Proxy API call melalui Next.js API routes
const response = await fetch('/api/consultation/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

// ❌ SALAH: Direct call ke backend (CORS issues)
const response = await fetch('http://backend.railway.app/api/...', ...)
```

---

## 🚀 DEPLOYMENT REQUIREMENTS

### Vercel (Frontend):
1. **Environment Variables yang Diperlukan:**
```env
NEXT_PUBLIC_API_URL=https://backend.railway.app
NEXT_PUBLIC_SITE_URL=https://pasalku.vercel.app
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://pasalku.vercel.app
```

2. **Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x

3. **vercel.json Configuration:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Railway/Render (Backend):
1. **Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=xxx
OPENAI_API_KEY=xxx (or other LLM API key)
ALLOWED_ORIGINS=https://pasalku.vercel.app
```

2. **Procfile/Start Command:**
```
web: uvicorn app:app --host 0.0.0.0 --port $PORT
```

3. **requirements.txt harus include:**
- fastapi
- uvicorn[standard]
- sqlalchemy
- psycopg2-binary
- python-jose[cryptography]
- passlib[bcrypt]
- python-multipart

---

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue 1: "Tampilan kembali ke versi lama setelah npm run dev"
**Root Cause:** `app/page.tsx` masih import komponen lama
**Solution:**
```typescript
// ❌ SALAH:
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';

// ✅ BENAR:
import { HeroSection } from '@/components/hero-section-psychology';
const FeaturesSection = dynamic(() => import('@/components/features-section-psychology'));
```

### Issue 2: "Hydration Error"
**Root Cause:** Content berbeda antara server & client render
**Solution:**
1. Wrap dengan `<ClientOnlyWrapper>`
2. Gunakan `useState` dengan initial value yang sama di server & client
3. Set `isMounted` state di `useEffect`

### Issue 3: "Cannot find module error saat build"
**Root Cause:** Missing export atau salah path import
**Solution:**
1. Pastikan component punya `export default ComponentName`
2. Check path import (case-sensitive!)
3. Verify tsconfig.json paths alias

### Issue 4: "API call failed 404/CORS"
**Root Cause:** Direct call ke backend tanpa proxy
**Solution:** Buat API route di `app/api/` untuk proxy ke backend

### Issue 5: "Build success tapi page blank di Vercel"
**Root Cause:** 
- Missing environment variables
- Client-side only code di server component
**Solution:**
1. Add semua env vars di Vercel dashboard
2. Mark client components dengan `'use client'`
3. Check browser console untuk error

---

## 📝 TASK CHECKLIST SEBELUM DEPLOYMENT

### Pre-Deployment Frontend:
- [ ] Semua komponen sudah fix hydration error
- [ ] Dark mode berfungsi di semua halaman
- [ ] Build success (`npm run build`)
- [ ] Tidak ada TypeScript error
- [ ] Environment variables sudah di-set
- [ ] API routes sudah proxy ke backend dengan benar
- [ ] Authentication flow working (login/register)
- [ ] Konsultasi flow working end-to-end

### Pre-Deployment Backend:
- [ ] Database migrations sudah running
- [ ] CORS settings sudah include Vercel domain
- [ ] JWT authentication working
- [ ] All endpoints return proper error handling
- [ ] Rate limiting implemented (untuk free tier)
- [ ] Logging/monitoring setup

### Post-Deployment Verification:
- [ ] Landing page load dengan benar
- [ ] Dark mode toggle working
- [ ] Register user baru berhasil
- [ ] Login berhasil dan dapat token
- [ ] Konsultasi chat berfungsi
- [ ] Riwayat konsultasi tersimpan
- [ ] Mobile responsive
- [ ] Performance score >80 di Lighthouse

---

## 💡 BEST PRACTICES

1. **Always test locally before commit:**
   ```bash
   npm run build  # Frontend
   npm run dev    # Test di localhost:5000
   ```

2. **Commit messages harus descriptive:**
   ```
   ✅ fix: resolve hydration error in hero section
   ✅ feat: add consultation history page
   ✅ chore: update dependencies
   
   ❌ fix bug
   ❌ update
   ```

3. **Code review checklist:**
   - TypeScript types lengkap?
   - Dark mode classes added?
   - Hydration-safe?
   - Mobile responsive?
   - Accessibility (aria-labels)?

4. **Performance optimization:**
   - Use `dynamic()` untuk heavy components
   - Image optimization dengan next/image
   - Lazy load non-critical components
   - Minimize bundle size

---

## 🆘 WHEN TO ASK FOR HELP

**ASK ME (GitHub Copilot) WHEN:**
- Tidak yakin approach yang benar
- Ada error yang tidak dimengerti
- Perlu refactor code yang kompleks
- Butuh review sebelum commit

**JANGAN LANGSUNG UBAH WHEN:**
- Ada file dengan suffix `-psychology` atau `-backup`
- File yang sudah ada comment "// ✅ FIXED" atau "// DO NOT MODIFY"
- Configuration files (next.config.js, tsconfig.json) tanpa alasan jelas

**ALWAYS CHECK FIRST:**
- Apakah ada file FIXES_APPLIED.md atau IMPLEMENTATION_COMPLETE.md?
- Apakah issue yang diminta fix sudah ter-resolve sebelumnya?
- Apakah ada dokumentasi terkait di folder `docs/`?

---

## 🎯 SAAT INI STATUS PROJECT:

**✅ SUDAH SELESAI:**
- Landing page dengan psychology-driven design
- Dark mode implementation
- Authentication system (backend)
- Basic consultation flow (backend)
- Responsive navigation
- Footer dengan social links

**🚧 SEDANG DIKERJAKAN:**
- Deployment ke Vercel (frontend)
- Deployment backend ke Railway/Render
- Fine-tuning API endpoints
- Testing end-to-end flow

**📋 TODO:**
- Payment integration (GoPay/OVO)
- Admin dashboard
- Analytics dashboard
- Email notifications
- WhatsApp integration
- Case studies management
- Document upload & analysis (full implementation)

---

## 🚀 QUICK START COMMANDS

```bash
# Development
npm run dev              # Start frontend (localhost:5000)
cd backend && uvicorn app:app --reload  # Start backend (localhost:8000)

# Testing
npm run build            # Test production build
npm run lint             # Check linting errors

# Deployment
git add .
git commit -m "descriptive message"
git push origin main     # Auto-deploy ke Vercel (jika sudah setup)

# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head     # Run migrations
```

---

## 📞 CONTACTS & RESOURCES

- **Repository:** https://github.com/yhyaa294/pasalku-ai
- **Frontend URL:** https://pasalku.vercel.app (when deployed)
- **Backend URL:** https://pasalku-backend.railway.app (when deployed)
- **Figma Design:** (if available)
- **API Documentation:** /docs (FastAPI auto-generated)

---

## ⚡ EMERGENCY FIXES

### Jika Build Failed:
1. Check error message di Vercel logs
2. Coba `npm run build` locally
3. Fix TypeScript errors
4. Check missing dependencies
5. Verify environment variables

### Jika Page Blank:
1. Open browser console
2. Check network tab for failed requests
3. Verify API endpoints responding
4. Check authentication token

### Jika API Error:
1. Check CORS settings di backend
2. Verify API URL di environment variables
3. Check backend logs
4. Test endpoints dengan Postman/curl

---

## 🎓 LEARNING RESOURCES

- Next.js 15 Docs: https://nextjs.org/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Vercel Deployment: https://vercel.com/docs

---

**INGAT:** Tujuan utama adalah fitur **KONSULTASI HUKUM** berfungsi dengan baik, responsif, dan bisa di-deploy. Semua hal lain adalah secondary. Focus on making the core feature work perfectly! 🎯

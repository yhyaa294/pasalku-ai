# 🎯 PROMPT LENGKAP UNTUK GEMINI CLI - PASALKU.AI

**PENTING: Baca semua konteks ini sebelum mengerjakan apapun!**

---

## 📌 RINGKASAN SITUASI TERKINI

### Masalah yang Baru Saja Terjadi:
User menjalankan `npm run dev` dan tampilan landing page **kembali ke versi lama yang kacau**, padahal kemarin sudah diperbaiki dengan desain psychology-driven yang bagus.

### Root Cause yang Ditemukan:
File `app/page.tsx` masih menggunakan import dari komponen LAMA:
- ❌ `hero-section.tsx` (LAMA - JANGAN PAKAI)
- ❌ `features-section.tsx` (LAMA - JANGAN PAKAI)
- ❌ `pricing-section.tsx` (LAMA - JANGAN PAKAI)

Padahal sudah ada komponen BARU dengan suffix `-psychology`:
- ✅ `hero-section-psychology.tsx` (BARU - HARUS PAKAI)
- ✅ `problem-statement-section-psychology.tsx` (BARU - HARUS PAKAI)
- ✅ `features-section-psychology.tsx` (BARU - HARUS PAKAI)
- ✅ `pricing-section-psychology.tsx` (BARU - HARUS PAKAI)

### Solusi yang Sudah Diterapkan:
✅ Update `app/page.tsx` untuk import dari komponen `-psychology`
✅ Tambahkan `export default` untuk komponen yang perlu dynamic import
✅ Build success, server running di localhost:5000
✅ Status compile: `✓ Compiled / in 21.7s (3222 modules)`

---

## 🎯 TUJUAN UTAMA PROJECT: PASALKU.AI

### Deskripsi Project:
**Pasalku.ai** adalah platform konsultasi hukum berbasis AI untuk pasar Indonesia. Tujuan utama adalah memberikan akses hukum yang mudah, cepat, dan terjangkau untuk semua orang.

### Fitur CORE yang Harus Berfungsi:
1. **AI Legal Consultation (PRIORITAS TERTINGGI)**
   - User bisa chat dengan AI untuk pertanyaan hukum
   - AI memberikan jawaban dengan referensi pasal hukum Indonesia
   - Sistem stateful: konsultasi disimpan dan bisa dilanjutkan
   - Flow: Register → Login → Konsultasi → Save History

2. **Landing Page yang Menarik**
   - Desain modern dengan psychology-driven principles
   - Highlight pain points user (akses hukum mahal, ribet)
   - Show solutions dengan emotional triggers
   - Pricing transparency
   - Social proof & testimonials

3. **Authentication System**
   - Register/Login dengan JWT
   - Role-based: public, premium, professional
   - Free tier: 5 konsultasi/bulan
   - Premium: unlimited konsultasi

4. **Dark Mode Support**
   - Toggle dark/light mode
   - Semua komponen harus support dark mode
   - Persistent preference (localStorage)

---

## 📁 STRUKTUR PROJECT

```
pasalku-ai-3/
├── app/
│   ├── page.tsx                              ✅ SUDAH FIX - PAKAI KOMPONEN PSYCHOLOGY
│   ├── konsultasi/page.tsx                   🚧 PERLU IMPLEMENTASI
│   ├── dashboard/page.tsx                    ✅ ADA
│   ├── login/page.tsx                        ✅ ADA
│   ├── register/page.tsx                     ✅ ADA
│   ├── api/                                  🚧 PERLU PROXY KE BACKEND
│   │   ├── auth/
│   │   ├── consultation/
│   │   └── ...
│   └── ...
│
├── components/
│   ├── enhanced-navigation.tsx               ✅ FIXED - Dark mode support
│   ├── enhanced-footer.tsx                   ✅ FIXED
│   ├── dark-mode-toggle.tsx                  ✅ FIXED
│   │
│   ├── hero-section-psychology.tsx           ✅ FIXED - PAKAI INI!
│   ├── problem-statement-section-psychology.tsx  ✅ FIXED - PAKAI INI!
│   ├── features-section-psychology.tsx       ✅ FIXED - PAKAI INI!
│   ├── pricing-section-psychology.tsx        ✅ FIXED - PAKAI INI!
│   │
│   ├── hero-section.tsx                      ❌ LAMA - JANGAN PAKAI
│   ├── features-section.tsx                  ❌ LAMA - JANGAN PAKAI
│   ├── pricing-section.tsx                   ❌ LAMA - JANGAN PAKAI
│   │
│   ├── how-it-works-section.tsx              ✅ OK
│   ├── faq-section.tsx                       ✅ OK
│   ├── testimonials-section.tsx              ✅ OK
│   ├── cta-section.tsx                       ✅ OK
│   │
│   ├── EnhancedChatInterface.tsx             🚧 PERLU INTEGRASI KE /konsultasi
│   ├── ClientOnlyWrapper.tsx                 ✅ FIXED - Prevent hydration
│   └── ...
│
├── backend/
│   ├── app.py                                🚧 PERLU TESTING
│   ├── models/
│   │   ├── user.py
│   │   ├── consultation.py
│   │   └── ...
│   ├── routes/
│   │   ├── auth.py
│   │   ├── consultation.py
│   │   └── ...
│   └── ...
│
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── ...
```

---

## ⚠️ RULES KRUSIAL - WAJIB DIIKUTI!

### 1. JANGAN PERNAH UBAH FILE YANG SUDAH FIX!

**File yang SUDAH FIX dan JANGAN DISENTUH kecuali ada bug:**
```
✅ app/page.tsx (SUDAH PAKAI KOMPONEN PSYCHOLOGY)
✅ components/hero-section-psychology.tsx
✅ components/problem-statement-section-psychology.tsx
✅ components/features-section-psychology.tsx
✅ components/pricing-section-psychology.tsx
✅ components/enhanced-navigation.tsx
✅ components/enhanced-footer.tsx
✅ components/dark-mode-toggle.tsx
✅ components/ClientOnlyWrapper.tsx
```

**Jika user bilang "tampilan kacau" atau "balik ke versi lama":**
1. ❌ JANGAN langsung buat komponen baru
2. ❌ JANGAN ubah komponen `-psychology` yang sudah ada
3. ✅ CEK DULU: apakah `app/page.tsx` masih import dari komponen `-psychology`?
4. ✅ CEK: apakah ada konflik git yang bikin file revert?
5. ✅ CEK: apakah build berhasil tanpa error?

### 2. SELALU CEK SEBELUM MENGUBAH APAPUN

**Workflow yang BENAR:**
```bash
# Step 1: Cek file yang mau diubah
cat app/page.tsx | grep "import.*hero-section"

# Step 2: Pastikan import dari -psychology
# Harus ada: import { HeroSection } from '@/components/hero-section-psychology'
# BUKAN:     import { HeroSection } from '@/components/hero-section'

# Step 3: Test build
npm run build

# Step 4: Baru commit jika success
git add .
git commit -m "fix: ensure psychology components are used"
```

### 3. HYDRATION ERROR PREVENTION (CRITICAL!)

**❌ PENYEBAB HYDRATION ERROR:**
```typescript
// ❌ SALAH: Content berbeda di server vs client
export default function Component() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => { setMounted(true) }, [])
  
  // ❌ INI AKAN MISMATCH!
  return <div>{mounted ? "Client" : "Server"}</div>
}

// ❌ SALAH: Random values
return <div key={Math.random()}>{content}</div>

// ❌ SALAH: Direct window access
const width = window.innerWidth  // Server tidak punya window!
```

**✅ SOLUSI YANG BENAR:**
```typescript
// ✅ BENAR: Wrap dengan ClientOnlyWrapper
import { ClientOnlyWrapper } from '@/components/ClientOnlyWrapper'

export default function Component() {
  return (
    <div>
      <div>Static content (safe untuk SSR)</div>
      
      <ClientOnlyWrapper>
        <DynamicClientContent />
      </ClientOnlyWrapper>
    </div>
  )
}

// ✅ BENAR: Dynamic import dengan ssr: false
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

// ✅ BENAR: Same initial state
const [value, setValue] = useState('')  // Empty string di server & client
```

### 4. DARK MODE COMPATIBILITY (MANDATORY!)

**❌ SALAH:**
```typescript
// ❌ Hanya light mode
<div className="bg-white text-gray-900">
  
// ❌ Inline styles (tidak support dark mode)
<div style={{ backgroundColor: 'white' }}>
```

**✅ BENAR:**
```typescript
// ✅ Support dark mode
<div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100">

// ✅ Gradient dengan dark variant
<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">

// ✅ Borders
<div className="border border-gray-200 dark:border-slate-700">
```

### 5. TYPESCRIPT STRICT MODE

**✅ REQUIRED:**
- Semua component HARUS punya interface/type untuk props
- Jangan pakai `any` (kecuali really necessary)
- Export component dengan named export + default export jika perlu dynamic import

**Contoh:**
```typescript
// ✅ BENAR
interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: FC<HeroSectionProps> = ({ onGetStarted }) => {
  // Component code
}

export default HeroSection  // Untuk dynamic import
```

### 6. API ROUTING (CRITICAL!)

**❌ SALAH: Direct call ke backend**
```typescript
// ❌ AKAN ERROR CORS!
fetch('http://backend.railway.app/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

**✅ BENAR: Proxy melalui Next.js API routes**
```typescript
// ✅ Create: app/api/auth/login/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  
  // Proxy ke backend
  const response = await fetch(process.env.BACKEND_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  
  return Response.json(await response.json())
}

// ✅ Client call
fetch('/api/auth/login', {  // No CORS issue!
  method: 'POST',
  body: JSON.stringify(data)
})
```

---

## 🚀 DEPLOYMENT TARGET & REQUIREMENTS

### Frontend (Vercel):

**Environment Variables yang WAJIB ada:**
```env
# Required
NEXT_PUBLIC_API_URL=https://pasalku-backend.railway.app
NEXT_PUBLIC_SITE_URL=https://pasalku.vercel.app

# Optional
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://pasalku.vercel.app
SENTRY_DSN=your-sentry-dsn
```

**Build Settings di Vercel:**
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: **18.x** atau **20.x**

**Pre-Deployment Checklist:**
```bash
# 1. Build test
npm run build  # Harus success!

# 2. Check TypeScript
npm run type-check  # atau: npx tsc --noEmit

# 3. Check lint
npm run lint

# 4. Test locally
npm run build && npm start  # Test production build

# 5. Environment variables
# Pastikan semua env vars sudah di-set di Vercel dashboard
```

### Backend (Railway/Render):

**Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
ALLOWED_ORIGINS=https://pasalku.vercel.app,http://localhost:5000
PORT=8000
```

**Start Command:**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

**requirements.txt essentials:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0
```

---

## 🔧 COMMON ISSUES & TROUBLESHOOTING

### Issue 1: "Tampilan kembali ke versi lama setelah npm run dev"

**Root Cause:** `app/page.tsx` masih import komponen lama

**Diagnosis:**
```bash
# Check imports
grep "import.*hero-section" app/page.tsx
grep "import.*features-section" app/page.tsx
grep "import.*pricing-section" app/page.tsx
```

**Fix:**
```typescript
// ❌ Jika ada ini, GANTI:
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';

// ✅ Jadi ini:
import { HeroSection } from '@/components/hero-section-psychology';
const FeaturesSection = dynamic(() => import('@/components/features-section-psychology'), {
  ssr: false
});
```

**Verify:**
```bash
npm run dev
# Buka http://localhost:5000
# Cek apakah tampilan sudah benar
```

---

### Issue 2: "Hydration Error"

**Error Messages:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
Error: Text content does not match server-rendered HTML.
Error: There was an error while hydrating. Because the error happened outside of a Suspense boundary...
```

**Root Cause:** Content di server berbeda dengan client

**Fix Strategy:**
1. Wrap dynamic content dengan `<ClientOnlyWrapper>`
2. Gunakan `useState` dengan initial value yang sama
3. Jangan pakai `Math.random()`, `Date.now()`, atau `window` langsung

**Example Fix:**
```typescript
// ❌ BEFORE (ERROR):
export default function Component() {
  return <div>{new Date().toISOString()}</div>
}

// ✅ AFTER (FIXED):
export default function Component() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState('')
  
  useEffect(() => {
    setMounted(true)
    setTime(new Date().toISOString())
  }, [])
  
  if (!mounted) return <div>Loading...</div>
  
  return <div>{time}</div>
}

// ✅ ATAU lebih simple dengan ClientOnlyWrapper:
export default function Component() {
  return (
    <ClientOnlyWrapper>
      <div>{new Date().toISOString()}</div>
    </ClientOnlyWrapper>
  )
}
```

---

### Issue 3: "Module not found" atau "Cannot find module"

**Error:**
```
Module not found: Can't resolve '@/components/hero-section-psychology'
```

**Diagnosis:**
```bash
# Check if file exists
ls components/hero-section-psychology.tsx

# Check export
grep "export" components/hero-section-psychology.tsx
```

**Common Causes:**
1. File tidak ada (typo di path)
2. Missing export
3. Case-sensitive issue (Linux vs Windows)

**Fix:**
```typescript
// Pastikan file ada export:
// ✅ Named export
export const HeroSection: FC<Props> = (props) => { ... }

// ✅ Default export (untuk dynamic import)
export default HeroSection
```

---

### Issue 4: "API call failed / CORS error"

**Error di browser console:**
```
Access to fetch at 'http://backend.railway.app/api/...' from origin 'https://pasalku.vercel.app' 
has been blocked by CORS policy
```

**Root Cause:** Direct call ke backend without proxy

**Fix:**
1. **Create API proxy route** di `app/api/[endpoint]/route.ts`
2. **Frontend call** ke `/api/[endpoint]` bukan ke backend langsung
3. **Backend CORS** harus allow Vercel domain

**Example:**
```typescript
// ✅ app/api/consultation/chat/route.ts
export async function POST(req: Request) {
  const token = req.headers.get('Authorization')
  const body = await req.json()
  
  const response = await fetch(process.env.BACKEND_URL + '/api/consultation/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token || ''
    },
    body: JSON.stringify(body)
  })
  
  return Response.json(await response.json(), { status: response.status })
}

// ✅ Frontend
const response = await fetch('/api/consultation/chat', {  // Proxy!
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(message)
})
```

---

### Issue 5: "Build success tapi page blank di production"

**Symptoms:**
- Build berhasil di Vercel
- Deploy success
- Tapi page blank / white screen

**Diagnosis:**
1. Buka browser console → cek error messages
2. Check Vercel function logs
3. Verify environment variables

**Common Causes:**
1. Missing environment variables
2. Client-side code di server component
3. API endpoint tidak reachable

**Fix:**
```bash
# 1. Check env vars di Vercel
vercel env ls

# 2. Add missing vars
vercel env add NEXT_PUBLIC_API_URL

# 3. Redeploy
vercel --prod
```

---

## 📋 TASK WORKFLOW - IKUTI URUTAN INI!

### Saat Diminta Fix Bug atau Add Feature:

**Step 1: UNDERSTAND THE REQUEST**
```
❓ What exactly is the problem?
❓ Which files are affected?
❓ Has this been fixed before?
```

**Step 2: CHECK EXISTING CODE**
```bash
# Check file yang akan diubah
cat [filename]

# Check related files
ls components/ | grep [related-pattern]

# Check git history
git log --oneline -- [filename]
```

**Step 3: PLAN THE FIX**
```
✅ What needs to be changed?
✅ Will this affect other components?
✅ Do I need to update imports elsewhere?
✅ Is this breaking existing functionality?
```

**Step 4: IMPLEMENT**
```
⚠️ Make minimal changes
⚠️ Follow existing patterns
⚠️ Don't refactor unless necessary
⚠️ Test as you go
```

**Step 5: VERIFY**
```bash
# Build test
npm run build

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# Dev test
npm run dev
# → Open localhost:5000 dan cek manual
```

**Step 6: COMMIT**
```bash
git add .
git commit -m "fix: [descriptive message]"
# atau
git commit -m "feat: [descriptive message]"
```

---

## 🎯 SPECIFIC INSTRUCTIONS PER FEATURE

### FITUR 1: Landing Page (SUDAH FIX!)

**Status:** ✅ SELESAI - Psychology components sudah aktif

**Yang SUDAH BENAR:**
- `app/page.tsx` menggunakan komponen `-psychology`
- Dark mode support
- Responsive design
- Hydration safe

**JANGAN UBAH kecuali ada bug spesifik!**

---

### FITUR 2: Konsultasi Hukum (TODO - HIGH PRIORITY!)

**Status:** 🚧 Perlu implementasi lengkap

**Requirements:**
1. User bisa chat dengan AI untuk pertanyaan hukum
2. AI menjawab dengan referensi pasal hukum Indonesia
3. Conversation history tersimpan
4. User bisa lihat riwayat konsultasi

**Implementation Plan:**

**A. Frontend (`app/konsultasi/page.tsx`):**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { EnhancedChatInterface } from '@/components/EnhancedChatInterface'
import { useRouter } from 'next/navigation'

export default function KonsultasiPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/login?redirect=/konsultasi')
      return
    }
    
    setIsAuthenticated(true)
    setUserId(JSON.parse(user).id)
  }, [router])
  
  if (!isAuthenticated) {
    return <div>Checking authentication...</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <EnhancedChatInterface userId={userId} />
    </div>
  )
}
```

**B. API Proxy (`app/api/consultation/chat/route.ts`):**
```typescript
export async function POST(req: Request) {
  const token = req.headers.get('Authorization')
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await req.json()
  
  // Proxy ke backend
  const response = await fetch(`${process.env.BACKEND_URL}/api/consultation/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(body)
  })
  
  const data = await response.json()
  return Response.json(data, { status: response.status })
}
```

**C. Backend (FastAPI - `backend/routes/consultation.py`):**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.consultation import Consultation
from services.ai_service import AIService
from auth.dependencies import get_current_user

router = APIRouter()

@router.post("/chat")
async def chat_consultation(
    message: str,
    consultation_id: Optional[str] = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get or create consultation
    if consultation_id:
        consultation = db.query(Consultation).filter(
            Consultation.id == consultation_id,
            Consultation.user_id == current_user.id
        ).first()
    else:
        consultation = Consultation(
            user_id=current_user.id,
            status='active'
        )
        db.add(consultation)
        db.commit()
    
    # Get AI response
    ai_service = AIService()
    response = await ai_service.get_legal_answer(
        message=message,
        conversation_history=consultation.messages
    )
    
    # Save to DB
    consultation.add_message({
        'role': 'user',
        'content': message,
        'timestamp': datetime.now()
    })
    consultation.add_message({
        'role': 'assistant',
        'content': response['answer'],
        'citations': response['citations'],
        'timestamp': datetime.now()
    })
    db.commit()
    
    return {
        'consultation_id': consultation.id,
        'answer': response['answer'],
        'citations': response['citations']
    }
```

**Testing Checklist:**
- [ ] User bisa buka /konsultasi setelah login
- [ ] Chat interface muncul dengan benar
- [ ] User bisa kirim pesan
- [ ] AI respond dengan jawaban + referensi pasal
- [ ] Conversation history tersimpan
- [ ] User bisa lihat riwayat di /dashboard

---

### FITUR 3: Authentication (SUDAH ADA - PERLU TESTING!)

**Status:** ✅ Frontend ada, 🚧 Backend perlu testing

**Files:**
- `app/login/page.tsx` ✅
- `app/register/page.tsx` ✅
- `app/api/auth/login/route.ts` 🚧 Perlu dibuat
- `app/api/auth/register/route.ts` 🚧 Perlu dibuat
- `backend/routes/auth.py` 🚧 Perlu testing

**Testing Steps:**
```bash
# 1. Test register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# 2. Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Test protected endpoint
curl http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer [token-from-login]"
```

---

## 💡 BEST PRACTICES - ALWAYS FOLLOW!

### 1. Code Organization
```
✅ One component per file
✅ Group related components in folders
✅ Use index.ts for exports
✅ Separate logic from UI (hooks, utils)
```

### 2. Naming Conventions
```typescript
// ✅ Components: PascalCase
export const HeroSection = () => {}

// ✅ Files: kebab-case
hero-section.tsx
enhanced-chat-interface.tsx

// ✅ Hooks: camelCase with 'use' prefix
export const useAuth = () => {}

// ✅ Utils: camelCase
export const formatDate = () => {}

// ✅ Constants: SCREAMING_SNAKE_CASE
export const API_BASE_URL = 'https://...'
```

### 3. Commit Messages
```bash
# ✅ GOOD
git commit -m "fix: resolve hydration error in hero section"
git commit -m "feat: add consultation chat interface"
git commit -m "refactor: extract chat logic to custom hook"
git commit -m "chore: update dependencies"

# ❌ BAD
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### 4. Code Comments
```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Using ClientOnlyWrapper to prevent hydration mismatch
// because localStorage is not available on server
<ClientOnlyWrapper>
  <UserPreferences />
</ClientOnlyWrapper>

// ❌ BAD: Obvious comments
// This is a button
<button>Click me</button>
```

### 5. Error Handling
```typescript
// ✅ GOOD
try {
  const response = await fetch('/api/...')
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  const data = await response.json()
  return data
} catch (error) {
  console.error('Failed to fetch data:', error)
  // Show user-friendly message
  toast.error('Gagal memuat data. Silakan coba lagi.')
  return null
}

// ❌ BAD
const data = await fetch('/api/...').then(r => r.json())  // No error handling!
```

---

## 🆘 WHEN TO ASK FOR HELP

**ASK GitHub Copilot / me WHEN:**
- ❓ Tidak yakin approach yang benar
- ❓ Ada error yang sudah di-Google tapi belum ketemu solusi
- ❓ Perlu refactor code yang kompleks
- ❓ Mau implement fitur baru yang belum pernah ada
- ❓ Butuh review sebelum commit changes besar

**JANGAN LANGSUNG UBAH WHEN:**
- ⚠️ Ada file dengan suffix `-psychology`, `-backup`, `-original-backup`
- ⚠️ File yang ada comment `// ✅ FIXED` atau `// DO NOT MODIFY`
- ⚠️ Config files tanpa alasan jelas (next.config.js, tsconfig.json, tailwind.config.js)
- ⚠️ Ada dokumentasi seperti FIXES_APPLIED.md atau IMPLEMENTATION_COMPLETE.md

**ALWAYS CHECK FIRST:**
- 📝 Apakah ada dokumentasi terkait di `docs/` atau root folder?
- 📝 Apakah issue yang mau di-fix sudah ter-resolve sebelumnya?
- 📝 Apakah ada test file yang perlu diupdate?

---

## 📞 PROJECT RESOURCES

- **Repository:** https://github.com/yhyaa294/pasalku-ai
- **Branch:** main
- **Frontend (when deployed):** https://pasalku.vercel.app
- **Backend (when deployed):** https://pasalku-backend.railway.app
- **API Docs:** https://pasalku-backend.railway.app/docs (FastAPI auto-generated)

---

## 🎓 LEARNING REFERENCES

Jika perlu referensi:
- **Next.js 15 Docs:** https://nextjs.org/docs
- **App Router:** https://nextjs.org/docs/app
- **Server Components:** https://nextjs.org/docs/app/building-your-application/rendering/server-components
- **FastAPI:** https://fastapi.tiangolo.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **React Hooks:** https://react.dev/reference/react

---

## 🚀 QUICK COMMANDS REFERENCE

```bash
# Development
npm run dev                    # Start dev server (localhost:5000)
npm run build                  # Test production build
npm run lint                   # Check linting
npx tsc --noEmit              # TypeScript check

# Backend
cd backend
source venv/bin/activate       # Linux/Mac
.\venv\Scripts\Activate.ps1    # Windows
uvicorn app:app --reload       # Start backend (localhost:8000)

# Git
git status                     # Check changes
git diff                       # See changes
git add .                      # Stage all
git commit -m "message"        # Commit
git push origin main           # Push to GitHub

# Vercel
vercel                         # Deploy preview
vercel --prod                  # Deploy production
vercel logs                    # View logs
vercel env ls                  # List env vars
```

---

## 🎯 CURRENT PROJECT STATUS

### ✅ SUDAH SELESAI:
- [x] Landing page dengan psychology-driven design
- [x] Dark mode implementation (fully working)
- [x] Responsive navigation dengan dark mode toggle
- [x] Enhanced footer dengan social links
- [x] Authentication UI (login & register pages)
- [x] Dashboard UI
- [x] Hydration error fixes dengan ClientOnlyWrapper
- [x] TypeScript strict mode compliance

### 🚧 SEDANG DIKERJAKAN:
- [ ] Deploy ke Vercel (frontend)
- [ ] Deploy backend ke Railway
- [ ] Setup environment variables
- [ ] Testing authentication flow end-to-end

### 📋 TODO (PRIORITAS):
1. **HIGH:** Implementasi lengkap konsultasi hukum feature
   - Backend AI service integration
   - Chat interface connection
   - Save conversation history
   
2. **HIGH:** Setup API proxy routes untuk semua endpoints
   - `/api/auth/*`
   - `/api/consultation/*`
   - `/api/user/*`

3. **MEDIUM:** Payment integration (GoPay/OVO)
4. **MEDIUM:** Admin dashboard
5. **MEDIUM:** Email notifications
6. **LOW:** WhatsApp integration
7. **LOW:** Analytics dashboard

---

## ⚡ EMERGENCY PROCEDURES

### Jika Build Failed di Vercel:
1. Check Vercel deployment logs
2. Try `npm run build` locally
3. Fix TypeScript/ESLint errors
4. Check missing dependencies in package.json
5. Verify environment variables
6. Check Node version compatibility

### Jika Page Blank di Production:
1. Open browser DevTools → Console
2. Check Network tab for failed requests
3. Verify API endpoints are reachable
4. Check Vercel function logs
5. Verify environment variables in Vercel dashboard

### Jika Backend API Error:
1. Check backend logs in Railway/Render
2. Verify CORS settings
3. Test endpoint dengan curl/Postman
4. Check database connection
5. Verify JWT token validity

---

## 🎯 FINAL REMINDER

**INGAT SELALU:**

1. **JANGAN UBAH FILE YANG SUDAH FIX** kecuali ada bug jelas
2. **CEK DULU** sebelum buat komponen baru - mungkin sudah ada
3. **TEST BUILD** sebelum commit
4. **DARK MODE** wajib di semua komponen
5. **HYDRATION SAFE** - pakai ClientOnlyWrapper jika perlu
6. **TUJUAN UTAMA:** Fitur konsultasi hukum harus berfungsi sempurna!

---

**Saat ini priority #1 adalah:** Memastikan deployment berjalan lancar dan fitur konsultasi hukum berfungsi end-to-end.

**Status terakhir yang diketahui:**
- ✅ Landing page SUDAH BENAR dengan komponen psychology
- ✅ Build success di local
- ✅ Server running di localhost:5000
- 🚧 Belum deploy ke Vercel
- 🚧 Backend belum fully tested

**Next steps:**
1. Pastikan semua API proxy routes sudah dibuat
2. Test authentication flow
3. Implement consultation feature
4. Deploy ke Vercel + Railway
5. End-to-end testing

---

**GOOD LUCK! 🚀**

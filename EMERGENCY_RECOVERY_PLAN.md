# 🚨 EMERGENCY RECOVERY PLAN - PASALKU.AI

**Status:** CRITICAL - Kode Lokal Sempurna, GitHub Rusak  
**Action:** Force Push & Full Recovery  
**Date:** November 5, 2025 05:30 WIB

---

## ⚠️ SITUASI SAAT INI

### 🟢 LOKAL (SEMPURNA)
- **Location:** `C:\Users\YAHYA\pasalku-ai-3`
- **Status:** Kode 1-2 minggu lalu, 96+ fitur, production-ready 85%
- **Condition:** ✅ BAGUS - Ini adalah "KODE EMAS" Anda

### 🔴 REMOTE/GITHUB (RUSAK)
- **Location:** GitHub origin/main
- **Status:** Kode 1 bulan lalu, rusak, banyak error
- **Condition:** ❌ BURUK - Perlu di-overwrite

### 🔴 VERCEL (DEPLOY KODE RUSAK)
- **URL:** https://pasalku-ai.vercel.app
- **Status:** Deploy dari GitHub yang rusak
- **Condition:** ❌ TAMPILAN JELEK - Akan fixed setelah GitHub diperbaiki

---

## 🎯 RENCANA PENYELAMATAN (6 LANGKAH KRITIS)

### ⚡ LANGKAH 1: BACKUP KODE EMAS (WAJIB!)

**SEBELUM APAPUN, BACKUP DULU!**

#### Option A: Manual Backup (RECOMMENDED)
1. Buka File Explorer
2. Navigate ke `C:\Users\YAHYA\`
3. Klik kanan folder `pasalku-ai-3`
4. Pilih **Copy**
5. Paste ke lokasi aman:
   - Desktop: `C:\Users\YAHYA\Desktop\BACKUP_PASALKU_AI_5NOV2025`
   - USB Drive: `D:\BACKUP_PASALKU_AI_5NOV2025`
   - OneDrive/Google Drive untuk extra safety

#### Option B: Command Line Backup

```powershell
# Buka PowerShell
# Copy ke Desktop
xcopy "C:\Users\YAHYA\pasalku-ai-3" "C:\Users\YAHYA\Desktop\BACKUP_PASALKU_AI_5NOV2025" /E /I /H

# Atau buat ZIP
Compress-Archive -Path "C:\Users\YAHYA\pasalku-ai-3" -DestinationPath "C:\Users\YAHYA\Desktop\BACKUP_PASALKU_AI_5NOV2025.zip"
```

#### ✅ Verification Checklist
- [ ] Backup folder created
- [ ] Backup size similar to original (~500MB - 2GB)
- [ ] Can open files in backup folder
- [ ] Backup is in safe location (not same drive)

**🚨 TIDAK BOLEH LANJUT KE LANGKAH 2 SEBELUM BACKUP SELESAI!**

---

### ⚡ LANGKAH 2: FORCE PUSH KE GITHUB

**Tujuan:** Overwrite GitHub dengan kode lokal yang sempurna

#### Step 2.1: Buka Terminal di Project Folder

```powershell
# Buka PowerShell
cd C:\Users\YAHYA\pasalku-ai-3
```

#### Step 2.2: Verify Git Status

```bash
# Check current branch
git branch
# You should see: * main (or * master)

# Check status
git status
# Note: Might show "Your branch and origin/main have diverged"
```

#### Step 2.3: Check Remote Connection

```bash
# Verify GitHub remote
git remote -v
# Should show:
# origin  https://github.com/yhyaa294/pasalku-ai.git (fetch)
# origin  https://github.com/yhyaa294/pasalku-ai.git (push)
```

#### Step 2.4: FORCE PUSH (CRITICAL COMMAND)

**⚠️ WARNING: This will PERMANENTLY overwrite GitHub history!**

```bash
# Method 1: Standard Force Push (Most Common)
git push origin main --force

# Method 2: Force with Lease (Slightly Safer)
git push origin main --force-with-lease

# If your branch is 'master' instead of 'main':
git push origin master --force
```

#### What Happens:
- ✅ Local code (perfect) uploads to GitHub
- ✅ Remote code (broken) gets overwritten
- ✅ GitHub now matches your local
- ⏳ Vercel will auto-detect and start redeploying

#### Common Errors & Solutions:

**Error 1: "Permission denied"**
```bash
# Solution: Login to GitHub CLI
gh auth login
# Or configure Git credentials
```

**Error 2: "Protected branch"**
```bash
# Solution: Go to GitHub → Settings → Branches → Remove protection temporarily
```

**Error 3: "Remote contains work that you do not have"**
```bash
# This is expected! That's why we're force pushing
# Just proceed with --force
```

#### ✅ Verification
1. Go to GitHub: https://github.com/yhyaa294/pasalku-ai
2. Refresh page (Ctrl + F5)
3. Check commit date - should be recent (1-2 weeks ago)
4. Check file structure - should match your local

---

### ⚡ LANGKAH 3: TRIGGER VERCEL REDEPLOY

**Tujuan:** Make Vercel build from new GitHub code

#### Step 3.1: Check Auto Deploy

1. Open Vercel Dashboard: https://vercel.com/dashboard
2. Find your project: `pasalku-ai`
3. Check "Deployments" tab
4. Look for new deployment with "Building..." status

**Expected:** Vercel auto-deploys within 1-2 minutes of GitHub push

#### Step 3.2: Manual Redeploy (If Needed)

If auto-deploy doesn't trigger:

1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Find latest deployment
4. Click "..." menu (three dots)
5. Select "Redeploy"
6. Confirm

#### Step 3.3: Monitor Build Progress

Watch for:
- ✅ "Building" → "Running checks" → "Ready"
- ⏱️ Usually takes 3-5 minutes
- 📧 Email notification when complete

#### ✅ Verification
```bash
# After build completes, test these URLs:
https://pasalku-ai.vercel.app
https://pasalku-ai.vercel.app/api/health

# Should show NEW version, not old broken version
```

---

### ⚡ LANGKAH 4: CONFIGURE VERCEL ENVIRONMENT VARIABLES

**Tujuan:** Make backend APIs work in production

#### Step 4.1: Prepare Your API Keys

Collect these keys (from your local `.env`):

```bash
# AI Services
ARK_API_KEY=your_ark_key_here
GROQ_API_KEY=your_groq_key_here

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Database
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/pasalku_ai
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pasalku_ai

# Security
SECRET_KEY=your-secret-key-here

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

#### Step 4.2: Add to Vercel

1. **Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Add each variable:**
   - Click "Add New"
   - Name: `ARK_API_KEY`
   - Value: `your_actual_key`
   - Environment: Check all (Production, Preview, Development)
   - Click "Save"

3. **Repeat for ALL variables** (minimum 10 critical ones)

#### Step 4.3: Redeploy After Adding Variables

**IMPORTANT:** Environment variables only apply to NEW deployments!

```bash
# Go back to Deployments tab
# Click "Redeploy" again
# This time with all env vars configured
```

#### ✅ Verification
```bash
# Test API endpoints after redeploy:
curl https://pasalku-ai.vercel.app/api/health
# Should return: {"status": "healthy", ...}

# Test AI endpoint:
curl https://pasalku-ai.vercel.app/api/v1/chat/test
# Should NOT return "API key missing" error
```

---

### ⚡ LANGKAH 5: RUN DATABASE MIGRATIONS

**Tujuan:** Create correct database schema in production

#### Step 5.1: Configure Production Database URL

**Option A: Use Neon PostgreSQL (Recommended)**

1. Go to https://neon.tech/
2. Create free account
3. Create new project: "pasalku-ai-prod"
4. Copy connection string
5. Add to Vercel env vars:
   ```
   DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/pasalku_ai
   ```

**Option B: Use Existing PostgreSQL**

If you already have PostgreSQL, just get the connection string.

#### Step 5.2: Run Migrations from Local

```bash
# Open terminal in project root
cd C:\Users\YAHYA\pasalku-ai-3\backend

# Make sure you have production DATABASE_URL in .env
# Or set it temporarily:
$env:DATABASE_URL="postgresql://user:pass@host.neon.tech:5432/pasalku_ai"

# Run migration
python -m alembic upgrade head
```

#### Expected Output:
```
INFO  [alembic.runtime.migration] Running upgrade -> abc123
INFO  [alembic.runtime.migration] Running upgrade abc123 -> def456
```

#### Step 5.3: Verify Migration

```bash
# Connect to database and check tables
python backend/simple_db_test.py

# Or use SQL client to verify tables exist:
# - users
# - conversations
# - messages
# - subscriptions
# etc.
```

#### ✅ Verification
- [ ] Migration commands ran without errors
- [ ] Database tables created
- [ ] Can create test user
- [ ] Login works on live site

---

### ⚡ LANGKAH 6: BUILD MISSING UI COMPONENTS

**Tujuan:** Make all 96+ features accessible from frontend

#### 6.1: Create Features Navigation Sidebar

**File to Create:** `components/FeaturesNavigationSidebar.tsx`

I'll create this component for you (see next section)

#### 6.2: Create Analytics Dashboard Frontend

**File to Create:** `app/analytics/dashboard/page.tsx`

I'll create this component for you (see next section)

#### 6.3: Enhance Admin Panel

**Files to Update:**
- `app/admin/dashboard/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/verification/page.tsx`

I'll enhance these for you (see next section)

---

## 📋 COMPLETE RECOVERY CHECKLIST

### Pre-Recovery
- [ ] Backup created at safe location
- [ ] Backup verified (can open files)
- [ ] Git installed and configured
- [ ] Terminal/PowerShell ready

### GitHub Recovery
- [ ] Force push successful
- [ ] GitHub shows new code (refresh page)
- [ ] Commit history matches local
- [ ] Repository looks correct

### Vercel Deployment
- [ ] Auto-deploy triggered OR manual redeploy done
- [ ] Build status shows "Ready"
- [ ] No build errors in logs
- [ ] Website loads (even if some APIs fail)

### Environment Configuration
- [ ] All API keys collected
- [ ] ARK_API_KEY added to Vercel
- [ ] GROQ_API_KEY added to Vercel
- [ ] CLERK keys added to Vercel
- [ ] STRIPE keys added to Vercel
- [ ] DATABASE_URL added to Vercel
- [ ] Redeployed after adding env vars
- [ ] API endpoints working

### Database Setup
- [ ] Production database created (Neon/PostgreSQL)
- [ ] Connection string obtained
- [ ] Migrations ran successfully
- [ ] Tables created in database
- [ ] Test data inserted successfully

### Frontend Enhancements
- [ ] Features navigation component created
- [ ] Analytics dashboard built
- [ ] Admin panel enhanced
- [ ] All components deployed
- [ ] Navigation working on live site

---

## 🆘 TROUBLESHOOTING

### Problem: Force Push Rejected

```bash
# Error: "Updates were rejected"
# Solution: Make sure you're using --force flag
git push origin main --force

# If still fails, check:
git remote -v  # Verify remote URL
gh auth login  # Re-authenticate
```

### Problem: Vercel Build Fails

```bash
# Check Vercel build logs for errors
# Common issues:
# 1. Missing dependencies → Add to package.json
# 2. TypeScript errors → Fix in code
# 3. Environment vars → Add in Vercel settings
# 4. Build timeout → Optimize build
```

### Problem: Database Connection Fails

```bash
# Check:
# 1. DATABASE_URL format correct
# 2. Database server accessible from internet
# 3. IP whitelist (some DBs require this)
# 4. Database user has correct permissions
```

### Problem: API Keys Not Working

```bash
# Verify:
# 1. Keys added to Vercel (not just local .env)
# 2. Redeployed after adding keys
# 3. Keys valid and not expired
# 4. API usage limits not exceeded
```

---

## 📊 EXPECTED TIMELINE

```
Langkah 1 (Backup):              10 minutes
Langkah 2 (Force Push):           5 minutes
Langkah 3 (Vercel Redeploy):     10 minutes
Langkah 4 (Env Variables):       30 minutes
Langkah 5 (Database Migration):  15 minutes
Langkah 6 (UI Components):       2-4 hours

TOTAL RECOVERY TIME: 3-5 hours
```

---

## 🎯 SUCCESS CRITERIA

Platform fully recovered when:
- ✅ GitHub shows correct code
- ✅ Vercel deploys successfully
- ✅ Website loads without errors
- ✅ All API endpoints respond
- ✅ Login/auth works
- ✅ Database connected
- ✅ Features accessible from UI
- ✅ Analytics dashboard functional

---

## 📞 EMERGENCY CONTACTS

If you get stuck:
1. **Check logs:** Vercel Dashboard → Deployment → Logs
2. **GitHub issues:** Check if force push succeeded
3. **Database:** Verify connection string
4. **API keys:** Double-check they're in Vercel

---

**READY TO START?**

1. ✅ Read this entire document
2. ✅ Prepare all API keys
3. ✅ Create backup
4. ✅ Execute Langkah 2 (Force Push)
5. ✅ Follow remaining steps

**Let's save your project! 🚀**

---

**Created:** November 5, 2025 05:30 WIB  
**Status:** READY TO EXECUTE  
**Priority:** 🚨 CRITICAL

# 🚂 STEP 5: DEPLOY BACKEND TO RAILWAY

**Time Required:** 15 minutes  
**Priority:** 🔴 CRITICAL FOR AI FEATURES  
**Prerequisite:** ✅ Frontend deployed and loading (STEP 4)  
**Status:** ⏳ Ready to deploy

---

## 🎯 **WHAT THIS ENABLES**

After backend deployment:
- ✅ AI consultation works
- ✅ Chat features functional
- ✅ User data saves to database
- ✅ All 96+ features become accessible
- ✅ API endpoints respond

---

## 📋 **PREPARATION**

### **Before You Start:**

1. **Create Railway Account**
   - Go to: https://railway.app/
   - Click "Login with GitHub"
   - Authorize Railway to access your GitHub

2. **Install Railway CLI**
   ```powershell
   npm install -g @railway/cli
   ```
   
   Wait for installation to complete (~1 minute)

3. **Verify Installation**
   ```powershell
   railway --version
   ```
   
   Should output something like: `railway version 3.x.x`

---

## 🎯 **STEP-BY-STEP DEPLOYMENT**

### **1. Navigate to Backend Folder**

```powershell
cd C:\Users\YAHYA\pasalku-ai-3\backend
```

### **2. Login to Railway**

```powershell
railway login
```

**What happens:**
1. Browser opens automatically
2. Shows: "CLI wants to access your account"
3. Click **Confirm**
4. Browser shows: "You can close this window"
5. Return to PowerShell

**Verify login:**
```powershell
railway whoami
```

Should show your GitHub username.

---

### **3. Initialize Railway Project**

```powershell
railway init
```

**You'll be prompted:**

```
? Enter project name: pasalku-ai-backend
? Environment: production
? Do you want to link to an existing project? No
```

**Press Enter** for each option.

---

### **4. Deploy to Railway**

```powershell
railway up
```

**What happens:**
1. Railway reads your `requirements.txt`
2. Detects it's a Python project
3. Builds Docker container
4. Deploys to cloud
5. Gives you a URL

**Wait time:** 3-5 minutes

**Expected output:**
```
✓ Building...
✓ Deployment successful
✓ Available at: https://pasalku-ai-backend-production-abc123.up.railway.app
```

**IMPORTANT:** Copy this URL! You'll need it.

---

### **5. Configure Environment Variables on Railway**

1. **Open Railway Dashboard**
   - Go to: https://railway.app/dashboard
   - Click on your project: `pasalku-ai-backend`

2. **Go to Variables Tab**
   - Click **Variables** in the left sidebar

3. **Add Required Variables:**

Click **+ New Variable** for each:

```env
# AI Service Keys
ARK_API_KEY=your_byteplus_ark_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/dbname

# MongoDB (Optional but recommended)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pasalku

# JWT Authentication
SECRET_KEY=your_super_secret_random_string_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=production
PROJECT_NAME=Pasalku.ai Backend

# CORS - Allow Vercel frontend
CORS_ORIGINS=https://pasalku-ai.vercel.app,http://localhost:3000

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here
```

4. **Click Deploy** (if prompted)

---

## 🔑 **WHERE TO GET DATABASE URL**

### **Neon PostgreSQL (Recommended - FREE):**

1. Go to: https://neon.tech/
2. Sign up / Login with GitHub
3. Click **Create Project**
4. Name: `pasalku-production`
5. Region: **Singapore** (closest to Indonesia)
6. Click **Create Project**

7. **Copy Connection String:**
   - Find "Connection string"
   - Click to reveal
   - Copy the full URL:
   ```
   postgresql://username:password@hostname.neon.tech:5432/database
   ```

8. **Add to Railway:**
   - Variable name: `DATABASE_URL`
   - Value: Paste the connection string

**Free tier:** ✅ 0.5GB storage, sufficient for testing

---

### **MongoDB (Optional but Recommended):**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up / Login
3. Create **Free Cluster** (M0)
4. Region: **Singapore**
5. Wait for cluster to deploy (2-3 minutes)

6. **Get Connection String:**
   - Click **Connect**
   - Choose **Connect your application**
   - Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/pasalku
   ```

7. **Create database user:**
   - Go to **Database Access**
   - Add new user
   - Username: `pasalku_admin`
   - Password: Generate secure password
   - User Privileges: **Read and write to any database**

**Free tier:** ✅ 512MB storage

---

## 🚀 **AFTER CONFIGURATION**

### **6. Redeploy Backend**

Railway should auto-deploy when you add variables, but to be sure:

1. In Railway Dashboard
2. Go to **Deployments** tab
3. Click **Deploy** button (if available)
4. Wait for deployment (~2 minutes)

---

### **7. Test Backend**

Once deployed, test these endpoints:

```bash
# Replace with YOUR Railway URL
https://your-backend.up.railway.app
```

**Test 1: Root Endpoint**
- Open in browser: `https://your-backend.up.railway.app`
- Should show: API homepage with documentation links

**Test 2: Health Check**
- Open: `https://your-backend.up.railway.app/api/health`
- Should return JSON:
```json
{
  "status": "ok",
  "environment": "production",
  "ai_service_available": true/false,
  "databases": {...}
}
```

**Test 3: API Docs**
- Open: `https://your-backend.up.railway.app/api/docs`
- Should show Swagger UI with all endpoints

---

### **8. Update Vercel with Backend URL**

1. Go to **Vercel Dashboard**
2. Project: `pasalku-ai`
3. **Settings** → **Environment Variables**
4. Find: `NEXT_PUBLIC_API_URL`
5. Edit value to your Railway URL:
   ```
   https://your-backend.up.railway.app
   ```
6. Click **Save**
7. **Redeploy** frontend

---

## ✅ **VERIFICATION**

After all steps complete:

### **Backend Tests:**
- [ ] Railway deployment shows "Active"
- [ ] Root URL loads API homepage
- [ ] `/api/health` returns JSON with status OK
- [ ] `/api/docs` shows Swagger UI
- [ ] Environment variables are set

### **Integration Test:**
- [ ] Frontend can reach backend
- [ ] Login flow completes
- [ ] Dashboard loads after login

---

## 🆘 **TROUBLESHOOTING**

### **Problem: Railway CLI not found**

**Solution:**
```powershell
# Reinstall Railway CLI
npm uninstall -g @railway/cli
npm install -g @railway/cli

# Verify
railway --version
```

---

### **Problem: "No such file or directory" during deploy**

**Cause:** Not in backend folder

**Solution:**
```powershell
# Make sure you're in the right place
cd C:\Users\YAHYA\pasalku-ai-3\backend
pwd  # Should show: ...pasalku-ai-3/backend

# Try railway up again
railway up
```

---

### **Problem: Deployment fails with "requirements.txt not found"**

**Cause:** Railway can't find Python dependencies

**Solution:**
```powershell
# Verify requirements.txt exists
ls requirements.txt

# If missing, copy from backup or create new one
# Then deploy again
railway up
```

---

### **Problem: Backend shows 500 errors**

**Cause:** Missing environment variables or database connection failed

**Solution:**
1. Check Railway logs:
   - Dashboard → Deployments → Click latest → View Logs
2. Look for error messages
3. Common issues:
   - `DATABASE_URL` not set or invalid
   - `ARK_API_KEY` missing
   - Database connection refused

**Fix:**
- Verify all environment variables are set
- Test database connection string separately
- Check database is running and accessible

---

### **Problem: CORS errors when frontend tries to access backend**

**Cause:** CORS_ORIGINS not configured

**Solution:**
```env
# In Railway variables, make sure you have:
CORS_ORIGINS=https://pasalku-ai.vercel.app,http://localhost:3000
```

Then redeploy.

---

## 📊 **WHAT SHOULD WORK NOW**

After Step 5 complete:

| Feature | Status | Notes |
|---------|--------|-------|
| Frontend | ✅ Works | From Step 4 |
| Backend API | ✅ Works | New! |
| Health Check | ✅ Works | API responding |
| Swagger Docs | ✅ Works | API documented |
| AI Features | ⚠️ Partial | Needs database (Step 6) |
| User Auth | ⚠️ Partial | Needs database |
| Chat Save | ❌ Not yet | Needs database migrations |

---

## ⏭️ **NEXT STEP**

Once backend is deployed and healthy:

1. ✅ Verify backend URL works
2. ✅ Test health endpoint returns OK
3. ✅ Update Vercel with backend URL
4. ✅ Mark this task as complete
5. ⏭️ Move to **STEP 6: Run Database Migrations**

Create file: `STEP_6_DATABASE_MIGRATIONS.md`

---

## 🎊 **CONGRATULATIONS!**

If backend is running:
- ✅ Platform is 80% functional!
- ✅ API is accessible
- ✅ AI service connected
- ✅ Almost ready for production!

**Final step:** Database migrations (Step 6) - Then you're DONE! 🚀

---

**Next Step:** Run Database Migrations (STEP 6)

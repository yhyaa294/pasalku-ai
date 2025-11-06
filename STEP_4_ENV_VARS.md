# ⚙️ STEP 4: CONFIGURE VERCEL ENVIRONMENT VARIABLES

**Time Required:** 10 minutes  
**Priority:** 🔴 CRITICAL FOR SITE TO WORK  
**Prerequisite:** ✅ Vercel auto-deploy completed (STEP 3)  
**Status:** ⏳ Ready to configure

---

## 🎯 **WHAT THIS FIXES**

After adding environment variables:
- ✅ White page → Working landing page
- ✅ Application error → Functional site
- ✅ Features will start working
- ✅ Site connects to backend (when deployed)

---

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

### **CRITICAL (Site won't work without these):**

```env
# App URL
NEXT_PUBLIC_APP_URL=https://pasalku-ai.vercel.app

# Backend API (will set after Step 5)
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_here
```

### **IMPORTANT (For payments & features):**

```env
# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
NEXT_PUBLIC_STRIPE_PRICE_ID=price_your_price_id

# Sentry Error Tracking (Optional but recommended)
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here
```

### **OPTIONAL (For analytics):**

```env
# Analytics
NEXT_PUBLIC_STATSIG_CLIENT_KEY=client_key_here
NEXT_PUBLIC_HYPERTUNE_TOKEN=token_here
```

---

## 🎯 **STEP-BY-STEP INSTRUCTIONS**

### **1. Go to Vercel Dashboard**

1. Open browser
2. Go to: https://vercel.com/dashboard
3. Login if needed
4. Click on your project: **pasalku-ai**

### **2. Navigate to Settings**

1. Click **Settings** tab (top menu)
2. Click **Environment Variables** in left sidebar

### **3. Add Variables One by One**

For EACH variable:

1. Click **Add New** button
2. Fill in:
   - **Key:** Variable name (e.g., `NEXT_PUBLIC_APP_URL`)
   - **Value:** The actual value
   - **Environment:** Select **All** (Production, Preview, Development)
3. Click **Save**

**Repeat for all variables!**

---

## 🔑 **WHERE TO GET API KEYS**

### **Clerk Authentication:**

1. Go to: https://clerk.com/
2. Login to your account (or create free account)
3. Create new application: "Pasalku AI"
4. Go to **API Keys** section
5. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

**Free tier:** ✅ Sufficient for testing

---

### **Stripe Payments:**

1. Go to: https://dashboard.stripe.com/
2. Login to your account (or create free account)
3. Click **Developers** → **API keys**
4. Copy:
   - `Publishable key` (starts with `pk_test_`)
   - `Secret key` (click "Reveal" then copy, starts with `sk_test_`)
5. For `NEXT_PUBLIC_STRIPE_PRICE_ID`:
   - Go to **Products** → Create a product
   - Set price (e.g., Rp 199,000/month)
   - Copy the Price ID (starts with `price_`)

**Test mode:** ✅ Use test keys for now

---

### **Sentry Error Tracking (Optional):**

1. Go to: https://sentry.io/
2. Login or create free account
3. Create new project: "Pasalku AI"
4. Platform: **Next.js**
5. Copy the **DSN** (looks like: `https://abc123@o123.ingest.sentry.io/456`)

**Free tier:** ✅ 5,000 errors/month

---

## 📝 **EXAMPLE CONFIGURATION**

Here's what it looks like in Vercel:

```
Key: NEXT_PUBLIC_APP_URL
Value: https://pasalku-ai.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development

Key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  
Value: pk_test_abc123def456...
Environments: ✓ Production ✓ Preview ✓ Development

Key: CLERK_SECRET_KEY
Value: sk_test_xyz789uvw012...
Environments: ✓ Production ✓ Preview ✓ Development

... and so on for each variable
```

---

## 🚀 **AFTER ADDING ALL VARIABLES**

### **4. Redeploy**

1. Go to **Deployments** tab
2. Find the latest deployment (should say "Ready")
3. Click the **...** (three dots) menu
4. Click **Redeploy**
5. **IMPORTANT:** Uncheck "Use existing Build Cache"
6. Click **Redeploy** button

**Why redeploy?**
- Environment variables only apply to NEW deployments
- Must rebuild to use the new variables

---

## ✅ **VERIFICATION**

### **After Redeploy Completes (5-10 minutes):**

1. **Visit your site:**
   - https://pasalku-ai.vercel.app

2. **You should see:**
   - ✅ Landing page loads (no white screen!)
   - ✅ Navigation works
   - ✅ Images display
   - ✅ Animations run smoothly
   - ✅ No console errors about missing env vars

3. **Open Console (F12):**
   - Should see minimal errors
   - No "undefined environment variable" errors

4. **Test a feature:**
   - Click "Login" button
   - Should redirect to Clerk login page
   - This confirms Clerk integration works!

---

## 🆘 **TROUBLESHOOTING**

### **Problem: Still showing white page**

**Check:**
1. Did you click "Redeploy"?
2. Did you wait for redeploy to complete?
3. Try hard refresh: `Ctrl + Shift + R`
4. Check browser console for errors

**Solution:**
```
1. Go to Vercel → Deployments
2. Click latest deployment
3. Check "Build Logs" for errors
4. Look for "Environment variable X is not defined"
5. Add the missing variable
6. Redeploy again
```

---

### **Problem: Login button doesn't work**

**Cause:** Clerk not configured correctly

**Check:**
1. Is `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set?
2. Is `CLERK_SECRET_KEY` set?
3. Are the keys valid (not expired)?

**Solution:**
1. Go to Clerk dashboard
2. Verify keys are correct
3. Copy fresh keys
4. Update in Vercel
5. Redeploy

---

### **Problem: "Failed to fetch" errors**

**Cause:** Backend not deployed yet

**This is OK!**
- Backend features won't work until Step 5
- Landing page should still load
- Static content should work
- Login should redirect to Clerk

**Solution:**
- Continue to Step 5 (Deploy Backend)

---

## 📊 **WHAT SHOULD WORK NOW**

After Step 4 complete:

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | ✅ Works | Should load fully |
| Navigation | ✅ Works | Menu links functional |
| Login/Register | ✅ Works | Redirects to Clerk |
| Static Content | ✅ Works | Text, images, animations |
| Backend Features | ❌ Not yet | Need Step 5 |
| AI Chat | ❌ Not yet | Need Step 5 |
| Database | ❌ Not yet | Need Step 6 |

---

## 🎯 **MINIMAL WORKING CONFIGURATION**

If you want to test quickly, use just these 3:

```env
NEXT_PUBLIC_APP_URL=https://pasalku-ai.vercel.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_secret
```

This is enough to:
- ✅ Load landing page
- ✅ Enable login/register
- ✅ Navigate site

You can add Stripe, Sentry, etc. later.

---

## ⏭️ **NEXT STEP**

Once Vercel redeploy is complete and site loads:

1. ✅ Verify landing page loads
2. ✅ Test login redirect works
3. ✅ Mark this task as complete
4. ⏭️ Move to **STEP 5: Deploy Backend to Railway**

Create file: `STEP_5_DEPLOY_BACKEND.md`

---

## 🎊 **CONGRATULATIONS!**

If your site is now loading:
- ✅ You've rescued the platform!
- ✅ Your "Ferrari" code is live
- ✅ Frontend is working
- ✅ 60% complete!

**Remaining:**
- ⏳ Deploy backend (Step 5)
- ⏳ Connect database (Step 6)

**You're almost there!** 🚀

---

**Next Step:** Deploy Backend to Railway (STEP 5)

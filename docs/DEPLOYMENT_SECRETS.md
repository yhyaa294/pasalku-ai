# 🔐 Deployment Secrets Configuration Guide

## GitHub Actions Secrets Setup

Navigate to: `https://github.com/yhyaa294/pasalku-ai/settings/secrets/actions`

### Required Secrets for CI/CD

#### Frontend Deployment (Vercel)

1. **VERCEL_TOKEN**
   - **Description:** Vercel authentication token for deployments
   - **How to Get:**
     ```bash
     # Install Vercel CLI
     npm install -g vercel
     
     # Login and get token
     vercel login
     vercel tokens create pasalku-ci-cd
     ```
   - **Value Format:** `ABC123xyz...` (alphanumeric string)
   - **Required For:** `deploy-production` job in main-ci-cd.yml

2. **VERCEL_ORG_ID**
   - **Description:** Your Vercel organization/team ID
   - **How to Get:**
     ```bash
     # Get from Vercel project settings or:
     vercel link
     cat .vercel/project.json
     ```
   - **Value Format:** `team_abc123xyz` or `user_abc123xyz`
   - **Location:** `.vercel/project.json` → `orgId`

3. **VERCEL_PROJECT_ID**
   - **Description:** Vercel project ID for pasalku-ai
   - **How to Get:**
     ```bash
     # From .vercel/project.json after running:
     vercel link
     ```
   - **Value Format:** `prj_abc123xyz...`
   - **Location:** `.vercel/project.json` → `projectId`

---

#### Backend Deployment (Railway)

4. **RAILWAY_TOKEN**
   - **Description:** Railway API token for backend deployments
   - **How to Get:**
     1. Go to https://railway.app/account/tokens
     2. Click "Create Token"
     3. Name: "pasalku-ci-cd"
     4. Copy the generated token
   - **Value Format:** `railway_abc123...`
   - **Required For:** `deploy-production` job

5. **RAILWAY_PROJECT_ID** (Optional)
   - **Description:** Railway project ID
   - **How to Get:**
     ```bash
     # Install Railway CLI
     npm install -g @railway/cli
     
     # Login and link project
     railway login
     railway link
     railway status
     ```
   - **Value Format:** `abc123-def456-ghi789`

---

#### Monitoring & Notifications

6. **SLACK_WEBHOOK** (Optional but Recommended)
   - **Description:** Slack webhook URL for deployment notifications
   - **How to Get:**
     1. Go to https://api.slack.com/apps
     2. Create new app → "From scratch"
     3. Enable "Incoming Webhooks"
     4. Add webhook to workspace
     5. Copy webhook URL
   - **Value Format:** `https://hooks.slack.com/services/T00/B00/XXX`
   - **Usage:** CI/CD pipeline sends deployment status updates

7. **SENTRY_DSN** (Already in code, verify in secrets)
   - **Description:** Sentry project DSN for error tracking
   - **How to Get:**
     1. Go to https://sentry.io
     2. Create project "pasalku-ai-backend"
     3. Copy DSN from project settings
   - **Value Format:** `https://abc123@o123.ingest.sentry.io/456`

---

#### Code Quality & Coverage

8. **CODECOV_TOKEN** (Optional)
   - **Description:** Codecov token for test coverage reports
   - **How to Get:**
     1. Go to https://codecov.io
     2. Link GitHub repository
     3. Copy repository upload token
   - **Value Format:** `abc123-def456-ghi789`
   - **Usage:** Upload coverage from `backend-test` job

---

### Environment Variables (Vercel & Railway)

#### Vercel Environment Variables

Navigate to: `https://vercel.com/[org]/pasalku-ai/settings/environment-variables`

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.pasalku.ai

# Authentication (if using NextAuth)
NEXTAUTH_URL=https://pasalku.ai
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_PROACTIVE_CHAT=true
NEXT_PUBLIC_ENABLE_PAYMENT=true
```

#### Railway Environment Variables

Navigate to: Railway project → Variables tab

```env
# Database URLs
DATABASE_URL=postgresql://user:pass@host:5432/pasalku_prod
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pasalku_prod
REDIS_URL=redis://host:6379

# AI Service Keys
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...

# Security
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
ALLOWED_ORIGINS=https://pasalku.ai,https://www.pasalku.ai

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# Email (if using SendGrid/Mailgun)
SENDGRID_API_KEY=SG....
EMAIL_FROM=noreply@pasalku.ai

# Feature Flags
ENABLE_RAG=true
ENABLE_ORCHESTRATOR=true
MAX_FILE_SIZE_MB=10
```

---

## Quick Setup Commands

### 1. Vercel Setup (Frontend)

```bash
# Navigate to frontend directory
cd c:\Users\YAHYA\pasalku-ai-3

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project (creates .vercel/project.json)
vercel link

# Get project details
cat .vercel\project.json

# Create production deployment token
vercel tokens create pasalku-ci-cd

# Set environment variables (interactive)
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLIC_KEY production
```

### 2. Railway Setup (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Link to existing project (if exists)
railway link

# Get project ID
railway status

# Create API token at: https://railway.app/account/tokens

# Deploy backend manually first time
railway up --service backend
```

### 3. Add Secrets to GitHub

```bash
# Using GitHub CLI (recommended)
gh secret set VERCEL_TOKEN --body "YOUR_TOKEN_HERE"
gh secret set VERCEL_ORG_ID --body "team_abc123"
gh secret set VERCEL_PROJECT_ID --body "prj_xyz789"
gh secret set RAILWAY_TOKEN --body "railway_abc123"
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/..."
gh secret set CODECOV_TOKEN --body "abc123-def456"

# Or use GitHub web UI:
# https://github.com/yhyaa294/pasalku-ai/settings/secrets/actions
```

---

## Verification Steps

### 1. Test Vercel Deployment

```bash
# Test deployment locally
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

### 2. Test Railway Deployment

```bash
# Deploy to Railway
railway up

# Check status
railway status

# View logs
railway logs
```

### 3. Test CI/CD Pipeline

```bash
# Trigger workflow manually
gh workflow run main-ci-cd.yml

# View workflow status
gh run list --workflow=main-ci-cd.yml

# View specific run
gh run view [run-id]
```

---

## Security Best Practices

### ✅ DO:
- Use production API keys only in production environment
- Rotate secrets every 90 days
- Use different secrets for staging and production
- Enable 2FA on Vercel, Railway, GitHub accounts
- Store backup of secrets in secure vault (1Password, Bitwarden)

### ❌ DON'T:
- Commit secrets to git (use .env.local locally)
- Share secrets via email or Slack
- Use same secret across multiple projects
- Use test/development keys in production

---

## Troubleshooting

### Deployment Fails with "Unauthorized"
**Solution:** Regenerate tokens and update GitHub secrets

```bash
# For Vercel
vercel tokens create pasalku-ci-cd-new
gh secret set VERCEL_TOKEN --body "NEW_TOKEN"

# For Railway
# Create new token at: https://railway.app/account/tokens
gh secret set RAILWAY_TOKEN --body "NEW_TOKEN"
```

### Environment Variables Not Working
**Solution:** Ensure correct environment scope

```bash
# Vercel: Check environment is set to "Production"
vercel env ls

# Railway: Verify in Variables tab (not Secrets)
railway variables
```

### Deployment Succeeds but Site Crashes
**Solution:** Check application logs

```bash
# Vercel logs
vercel logs --follow

# Railway logs
railway logs --follow
```

---

## Post-Setup Checklist

- [ ] All 6 GitHub secrets added
- [ ] Vercel environment variables configured
- [ ] Railway environment variables configured
- [ ] Test deployment triggered manually
- [ ] Deployment succeeds without errors
- [ ] Production site accessible
- [ ] API health check returns 200 OK
- [ ] Sentry receiving error reports (test by triggering error)
- [ ] Slack notifications working (if configured)
- [ ] Database connections successful
- [ ] AI services responding (Groq/OpenAI)

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **GitHub Actions Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Sentry Setup:** https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

**Last Updated:** November 8, 2025  
**Maintained By:** DevOps Team

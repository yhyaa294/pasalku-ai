# Pasalku.ai Deployment Checklist

## 🚀 Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured in production
- [ ] API keys validated and tested
- [ ] Database credentials secured
- [ ] SSL certificates configured
- [ ] Domain names configured

### Database Setup
- [ ] Neon PostgreSQL Instance 1 provisioned
- [ ] Neon PostgreSQL Instance 2 provisioned
- [ ] MongoDB Atlas cluster created
- [ ] Turso database created (optional)
- [ ] EdgeDB instance created (optional)
- [ ] Supabase project created (optional)
- [ ] All database migrations applied
- [ ] MongoDB indexes created
- [ ] Database backups configured

### Application Configuration
- [ ] Clerk production keys configured
- [ ] Clerk webhooks configured
- [ ] BytePlus Ark API tested in production
- [ ] Sentry DSN configured
- [ ] Checkly monitoring configured
- [ ] CORS origins configured
- [ ] Rate limiting configured

### Security
- [ ] Environment variables not committed to git
- [ ] API keys rotated from development
- [ ] Database passwords strong and unique
- [ ] SSL/TLS enabled for all connections
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Rate limiting enabled

### Testing
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] API endpoints tested
- [ ] Authentication flow tested
- [ ] AI chat functionality tested
- [ ] Database connections verified
- [ ] Error handling tested

---

## 🔧 Deployment Steps

### Step 1: Database Deployment

#### 1.1 Neon PostgreSQL Setup
```bash
# Connect to Neon Instance 1
psql "postgresql://user:password@host/db"

# Run migrations
cd backend
alembic upgrade head

# Verify tables created
\dt
```

#### 1.2 MongoDB Setup
```bash
# Run setup script
python backend/scripts/setup_databases.py

# Verify collections
mongosh "mongodb+srv://..."
show collections
```

#### 1.3 Create Admin User
```sql
-- In Neon Instance 1
INSERT INTO users (id, email, role, subscription_tier, is_active, created_at, updated_at)
VALUES (
  'admin_clerk_user_id',
  'admin@pasalku.ai',
  'admin',
  'enterprise',
  true,
  NOW(),
  NOW()
);
```

---

### Step 2: Backend Deployment (Railway)

#### 2.1 Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### 2.2 Create New Project
```bash
railway init
railway link
```

#### 2.3 Configure Environment Variables
```bash
# Set all required variables
railway variables set CLERK_SECRET_KEY=sk_...
railway variables set ARK_API_KEY=...
railway variables set DATABASE_URL=postgresql://...
railway variables set MONGODB_URI=mongodb+srv://...
# ... set all other variables
```

#### 2.4 Deploy
```bash
railway up
```

#### 2.5 Verify Deployment
```bash
# Get deployment URL
railway domain

# Test health endpoint
curl https://your-app.railway.app/api/health
```

---

### Step 3: Frontend Deployment (Vercel)

#### 3.1 Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

#### 3.2 Configure Project
```bash
# In project root
vercel

# Follow prompts to link project
```

#### 3.3 Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_SENTRY_DSN
# ... add all frontend variables
```

#### 3.4 Deploy
```bash
vercel --prod
```

---

### Step 4: Configure Clerk

#### 4.1 Production Instance
1. Go to Clerk Dashboard
2. Create production instance
3. Copy production keys
4. Update environment variables

#### 4.2 Configure Webhooks
```
Webhook URL: https://your-api.railway.app/api/auth/sync
Events to listen:
- user.created
- user.updated
- user.deleted
```

#### 4.3 Configure Allowed Origins
```
Add to Clerk Dashboard:
- https://your-app.vercel.app
- https://your-api.railway.app
```

---

### Step 5: Configure Stripe

#### 5.1 Create Products
```bash
# Using Stripe CLI or Dashboard
stripe products create --name "Pasalku Premium" --description "Premium subscription"
stripe prices create --product prod_xxx --unit-amount 99000 --currency idr --recurring interval=month
```

#### 5.2 Configure Webhooks
```
Webhook URL: https://your-api.railway.app/api/webhooks/stripe
Events to listen:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

#### 5.3 Test Webhook
```bash
stripe listen --forward-to localhost:8001/api/webhooks/stripe
```

---

### Step 6: Configure Monitoring

#### 6.1 Checkly Setup
```bash
cd monitoring

# Set environment variables
export CHECKLY_API_KEY=your_key
export CHECKLY_ACCOUNT_ID=your_id
export BACKEND_URL=https://your-api.railway.app

# Deploy checks
checkly deploy
```

#### 6.2 Sentry Setup
1. Create project in Sentry
2. Copy DSN
3. Update environment variables
4. Deploy application
5. Verify errors are captured

#### 6.3 Configure Alerts
- Email notifications for downtime
- Slack integration for errors
- PagerDuty for critical issues

---

### Step 7: DNS & Domain Configuration

#### 7.1 Configure Custom Domain (Vercel)
```bash
vercel domains add pasalku.ai
vercel domains add www.pasalku.ai
```

#### 7.2 Configure API Domain (Railway)
```bash
railway domain add api.pasalku.ai
```

#### 7.3 Update DNS Records
```
A     @           76.76.21.21 (Vercel)
CNAME www         cname.vercel-dns.com
CNAME api         your-app.railway.app
```

---

### Step 8: SSL/TLS Configuration

#### 8.1 Vercel (Automatic)
- SSL automatically provisioned
- No action required

#### 8.2 Railway (Automatic)
- SSL automatically provisioned
- Verify HTTPS working

#### 8.3 Force HTTPS
```python
# In FastAPI app
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
app.add_middleware(HTTPSRedirectMiddleware)
```

---

### Step 9: Performance Optimization

#### 9.1 Enable Caching
- Configure Turso edge cache
- Set appropriate TTL values
- Monitor cache hit rates

#### 9.2 Database Optimization
- Verify all indexes created
- Enable connection pooling
- Configure query timeouts

#### 9.3 CDN Configuration
- Enable Vercel Edge Network
- Configure static asset caching
- Optimize image delivery

---

### Step 10: Security Hardening

#### 10.1 Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/chat/message")
@limiter.limit("10/minute")
async def send_message():
    ...
```

#### 10.2 Security Headers
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pasalku.ai"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

#### 10.3 API Key Rotation
- Rotate all API keys
- Update in environment variables
- Test all integrations

---

## ✅ Post-Deployment Verification

### Automated Tests
```bash
# Run health checks
curl https://api.pasalku.ai/api/health
curl https://api.pasalku.ai/api/health/detailed

# Test authentication
curl -H "Authorization: Bearer $TOKEN" \
     https://api.pasalku.ai/api/auth/me

# Test AI chat
curl -X POST https://api.pasalku.ai/api/chat/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test query"}'
```

### Manual Tests
- [ ] User can register
- [ ] User can login
- [ ] User can send chat message
- [ ] AI responds correctly
- [ ] Citations are extracted
- [ ] Session is saved
- [ ] Professional verification works
- [ ] Admin panel accessible
- [ ] Monitoring is active
- [ ] Errors are tracked in Sentry

### Performance Tests
- [ ] API response time < 2s
- [ ] AI response time < 3s
- [ ] Database queries < 100ms
- [ ] Page load time < 3s
- [ ] No memory leaks
- [ ] No connection pool exhaustion

### Security Tests
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting working
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF protection enabled
- [ ] Authentication required for protected routes

---

## 🔄 Rollback Plan

### If Deployment Fails

#### Backend Rollback (Railway)
```bash
# List deployments
railway deployments

# Rollback to previous
railway rollback <deployment-id>
```

#### Frontend Rollback (Vercel)
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

#### Database Rollback
```bash
# Rollback migration
alembic downgrade -1

# Or rollback to specific version
alembic downgrade <revision>
```

---

## 📊 Monitoring Dashboard Setup

### Checkly Dashboard
- Configure uptime monitoring
- Set alert thresholds
- Add team members

### Sentry Dashboard
- Configure error grouping
- Set up release tracking
- Configure alert rules

### Custom Dashboard
- Setup Grafana/Datadog
- Configure metrics collection
- Create custom visualizations

---

## 🚨 Incident Response Plan

### Critical Issues
1. Check Checkly for uptime status
2. Check Sentry for errors
3. Check Railway/Vercel logs
4. Check database connectivity
5. Rollback if necessary

### Communication Plan
- Notify team via Slack
- Update status page
- Communicate with users
- Document incident
- Post-mortem analysis

---

## 📅 Maintenance Schedule

### Daily
- Review Sentry errors
- Check Checkly uptime
- Monitor API performance

### Weekly
- Review user feedback
- Analyze usage patterns
- Check subscription metrics
- Update AI prompts if needed

### Monthly
- Database optimization
- Security audit
- Cost analysis
- Feature usage review
- Dependency updates

---

## 📞 Emergency Contacts

### Technical
- **DevOps**: [Contact]
- **Backend**: [Contact]
- **Frontend**: [Contact]

### Services
- **Railway Support**: support@railway.app
- **Vercel Support**: support@vercel.com
- **Clerk Support**: support@clerk.com
- **Stripe Support**: support@stripe.com

---

## ✅ Final Checklist

### Before Going Live
- [ ] All tests passing
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] SSL configured
- [ ] Custom domains working
- [ ] Error tracking active
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation updated
- [ ] Team trained

### Launch Day
- [ ] Final smoke tests
- [ ] Monitor dashboards
- [ ] Team on standby
- [ ] Communication ready
- [ ] Rollback plan ready

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Address any issues
- [ ] Gather user feedback
- [ ] Document lessons learned
- [ ] Plan next iteration

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Version**: 1.0.0  
**Status**: ⬜ Ready | ⬜ In Progress | ⬜ Complete

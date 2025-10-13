# Pasalku.ai Implementation Guide

## Fase 1: Stabilisasi & Implementasi Fondasi ✅

### 1. Health Check & Monitoring ✅

**Implemented:**
- Enhanced health check endpoints (`/api/health`, `/api/health/detailed`, `/api/health/ready`, `/api/health/live`)
- Checkly monitoring configuration
- Sentry integration untuk error tracking
- Comprehensive database connectivity checks

**Files Created:**
- `backend/routers/health.py` - Health check endpoints
- `monitoring/checkly-config.js` - Checkly configuration
- `monitoring/health-check.check.js` - Basic health monitoring
- `monitoring/detailed-health-check.check.js` - Detailed monitoring
- `monitoring/README.md` - Monitoring documentation

**Setup Instructions:**
```bash
# Install Checkly CLI
npm install -g checkly

# Deploy monitoring
cd monitoring
checkly deploy

# Verify health endpoints
curl http://localhost:8000/api/health
curl http://localhost:8000/api/health/detailed
```

---

### 2. Autentikasi & RBAC ✅

**Implemented:**
- Clerk authentication integration
- Role-Based Access Control (RBAC)
- User management dengan 3 roles: `masyarakat_umum`, `profesional_hukum`, `admin`
- Professional verification workflow
- Audit logging untuk security compliance

**Files Created:**
- `backend/models/user.py` - Enhanced user models
- `backend/middleware/auth.py` - Clerk auth & RBAC middleware
- `backend/routers/auth.py` - Authentication endpoints
- `backend/routers/verification.py` - Professional verification endpoints

**Key Features:**
- JWT token verification via Clerk
- Automatic user creation on first login
- Role-based endpoint protection
- Query limit enforcement untuk free tier
- Professional upgrade workflow dengan document upload

**API Endpoints:**
```
GET  /api/auth/me - Get current user
PUT  /api/auth/me - Update user profile
POST /api/auth/sync - Sync from Clerk webhook
GET  /api/auth/usage - Get usage statistics

POST /api/verification/request - Request professional verification
GET  /api/verification/my-requests - Get verification requests
GET  /api/verification/status - Get verification status

# Admin only
GET  /api/verification/pending - List pending verifications
POST /api/verification/{id}/review - Review verification request
```

---

### 3. Database Schema ✅

**Implemented:**
- Multi-database architecture (Neon, MongoDB, Turso, EdgeDB)
- Alembic migrations untuk PostgreSQL
- MongoDB collections dengan indexes
- Comprehensive data models

**Files Created:**
- `backend/models/user.py` - User, VerificationRequest, Subscription, AuditLog
- `backend/models/chat.py` - ChatSession, DocumentMetadata, AIQueryLog, SessionAnalytics
- `backend/schemas/mongodb_schemas.py` - MongoDB collection schemas
- `backend/alembic/versions/001_initial_schema.py` - User tables migration
- `backend/alembic/versions/002_chat_sessions_schema.py` - Chat tables migration
- `backend/scripts/setup_databases.py` - Database setup script
- `docs/DATABASE_ARCHITECTURE.md` - Complete database documentation

**Database Structure:**

**Neon Instance 1 (User Data):**
- users
- verification_requests
- subscriptions
- audit_logs

**Neon Instance 2 (Session Data):**
- chat_sessions
- document_metadata
- ai_query_logs
- session_analytics

**MongoDB Collections:**
- chat_transcripts
- document_analyses
- verification_documents
- ai_response_cache
- dual_ai_comparisons
- user_activity_logs
- feature_flag_cache

**Setup Instructions:**
```bash
# Run database setup
python backend/scripts/setup_databases.py

# Apply migrations
cd backend
alembic upgrade head

# Verify connections
python backend/test_db_connections.py
```

---

### 4. BytePlus Ark AI Integration ✅

**Implemented:**
- Ark AI service wrapper
- Legal consultation specialized prompts
- Multiple AI personas
- Document analysis
- Citation extraction
- Confidence scoring

**Files Created:**
- `backend/services/ark_ai_service.py` - Ark AI service
- `backend/routers/chat.py` - Enhanced chat router

**Key Features:**
- Legal consultation dengan context
- AI personas: default, advokat_progresif, konsultan_bisnis, mediator
- Automatic citation extraction (Pasal, UU)
- Confidence score calculation
- Document analysis (contracts, lawsuits)
- Legal document generation

**API Endpoints:**
```
POST /api/chat/message - Send message to AI
POST /api/chat/sessions - Create new session
GET  /api/chat/sessions - List user sessions
GET  /api/chat/sessions/{id} - Get session with transcript
PUT  /api/chat/sessions/{id} - Update session
DELETE /api/chat/sessions/{id} - Delete session
```

**Usage Example:**
```python
# Send message to AI
{
  "content": "Apa hukuman untuk pencurian?",
  "session_id": "optional-session-id",
  "persona": "advokat_progresif",
  "category": "Hukum Pidana"
}

# Response
{
  "message_id": "uuid",
  "session_id": "uuid",
  "role": "assistant",
  "content": "Pencurian diatur dalam Pasal 362 KUHP...",
  "citations": [
    {
      "type": "pasal",
      "article": "362",
      "law": "KUHP",
      "text": "Pasal 362 KUHP"
    }
  ],
  "confidence_score": 0.85,
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 300,
    "total_tokens": 450
  },
  "response_time_ms": 1250
}
```

---

## Fase 2: Ekstensi Fungsionalitas (Next Steps)

### 5. Monetisasi dengan Stripe (Pending)

**To Implement:**
- Stripe customer creation
- Subscription plans (Free, Premium, Enterprise)
- Payment processing
- Webhook handling untuk subscription events
- Usage-based billing

**Required Files:**
- `backend/routers/stripe_integration.py`
- `backend/services/stripe_service.py`
- `backend/webhooks/stripe_webhooks.py`

**API Endpoints (Planned):**
```
POST /api/subscriptions/checkout - Create checkout session
GET  /api/subscriptions/plans - List available plans
POST /api/subscriptions/upgrade - Upgrade subscription
POST /api/subscriptions/cancel - Cancel subscription
POST /api/webhooks/stripe - Stripe webhook handler
```

---

### 6. Knowledge Graph dengan EdgeDB (Pending)

**To Implement:**
- EdgeDB schema untuk legal knowledge
- Data ingestion pipeline
- Query interface
- Integration dengan AI responses

**Required Files:**
- `backend/dbschema/default.esdl` - EdgeDB schema
- `backend/services/knowledge_graph_service.py`
- `backend/scripts/ingest_legal_data.py`

**Schema Structure (Planned):**
```
type LegalDocument {
  required property title -> str;
  required property type -> str;
  property content -> str;
  multi link articles -> Article;
}

type Article {
  required property number -> str;
  required property content -> str;
  link parent_law -> LegalDocument;
  multi link related_articles -> Article;
}

type Precedent {
  required property case_number -> str;
  required property summary -> str;
  multi link relevant_articles -> Article;
}
```

---

### 7. Dual-AI Verification (Pending)

**To Implement:**
- Groq AI integration
- Parallel query execution
- Response comparison
- Confidence scoring
- User selection interface

**Required Files:**
- `backend/services/groq_ai_service.py`
- `backend/services/dual_ai_service.py`
- `backend/routers/dual_ai.py`

---

### 8. Document Processing Pipeline (Pending)

**To Implement:**
- File upload handling
- OCR untuk scanned documents
- AI-powered analysis
- Inngest workflow orchestration

**Required Files:**
- `backend/routers/documents.py` (enhance existing)
- `backend/services/document_processor.py`
- `backend/services/ocr_service.py`
- `backend/workflows/document_processing.py`

---

## Fase 3: Pengembangan Lanjutan (Future)

### 9. Advanced Features (Planned)

- Real-time notifications via Supabase
- SMS alerts untuk critical events
- A/B testing dengan Statsig/Hypertune
- Legal expert marketplace
- B2B API dengan StackAuth
- Voice assistant integration
- Multi-language support

---

## Environment Variables Required

### Core Services
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# BytePlus Ark AI
ARK_API_KEY=your_ark_api_key
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_MODEL_ID=ep-20241211161256-d6pjl
ARK_REGION=cn-beijing

# Groq AI (for Dual-AI)
GROQ_API_KEY=your_groq_api_key

# Databases
DATABASE_URL=postgresql://...  # Neon Instance 1
DATABASE_URL_NEON_2=postgresql://...  # Neon Instance 2
MONGODB_URI=mongodb+srv://...
MONGO_DB_NAME=pasalku_ai
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=your_token
EDGEDB_INSTANCE=your_instance
EDGEDB_SECRET_KEY=your_key

# Supabase
PASALKU_AI_SUPABASE_URL=https://...
PASALKU_AI_PASALKU_AISUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Monitoring
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
CHECKLY_API_KEY=...
CHECKLY_ACCOUNT_ID=...

# Feature Flags
NEXT_PUBLIC_STATSIG_CLIENT_KEY=...
STATSIG_SERVER_API_KEY=...
PASALKU_NEXT_PUBLIC_HYPERTUNE_TOKEN=...

# Other Services
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
SMS_API_KEY=...
SMS_PROVIDER=...
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] MongoDB indexes created
- [ ] Checkly monitoring configured
- [ ] Sentry error tracking setup

### Deployment Steps
1. Deploy backend to Railway/Vercel
2. Deploy frontend to Vercel
3. Configure Clerk production keys
4. Setup Stripe webhooks
5. Configure Checkly production monitors
6. Test all critical flows

### Post-Deployment
- [ ] Verify health endpoints
- [ ] Test authentication flow
- [ ] Test AI chat functionality
- [ ] Verify database connections
- [ ] Check monitoring alerts
- [ ] Review Sentry errors

---

## Testing

### Unit Tests
```bash
pytest backend/tests/
```

### Integration Tests
```bash
pytest backend/tests/integration/
```

### API Tests
```bash
# Using httpx or requests
python backend/tests/test_api.py
```

---

## Monitoring & Maintenance

### Daily Checks
- Review Sentry errors
- Check Checkly uptime reports
- Monitor database performance
- Review API response times

### Weekly Tasks
- Review user feedback
- Analyze usage patterns
- Check subscription metrics
- Update AI prompts if needed

### Monthly Tasks
- Database optimization
- Security audit
- Cost analysis
- Feature usage review

---

## Support & Resources

- **Documentation**: `/docs` directory
- **API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Database Schema**: `docs/DATABASE_ARCHITECTURE.md`
- **Monitoring**: `monitoring/README.md`

---

## Next Steps

1. **Immediate (Week 1-2)**:
   - Implement Stripe integration
   - Setup Inngest workflows
   - Deploy to production

2. **Short-term (Week 3-4)**:
   - Implement dual-AI verification
   - Setup EdgeDB knowledge graph
   - Document processing pipeline

3. **Medium-term (Month 2-3)**:
   - Real-time notifications
   - Advanced analytics
   - Mobile app development

4. **Long-term (Month 4+)**:
   - Legal expert marketplace
   - B2B API platform
   - International expansion

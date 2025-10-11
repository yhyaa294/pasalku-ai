# Pasalku.ai - AI Legal Assistant

🧠✨ **Sistem AI asisten hukum Indonesia terkemuka** yang membantu pengguna dengan konsultasi hukum berbasis kecerdasan buatan canggih. Platform enterprise-grade dengan payment, analytics, dan multi-provider AI support.

## 🚀 Fitur Unggulan

### 💳 **Payment Processing** (Stripe Integration)
- **One-time payments** untuk konsultasi individual
- **Subscription plans** dengan berbagai tier
- **Subscription management** (upgrade/downgrade/cancel)
- **Payment history** dan invoice tracking
- **Webhook handling** untuk real-time payment updates
- **Secure payment forms** dengan Stripe Elements

### 🤖 **Multi-Provider AI System**
- **Primary**: BytePlus Ark (High-accuracy legal analysis)
- **Alternative**: Groq AI (Ultra-fast responses)
- **Auto-routing**: Intelligent provider selection
- **Failover**: Automatic switching saat provider down
- **Performance tracking**: Response time & success rate monitoring
- **Provider comparison**: Cost-benefit analysis tools

### 📊 **Advanced Analytics & Dashboard**
- **User behavior analytics** dengan MongoDB
- **Revenue tracking** dan financial insights
- **AI performance monitoring** (response times, success rates)
- **System health dashboard** real-time
- **Custom analytics widgets** dan visualizations
- **Export capabilities** untuk reporting

### 🔄 **Workflow Automation (Inngest)**
- **Automated email campaigns** untuk user engagement
- **Scheduled database maintenance**
- **Payment recovery workflows**
- **User onboarding sequences**
- **Batch processing** untuk large datasets
- **Smart retry mechanisms**

### 💰 **Sentry Error Monitoring**
- **Real-time error tracking** across all services
- **Performance monitoring** dengan APM
- **Error categorization** dan prioritization
- **Environment-specific monitoring**
- **Integration dengan logging system**

### 🔐 **Enhanced Authentication**
- **Clerk authentication** integration
- **Multi-provider SSO** support
- **Advanced security features**
- **User profile management**
- **Session management**

### 🎯 **Structured Legal Consultation**
- **AI-guided consultation flows**
- **Problem classification** otomatis
- **Evidence processing** dan analysis
- **Pre-analysis summaries**
- **Structured legal recommendations**
- **Citation extraction** dan legal reference tracking

## 🛠️ **Teknologi Enterprise Stack**

### **Backend & Architecture**
- **Framework**: FastAPI (Python async framework)
- **Database**: PostgreSQL (primary) + MongoDB (analytics)
- **ORM**: SQLAlchemy dengan UUID support
- **Migration**: Alembic untuk database versioning
- **API Documentation**: OpenAPI/Swagger auto-generated

### **AI & Machine Learning**
- **Primary AI**: BytePlus Ark (High-accuracy legal models)
- **Secondary AI**: Groq (Ultra-fast Llama models)
- **AI Routing**: Intelligent failover & load balancing
- **Response Processing**: Citation extraction, disclaimer generation
- **Performance Monitoring**: Response time & success rate tracking

### **Payment & Commercial**
- **Payment Processor**: Stripe (Global payment processing)
- **Payment Methods**: Credit cards, subscriptions, one-time payments
- **Webhook Handling**: Real-time payment status updates
- **Subscription Management**: Plan upgrades, cancellations, billing
- **Invoice Generation**: Automated receipting & reporting

### **Analytics & Monitoring**
- **Analytics Database**: MongoDB untuk user behavior tracking
- **Reporting**: Real-time dashboards & KPI monitoring
- **Error Tracking**: Sentry untuk production monitoring
- **Performance Metrics**: APM (Application Performance Monitoring)
- **Health Checks**: Automated system status monitoring

### **Automation & Workflow**
- **Workflow Engine**: Inngest untuk background processing
- **Job Scheduling**: Cron-based & event-triggered workflows
- **Email Automation**: User engagement & notification campaigns
- **Database Maintenance**: Automated cleanup & optimization
- **Batch Processing**: Large-scale data operations

### **Security & Authentication**
- **Auth Provider**: Clerk (Multi-provider SSO)
- **API Security**: JWT tokens dengan refresh mechanism
- **Rate Limiting**: Per-user & per-IP throttling
- **Input Validation**: Comprehensive sanitization & validation
- **XSS Protection**: Client-side & server-side prevention
- **CORS**: Configurable cross-origin resource sharing

### **Frontend & UI/UX**
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS dengan custom animations
- **State Management**: React hooks & context API
- **Charts**: Recharts untuk data visualization
- **Icons**: Lucide React untuk consistent iconography
- **Accessibility**: Radix UI components (WCAG compliant)

### **DevOps & Deployment**
- **Containerization**: Docker containers
- **Orchestration**: Docker Compose untuk local development
- **Cloud**: Vercel/Railway untuk scalable deployment
- **CI/CD**: GitHub Actions dengan automated testing
- **Monitoring**: Sentry + custom health dashboards
- **Backup**: Automated database backups (PostgreSQL & MongoDB)

## Instalasi

### Prerequisites
- **Python 3.9+** (Backend)
- **Node.js 18+** (Frontend)
- **PostgreSQL 15+** (Database)
- **MongoDB 5.0+** (Analytics)
- **Git**
- **Docker** (Optional untuk development)

### Setup Development Environment

#### 1. Clone Repository
```bash
git clone https://github.com/your-username/pasalku-ai.git
cd pasalku-ai
```

#### 2. Backend Setup (Python/FastAPI)
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Environment configuration
cp .env.example .env
# Edit .env dengan semua konfigurasi yang diperlukan
```

#### 3. Database Setup
```bash
# PostgreSQL setup (primary database)
cd backend
# Initialize database tables
python -c "
from backend.database import init_db
init_db()
print('Database initialized!')
"

# MongoDB untuk analytics (pastikan MongoDB running)
# Default connection akan menggunakan MongoDB local atau Atlas
```

#### 4. Frontend Setup (Next.js)
```bash
# Install Node.js dependencies
npm install
# atau jika menggunakan pnpm
pnpm install

# Start development servers
# Terminal 1: Backend server
npm run dev:backend

# Terminal 2: Frontend server
npm run dev
# Server akan berjalan di http://localhost:5000 (frontend)
```

#### 5. Testing Setup
```bash
# Run integration tests
npm run test:integration

# Run component tests
npm run test:components

# Run payment flow tests
npm run test:payment
```

---

## 📡 **API Documentation Lengkap**

### 🔓 **Public Consultations**
```http
POST /api/consult
```
Konsultasi hukum langsung dengan AI (tidak butuh login)

**Request Body:**
```json
{
  "query": "Pertanyaan hukum Anda",
  "session_id": "optional-session-id",
  "context": "optional-user-context"
}
```

---

### 💳 **Payment System**
```http
GET    /api/payments/subscription-plans     # List semua subscription plans
POST   /api/payments/create-payment-intent  # Create one-time payment
POST   /api/payments/create-subscription    # Create subscription payment
GET    /api/payments/payment-history/:id    # Payment history per user
POST   /api/payments/webhook                 # Stripe webhook handler
```

---

### 🤖 **AI Services**
```http
POST /api/structured-consult/initiate       # Start structured consultation
POST /api/structured-consult/generate-questions
POST /api/structured-consult/process-evidence
POST /api/structured-consult/generate-pre-analysis
POST /api/structured-consult/final-analysis
```

---

### 📊 **Analytics & Monitoring**
```http
GET    /api/analytics/dashboard-overview   # Complete analytics dashboard
GET    /api/analytics/global              # Global platform statistics
GET    /api/analytics/user/:userId        # User-specific analytics
POST   /api/analytics/log-activity        # Log user activities
GET    /api/health                         # System health status
```

---

### 🔐 **Authentication (Clerk)**
```http
# Managed by Clerk authentication
# /api/auth/* endpoints handled by Clerk middleware
```

---

### 🔄 **Workflow Automation (Inngest)**
```http
# Background workflows dikontrol melalui Inngest dashboard
# Webhook endpoints untuk event processing
POST   /api/workflows/webhook              # Inngest webhook receiver
```

---

### 💬 **Legacy Chat System**
```http
POST   /api/chat/consult                   # Basic AI consultation
GET    /api/chat/history                   # Chat session history
GET    /api/chat/session/:id              # Session details
DELETE /api/chat/session/:id              # Delete session
```

## 🧪 **Comprehensive Testing**

### Unit Tests
```bash
# Backend unit tests
cd backend
python -m pytest tests/ -v --cov=.

# Frontend component tests
cd ..
npm run test:components

# TypeScript type checking
npm run type-check
```

### Integration Tests
```bash
# Full integration test suite
npm run test:integration    # Backend APIs + Frontend integration

# Payment flow testing
npm run test:payment        # Stripe payment flows

# AI provider testing
npm run test:ai-providers   # Multi-provider AI routing

# Load testing
npm run test:load          # Performance under load
```

### Manual Testing Checklists

#### ▶️ Payment Flow Testing
- [ ] Subscription plan selection
- [ ] Stripe payment intent creation
- [ ] Payment form loading
- [ ] Successful payment completion
- [ ] Failed payment handling
- [ ] Webhook event processing
- [ ] Payment history display

#### ▶️ AI Provider Testing
- [ ] BytePlus Ark responses
- [ ] Groq AI responses
- [ ] Auto-routing functionality
- [ ] Fallback when provider down
- [ ] Structured consultation flow

#### ▶️ Analytics Testing
- [ ] Dashboard data loading
- [ ] User activity logging
- [ ] Revenue tracking
- [ ] System health monitoring

---

## ⚙️ **Environment Variables Lengkap**

```env
# =============================================================================
# ENVIRONMENT CONFIGURATION
# =============================================================================

# Application Environment
ENVIRONMENT=development  # development|production|staging
DEBUG=True               # Debug mode (development only)

# =============================================================================
# AI PROVIDER CONFIGURATION
# =============================================================================

# BytePlus Ark (Primary AI Provider)
ARK_API_KEY=your-byteplus-api-key
ARK_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
ARK_MODEL_ID=ep-20250830093230-swczp
ARK_REGION=ap-southeast

# Groq AI (Secondary/Fallback AI Provider)
GROQ_API_KEY=your-groq-api-key

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================

# PostgreSQL (Primary Database)
DATABASE_URL=postgresql://user:password@localhost:5432/pasalku_ai
DATABASE_URL_UNPOOLED=postgresql://user:password@localhost:5432/pasalku_ai

# MongoDB (Analytics Database)
MONGODB_URI=mongodb://localhost:27017/pasalku_analytics
MONGO_DB_NAME=pasalku_ai

# Database Connection Parameters
PGHOST=localhost
PGUSER=user
PGPASSWORD=password
PGDATABASE=pasalku_ai

# =============================================================================
# PAYMENT PROCESSING (STRIPE)
# =============================================================================

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Additional Settings
STRIPE_MCP_KEY=your-webhook-endpoint-key

# =============================================================================
# AUTHENTICATION (CLERK)
# =============================================================================

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret

# =============================================================================
# MONITORING & ERROR TRACKING
# =============================================================================

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=pasalku-ai
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# =============================================================================
# WORKFLOW AUTOMATION (INGEST)
# =============================================================================

INNGEST_EVENT_KEY=ingest_event_key_here
INNGEST_SIGNING_KEY=signkey-prod_your_signing_key

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================

# JWT Security
SECRET_KEY=your-very-strong-secret-key-change-this-in-production-123456789
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Settings (comma-separated origins)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5000

# Rate Limiting (optional)
RATE_LIMIT_REQUESTS_PER_MINUTE=60

# =============================================================================
# FEATURE FLAGS & CONFIGURATION
# =============================================================================

# Feature Toggles
ENABLE_AI_FALLBACK=True
ENABLE_ERROR_LOGGING=True
ENABLE_ANALYTICS_TRACKING=True
ENABLE_PAYMENT_PROCESSING=True

# API Timeouts (seconds)
AI_REQUEST_TIMEOUT=30
DB_CONNECTION_TIMEOUT=10
EXT_API_TIMEOUT=60

# =============================================================================
# DEVELOPMENT & DEBUG
# =============================================================================

# Frontend Development
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Email Service (Development)
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=test
SMTP_PASS=test

# Development Logging
LOG_LEVEL=INFO          # DEBUG|INFO|WARNING|ERROR
LOG_FORMAT=json         # json|text|colored
```

## Development Guidelines

### Code Style
- Follow PEP 8
- Use type hints
- Write comprehensive docstrings
- Use meaningful variable names

### Testing
- Write unit tests for all functions
- Integration tests for API endpoints
- Test edge cases and error conditions

### Security
- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Implement proper error handling

## Deployment

### Production Setup
1. Set `ENVIRONMENT=production`
2. Use strong `SECRET_KEY`
3. Configure PostgreSQL database
4. Set up proper CORS origins
5. Enable HTTPS
6. Configure monitoring and logging

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@pasalku.ai or join our Discord community.

## Roadmap

- [ ] Streaming responses
- [ ] Multi-language support
- [ ] Advanced legal document analysis
- [ ] Integration with legal databases
- [ ] Mobile app development
- [ ] Voice consultation feature

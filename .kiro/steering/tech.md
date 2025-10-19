# Technology Stack

## Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **UI Library**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono

## Backend
- **Framework**: FastAPI (Python)
- **Language**: Python 3.9+
- **ORM**: SQLAlchemy with Alembic migrations
- **Validation**: Pydantic
- **Server**: Uvicorn (ASGI)

## Multi-Database Architecture
1. **PostgreSQL (Neon)**: Primary application data, user auth, subscriptions
2. **MongoDB**: Chat history, AI responses, document metadata
3. **Supabase**: Real-time features, edge functions, public profiles
4. **Turso (SQLite)**: AI response cache, session data for performance
5. **EdgeDB**: Indonesian legal knowledge graph

## AI Services
- **Primary**: BytePlus Ark API
- **Fallback**: Groq API
- **Consensus System**: Dual AI validation for accuracy

## Authentication & Security
- **Primary Auth**: Clerk
- **Alternative**: StackAuth
- **Security**: JWT tokens, RBAC, AES-256 encryption, TLS 1.3

## Monitoring & Analytics
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Checkly
- **Analytics**: Vercel Analytics
- **Feature Flags**: Statsig, Hypertune

## Payment Processing
- **Provider**: Stripe
- **Integration**: React Stripe.js

## Common Commands

### Development
```bash
# Start full stack
npm run dev                    # Frontend (port 3000)
cd backend && python -m uvicorn app:app --reload --port 8000  # Backend

# Alternative: Use start script
./start.sh                     # Full stack startup script
```

### Frontend
```bash
npm install                    # Install dependencies
npm run build                  # Production build
npm run start                  # Production server
npm run lint                   # ESLint check
```

### Backend
```bash
cd backend
python -m venv venv            # Create virtual environment
source venv/bin/activate       # Activate (Linux/Mac)
# venv\Scripts\activate        # Activate (Windows)
pip install -r requirements.txt
alembic upgrade head           # Run migrations
python -m uvicorn app:app --reload
```

### Testing
```bash
./scripts/run-tests.sh         # Full test suite
pytest backend/tests/          # Backend tests only
npm run test:components        # Frontend component tests
```

### Deployment
```bash
./deployment/deploy.sh production    # Full deployment
vercel --prod                        # Frontend only
railway up                           # Backend only
```

## Environment Setup
- Copy `.env.example` to `.env.local` (frontend) and `.env` (backend)
- Configure all required API keys and database URLs
- Ensure Python 3.9+ and Node.js 18+ are installed
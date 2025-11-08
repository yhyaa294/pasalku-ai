# 🏗️ Pasalku.AI System Architecture

## Table of Contents
- [High-Level Overview](#high-level-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Architecture](#database-architecture)
- [AI/ML Pipeline](#aiml-pipeline)
- [Deployment Architecture](#deployment-architecture)
- [Security Architecture](#security-architecture)
- [Monitoring & Observability](#monitoring--observability)

---

## High-Level Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile App - Future]
    end
    
    subgraph "CDN & Edge"
        C[Vercel Edge Network]
    end
    
    subgraph "Frontend - Next.js 15"
        D[App Router]
        E[Server Components]
        F[Client Components]
        G[API Routes]
    end
    
    subgraph "Backend - FastAPI"
        H[API Gateway]
        I[Authentication Service]
        J[Chat Service]
        K[Document Analysis Service]
        L[Payment Service]
        M[Orchestrator Service]
    end
    
    subgraph "AI Services"
        N[Groq Llama 3.1 70B]
        O[OpenAI GPT-4 Turbo]
        P[LangChain Orchestration]
        Q[RAG System]
    end
    
    subgraph "Data Layer"
        R[(PostgreSQL)]
        S[(MongoDB)]
        T[(ChromaDB)]
        U[(Redis Cache)]
    end
    
    A --> C
    C --> D
    D --> E
    D --> F
    D --> G
    G --> H
    H --> I
    H --> J
    H --> K
    H --> L
    H --> M
    J --> P
    K --> Q
    M --> P
    P --> N
    P --> O
    Q --> T
    I --> R
    J --> S
    K --> S
    M --> S
    H --> U
```

---

## Frontend Architecture

### Next.js 15 App Router Structure

```mermaid
graph LR
    subgraph "App Directory"
        A[app/]
        A --> B[layout.tsx - Root Layout]
        A --> C[page.tsx - Landing Page]
        A --> D[api/ - API Routes]
        A --> E[Components Directory]
        
        D --> D1[chat/ - Proxy to Backend]
        D --> D2[auth/ - Authentication]
        D --> D3[payments/ - Stripe Integration]
        
        E --> E1[Server Components]
        E --> E2[Client Components]
        E --> E3[Shared UI Components]
    end
    
    subgraph "State Management"
        F[Zustand Stores]
        F --> F1[Chat Store]
        F --> F2[User Store]
        F --> F3[UI Store]
    end
    
    subgraph "Data Fetching"
        G[TanStack Query]
        G --> G1[Chat Queries]
        G --> G2[User Queries]
        G --> G3[Document Queries]
    end
```

### Component Hierarchy

```
components/
├── chat/
│   ├── ChatInterface.tsx          (Client - Real-time chat)
│   ├── EnhancedChatInterface.tsx  (Client - Pro features)
│   ├── OrchestratedChat.tsx       (Client - Multi-agent)
│   └── EnhancedMessage.tsx        (Server - Static rendering)
│
├── legal-ai/
│   ├── LegalAIConsultation.tsx    (Client - Analysis UI)
│   ├── DocumentUpload.tsx         (Client - File handling)
│   └── legal-analysis-features.tsx (Server - Feature cards)
│
├── ui/ (Shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
│
└── layout/
    ├── ultra-simple-navbar.tsx    (Server/Client hybrid)
    ├── enhanced-footer.tsx        (Server)
    └── floating-widgets.tsx       (Client - Interactive)
```

---

## Backend Architecture

### Microservices Design

```mermaid
graph TB
    subgraph "API Gateway Layer"
        A[FastAPI Main Server]
        A --> B[CORS Middleware]
        A --> C[Authentication Middleware]
        A --> D[Rate Limiting Middleware]
        A --> E[Logging Middleware]
    end
    
    subgraph "Service Layer"
        F[Chat Service]
        G[Document Service]
        H[Orchestrator Service]
        I[Payment Service]
        J[Analytics Service]
    end
    
    subgraph "Data Access Layer"
        K[PostgreSQL Repository]
        L[MongoDB Repository]
        M[ChromaDB Repository]
        N[Cache Layer - Redis]
    end
    
    A --> F
    A --> G
    A --> H
    A --> I
    A --> J
    
    F --> L
    F --> M
    F --> N
    
    G --> L
    G --> M
    
    H --> L
    H --> M
    H --> N
    
    I --> K
    
    J --> K
    J --> N
```

### Service Details

#### Chat Service (`backend/routers/chat.py`)
- **Responsibilities:**
  - Process user messages
  - Generate AI responses via Groq/OpenAI
  - Manage conversation history
  - Handle RAG retrieval
  
- **Endpoints:**
  - `POST /api/chat` - Send message
  - `GET /api/chat/conversations` - List conversations
  - `GET /api/chat/conversations/{id}` - Get conversation
  - `DELETE /api/chat/conversations/{id}` - Delete conversation

#### Document Analysis Service (`backend/routers/document_analysis.py`)
- **Responsibilities:**
  - Parse PDF/DOCX documents
  - Extract legal clauses
  - Perform compliance analysis
  - Generate analysis reports
  
- **Flow:**
  ```mermaid
  sequenceDiagram
      Client->>+API: Upload Document
      API->>+DocumentService: Process File
      DocumentService->>+PyPDF2: Extract Text
      PyPDF2-->>-DocumentService: Raw Text
      DocumentService->>+LangChain: Chunk & Embed
      LangChain-->>-DocumentService: Embeddings
      DocumentService->>+ChromaDB: Store Vectors
      ChromaDB-->>-DocumentService: Success
      DocumentService->>+LLM: Analyze Content
      LLM-->>-DocumentService: Analysis Results
      DocumentService-->>-API: Analysis Report
      API-->>-Client: JSON Response
  ```

#### Orchestrator Service (`backend/routers/proactive_chat.py`)
- **Responsibilities:**
  - Multi-stage conversation management
  - Feature recommendations
  - Context-aware questioning
  - Strategic report generation
  
- **State Machine:**
  ```mermaid
  stateDiagram-v2
      [*] --> InitialAnalysis
      InitialAnalysis --> Clarification
      Clarification --> DeepAnalysis
      DeepAnalysis --> FeatureOffering
      FeatureOffering --> ReportGeneration
      FeatureOffering --> ContextAwareSuggestions
      ReportGeneration --> [*]
      ContextAwareSuggestions --> [*]
  ```

---

## Database Architecture

### PostgreSQL Schema (Relational Data)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Analytics
CREATE TABLE usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_analytics_user_timestamp ON usage_analytics(user_id, timestamp DESC);
```

### MongoDB Collections (Document Data)

```javascript
// Conversations Collection
{
  _id: ObjectId,
  user_id: "user_abc123",
  conversation_id: "conv_xyz789",
  created_at: ISODate,
  updated_at: ISODate,
  messages: [
    {
      role: "user",
      content: "Apa itu KUHP?",
      timestamp: ISODate,
      metadata: {}
    },
    {
      role: "assistant",
      content: "KUHP adalah...",
      timestamp: ISODate,
      citations: [...],
      metadata: {
        model: "groq-llama-3.1-70b",
        processing_time_ms: 1250
      }
    }
  ],
  metadata: {
    total_messages: 10,
    last_active: ISODate
  }
}

// Document Analysis Collection
{
  _id: ObjectId,
  analysis_id: "analysis_123",
  user_id: "user_abc123",
  document: {
    filename: "contract.pdf",
    size_bytes: 1024000,
    upload_timestamp: ISODate,
    storage_url: "s3://..."
  },
  analysis: {
    type: "contract",
    findings: [...],
    risks: [...],
    compliance_score: 0.85
  },
  created_at: ISODate,
  status: "completed"
}

// Orchestrator Sessions
{
  _id: ObjectId,
  session_id: "session_abc123",
  user_id: "user_abc123",
  stage: "deep_analysis",
  context: {
    initial_query: "...",
    answers: [...],
    analysis_results: {...}
  },
  feature_offerings: [...],
  created_at: ISODate,
  updated_at: ISODate,
  status: "active"
}
```

### ChromaDB Collections (Vector Store)

```python
# Legal Knowledge Base Collection
collection = client.get_or_create_collection(
    name="legal_knowledge_base",
    metadata={
        "description": "Indonesian legal documents",
        "embedding_model": "text-embedding-3-small"
    }
)

# Document Structure
{
    "ids": ["uu_13_2003_pasal_88", "uu_13_2003_pasal_89"],
    "embeddings": [[0.123, 0.456, ...], [0.789, 0.012, ...]],
    "metadatas": [
        {
            "pasal": "Pasal 88",
            "uu": "UU No. 13 Tahun 2003",
            "category": "Ketenagakerjaan",
            "chunk_id": "chunk_1"
        }
    ],
    "documents": [
        "Setiap pekerja/buruh berhak memperoleh penghasilan..."
    ]
}
```

---

## AI/ML Pipeline

### RAG (Retrieval-Augmented Generation) Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant LangChain
    participant Embedder
    participant ChromaDB
    participant LLM
    
    User->>+API: Ask Legal Question
    API->>+LangChain: Process Query
    LangChain->>+Embedder: Embed Query
    Embedder-->>-LangChain: Query Embedding
    LangChain->>+ChromaDB: Similarity Search
    ChromaDB-->>-LangChain: Top K Documents
    LangChain->>LangChain: Construct Prompt
    LangChain->>+LLM: Generate Response
    LLM-->>-LangChain: AI Response
    LangChain-->>-API: Response + Citations
    API-->>-User: JSON Response
```

### Multi-Agent Orchestration

```mermaid
graph TB
    A[User Query] --> B[Orchestrator Agent]
    B --> C{Query Type?}
    
    C -->|General Legal| D[Legal Advisor Agent]
    C -->|Document Analysis| E[Document Analyzer Agent]
    C -->|Case Prediction| F[Prediction Agent]
    C -->|Contract Review| G[Contract Agent]
    
    D --> H[RAG Retrieval]
    E --> I[Document Parser]
    F --> J[ML Model]
    G --> K[Template Matcher]
    
    H --> L[Response Synthesizer]
    I --> L
    J --> L
    K --> L
    
    L --> M[Quality Checker]
    M --> N[Citation Formatter]
    N --> O[Final Response]
```

### Model Selection Strategy

```python
def select_model(query: str, user_tier: str) -> str:
    """
    Choose optimal model based on query and user tier
    """
    if user_tier == "free":
        return "groq-llama-3.1-8b"  # Fast, cost-efficient
    
    if len(query) > 500 or "analisis mendalam" in query:
        return "gpt-4-turbo"  # Complex analysis
    
    if user_tier in ["professional", "premium"]:
        return "groq-llama-3.1-70b"  # High quality, fast
    
    return "groq-llama-3.1-8b"  # Default
```

---

## Deployment Architecture

### Production Infrastructure

```mermaid
graph TB
    subgraph "Client Access"
        A[Users Worldwide]
    end
    
    subgraph "Vercel Edge Network"
        B[CDN - Global]
        C[Edge Functions]
        D[Next.js Frontend]
    end
    
    subgraph "Railway Backend"
        E[FastAPI Server]
        F[Worker Processes]
        G[Task Queue]
    end
    
    subgraph "Managed Databases"
        H[(Railway PostgreSQL)]
        I[(MongoDB Atlas)]
        J[(Railway Redis)]
    end
    
    subgraph "AI Services"
        K[Groq Cloud]
        L[OpenAI API]
    end
    
    subgraph "Monitoring"
        M[Sentry]
        N[Vercel Analytics]
        O[Railway Metrics]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    F --> H
    F --> I
    F --> J
    E --> K
    E --> L
    D --> M
    D --> N
    E --> M
    E --> O
```

### Environment Configuration

```yaml
# Vercel (Frontend)
NEXT_PUBLIC_API_URL: https://api.pasalku.ai
NEXT_PUBLIC_STRIPE_PUBLIC_KEY: pk_live_xxx
SENTRY_DSN: https://xxx@sentry.io/xxx
NODE_ENV: production

# Railway (Backend)
DATABASE_URL: postgresql://user:pass@host/db
MONGODB_URI: mongodb+srv://user:pass@cluster/db
REDIS_URL: redis://host:6379
GROQ_API_KEY: gsk_xxx
OPENAI_API_KEY: sk-xxx
SECRET_KEY: xxx
ALLOWED_ORIGINS: https://pasalku.ai
```

---

## Security Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Backend
    participant DB
    
    Client->>+Frontend: Login Request
    Frontend->>+Backend: POST /api/auth/login
    Backend->>+DB: Verify Credentials
    DB-->>-Backend: User Data
    Backend->>Backend: Generate JWT
    Backend-->>-Frontend: JWT Token
    Frontend->>Frontend: Store in httpOnly Cookie
    Frontend-->>-Client: Success
    
    Note over Client,DB: Subsequent Requests
    
    Client->>+Frontend: API Request
    Frontend->>+Backend: Request + JWT Cookie
    Backend->>Backend: Validate JWT
    Backend->>+DB: Get User Context
    DB-->>-Backend: User Data
    Backend-->>-Frontend: Protected Resource
    Frontend-->>-Client: Response
```

### Security Layers

1. **Transport Security:**
   - TLS 1.3 encryption
   - HSTS headers
   - Certificate pinning

2. **Application Security:**
   - JWT authentication
   - Rate limiting (20-200 req/min by tier)
   - Input validation (Pydantic schemas)
   - SQL injection prevention (ORM)
   - XSS protection (React escaping)

3. **Data Security:**
   - Encrypted at rest (PostgreSQL + MongoDB)
   - Encrypted in transit (TLS)
   - PII tokenization
   - Secure secret management (Railway/Vercel env vars)

4. **API Security:**
   - CORS whitelisting
   - API key rotation
   - Webhook signature verification
   - Request signing

---

## Monitoring & Observability

### Metrics Dashboard

```mermaid
graph LR
    subgraph "Application Metrics"
        A[Request Rate]
        B[Response Time]
        C[Error Rate]
        D[Success Rate]
    end
    
    subgraph "Business Metrics"
        E[Active Users]
        F[Conversations/Day]
        G[Documents Analyzed]
        H[Revenue]
    end
    
    subgraph "Infrastructure Metrics"
        I[CPU Usage]
        J[Memory Usage]
        K[Database Connections]
        L[Cache Hit Rate]
    end
    
    subgraph "AI Metrics"
        M[Model Latency]
        N[Token Usage]
        O[RAG Relevance Score]
        P[User Satisfaction]
    end
    
    A --> Q[Grafana Dashboard]
    B --> Q
    C --> Q
    D --> Q
    E --> Q
    F --> Q
    G --> Q
    H --> Q
    I --> Q
    J --> Q
    K --> Q
    L --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q
```

### Error Tracking

```javascript
// Sentry Integration (Frontend)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
})

// Backend Error Tracking
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0
)
```

### Health Checks

```python
# Backend Health Endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "services": {
            "database": await check_postgres(),
            "mongodb": await check_mongodb(),
            "redis": await check_redis(),
            "ai_services": await check_ai_apis()
        }
    }
```

---

## Technology Stack Summary

### Frontend
- **Framework:** Next.js 15.5.6 (App Router)
- **UI:** React 18, TypeScript 5.x
- **Styling:** Tailwind CSS, Shadcn/ui
- **State:** Zustand, TanStack Query
- **Animations:** Framer Motion
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python 3.11)
- **ORM:** SQLAlchemy (PostgreSQL)
- **ODM:** PyMongo (MongoDB)
- **Validation:** Pydantic v2
- **Tasks:** Celery (future)
- **Deployment:** Railway

### AI/ML
- **LLMs:** Groq Llama 3.1 (8B/70B), GPT-4 Turbo
- **Orchestration:** LangChain
- **Embeddings:** OpenAI text-embedding-3-small
- **Vector DB:** ChromaDB
- **PDF Processing:** PyPDF2, python-docx

### Databases
- **Relational:** PostgreSQL 15
- **Document:** MongoDB 7.0
- **Vector:** ChromaDB
- **Cache:** Redis 7.x

### DevOps
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, Vercel Analytics
- **Security:** CodeQL, Trivy, Dependabot
- **Secrets:** GitHub Secrets, Railway/Vercel env

---

## Scalability Considerations

### Horizontal Scaling

```mermaid
graph TB
    A[Load Balancer] --> B[Frontend Instance 1]
    A --> C[Frontend Instance 2]
    A --> D[Frontend Instance N]
    
    E[API Gateway] --> F[Backend Worker 1]
    E --> G[Backend Worker 2]
    E --> H[Backend Worker N]
    
    F --> I[(PostgreSQL Primary)]
    G --> I
    H --> I
    
    I --> J[(PostgreSQL Replica 1)]
    I --> K[(PostgreSQL Replica 2)]
```

### Caching Strategy

1. **CDN Caching:** Static assets (images, JS, CSS)
2. **Redis Caching:** 
   - User sessions
   - API responses (TTL: 5 min)
   - Legal knowledge snippets (TTL: 1 hour)
3. **Browser Caching:** Next.js static pages

### Database Optimization

- **Read Replicas:** For analytics queries
- **Connection Pooling:** Max 20 connections/worker
- **Query Optimization:** Indexed on user_id, timestamp
- **Partitioning:** Usage analytics by month

---

**Last Updated:** November 8, 2025  
**Version:** 1.0.0

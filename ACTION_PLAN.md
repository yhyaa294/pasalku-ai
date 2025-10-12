# 🎯 Pasalku.ai - Action Plan & Next Steps

## 📋 Status Saat Ini

### ✅ Sudah Selesai (Fase 1)
- [x] Health check & monitoring system
- [x] Clerk authentication integration
- [x] Database architecture (Neon, MongoDB, Turso, EdgeDB)
- [x] BytePlus Ark AI integration
- [x] Chat interface dengan AI
- [x] Professional verification workflow
- [x] Audit logging & security
- [x] Comprehensive documentation

### 🔄 Perlu Diselesaikan Segera
- [ ] Fix koneksi port 8001 (jika masih ada masalah)
- [ ] Deploy ke production
- [ ] Stripe integration untuk monetisasi
- [ ] EdgeDB data population
- [ ] Testing menyeluruh

---

## 🚀 LANGKAH KONKRET MINGGU INI (Week 5)

### Hari 1-2: Verifikasi & Stabilisasi

#### ✅ Langkah 1: Pastikan Backend Berjalan dengan Baik

**Status**: Sudah ada implementasi, perlu verifikasi

**Tindakan:**
```bash
# 1. Test backend server
cd backend
uvicorn app:app --reload --port 8001

# 2. Verify health endpoint
curl http://localhost:8001/api/health

# Expected response:
# {
#   "status": "healthy",
#   "environment": "development",
#   "version": "1.0.0",
#   "uptime": 12.34,
#   "services": {"api": "operational", "port": "8001"}
# }

# 3. Test detailed health
curl http://localhost:8001/api/health/detailed

# 4. Check API docs
# Open: http://localhost:8001/docs
```

**Troubleshooting Jika Port 8001 Bermasalah:**
```powershell
# Windows: Check port usage
netstat -ano | findstr :8001

# Kill process if needed
taskkill /PID <process_id> /F

# Try alternative port
uvicorn app:app --reload --port 8002
```

**Checklist:**
- [ ] Backend server running
- [ ] Health endpoint responding
- [ ] All databases connected
- [ ] Swagger UI accessible
- [ ] No errors in logs

---

#### ✅ Langkah 2: Verifikasi Autentikasi Clerk

**Status**: Sudah diimplementasi, perlu testing

**Tindakan:**
```bash
# 1. Verify Clerk keys in .env
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

# 2. Test user registration via Clerk
# Go to your frontend and register a new user

# 3. Check if user created in database
# Connect to Neon Instance 1
psql "postgresql://user:password@host/db"
SELECT id, email, role, subscription_tier FROM users;

# 4. Test authentication endpoint
curl -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
     http://localhost:8001/api/auth/me
```

**Jika Ada Masalah:**
```python
# Test Clerk connection manually
# Create: backend/test_clerk.py

import os
from clerk import Clerk

clerk = Clerk(api_key=os.getenv("CLERK_SECRET_KEY"))

# List users
users = clerk.users.list()
print(f"Found {len(users)} users")

# Run test
python backend/test_clerk.py
```

**Checklist:**
- [ ] Clerk keys configured
- [ ] User can register
- [ ] User can login
- [ ] User data saved to Neon 1
- [ ] JWT authentication working

---

#### ✅ Langkah 3: Test AI Chat Functionality

**Status**: Sudah diimplementasi, perlu testing

**Tindakan:**
```bash
# 1. Test AI chat endpoint
curl -X POST http://localhost:8001/api/chat/message \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Apa itu Pasal 362 KUHP?",
    "persona": "default"
  }'

# Expected response:
# {
#   "message_id": "uuid",
#   "session_id": "uuid",
#   "role": "assistant",
#   "content": "Pasal 362 KUHP mengatur tentang...",
#   "citations": [...],
#   "confidence_score": 0.85,
#   "usage": {"total_tokens": 450},
#   "response_time_ms": 1250
# }

# 2. Verify session saved
curl -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
     http://localhost:8001/api/chat/sessions

# 3. Check MongoDB for transcript
mongosh "mongodb+srv://..."
use pasalku_ai
db.chat_transcripts.find().limit(1)

# 4. Check Neon 2 for session metadata
psql "postgresql://..." # Neon Instance 2
SELECT * FROM chat_sessions LIMIT 1;
```

**Checklist:**
- [ ] AI responds to queries
- [ ] Citations extracted
- [ ] Session created in Neon 2
- [ ] Transcript saved to MongoDB
- [ ] Confidence score calculated

---

### Hari 3-4: Stripe Integration (Monetisasi)

#### 🔜 Langkah 4: Setup Stripe Products & Prices

**File Baru yang Perlu Dibuat:**
```
backend/services/stripe_service.py
backend/routers/subscriptions.py
backend/webhooks/stripe_webhooks.py
```

**Implementasi:**

**A. Create Stripe Service**
```python
# backend/services/stripe_service.py
import os
import stripe
from typing import Dict, Any, Optional

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    """Stripe integration service"""
    
    async def create_customer(self, email: str, name: str, user_id: str) -> Dict[str, Any]:
        """Create Stripe customer"""
        customer = stripe.Customer.create(
            email=email,
            name=name,
            metadata={"user_id": user_id}
        )
        return customer
    
    async def create_checkout_session(
        self,
        customer_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str
    ) -> Dict[str, Any]:
        """Create checkout session"""
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url
        )
        return session
    
    async def get_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Get subscription details"""
        return stripe.Subscription.retrieve(subscription_id)
    
    async def cancel_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Cancel subscription"""
        return stripe.Subscription.delete(subscription_id)

stripe_service = StripeService()
```

**B. Create Subscription Router**
```python
# backend/routers/subscriptions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models.user import User, SubscriptionTier
from ..middleware.auth import get_current_active_user
from ..services.stripe_service import stripe_service

router = APIRouter()

class CheckoutRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

@router.post("/checkout")
async def create_checkout_session(
    request: CheckoutRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create Stripe checkout session"""
    
    # Create or get Stripe customer
    if not current_user.stripe_customer_id:
        customer = await stripe_service.create_customer(
            email=current_user.email,
            name=current_user.full_name or current_user.email,
            user_id=current_user.id
        )
        current_user.stripe_customer_id = customer.id
        db.commit()
    
    # Create checkout session
    session = await stripe_service.create_checkout_session(
        customer_id=current_user.stripe_customer_id,
        price_id=request.price_id,
        success_url=request.success_url,
        cancel_url=request.cancel_url
    )
    
    return {"checkout_url": session.url, "session_id": session.id}

@router.get("/plans")
async def get_subscription_plans():
    """Get available subscription plans"""
    return {
        "plans": [
            {
                "id": "free",
                "name": "Free",
                "price": 0,
                "currency": "IDR",
                "features": [
                    "10 AI queries per month",
                    "Basic legal consultation",
                    "Chat history"
                ]
            },
            {
                "id": "premium",
                "name": "Premium",
                "price": 99000,
                "currency": "IDR",
                "stripe_price_id": "price_xxx", # Replace with actual
                "features": [
                    "Unlimited AI queries",
                    "Advanced legal consultation",
                    "Document analysis",
                    "Priority support",
                    "Dual-AI verification"
                ]
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "price": 499000,
                "currency": "IDR",
                "stripe_price_id": "price_yyy", # Replace with actual
                "features": [
                    "Everything in Premium",
                    "API access",
                    "Custom integrations",
                    "Dedicated support",
                    "SLA guarantee"
                ]
            }
        ]
    }

@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cancel current subscription"""
    
    if not current_user.stripe_subscription_id:
        raise HTTPException(status_code=400, detail="No active subscription")
    
    await stripe_service.cancel_subscription(current_user.stripe_subscription_id)
    
    current_user.subscription_tier = SubscriptionTier.FREE
    current_user.subscription_status = "canceled"
    db.commit()
    
    return {"status": "success", "message": "Subscription canceled"}
```

**C. Create Stripe Webhook Handler**
```python
# backend/webhooks/stripe_webhooks.py
from fastapi import APIRouter, Request, HTTPException
from sqlalchemy.orm import Session
import stripe
import os

from ..database import get_db
from ..models.user import User, SubscriptionTier, Subscription

router = APIRouter()

@router.post("/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle events
    if event.type == "checkout.session.completed":
        await handle_checkout_completed(event.data.object)
    elif event.type == "customer.subscription.updated":
        await handle_subscription_updated(event.data.object)
    elif event.type == "customer.subscription.deleted":
        await handle_subscription_deleted(event.data.object)
    
    return {"status": "success"}

async def handle_checkout_completed(session):
    """Handle successful checkout"""
    db = next(get_db())
    
    customer_id = session.customer
    subscription_id = session.subscription
    
    # Find user by Stripe customer ID
    user = db.query(User).filter(
        User.stripe_customer_id == customer_id
    ).first()
    
    if user:
        user.stripe_subscription_id = subscription_id
        user.subscription_tier = SubscriptionTier.PREMIUM
        user.subscription_status = "active"
        
        # Create subscription record
        subscription = Subscription(
            user_id=user.id,
            stripe_subscription_id=subscription_id,
            stripe_customer_id=customer_id,
            tier=SubscriptionTier.PREMIUM,
            status="active"
        )
        db.add(subscription)
        db.commit()

async def handle_subscription_updated(subscription):
    """Handle subscription update"""
    db = next(get_db())
    
    user = db.query(User).filter(
        User.stripe_subscription_id == subscription.id
    ).first()
    
    if user:
        user.subscription_status = subscription.status
        db.commit()

async def handle_subscription_deleted(subscription):
    """Handle subscription cancellation"""
    db = next(get_db())
    
    user = db.query(User).filter(
        User.stripe_subscription_id == subscription.id
    ).first()
    
    if user:
        user.subscription_tier = SubscriptionTier.FREE
        user.subscription_status = "canceled"
        db.commit()
```

**D. Update app.py to include new routers**
```python
# backend/app.py - Add these lines

from .routers.subscriptions import router as subscriptions_router
from .webhooks.stripe_webhooks import router as stripe_webhook_router

app.include_router(subscriptions_router, prefix="/api/subscriptions", tags=["Subscriptions"])
app.include_router(stripe_webhook_router, prefix="/webhooks", tags=["Webhooks"])
```

**E. Setup Stripe Products (Manual)**
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Create products
stripe products create --name "Pasalku Premium" --description "Premium subscription"
stripe products create --name "Pasalku Enterprise" --description "Enterprise subscription"

# Create prices
stripe prices create \
  --product prod_xxx \
  --unit-amount 99000 \
  --currency idr \
  --recurring interval=month

stripe prices create \
  --product prod_yyy \
  --unit-amount 499000 \
  --currency idr \
  --recurring interval=month

# Setup webhook
stripe listen --forward-to localhost:8001/webhooks/stripe
```

**Checklist:**
- [ ] Stripe service created
- [ ] Subscription router created
- [ ] Webhook handler created
- [ ] Products created in Stripe
- [ ] Prices configured
- [ ] Webhook tested locally
- [ ] Frontend checkout flow implemented

---

### Hari 5: EdgeDB Data Population

#### 🔜 Langkah 5: Populate EdgeDB dengan Data Hukum

**File Baru yang Perlu Dibuat:**
```
backend/dbschema/default.esdl
backend/scripts/ingest_legal_data.py
backend/services/knowledge_graph_service.py
```

**Implementasi:**

**A. Define EdgeDB Schema**
```edgeql
# backend/dbschema/default.esdl

module default {
    # Legal Document (UU, Peraturan, etc.)
    type LegalDocument {
        required property title -> str;
        required property document_type -> str; # UU, PP, Perpres, etc.
        required property number -> str;
        required property year -> int16;
        property description -> str;
        property content -> str;
        property status -> str; # active, revoked, amended
        property effective_date -> datetime;
        property source_url -> str;
        
        multi link articles -> Article;
        multi link amendments -> LegalDocument;
        
        index on (.title);
        index on (.document_type);
        index on (.year);
    }
    
    # Article/Pasal
    type Article {
        required property number -> str;
        required property content -> str;
        property explanation -> str;
        
        required link parent_law -> LegalDocument;
        multi link related_articles -> Article;
        multi link precedents -> Precedent;
        
        index on (.number);
    }
    
    # Legal Term/Terminology
    type LegalTerm {
        required property term -> str;
        required property definition -> str;
        property examples -> array<str>;
        
        multi link related_articles -> Article;
        multi link related_documents -> LegalDocument;
        
        index on (.term);
    }
    
    # Court Precedent
    type Precedent {
        required property case_number -> str;
        required property court_level -> str; # MA, PT, PN
        required property decision_date -> datetime;
        property summary -> str;
        property verdict -> str;
        property legal_reasoning -> str;
        
        multi link relevant_articles -> Article;
        multi link relevant_laws -> LegalDocument;
        
        index on (.case_number);
        index on (.decision_date);
    }
    
    # Legal Category
    type LegalCategory {
        required property name -> str; # Pidana, Perdata, Tata Usaha, etc.
        property description -> str;
        
        multi link documents -> LegalDocument;
        multi link subcategories -> LegalCategory;
    }
}
```

**B. Apply EdgeDB Migration**
```bash
# Create migration
edgedb migration create

# Apply migration
edgedb migration apply

# Verify
edgedb query "SELECT LegalDocument { title } LIMIT 1"
```

**C. Create Data Ingestion Script**
```python
# backend/scripts/ingest_legal_data.py

import edgedb
import os
from datetime import datetime

# Connect to EdgeDB
client = edgedb.create_client(
    dsn=f"edgedb://{os.getenv('EDGEDB_INSTANCE')}?secret_key={os.getenv('EDGEDB_SECRET_KEY')}"
)

# Sample data - KUHP
def ingest_kuhp():
    """Ingest KUHP (Kitab Undang-Undang Hukum Pidana)"""
    
    # Create KUHP document
    kuhp = client.query_single("""
        INSERT LegalDocument {
            title := 'Kitab Undang-Undang Hukum Pidana',
            document_type := 'UU',
            number := '1',
            year := 1946,
            description := 'Undang-Undang tentang Hukum Pidana',
            status := 'active',
            effective_date := <datetime>'1946-01-01T00:00:00Z'
        }
    """)
    
    print(f"Created KUHP: {kuhp.id}")
    
    # Add articles
    articles_data = [
        {
            "number": "362",
            "content": "Barang siapa mengambil barang sesuatu, yang seluruhnya atau sebagian kepunyaan orang lain, dengan maksud untuk dimiliki secara melawan hukum, diancam karena pencurian, dengan pidana penjara paling lama lima tahun atau pidana denda paling banyak sembilan ratus rupiah.",
            "explanation": "Pasal ini mengatur tentang tindak pidana pencurian biasa."
        },
        {
            "number": "338",
            "content": "Barang siapa dengan sengaja merampas nyawa orang lain, diancam karena pembunuhan dengan pidana penjara paling lama lima belas tahun.",
            "explanation": "Pasal ini mengatur tentang tindak pidana pembunuhan."
        },
        # Add more articles...
    ]
    
    for article_data in articles_data:
        client.query("""
            INSERT Article {
                number := <str>$number,
                content := <str>$content,
                explanation := <str>$explanation,
                parent_law := (SELECT LegalDocument FILTER .id = <uuid>$law_id)
            }
        """, number=article_data["number"], 
             content=article_data["content"],
             explanation=article_data["explanation"],
             law_id=kuhp.id)
        
        print(f"Added Article {article_data['number']}")

# Sample data - Legal Terms
def ingest_legal_terms():
    """Ingest common legal terms"""
    
    terms = [
        {
            "term": "Melawan Hukum",
            "definition": "Perbuatan yang bertentangan dengan hukum atau tanpa hak",
            "examples": ["Mengambil barang orang lain tanpa izin", "Masuk ke properti orang lain tanpa izin"]
        },
        {
            "term": "Pidana Penjara",
            "definition": "Hukuman berupa pencabutan kemerdekaan seseorang dengan menempatkannya di lembaga pemasyarakatan",
            "examples": ["Pidana penjara 5 tahun", "Pidana penjara seumur hidup"]
        },
        # Add more terms...
    ]
    
    for term_data in terms:
        client.query("""
            INSERT LegalTerm {
                term := <str>$term,
                definition := <str>$definition,
                examples := <array<str>>$examples
            }
        """, **term_data)
        
        print(f"Added term: {term_data['term']}")

# Run ingestion
if __name__ == "__main__":
    print("Starting legal data ingestion...")
    
    ingest_kuhp()
    ingest_legal_terms()
    
    print("Data ingestion complete!")
    
    # Verify
    count = client.query_single("SELECT count(LegalDocument)")
    print(f"Total documents: {count}")
    
    count = client.query_single("SELECT count(Article)")
    print(f"Total articles: {count}")
```

**D. Create Knowledge Graph Service**
```python
# backend/services/knowledge_graph_service.py

import edgedb
import os
from typing import List, Dict, Any, Optional

class KnowledgeGraphService:
    """EdgeDB knowledge graph service"""
    
    def __init__(self):
        self.client = edgedb.create_client(
            dsn=f"edgedb://{os.getenv('EDGEDB_INSTANCE')}?secret_key={os.getenv('EDGEDB_SECRET_KEY')}"
        )
    
    async def search_articles(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search for relevant articles"""
        results = self.client.query("""
            SELECT Article {
                number,
                content,
                explanation,
                parent_law: {
                    title,
                    document_type,
                    number,
                    year
                }
            }
            FILTER contains(Article.content, <str>$query)
            LIMIT <int16>$limit
        """, query=query, limit=limit)
        
        return [
            {
                "article_number": r.number,
                "content": r.content,
                "explanation": r.explanation,
                "law": {
                    "title": r.parent_law.title,
                    "type": r.parent_law.document_type,
                    "number": r.parent_law.number,
                    "year": r.parent_law.year
                }
            }
            for r in results
        ]
    
    async def get_article_by_number(self, law_id: str, article_number: str) -> Optional[Dict[str, Any]]:
        """Get specific article"""
        result = self.client.query_single("""
            SELECT Article {
                number,
                content,
                explanation,
                parent_law: {
                    title,
                    document_type
                },
                related_articles: {
                    number,
                    content
                }
            }
            FILTER .number = <str>$article_number
            AND .parent_law.id = <uuid>$law_id
        """, article_number=article_number, law_id=law_id)
        
        if not result:
            return None
        
        return {
            "article_number": result.number,
            "content": result.content,
            "explanation": result.explanation,
            "law": {
                "title": result.parent_law.title,
                "type": result.parent_law.document_type
            },
            "related_articles": [
                {"number": a.number, "content": a.content}
                for a in result.related_articles
            ]
        }
    
    async def search_legal_terms(self, term: str) -> List[Dict[str, Any]]:
        """Search legal terms"""
        results = self.client.query("""
            SELECT LegalTerm {
                term,
                definition,
                examples
            }
            FILTER contains(LegalTerm.term, <str>$term)
        """, term=term)
        
        return [
            {
                "term": r.term,
                "definition": r.definition,
                "examples": r.examples
            }
            for r in results
        ]

knowledge_graph_service = KnowledgeGraphService()
```

**E. Integrate with AI Service**
```python
# Update backend/services/ark_ai_service.py

from .knowledge_graph_service import knowledge_graph_service

class ArkAIService:
    # ... existing code ...
    
    async def legal_consultation(
        self,
        user_query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        legal_context: Optional[Dict[str, Any]] = None,
        persona: str = "default"
    ) -> Dict[str, Any]:
        """Enhanced with knowledge graph"""
        
        # Search knowledge graph for relevant context
        relevant_articles = await knowledge_graph_service.search_articles(user_query, limit=5)
        relevant_terms = await knowledge_graph_service.search_legal_terms(user_query)
        
        # Add to legal context
        if not legal_context:
            legal_context = {}
        
        if relevant_articles:
            legal_context["relevant_articles"] = [
                f"Pasal {a['article_number']} {a['law']['title']}: {a['content']}"
                for a in relevant_articles
            ]
        
        if relevant_terms:
            legal_context["relevant_terms"] = [
                f"{t['term']}: {t['definition']}"
                for t in relevant_terms
            ]
        
        # Continue with existing logic...
        return await super().legal_consultation(
            user_query, conversation_history, legal_context, persona
        )
```

**Checklist:**
- [ ] EdgeDB schema defined
- [ ] Migration applied
- [ ] KUHP data ingested
- [ ] Legal terms ingested
- [ ] Knowledge graph service created
- [ ] Integrated with AI service
- [ ] Search functionality tested

---

## 📅 Timeline Summary

### Week 5 (Current)
- **Day 1-2**: Verifikasi & stabilisasi (Langkah 1-3)
- **Day 3-4**: Stripe integration (Langkah 4)
- **Day 5**: EdgeDB data population (Langkah 5)

### Week 6
- **Day 1-2**: Frontend integration untuk Stripe
- **Day 3-4**: Testing menyeluruh
- **Day 5**: Bug fixes & optimization

### Week 7
- **Day 1-3**: Deployment ke production
- **Day 4-5**: Monitoring & adjustments

### Week 8
- **Day 1-5**: Fase 2 features (Dual-AI, Document processing)

---

## ✅ Daily Checklist

### Setiap Hari:
- [ ] Commit code changes
- [ ] Update documentation
- [ ] Test new features
- [ ] Check error logs
- [ ] Monitor performance

### Setiap Minggu:
- [ ] Review progress
- [ ] Update roadmap
- [ ] Team sync (if applicable)
- [ ] User feedback review
- [ ] Performance analysis

---

## 🎯 Success Criteria

### Week 5 Goals:
- [ ] Backend stable dan running
- [ ] Authentication working perfectly
- [ ] AI chat fully functional
- [ ] Stripe integration complete
- [ ] EdgeDB populated with initial data

### Week 6 Goals:
- [ ] All features tested
- [ ] No critical bugs
- [ ] Performance optimized
- [ ] Documentation updated

### Week 7 Goals:
- [ ] Deployed to production
- [ ] Monitoring active
- [ ] Users can register & use
- [ ] Payments working

---

## 📞 Support & Resources

### When Stuck:
1. Check documentation in `/docs`
2. Review API docs at `/docs` endpoint
3. Check error logs in Sentry
4. Test with Postman/curl
5. Ask for help (GitHub issues, team, etc.)

### Useful Commands:
```bash
# Start backend
cd backend && uvicorn app:app --reload --port 8001

# Run database setup
python backend/scripts/setup_databases.py

# Apply migrations
alembic upgrade head

# Test endpoints
curl http://localhost:8001/api/health

# Check logs
tail -f logs/app.log

# Run tests
pytest backend/tests/
```

---

**Current Status**: 📍 Week 5, Day 1  
**Next Milestone**: Stripe Integration Complete  
**Target**: Production Deployment by Week 7

🚀 **Let's build Pasalku.ai!**

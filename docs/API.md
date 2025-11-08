# 📖 Pasalku.AI API Documentation

**Base URL:** `https://api.pasalku.ai` (Production) | `http://localhost:8000` (Development)

**Version:** v1.0  
**Authentication:** Bearer Token (JWT)

---

## 🔐 Authentication

### Register User

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "tier": "free",
  "created_at": "2025-11-08T12:00:00Z"
}
```

### Login

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## 💬 AI Chat

### Send Message

**POST** `/api/chat`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Apa saja hak-hak karyawan menurut UU Ketenagakerjaan?",
  "context": {
    "conversation_id": "conv_xyz789",
    "user_tier": "professional"
  }
}
```

**Response:** `200 OK`
```json
{
  "response": "Berikut hak-hak karyawan berdasarkan UU No. 13 Tahun 2003...",
  "citations": [
    {
      "pasal": "Pasal 88 UU 13/2003",
      "content": "Setiap pekerja/buruh berhak memperoleh penghasilan...",
      "relevance": 0.95
    }
  ],
  "conversation_id": "conv_xyz789",
  "message_id": "msg_abc456",
  "metadata": {
    "model_used": "groq-llama-3.1-70b",
    "processing_time_ms": 1250,
    "confidence": 0.94
  }
}
```

### Get Conversation History

**GET** `/api/chat/conversations/{conversation_id}`

**Response:** `200 OK`
```json
{
  "conversation_id": "conv_xyz789",
  "messages": [
    {
      "role": "user",
      "content": "Apa itu KUHP?",
      "timestamp": "2025-11-08T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "KUHP adalah Kitab Undang-Undang Hukum Pidana...",
      "timestamp": "2025-11-08T10:00:02Z"
    }
  ],
  "total_messages": 10,
  "created_at": "2025-11-08T10:00:00Z"
}
```

---

## 📄 Legal AI Analysis

### Analyze Document

**POST** `/api/legal-ai/analyze`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Body:**
```
document: [PDF/DOCX file]
analysis_type: "contract" | "legal_opinion" | "case_review"
```

**Response:** `200 OK`
```json
{
  "analysis_id": "analysis_123",
  "document_type": "contract",
  "findings": {
    "summary": "Kontrak kerjasama yang mengatur...",
    "key_clauses": [
      {
        "clause": "Pasal 5 - Jangka Waktu",
        "analysis": "Kontrak berlaku selama 12 bulan...",
        "risk_level": "low"
      }
    ],
    "risks": [
      {
        "type": "legal_compliance",
        "description": "Klausul sanksi tidak sesuai UU Perlindungan Konsumen",
        "severity": "high",
        "recommendation": "Revisi pasal 8 untuk compliance"
      }
    ],
    "compliance_score": 0.85
  },
  "citations": [...],
  "processing_time_ms": 3500
}
```

### Generate Strategic Report

**POST** `/api/proactive-chat/generate-report`

**Body:**
```json
{
  "session_id": "session_abc123",
  "report_type": "strategic_analysis"
}
```

**Response:** `200 OK`
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="strategic_report_20251108.pdf"

[PDF Binary Data]
```

---

## 🎯 Proactive Orchestrator

### Start Proactive Session

**POST** `/api/proactive-chat/start`

**Body:**
```json
{
  "initial_query": "Saya ingin membuat kontrak kerjasama",
  "user_tier": "professional"
}
```

**Response:** `200 OK`
```json
{
  "session_id": "session_abc123",
  "stage": "initial_analysis",
  "response": "Saya akan membantu Anda membuat kontrak kerjasama...",
  "clarification_questions": [
    {
      "id": "q1",
      "question": "Siapa pihak yang terlibat dalam kerjasama?",
      "type": "text",
      "required": true
    }
  ],
  "feature_offerings": [
    {
      "feature_id": "contract_analysis",
      "title": "Analisis Kontrak Pro",
      "description": "AI review komprehensif",
      "tier_required": "professional",
      "has_access": true
    }
  ]
}
```

### Submit Answers

**POST** `/api/proactive-chat/answer`

**Body:**
```json
{
  "session_id": "session_abc123",
  "answers": [
    {
      "question_id": "q1",
      "answer": "PT ABC dan PT XYZ"
    }
  ]
}
```

---

## 📚 Legal Knowledge Base

### Search Legal Terms

**GET** `/api/kamus/search?q={query}&limit=10`

**Response:** `200 OK`
```json
{
  "results": [
    {
      "id": "term_123",
      "term": "Pidana",
      "definition": "Hukuman yang dijatuhkan kepada pelaku tindak pidana...",
      "category": "Hukum Pidana",
      "related_terms": ["Tindak Pidana", "Sanksi", "KUHP"]
    }
  ],
  "total": 1,
  "query": "pidana"
}
```

### Get Legal Articles

**GET** `/api/legal-basis/pasal/{pasal_number}`

**Example:** `/api/legal-basis/pasal/88`

**Response:** `200 OK`
```json
{
  "pasal": "Pasal 88",
  "uu": "UU No. 13 Tahun 2003 (Ketenagakerjaan)",
  "content": "Setiap pekerja/buruh berhak memperoleh penghasilan...",
  "penjelasan": "Pasal ini mengatur hak pekerja atas upah...",
  "related_pasal": ["Pasal 89", "Pasal 90"]
}
```

---

## 💳 Payment & Subscription

### Create Subscription

**POST** `/api/payments/subscribe`

**Body:**
```json
{
  "tier": "professional",
  "billing_cycle": "monthly",
  "payment_method": "gopay"
}
```

**Response:** `200 OK`
```json
{
  "subscription_id": "sub_xyz123",
  "status": "pending_payment",
  "amount": 99000,
  "currency": "IDR",
  "payment_url": "https://gopay.payment.link/abc123",
  "expires_at": "2025-11-08T13:00:00Z"
}
```

### Check Subscription Status

**GET** `/api/payments/subscription/status`

**Response:** `200 OK`
```json
{
  "subscription_id": "sub_xyz123",
  "tier": "professional",
  "status": "active",
  "current_period_start": "2025-11-01T00:00:00Z",
  "current_period_end": "2025-12-01T00:00:00Z",
  "cancel_at_period_end": false
}
```

---

## 📊 Analytics

### Get Usage Stats

**GET** `/api/analytics/usage`

**Response:** `200 OK`
```json
{
  "period": "current_month",
  "chat_messages": 150,
  "documents_analyzed": 5,
  "api_calls": 450,
  "quota": {
    "chat_messages": 1000,
    "documents": 20,
    "api_calls": 5000
  },
  "usage_percentage": 15
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: message",
    "details": {
      "field": "message",
      "issue": "required"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "INSUFFICIENT_TIER",
    "message": "This feature requires Professional tier",
    "upgrade_url": "/pricing"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req_abc123"
  }
}
```

---

## 🔢 Rate Limits

| Tier | Requests/minute | Requests/hour |
|------|----------------|---------------|
| Free | 20 | 500 |
| Professional | 100 | 5,000 |
| Premium | 200 | 20,000 |

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699459200
```

---

## 🌐 Webhooks

### Register Webhook

**POST** `/api/webhooks/register`

**Body:**
```json
{
  "url": "https://yourapp.com/webhooks/pasalku",
  "events": ["analysis.completed", "subscription.updated"],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

**analysis.completed**
```json
{
  "event": "analysis.completed",
  "timestamp": "2025-11-08T12:00:00Z",
  "data": {
    "analysis_id": "analysis_123",
    "status": "completed",
    "result_url": "/api/analysis/123/result"
  }
}
```

---

## 📦 SDKs

### JavaScript/TypeScript
```bash
npm install @pasalku/sdk
```

```typescript
import { PasalkuClient } from '@pasalku/sdk'

const client = new PasalkuClient({
  apiKey: 'your_api_key'
})

const response = await client.chat.send({
  message: 'Apa itu KUHP?'
})
```

### Python
```bash
pip install pasalku-python
```

```python
from pasalku import PasalkuClient

client = PasalkuClient(api_key='your_api_key')

response = client.chat.send(
    message='Apa itu KUHP?'
)
```

---

## 🆘 Support

- 📧 Email: api@pasalku.ai
- 💬 Discord: [Join](https://discord.gg/pasalku-ai)
- 📚 Docs: https://docs.pasalku.ai
- 🐛 Issues: https://github.com/yhyaa294/pasalku-ai/issues

---

**Last Updated:** November 8, 2025  
**API Version:** 1.0.0

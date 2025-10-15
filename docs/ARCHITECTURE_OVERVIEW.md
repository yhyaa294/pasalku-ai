# Arsitektur Teknis Pasalku.ai

> Dokumen ini menjelaskan bagaimana konsep Pasalku.ai diterjemahkan ke dalam arsitektur teknis yang konkret.

---

## 🏗️ Arsitektur High-Level

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Web App     │  │  Mobile App  │  │  API Clients │        │
│  │  (Next.js)   │  │  (Future)    │  │  (Partners)  │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼───────────────┐
│                     API GATEWAY LAYER                          │
│  - Rate Limiting  - Authentication  - Load Balancing           │
│  - Request Routing  - CORS  - Response Caching                 │
└─────────┬──────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (FastAPI)                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  ROUTERS (Endpoints)                     │  │
│  │  /chat  /documents  /analysis  /users  /admin           │  │
│  └────────────────────┬────────────────────────────────────┘  │
│                       │                                        │
│  ┌────────────────────▼────────────────────────────────────┐  │
│  │                BUSINESS LOGIC LAYER                     │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Dual AI    │  │  Document    │  │  Knowledge   │ │  │
│  │  │   Service    │  │  Service     │  │  Graph Svc   │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │  │
│  │         │                  │                  │         │  │
│  │  ┌──────▼──────────────────▼──────────────────▼──────┐ │  │
│  │  │          ORCHESTRATION LAYER                      │ │  │
│  │  │  - Workflow Management  - Cache Management        │ │  │
│  │  │  - Error Handling  - Logging & Monitoring         │ │  │
│  │  └───────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────┬──────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  EdgeDB      │  │  MongoDB     │  │  Redis       │        │
│  │  Repository  │  │  Repository  │  │  Cache       │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼───────────────┐
│                     PERSISTENCE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   EdgeDB     │  │   MongoDB    │  │    Redis     │        │
│  │  (Relations) │  │  (Documents) │  │   (Cache)    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ BytePlus Ark │  │     Groq     │  │   Rollbar    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Alur Data: Dari Pertanyaan ke Jawaban

### Skenario: User mengajukan pertanyaan hukum

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. "Bagaimana cara menggugat tetangga yang membangun tembok?"
     ▼
┌────────────────┐
│  Next.js App   │
│  ChatInterface │
└────┬───────────┘
     │ 2. POST /api/chat/message
     ▼
┌─────────────────────────────┐
│  FastAPI Backend            │
│  routers/chat.py            │
└────┬────────────────────────┘
     │ 3. Validate & Parse Input
     ▼
┌─────────────────────────────┐
│  AI Service Orchestrator    │
└────┬────────────────────────┘
     │
     ├─── 4a. BytePlus Ark API ──┐
     │                            │
     └─── 4b. Groq API ──────────┤
                                  │
     ┌────────────────────────────┘
     │ 5. Dual responses received
     ▼
┌─────────────────────────────┐
│  AI Consensus Engine        │
│  - Compare outputs          │
│  - Calculate confidence     │
│  - Merge results            │
└────┬────────────────────────┘
     │ 6. Consensus answer
     ▼
┌─────────────────────────────┐
│  Knowledge Graph Service    │
│  - Semantic search EdgeDB   │
│  - Find relevant citations  │
└────┬────────────────────────┘
     │ 7. Citations found
     ▼
┌─────────────────────────────┐
│  Response Builder           │
│  - Format answer            │
│  - Add citations            │
│  - Add disclaimer           │
└────┬────────────────────────┘
     │ 8. Structured response
     ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  - Save conversation        │
│  - Update user history      │
└────┬────────────────────────┘
     │ 9. Success confirmation
     ▼
┌──────────┐
│   USER   │ ← 10. Display formatted answer with citations
└──────────┘
```

---

## 🧩 Komponen Utama

### 1. Dual AI Service

**Lokasi:** `backend/services/ai/`

**Struktur:**
```
services/ai/
├── __init__.py
├── byteplus_service.py      # BytePlus Ark integration
├── groq_service.py           # Groq integration
├── consensus_engine.py       # AI consensus logic
├── prompt_templates.py       # Prompt engineering
└── models.py                 # Pydantic models
```

**Flow:**
```python
# Simplified pseudo-code
async def get_ai_response(query: str):
    # Parallel processing
    byteplus_task = byteplus_service.query(query)
    groq_task = groq_service.query(query)
    
    byteplus_result, groq_result = await asyncio.gather(
        byteplus_task, 
        groq_task
    )
    
    # Consensus
    final_result = consensus_engine.merge(
        byteplus_result,
        groq_result
    )
    
    return final_result
```

**Consensus Algorithm:**
```python
def calculate_consensus(response_a, response_b):
    # Semantic similarity
    similarity = calculate_semantic_similarity(
        response_a.content, 
        response_b.content
    )
    
    # Confidence scoring
    confidence_a = response_a.confidence
    confidence_b = response_b.confidence
    
    # Weight calculation
    if similarity > 0.85:  # High agreement
        # Take highest confidence
        return max(confidence_a, confidence_b)
    elif similarity > 0.60:  # Moderate agreement
        # Merge with weighted average
        return merge_weighted(response_a, response_b)
    else:  # Low agreement
        # Flag for human review or use conservative approach
        return conservative_merge(response_a, response_b)
```

---

### 2. Knowledge Graph Service

**Lokasi:** `backend/services/knowledge_graph/`

**EdgeDB Schema (Simplified):**
```edgedb
# Legal Document Types
type LegalDocument {
    required property title -> str;
    required property type -> DocumentType;
    property content -> str;
    property publish_date -> datetime;
    property effective_date -> datetime;
    property status -> DocumentStatus;
    
    # Relations
    multi link citations -> LegalDocument;
    multi link amended_by -> LegalDocument;
    multi link supersedes -> LegalDocument;
}

# Articles/Pasal
type Article {
    required property number -> str;
    required property content -> str;
    required link document -> LegalDocument;
    
    # Relations
    multi link related_articles -> Article;
    multi link cases -> CourtCase;
}

# Court Cases
type CourtCase {
    required property case_number -> str;
    required property summary -> str;
    property decision_date -> datetime;
    property court_level -> CourtLevel;
    
    # Relations
    multi link cited_articles -> Article;
    multi link related_cases -> CourtCase;
}

# Semantic Tags
type LegalTopic {
    required property name -> str;
    property description -> str;
    
    multi link documents -> LegalDocument;
    multi link articles -> Article;
}
```

**Semantic Search Flow:**
```python
async def semantic_search(query: str, context: dict):
    # 1. Extract legal entities from query
    entities = extract_legal_entities(query)
    
    # 2. Determine legal domain
    domain = classify_legal_domain(query)
    
    # 3. EdgeDB query with semantic matching
    results = await edgedb.query("""
        SELECT LegalDocument {
            title,
            content,
            articles: {
                number,
                content
            },
            relevance := semantic_score(<str>$query, .content)
        }
        FILTER .type = <DocumentType>$domain
        ORDER BY .relevance DESC
        LIMIT 10
    """, query=query, domain=domain)
    
    # 4. Citation extraction
    citations = extract_citations(results)
    
    return CitationResult(
        documents=results,
        citations=citations,
        confidence=calculate_relevance_confidence(results)
    )
```

---

### 3. Document Intelligence Service

**Lokasi:** `backend/services/document_ai/`

**Capabilities:**
- OCR (Tesseract / Google Vision API)
- Document classification
- Key information extraction
- Contract analysis

**Flow:**
```python
async def analyze_document(file: UploadFile):
    # 1. File validation
    validate_file_type(file)
    
    # 2. OCR if needed
    if is_image_or_scan(file):
        text = await ocr_service.extract_text(file)
    else:
        text = await extract_text_from_pdf(file)
    
    # 3. Document classification
    doc_type = classify_document(text)
    
    # 4. Entity extraction
    entities = extract_entities(text, doc_type)
    
    # 5. Specialized analysis
    if doc_type == "contract":
        analysis = await contract_analyzer.analyze(text, entities)
    elif doc_type == "court_document":
        analysis = await court_doc_analyzer.analyze(text, entities)
    else:
        analysis = await generic_analyzer.analyze(text, entities)
    
    return DocumentAnalysisResult(
        text=text,
        doc_type=doc_type,
        entities=entities,
        analysis=analysis
    )
```

---

### 4. Reasoning Chain Analyzer

**Lokasi:** `backend/services/reasoning/`

**Purpose:** Detect logical fallacies and strengthen legal arguments

**Implementation:**
```python
class ReasoningChainAnalyzer:
    def analyze_argument(self, argument: str) -> ReasoningAnalysis:
        # 1. Break down argument into premises and conclusions
        structure = self.parse_argument_structure(argument)
        
        # 2. Identify logical connectors
        connectors = self.identify_logical_connectors(structure)
        
        # 3. Check for common fallacies
        fallacies = self.detect_fallacies(structure)
        
        # 4. Validate legal reasoning
        legal_validity = self.validate_legal_reasoning(structure)
        
        # 5. Suggest improvements
        suggestions = self.generate_improvements(structure, fallacies)
        
        return ReasoningAnalysis(
            structure=structure,
            fallacies=fallacies,
            validity_score=legal_validity,
            suggestions=suggestions
        )
```

---

## 🗄️ Database Strategy

### EdgeDB (Knowledge Graph)
**Use Cases:**
- Legal documents with complex relationships
- Citation networks
- Hierarchical regulations
- Semantic relationships

**Advantages:**
- Strong typing
- Built-in graph queries
- Schema evolution
- ACID compliance

---

### MongoDB (Operational Data)
**Use Cases:**
- User conversations
- Chat history
- Uploaded documents (metadata)
- User profiles
- Session data

**Advantages:**
- Flexible schema
- Fast writes
- Good for unstructured data
- Easy horizontal scaling

---

### Redis (Caching)
**Use Cases:**
- AI response caching
- Session management
- Rate limiting
- Real-time analytics

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────┐
│              SECURITY LAYERS                        │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  1. Authentication & Authorization          │   │
│  │  - JWT tokens                                │   │
│  │  - OAuth2 (Google, etc.)                    │   │
│  │  - Role-based access control (RBAC)         │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  2. Data Encryption                         │   │
│  │  - TLS 1.3 in transit                       │   │
│  │  - AES-256 at rest                          │   │
│  │  - Field-level encryption (PII)             │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  3. API Security                            │   │
│  │  - Rate limiting                            │   │
│  │  - Input validation & sanitization          │   │
│  │  - CORS configuration                       │   │
│  │  - API key management                       │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  4. Audit & Monitoring                      │   │
│  │  - Request logging                          │   │
│  │  - Error tracking (Rollbar)                 │   │
│  │  - Security event alerts                    │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring & Observability

### Metrics to Track

**Application Metrics:**
- Request latency (p50, p95, p99)
- Error rates
- API endpoint usage
- Concurrent users

**AI Metrics:**
- Model response time
- Consensus agreement rate
- Citation accuracy
- User satisfaction scores

**Infrastructure Metrics:**
- CPU/Memory usage
- Database query performance
- Cache hit rates
- Network throughput

### Tools
- **Logging:** Python `logging` + file rotation
- **Error Tracking:** Rollbar
- **Performance:** FastAPI built-in metrics
- **Uptime:** UptimeRobot / Pingdom

---

## 🚀 Deployment Architecture

```
┌────────────────────────────────────────────────────┐
│              PRODUCTION ENVIRONMENT                │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │         Load Balancer (Nginx)            │    │
│  └─────┬──────────────────────────┬─────────┘    │
│        │                          │               │
│  ┌─────▼────────┐        ┌───────▼──────┐       │
│  │  Next.js     │        │  Next.js     │       │
│  │  Instance 1  │        │  Instance 2  │       │
│  └─────┬────────┘        └───────┬──────┘       │
│        │                          │               │
│        └──────────┬───────────────┘               │
│                   │                               │
│  ┌────────────────▼────────────────────────┐     │
│  │      API Gateway (FastAPI)              │     │
│  │      (Multiple instances)               │     │
│  └────────────────┬────────────────────────┘     │
│                   │                               │
│  ┌────────────────▼────────────────────────┐     │
│  │      Database Cluster                   │     │
│  │  ┌───────────┐  ┌──────────┐           │     │
│  │  │  EdgeDB   │  │ MongoDB  │           │     │
│  │  │  Primary  │  │ Replica  │           │     │
│  │  └───────────┘  └──────────┘           │     │
│  └──────────────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
```

---

## 📚 Referensi Dokumen Terkait

- [Concept Map](./CONCEPT_MAP.md)
- [Database Schema Details](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Last Updated:** 15 Oktober 2025  
**Version:** 1.0

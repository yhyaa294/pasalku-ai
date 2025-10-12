# Pasalku.ai Database Architecture

## Overview
Pasalku.ai menggunakan arsitektur "Blockchain-Inspired" dengan multiple specialized databases untuk optimal performance, scalability, dan data integrity.

## Database Stack

### 1. Neon PostgreSQL Instance 1 (Main Application Database)
**Purpose**: Core application data - Users, Authentication, Subscriptions

**Tables**:
- `users` - User accounts dengan Clerk integration
- `verification_requests` - Professional verification requests
- `subscriptions` - Subscription history dan billing
- `audit_logs` - Security audit trail

**Key Features**:
- ACID compliance untuk transactional data
- Clerk user ID sebagai primary key
- Role-Based Access Control (RBAC)
- Comprehensive audit logging

**Connection**: `DATABASE_URL` atau `DATABASE_URL_NEON_1`

---

### 2. Neon PostgreSQL Instance 2 (Session Metadata)
**Purpose**: Chat session metadata, document metadata, analytics

**Tables**:
- `chat_sessions` - Chat session metadata dengan PIN protection
- `document_metadata` - Document upload metadata
- `ai_query_logs` - AI query logging untuk billing dan analytics
- `session_analytics` - Aggregated session statistics

**Key Features**:
- Separation of concerns dari user data
- Fast metadata queries
- Analytics-ready structure
- MongoDB references untuk full content

**Connection**: `DATABASE_URL_NEON_2`

---

### 3. MongoDB (Unstructured Data Storage)
**Purpose**: Full chat transcripts, document content, large unstructured data

**Collections**:
- `chat_transcripts` - Full conversation history
- `document_analyses` - Complete document analysis results
- `verification_documents` - Professional verification documents (binary)
- `ai_response_cache` - Cached AI responses untuk common queries
- `knowledge_graph_cache` - Cached EdgeDB query results
- `user_activity_logs` - Detailed user activity tracking
- `dual_ai_comparisons` - Dual-AI verification results
- `feature_flag_cache` - Feature flags cache

**Key Features**:
- Flexible schema untuk evolving data structures
- GridFS untuk large file storage
- Efficient full-text search
- Horizontal scalability

**Connection**: `MONGODB_URI` + `MONGO_DB_NAME`

---

### 4. Turso (Edge SQLite Cache)
**Purpose**: Edge caching untuk low-latency access

**Tables**:
- `ai_response_cache` - Frequently accessed AI responses
- `feature_flags` - Feature flag cache dari Statsig/Hypertune

**Key Features**:
- Ultra-low latency (<10ms)
- Global edge distribution
- Automatic replication
- TTL-based expiration

**Connection**: `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`

---

### 5. EdgeDB (Knowledge Graph)
**Purpose**: Legal knowledge graph - laws, regulations, precedents

**Schema** (to be defined in `.esdl` files):
- Legal documents hierarchy
- Article relationships
- Case law connections
- Legal term definitions

**Key Features**:
- Graph-like queries dengan SQL-like syntax
- Strong typing
- Built-in migrations
- Efficient relationship traversal

**Connection**: `EDGEDB_INSTANCE` + `EDGEDB_SECRET_KEY`

---

### 6. Supabase PostgreSQL (Realtime & Edge Functions)
**Purpose**: Realtime notifications, edge computing

**Features**:
- Realtime subscriptions untuk notifications
- Edge functions untuk serverless logic
- Built-in authentication (backup untuk Clerk)
- Storage untuk public assets

**Connection**: `PASALKU_AI_SUPABASE_URL` + keys

---

## Data Flow Architecture

### User Registration Flow
```
1. User registers via Clerk
2. Clerk webhook → Backend /api/auth/sync
3. Create user record in Neon 1
4. Log action in audit_logs
5. Initialize user preferences
```

### Chat Session Flow
```
1. User starts chat
2. Create session metadata in Neon 2
3. Store messages in MongoDB (chat_transcripts)
4. Log AI queries in Neon 2 (ai_query_logs)
5. Update session analytics in Neon 2
6. Cache common responses in Turso
```

### Document Upload Flow
```
1. User uploads document
2. Store file in MongoDB GridFS
3. Create metadata in Neon 2 (document_metadata)
4. Trigger Inngest workflow for processing
5. AI analysis → results in MongoDB (document_analyses)
6. Update metadata with summary in Neon 2
```

### Professional Verification Flow
```
1. User submits verification request
2. Upload documents to MongoDB (verification_documents)
3. Create request in Neon 1 (verification_requests)
4. Admin reviews via admin panel
5. Approve → Update user role in Neon 1
6. Log action in audit_logs
```

### AI Query with Dual Verification
```
1. User sends query
2. Query both Ark and Groq in parallel
3. Compare responses
4. Store comparison in MongoDB (dual_ai_comparisons)
5. Log queries in Neon 2 (ai_query_logs)
6. Return merged/selected response
7. Cache in Turso if frequently asked
```

---

## Database Schema Diagrams

### Neon Instance 1 (Users & Auth)
```
users
├── id (PK, Clerk user ID)
├── email (unique)
├── role (enum: masyarakat_umum, profesional_hukum, admin)
├── subscription_tier (enum: free, premium, enterprise)
├── stripe_customer_id
├── verification_status
└── timestamps

verification_requests
├── id (PK, UUID)
├── user_id (FK → users)
├── status (enum: pending, approved, rejected)
├── documents (JSON, refs to MongoDB)
└── review details

subscriptions
├── id (PK, UUID)
├── user_id (FK → users)
├── stripe_subscription_id
├── tier
├── status
└── billing details

audit_logs
├── id (PK, UUID)
├── user_id
├── action
├── resource_type
├── metadata (JSON)
└── timestamp
```

### Neon Instance 2 (Sessions & Metadata)
```
chat_sessions
├── id (PK, UUID)
├── user_id
├── mongodb_transcript_id (ref to MongoDB)
├── pin_hash (encrypted)
├── ai_model
├── message_count
├── rating
└── timestamps

document_metadata
├── id (PK, UUID)
├── user_id
├── session_id (FK → chat_sessions)
├── mongodb_document_id (ref to MongoDB GridFS)
├── processing_status
├── ai_summary
└── timestamps

ai_query_logs
├── id (PK, UUID)
├── user_id
├── session_id
├── query_type
├── ai_provider
├── tokens (prompt, completion, total)
├── response_time_ms
└── timestamp

session_analytics
├── id (PK, UUID)
├── session_id (unique)
├── total_messages
├── total_tokens
├── avg_confidence_score
└── timestamps
```

---

## Database Migrations

### Alembic (PostgreSQL)
```bash
# Create new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### EdgeDB
```bash
# Create migration
edgedb migration create

# Apply migration
edgedb migration apply

# Check status
edgedb migration status
```

---

## Backup Strategy

### Neon PostgreSQL
- Automatic daily backups
- Point-in-time recovery (PITR)
- Retention: 30 days

### MongoDB
- Automated backups via MongoDB Atlas
- Snapshot frequency: Every 6 hours
- Retention: 7 days

### Turso
- Automatic replication across regions
- No manual backup needed (ephemeral cache)

### EdgeDB
- Daily automated backups
- Manual backups before major schema changes

---

## Performance Optimization

### Indexing Strategy
- All foreign keys indexed
- Timestamp columns indexed for time-based queries
- User_id indexed in all tables
- Full-text indexes in MongoDB collections

### Query Optimization
- Use Turso cache for frequently accessed data
- Batch operations where possible
- Lazy loading untuk large datasets
- Pagination for list endpoints

### Caching Layers
1. **Turso** - Edge cache (TTL: 5-60 minutes)
2. **MongoDB cache collections** - Application cache (TTL: 1-24 hours)
3. **Application memory** - In-process cache (TTL: 1-5 minutes)

---

## Security Measures

### Data Encryption
- All connections use SSL/TLS
- Sensitive fields encrypted at rest
- PIN hashes use bcrypt with salt

### Access Control
- Database credentials in environment variables
- Least privilege principle
- Separate read/write credentials where possible

### Audit Trail
- All user actions logged in audit_logs
- IP address and user agent tracking
- Immutable audit records

---

## Monitoring & Alerts

### Health Checks
- `/api/health/detailed` endpoint checks all databases
- Checkly monitors database connectivity
- Sentry tracks database errors

### Metrics to Monitor
- Connection pool usage
- Query response times
- Error rates
- Storage usage
- Cache hit rates

### Alerts
- Database connection failures
- Slow queries (>1s)
- High error rates (>1%)
- Storage approaching limits (>80%)

---

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in all database credentials.

### 3. Run Database Setup
```bash
python backend/scripts/setup_databases.py
```

### 4. Verify Connections
```bash
python backend/test_db_connections.py
```

### 5. Apply Migrations
```bash
cd backend
alembic upgrade head
```

---

## Troubleshooting

### Connection Issues
1. Verify environment variables
2. Check firewall/security groups
3. Verify SSL certificates
4. Test with connection string directly

### Migration Issues
1. Check Alembic version compatibility
2. Verify database user has CREATE permissions
3. Review migration logs
4. Rollback and retry if needed

### Performance Issues
1. Check query execution plans
2. Review index usage
3. Monitor connection pool
4. Consider adding caching

---

## Future Enhancements

### Phase 2
- Read replicas untuk Neon instances
- Sharding strategy untuk MongoDB
- Redis integration untuk session management

### Phase 3
- Multi-region deployment
- Active-active replication
- Advanced analytics database (ClickHouse/TimescaleDB)

---

## Support & Documentation

- **Neon**: https://neon.tech/docs
- **MongoDB**: https://docs.mongodb.com
- **Turso**: https://docs.turso.tech
- **EdgeDB**: https://www.edgedb.com/docs
- **Supabase**: https://supabase.com/docs

# PasalKu.ai Production Deployment Guide

## 📋 Prerequisites

### Infrastructure Requirements
- **Docker Engine**: 24.0+
- **Kubernetes Cluster**: 1.26+
- **Helm**: 3.11+
- **PostgreSQL/EdgeDB**: 13+ / 4.0+
- **Redis**: 7.0+
- **Nginx/Ingress Controller**

### API Keys & Secrets
```bash
# Required Environment Variables
ARK_API_KEY="your_byteplus_key"
GROQ_API_KEY="your_groq_key"
DATABASE_URL="postgresql://..."
EDGE_DB_DSN="edgedb://..."
REDIS_URL="redis://..."
JWT_SECRET="your-jwt-secret"

# Optional
GOOGLE_API_KEY="translator-api"
DEEPL_API_KEY="fallback-translator"
```

---

## 🚀 Quick Start Deployment

### 1. Infrastructure Setup

#### Using Docker Compose (Development)
```bash
# Clone repository
git clone https://github.com/yhyaa294/pasalku-ai.git
cd pasalku-ai

# Set environment variables
cp backend/.env.example backend/.env
# Edit .env with your API keys

# Start all services
docker-compose up -d --build

# Verify deployment
curl http://localhost:8000/health
curl http://localhost:3000
```

#### Kubernetes Deployment (Production)
```bash
# Add Helm repository
helm repo add pasalku https://charts.pasalku.ai
helm repo update

# Install with custom values
helm install pasalku pasalku/pasalku-ai \
  --values custom-values.yaml \
  --namespace pasalku \
  --create-namespace

# Verify deployment
kubectl get pods -n pasalku
kubectl get ingress -n pasalku
```

### 2. Database Setup

#### EdgeDB Knowledge Graph
```bash
# Install EdgeDB CLI
edgedb cloud login

# Initialize database
edgedb project init --name pasalku-knowledge-graph

# Apply schema migrations
edgedb migrate

# Seed initial legal data
edgedb query -f scripts/seed_legal_data.edgeql
```

#### MongoDB Vector Store
```bash
# Initialize MongoDB with vector search
mongosh --eval "use pasalku_ai; db.createCollection('legal_documents', {storageEngine: {wiredTiger: {configString: 'block_compressor=zstd'}}})"
mongosh scripts/init_mongodb.js
```

### 3. AI Services Configuration

#### Model Fine-tuning (Optional)
```bash
# Fine-tune BytePlus model for Indonesian legal
python scripts/fine_tune_byteplus.py \
  --dataset legal_corpus_indonesia.jsonl \
  --model ep-20250830093230-swczp \
  --epoch 3

# Validate fine-tuned model
python scripts/validate_fine_tune.py
```

#### Consensus Engine Calibration
```bash
# Run calibration tests
cd backend
python -m pytest services/ai/test_consensus_calibration.py -v

# Adjust confidence thresholds
python scripts/calibrate_consensus.py \
  --test-dataset legal_test_cases.json \
  --output config/consensus_config.yaml
```

---

## 🔍 Monitoring & Observability

### Metrics Collection
```bash
# Prometheus metrics endpoint
curl http://localhost:9090/metrics

# Custom metrics
curl http://localhost:8000/api/v1/metrics/consensus
```

### Logging Setup
```bash
# View application logs
kubectl logs -f deployment/pasalku-backend -n pasalku

# Structured logging configuration
helm upgrade pasalku pasalku/pasalku-ai \
  --set logging.level=INFO \
  --set logging.format=json
```

### Health Checks
```bash
# Individual service health
curl http://localhost:8000/health/ai
curl http://localhost:8000/health/database
curl http://localhost:8000/health/cache

# Full system health check
curl http://localhost:8000/health/system
```

---

## 🔐 Security Configuration

### Network Security
```yaml
# Traefik Ingress Configuration
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: pasalku-secure
spec:
  entryPoints:
    - websecure
  routes:
  - match: Host(`api.pasalku.com`)
    kind: Rule
    services:
    - name: pasalku-backend
      port: 8000
  tls:
    certResolver: letsencrypt
```

### API Security
```bash
# Rate limiting configuration
# Edit config/rate_limits.yaml
global_per_minute: 1000
ai_services_per_hour: 100  # Per user
uploads_per_day: 50       # Per user

# Deploy rate limits
kubectl apply -f config/rate-limits.yaml
```

### Data Encryption
```bash
# Database encryption
# PostgreSQL
ALTER TABLE user_sessions ENCRYPTION KEY 'your-encryption-key';

# EdgeDB
edgedb configure set --name encryption-key your-key-here

# File encryption for uploads
# Configure Cloud Storage with encryption
gcloud storage buckets create gs://pasalku-documents \
  --default-storage-class=STANDARD \
  --encryption-key=projects/your-project/locations/global/keyRings/your-keyring/cryptoKeys/your-key
```

---

## 🔧 Maintenance & Operations

### Database Maintenance
```bash
# Weekly EdgeDB maintenance
edgedb query "MAINTAIN VACUUM;"

# MongoDB optimization
mongosh --eval "db.legal_documents.reIndex();"

# Backup procedures
./scripts/backup.sh --type full --encrypt
```

### Model Updates
```bash
# Update AI models
helm upgrade pasalku pasalku/pasalku-ai \
  --set ark.modelId=ep-20250901000000-updated \
  --set groq.model=mixtral-8x7b-updated

# Validate model performance
python scripts/model_validation.py
```

### Scaling Configuration
```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pasalku-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pasalku-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 🚨 Troubleshooting

### Common Issues

#### AI Service Timeouts
```python
# In backend/.env
# Increase timeout values
ARK_TIMEOUT=120.0
GROQ_TIMEOUT=60.0

# Check service health
curl http://localhost:8000/health/ai-services
```

#### Database Connection Issues
```bash
# Verify EdgeDB connection
edgedb query "SELECT 1;"

# Check PostgreSQL
psql "$DATABASE_URL" -c "SELECT version();"

# Redis connectivity
redis-cli -u "$REDIS_URL" ping
```

#### High Memory Usage
```yaml
# Update resource limits
apiVersion: v1
kind: ResourceQuota
metadata:
  name: pasalku-quota
  namespace: pasalku
spec:
  hard:
    requests.cpu: "2000m"
    requests.memory: "4Gi"
    limits.cpu: "4000m"
    limits.memory: "8Gi"
```

---

## 📊 Performance Optimization

### Caching Strategy
```python
# Redis cache configuration
CACHE_CONFIG = {
    "legal_queries": {"ttl": 3600, "strategy": "lru"},
    "ai_responses": {"ttl": 1800, "strategy": "size_based"},
    "kg_results": {"ttl": 7200, "strategy": "time_based"}
}

# Cache invalidation
redis-cli KEYS "pasalku:*" | xargs redis-cli DEL
```

### Database Optimization
```sql
-- PostgreSQL optimizations
CREATE INDEX CONCURRENTLY idx_user_queries_timestamp
ON user_queries (created_at DESC)
WHERE created_at > NOW() - INTERVAL '30 days';

-- EdgeDB query optimization
CREATE INDEX ON LegalDocument USING btree (type, year);
CREATE INDEX ON LegalDocument USING gin (content_vector);
```

### CDN Setup
```bash
# Cloudflare configuration
# Enable for static assets and API responses
api.cloudflare.com/client/v4/zones/{zone_id}/settings/caching_level

# CDN rules for legal content
# Cache static legal references (laws), but not user queries
```

---

## 🔄 Backup & Recovery

### Automated Backups
```bash
# Daily backup schedule
crontab -e
# 0 2 * * * /opt/pasalku/scripts/backup.sh --type daily

# Backup verification
./scripts/verify_backup.sh backup-2025-10-15.tar.gz
```

### Disaster Recovery
```bash
# Restore from backup
./scripts/restore.sh --backup backup-2025-10-15.tar.gz --validate

# Cross-region failover
kubectl apply -f disaster-recovery/failover-us-west.yaml
```

---

## 📞 Support & Monitoring

### Alert Configuration
```yaml
# AlertManager rules
groups:
- name: pasalku-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
```

### Contact Information
- **Technical Support**: dev@pasalku.ai
- **Security Issues**: security@pasalku.ai
- **Incident Response**: +62-812-3456-7890
- **Documentation**: https://docs.pasalku.ai

---

*Last Updated: October 15, 2025*
*Version: 1.0*
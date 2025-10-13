# Pasalku.ai Monitoring Setup

## Overview

Monitoring setup untuk Pasalku.ai menggunakan Checkly untuk uptime monitoring dan Sentry untuk error tracking.

## Checkly Monitoring

### Prerequisites

- Checkly Account ID: `CHECKLY_ACCOUNT_ID`
- Checkly API Key: `CHECKLY_API_KEY`

### Setup Instructions

1. **Install Checkly CLI**

   ```bash
   npm install -g checkly
   ```

2. **Login to Checkly**

   ```bash
   checkly login
   ```

3. **Set Environment Variables**

   ```bash
   # Windows PowerShell
   $env:CHECKLY_API_KEY="your_api_key"
   $env:CHECKLY_ACCOUNT_ID="your_account_id"
   $env:BACKEND_URL="https://your-backend-url.com"

   # Linux/Mac
   export CHECKLY_API_KEY="your_api_key"
   export CHECKLY_ACCOUNT_ID="your_account_id"
   export BACKEND_URL="https://your-backend-url.com"
   ```

4. **Deploy Monitoring Checks**

   ```bash
   cd monitoring
   checkly deploy
   ```

### Monitoring Endpoints

#### 1. Basic Health Check (`/api/health`)

- **Frequency**: Every 5 minutes
- **Locations**: US East, EU West, Asia Pacific Southeast
- **Purpose**: Memastikan API berjalan dan merespons
- **Expected Response**:

  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "version": "1.0.0",
    "uptime": 12345.67,
    "services": {
      "api": "operational",
      "port": "8000"
    }
  }
  ```

#### 2. Detailed Health Check (`/api/health/detailed`)

- **Frequency**: Every 10 minutes
- **Locations**: US East, EU West, Asia Pacific Southeast
- **Purpose**: Monitor semua database connections dan external services
- **Expected Response**:

  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "version": "1.0.0",
    "uptime": 12345.67,
    "databases": {
      "postgresql_neon_1": {
        "status": "connected",
        "type": "PostgreSQL",
        "purpose": "Main Application Database"
      },
      "mongodb": {
        "status": "connected",
        "type": "MongoDB",
        "purpose": "Unstructured Data & Transcripts"
      },
      "supabase": {
        "status": "connected",
        "type": "PostgreSQL (Supabase)",
        "purpose": "Realtime & Edge Functions"
      },
      "turso": {
        "status": "connected",
        "type": "LibSQL/SQLite",
        "purpose": "Edge Cache"
      },
      "edgedb": {
        "status": "connected",
        "type": "EdgeDB",
        "purpose": "Knowledge Graph"
      }
    },
    "external_services": {
      "byteplus_ark": {
        "configured": true,
        "purpose": "Primary AI Engine"
      },
      "groq": {
        "configured": true,
        "purpose": "Secondary AI Engine (Dual-AI Verification)"
      },
      "clerk": {
        "configured": true,
        "purpose": "Authentication & User Management"
      },
      "stripe": {
        "configured": true,
        "purpose": "Payment & Subscription Management"
      }
    },
    "system_info": {
      "python_version": "3.11.0",
      "platform": "linux",
      "port": "8000",
      "workers": "4"
    }
  }
  ```

#### 3. Readiness Check (`/api/health/ready`)

- **Purpose**: Kubernetes/container readiness probe
- **Use Case**: Menentukan apakah container siap menerima traffic

#### 4. Liveness Check (`/api/health/live`)

- **Purpose**: Kubernetes/container liveness probe
- **Use Case**: Mendeteksi jika aplikasi hang atau deadlock

### Alert Configuration

Checkly akan mengirim alert jika:

- Health check endpoint tidak merespons (downtime)
- Response time melebihi threshold (degraded performance)
- Status code bukan 200 OK
- Database connections gagal

### Alert Channels

Konfigurasi alert channels di Checkly dashboard:

- Email notifications
- Slack integration
- PagerDuty (untuk critical alerts)
- Webhook (custom integrations)

## Sentry Error Tracking

### Configuration

Sentry sudah terintegrasi di backend (`app.py`):

```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "development")
)
```

### Environment Variables Required

- `SENTRY_DSN`: Sentry Data Source Name
- `SENTRY_PROJECT`: Project name di Sentry
- `SENTRY_ORG`: Organization name di Sentry

### What Sentry Monitors

1. **Error Tracking**: Semua unhandled exceptions
2. **Performance Monitoring**: API response times
3. **Transaction Tracing**: Request flow through the application
4. **Release Tracking**: Deploy tracking dan error attribution

### Sentry Dashboard

Access Sentry dashboard untuk:

- Real-time error notifications
- Error frequency dan trends
- Stack traces dan context
- User impact analysis
- Performance bottlenecks

## Monitoring Best Practices

### 1. Response Time Thresholds
- **Healthy**: < 2 seconds
- **Degraded**: 2-5 seconds
- **Critical**: > 5 seconds

### 2. Database Connection Monitoring
- Monitor semua database connections secara berkala
- Alert jika ada database yang tidak terhubung
- Track connection pool usage

### 3. External Service Monitoring
- Verify API keys configured
- Monitor API rate limits
- Track external service failures

### 4. Log Aggregation
- Centralize logs dari semua services
- Use structured logging (JSON format)
- Implement log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)

## Troubleshooting

### Checkly Check Failing
1. Verify backend URL is correct
2. Check if backend is running
3. Verify firewall/security group rules
4. Check SSL certificate validity

### Database Connection Issues
1. Check database credentials
2. Verify network connectivity
3. Check database server status
4. Review connection pool settings

### High Response Times
1. Check database query performance
2. Review API endpoint logic
3. Monitor external API calls
4. Check server resources (CPU, memory)

## Maintenance

### Regular Tasks
- Review monitoring alerts weekly
- Update alert thresholds based on trends
- Test failover scenarios monthly
- Review and optimize slow endpoints
- Update monitoring checks when adding new features

## Support
For issues or questions:
- Checkly Documentation: https://www.checklyhq.com/docs/
- Sentry Documentation: https://docs.sentry.io/
- Internal Support: [Your support channel]

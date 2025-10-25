# 🏗️ TestSprite MCP Architecture - Pasalku AI

## 📊 Architecture Overview

```mermaid
graph TB
    A[Pasalku AI Project] --> B[MCP Configuration Layer]
    B --> C[TestSprite MCP Server]
    C --> D[IDE Integration]
    C --> E[Backend Services]
    C --> F[Testing Pipeline]
    
    D --> D1[Claude Desktop]
    D --> D2[Cursor IDE]
    D --> D3[VS Code]
    
    E --> E1[Python Backend]
    E --> E2[FastAPI Routes]
    E --> E3[AI Services]
    
    F --> F1[Unit Tests]
    F --> F2[Integration Tests]
    F --> F3[E2E Tests]
```

---

## 🔄 Configuration Flow

```mermaid
graph LR
    A[.env.mcp] -->|Load Environment| B[start-mcp.ps1]
    C[mcp-config.json] -->|Read Config| B
    B -->|Set Variables| D[Environment]
    D -->|Pass to| E[NPX Command]
    E -->|Execute| F[TestSprite MCP Server]
    F -->|Connect| G[IDE/Tools]
```

---

## 📁 File Structure & Relationships

```mermaid
graph TD
    A[Project Root] --> B[Configuration Files]
    A --> C[Scripts]
    A --> D[Documentation]
    A --> E[Templates]
    
    B --> B1[mcp-config.json<br/>🔒 PRIVATE]
    B --> B2[.env.mcp<br/>🔒 PRIVATE]
    
    C --> C1[start-mcp.ps1<br/>✅ PUBLIC]
    
    D --> D1[MCP_SETUP_GUIDE.md<br/>✅ PUBLIC]
    D --> D2[MCP_QUICK_REFERENCE.md<br/>✅ PUBLIC]
    D --> D3[MCP_CONFIGURATION_SUMMARY.md<br/>✅ PUBLIC]
    
    E --> E1[mcp-config.example.json<br/>✅ PUBLIC]
    E --> E2[.env.mcp.example<br/>✅ PUBLIC]
    
    B1 -.->|Template| E1
    B2 -.->|Template| E2
```

---

## 🔐 Security Architecture

```mermaid
graph TB
    A[API Keys & Secrets] --> B{Storage Method}
    B -->|Development| C[.env.mcp file]
    B -->|Production| D[Environment Variables]
    
    C --> E[.gitignore]
    D --> F[Secrets Management]
    
    F --> F1[Vercel Env Vars]
    F --> F2[Railway Secrets]
    F --> F3[GitHub Secrets]
    
    E -->|Excludes| G[Git Repository]
    G -->|Safe for| H[Public Commit]
    
    C -.->|Never| G
    D -->|Safe| G
```

---

## 🔌 Integration Points

```mermaid
graph LR
    A[TestSprite MCP Server] --> B{Integration Layer}
    
    B --> C[IDE Integration]
    C --> C1[Model Context Protocol]
    C1 --> C2[Claude Desktop]
    C1 --> C3[Cursor IDE]
    C1 --> C4[VS Code]
    
    B --> D[Backend Integration]
    D --> D1[Python Services]
    D --> D2[FastAPI Routes]
    D --> D3[Testing Framework]
    
    B --> E[CI/CD Integration]
    E --> E1[GitHub Actions]
    E --> E2[Azure Pipelines]
    E --> E3[Railway Deploy]
```

---

## 📊 Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Script as start-mcp.ps1
    participant Env as Environment
    participant NPX
    participant MCP as TestSprite MCP
    participant API as TestSprite API
    
    User->>Script: Run ./start-mcp.ps1
    Script->>Script: Load .env.mcp
    Script->>Env: Set TESTSPRITE_API_KEY
    Script->>Env: Set TESTSPRITE_PROJECT
    Script->>NPX: Execute npx @testsprite/testsprite-mcp@latest
    NPX->>MCP: Start MCP Server
    MCP->>Env: Read API Key
    MCP->>API: Authenticate
    API-->>MCP: Auth Success
    MCP-->>User: Server Ready
```

---

## 🎯 Configuration Comparison

### ❌ Wrong Configuration (Original)

```mermaid
graph LR
    A[env object] --> B["sk-user--TY-...: 'mcp_pasalku'"]
    B -.->|WRONG| C[API key as KEY]
    B -.->|WRONG| D[Project as VALUE]
    
    style B fill:#ff6b6b
    style C fill:#ff6b6b
    style D fill:#ff6b6b
```

**Problems:**
- API key (long string) used as environment variable **name**
- Project identifier used as environment variable **value**
- Reversed key-value relationship

---

### ✅ Correct Configuration (Fixed)

```mermaid
graph LR
    A[env object] --> B[TESTSPRITE_API_KEY]
    A --> C[TESTSPRITE_PROJECT]
    
    B --> D["'sk-user--TY-...'"]
    C --> E["'mcp_pasalku'"]
    
    D -->|VALUE| F[API Authentication]
    E -->|VALUE| G[Project Identifier]
    
    style B fill:#51cf66
    style C fill:#51cf66
    style D fill:#51cf66
    style E fill:#51cf66
```

**Correct Structure:**
- `TESTSPRITE_API_KEY` as environment variable **name**
- API key (long string) as **value** of `TESTSPRITE_API_KEY`
- `TESTSPRITE_PROJECT` as environment variable **name**
- Project identifier as **value** of `TESTSPRITE_PROJECT`

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    A[Development Environment] --> B{Environment}
    B -->|Local| C[.env.mcp file]
    B -->|Staging| D[Environment Variables]
    B -->|Production| E[Secrets Management]
    
    C --> F[start-mcp.ps1]
    D --> G[Railway Deployment]
    E --> H[Vercel Deployment]
    
    F -->|Local Testing| I[TestSprite MCP]
    G -->|Staging Tests| I
    H -->|Production Tests| I
    
    I --> J[Test Reports]
    J --> K[CI/CD Pipeline]
```

---

## 🔧 Testing Workflow

```mermaid
graph TD
    A[Developer] -->|Write Code| B[Pasalku AI Features]
    B -->|Commit| C[Git Repository]
    C -->|Trigger| D[CI/CD Pipeline]
    
    D --> E{Run Tests}
    E -->|Unit Tests| F[Jest/Pytest]
    E -->|Integration| G[TestSprite MCP]
    E -->|E2E Tests| H[Playwright]
    
    F --> I{All Pass?}
    G --> I
    H --> I
    
    I -->|Yes| J[Deploy to Staging]
    I -->|No| K[Notify Developer]
    
    J --> L[Smoke Tests]
    L -->|Pass| M[Deploy to Production]
    L -->|Fail| K
```

---

## 📦 Component Interaction

```mermaid
graph TB
    subgraph "Pasalku AI Project"
        A[Frontend - Next.js]
        B[Backend - FastAPI]
        C[Database Layer]
    end
    
    subgraph "MCP Layer"
        D[mcp-config.json]
        E[.env.mcp]
        F[start-mcp.ps1]
    end
    
    subgraph "TestSprite MCP"
        G[MCP Server]
        H[Test Runner]
        I[Report Generator]
    end
    
    F --> D
    F --> E
    F --> G
    
    G --> A
    G --> B
    
    H --> A
    H --> B
    H --> C
    
    I --> J[Test Results]
    J --> K[Dashboard]
```

---

## 🌐 Environment Variables Flow

```mermaid
graph LR
    A[.env.mcp file] -->|Parse| B[start-mcp.ps1]
    B -->|Set| C[Process Environment]
    
    C --> D[TESTSPRITE_API_KEY]
    C --> E[TESTSPRITE_PROJECT]
    
    D --> F[Authentication]
    E --> G[Project Context]
    
    F --> H[TestSprite API]
    G --> H
    
    H --> I[MCP Server Active]
```

---

## 🔄 Update & Maintenance Flow

```mermaid
graph TD
    A[API Key Rotation] -->|Update| B[.env.mcp]
    B -->|Restart| C[start-mcp.ps1]
    C --> D[New MCP Session]
    
    E[Config Update] -->|Modify| F[mcp-config.json]
    F -->|Restart| C
    
    G[MCP Package Update] -->|Run| H[npm install]
    H -->|Latest| I[@testsprite/testsprite-mcp@latest]
    I -->|Restart| C
```

---

## 📊 Performance Monitoring

```mermaid
graph TB
    A[MCP Server] --> B[Metrics Collection]
    B --> C{Metric Types}
    
    C --> D[Response Time]
    C --> E[Success Rate]
    C --> F[API Calls]
    
    D --> G[Dashboard]
    E --> G
    F --> G
    
    G --> H{Alert Conditions}
    H -->|Slow Response| I[Alert Team]
    H -->|High Failure| I
    H -->|Quota Exceeded| I
```

---

## 🎓 Best Practices Flow

```mermaid
graph LR
    A[Development] --> B{Security Check}
    B -->|Pass| C[.env.mcp in .gitignore]
    C --> D[Use Templates]
    D --> E[Documentation]
    
    E --> F[Commit to Git]
    
    B -->|Fail| G[Fix Security Issues]
    G --> A
```

---

## 🔍 Troubleshooting Decision Tree

```mermaid
graph TD
    A[MCP Not Working] --> B{Check Installation}
    B -->|Not Installed| C[npm install]
    B -->|Installed| D{Check Config}
    
    D -->|Invalid| E[Fix mcp-config.json]
    D -->|Valid| F{Check API Key}
    
    F -->|Invalid| G[Update .env.mcp]
    F -->|Valid| H{Check Network}
    
    H -->|Network Issue| I[Check Firewall]
    H -->|Network OK| J{Check Logs}
    
    C --> K[Retry]
    E --> K
    G --> K
    I --> K
    J --> L[Contact Support]
```

---

## 📚 Documentation Hierarchy

```mermaid
graph TD
    A[MCP Documentation] --> B[Quick Start]
    A --> C[Detailed Guide]
    A --> D[Reference]
    A --> E[Architecture]
    
    B --> B1[MCP_QUICK_REFERENCE.md]
    C --> C1[MCP_SETUP_GUIDE.md]
    D --> D1[MCP_CONFIGURATION_SUMMARY.md]
    E --> E1[MCP_ARCHITECTURE.md]
    
    B1 -.->|Links to| C1
    C1 -.->|Links to| D1
    D1 -.->|Links to| E1
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-10-25  
**Project:** Pasalku AI - TestSprite MCP Integration

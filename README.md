# 🚀 Pasalku.AI - Platform AI Hukum Indonesia Terdepan

[![CI/CD](https://github.com/yhyaa294/pasalku-ai/actions/workflows/main-ci-cd.yml/badge.svg)](https://github.com/yhyaa294/pasalku-ai/actions/workflows/main-ci-cd.yml)
[![Dependency Review](https://github.com/yhyaa294/pasalku-ai/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/yhyaa294/pasalku-ai/actions/workflows/dependency-review.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)

> **Platform AI hukum pertama di Indonesia** - Analisis dokumen legal dengan akurasi 94.1%, konsultasi 24/7, dan prediksi kasus berbasis AI

[🌐 Live Demo](https://pasalku.ai) • [📚 Documentation](./docs/) • [🤝 Contributing](./CONTRIBUTING.md) • [📖 API Docs](./docs/API.md)

---

## ✨ Features

### 🤖 AI-Powered Legal Consultation
- **Chat 24/7** dengan AI legal assistant berbahasa Indonesia
- **Multi-LLM System** (Groq Llama 3.1 70B, GPT-4 Turbo)
- **Context-aware** dengan RAG (Retrieval Augmented Generation)
- **Akurasi 94.1%** dalam analisis hukum Indonesia

### 📄 Document Analysis & Generation
- **Smart Contract Analysis** - Review kontrak otomatis
- **PDF/DOCX Support** - Upload dan analisis dokumen
- **Legal Citation** - Referensi pasal otomatis
- **Document Templates** - Generate dokumen legal standar

### ⚖️ Case Prediction & Strategy
- **AI Case Prediction** - Prediksi outcome kasus dengan ML
- **Strategic Reports** - Laporan strategi hukum otomatis (PDF)
- **SWOT Analysis** - Analisis strengths, weaknesses, opportunities, threats
- **Action Plan** - Rekomendasi langkah hukum 4 minggu

### 🎯 Proactive AI Orchestrator
- **Intelligent Feature Offering** - AI suggest fitur sesuai konteks
- **Multi-tier Access** (Free, Professional, Premium)
- **Persona Simulation** - 5 AI persona untuk negosiasi
- **Clarification System** - AI tanya pertanyaan yang tepat

### 📚 Legal Knowledge Base
- **1000+ Pasal** UU Indonesia (KUHP, KUHAP, UU Ketenagakerjaan, dll)
- **Kamus Hukum** interaktif dengan 500+ istilah
- **Case Database** dengan putusan MA/PN
- **Semantic Search** powered by ChromaDB

---

## 🏗️ Tech Stack

### Frontend
```
Next.js 15.5  •  React 18  •  TypeScript  •  Tailwind CSS
Shadcn/ui  •  Framer Motion  •  Clerk Auth
```

### Backend
```
FastAPI  •  Python 3.11  •  Pydantic  •  SQLAlchemy
MongoDB  •  PostgreSQL  •  ChromaDB (Vector DB)
```

### AI/ML
```
Groq (Llama 3.1 70B)  •  OpenAI GPT-4  •  LangChain
RAG System  •  Embeddings (OpenAI)  •  ReportLab (PDF)
```

### DevOps & Monitoring
```
GitHub Actions  •  Vercel  •  Railway
Sentry  •  Dependabot  •  CodeQL Security
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ dan npm/pnpm
- Python 3.11+
- MongoDB & PostgreSQL (atau cloud providers)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yhyaa294/pasalku-ai.git
cd pasalku-ai

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
pip install -r requirements.txt

# 4. Setup environment variables
cp .env.example .env
# Edit .env dengan API keys dan database URLs

# 5. Run development servers
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
python run_server.py
```

Frontend: `http://localhost:5000`  
Backend API: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

---

## 📁 Project Structure

```
pasalku-ai/
├── app/                    # Next.js App Router pages
│   ├── chat/              # AI Chat interface
│   ├── legal-ai/          # Legal AI consultation
│   ├── pricing/           # Pricing & plans
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── sections/         # Landing page sections
│   └── features/         # Feature-specific components
├── backend/
│   ├── routers/          # FastAPI route handlers
│   ├── services/         # Business logic
│   │   ├── ai/          # AI orchestration
│   │   ├── legal_ai_orchestrator.py
│   │   └── report_generator.py
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas
│   └── core/            # Config & security
├── .github/
│   ├── workflows/        # CI/CD pipelines
│   └── dependabot.yml   # Auto dependency updates
└── docs/                # Documentation
```

---

## 🧪 Testing

```bash
# Frontend tests
npm test
npm run test:e2e

# Backend tests
cd backend
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html

# Security scan
npm audit
safety check --file backend/requirements.txt
```

---

## 🚢 Deployment

### Automated Deployment (Main Branch)

Push to `main` triggers automatic deployment via GitHub Actions:

1. **Security Scans** - CodeQL + Trivy
2. **Build & Test** - Frontend + Backend
3. **Deploy** - Vercel (Frontend) + Railway (Backend)
4. **Performance Audit** - Lighthouse CI

### Manual Deployment

**Frontend (Vercel):**
```bash
npm run build
vercel --prod
```

**Backend (Railway):**
```bash
railway up
```

---

## 🔒 Security

- ✅ **GitHub Advanced Security** enabled
- ✅ **Secret Scanning** with push protection
- ✅ **Dependabot** auto security updates
- ✅ **CodeQL** analysis on every PR
- ✅ **Trivy** container vulnerability scanning

Report security issues: security@pasalku.ai

---

## 📊 Performance

- ⚡ **Lighthouse Score:** 90+ (Performance, SEO, Accessibility)
- 🚀 **First Contentful Paint:** < 1.5s
- 📱 **Mobile Optimized:** 100% responsive
- 🌐 **API Response Time:** < 200ms (p95)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 Documentation

- [📖 Architecture Overview](./AI_ARCHITECTURE_MASTER_PLAN.md)
- [🔧 API Documentation](./docs/API.md)
- [🚀 Deployment Guide](./docs/DEPLOYMENT.md)
- [🧪 Testing Guide](./docs/TESTING.md)
- [📚 Master Documentation](./PASALKU_AI_MASTER_DOCUMENTATION.md)

---

## 🗺️ Roadmap

**Q4 2025:**
- ✅ Proactive AI Orchestrator
- ✅ Strategic Report Generator
- 🚧 Pasalku Academy (Learning Platform)
- 🚧 Mobile App (React Native)

**Q1 2026:**
- 📋 Real-time Collaboration
- 📋 Voice-to-text legal consultation
- 📋 Integration dengan JDIH (Jaringan Dokumentasi Hukum)
- 📋 Blockchain-based document verification

See [PROJECT_TIMELINE_2025.md](./PROJECT_TIMELINE_2025.md) for detailed roadmap.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 👥 Team

**Developed by:** Pasalku.AI Team  
**Maintained by:** [@yhyaa294](https://github.com/yhyaa294)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) - Ultra-fast LLM inference
- [OpenAI](https://openai.com/) - GPT-4 API
- [Vercel](https://vercel.com/) - Frontend hosting
- [Railway](https://railway.app/) - Backend infrastructure
- Indonesian legal community for feedback and support

---

## 📞 Support

- 📧 Email: support@pasalku.ai
- 💬 Discord: [Join our community](https://discord.gg/pasalku-ai)
- 🐦 Twitter: [@PasalkuAI](https://twitter.com/PasalkuAI)
- 📚 Docs: [docs.pasalku.ai](https://docs.pasalku.ai)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ in Indonesia 🇮🇩

</div>

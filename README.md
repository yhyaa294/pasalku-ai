# Pasalku.ai - Legal AI Consultation Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/syarifuddinudin526-9418s-projects/v0-pasalku-ai)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **Pasalku.ai** adalah platform konsultasi hukum berbasis AI yang menyediakan informasi hukum Indonesia yang akurat dan terpercaya. Platform ini menggunakan teknologi AI untuk memberikan penjelasan hukum yang mudah dipahami dengan sitasi yang jelas.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Arsitektur](#arsitektur)
- [Teknologi Stack](#teknologi-stack)
- [Status Pengembangan](#status-pengembangan)
- [Roadmap Pengembangan](#roadmap-pengembangan)
- [Panduan Instalasi](#panduan-instalasi)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Proyek](#struktur-proyek)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Fitur Utama

### Sudah Diimplementasi
- **Landing Page** dengan UI/UX modern dan responsif
- **Chat Interface** untuk konsultasi hukum AI
- **Autentikasi** dengan JWT token
- **Integrasi AI** menggunakan BytePlus Ark
- **Sistem Role** (Public, Legal Professional, Admin)
- **Payment Integration** dengan Stripe
- **Database** PostgreSQL dengan SQLAlchemy ORM
- **CORS Support** untuk frontend-backend communication

### Sedang Dikembangkan
- Thread management system
- Advanced AI features
- Enhanced payment features
- Admin dashboard

## Arsitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     Database    │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Landing Page  │    │ • REST API      │    │ • User Data     │
│ • Chat UI       │    │ • Auth System   │    │ • Chat History  │
│ • Auth Pages    │    │ • AI Integration│    │ • Payment Data  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     AI Service  │    │ Payment Service │    │   File Storage  │
│ (BytePlus Ark)  │    │    (Stripe)     │    │     (AWS S3)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Teknologi Stack

### Frontend
- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **AI Integration**: BytePlus Ark SDK
- **Payment**: Stripe SDK
- **Validation**: Pydantic

### Database & Infrastructure
- **Database**: PostgreSQL
- **Deployment**: Vercel (Frontend) + Railway/Heroku (Backend)
- **File Storage**: AWS S3 (planned)
- **Monitoring**: Sentry (planned)
- **Analytics**: Vercel Analytics

## Status Pengembangan

### Completed (Phase 1 - MVP)
- [x] **Frontend Setup** - Next.js project with TypeScript
- [x] **Backend Setup** - FastAPI with PostgreSQL
- [x] **Authentication System** - JWT-based auth with role management
- [x] **AI Integration** - BytePlus Ark integration
- [x] **Chat Interface** - Real-time chat UI
- [x] **Payment Setup** - Stripe integration
- [x] **Database Models** - User, Role, Chat models
- [x] **CORS Configuration** - Frontend-backend communication
- [x] **Basic Deployment** - Vercel deployment

### In Progress (Phase 2 - Enhancement)
- [ ] Thread management system
- [ ] Advanced AI features
- [ ] Enhanced payment features
- [ ] Admin dashboard

### Planned (Phase 3 - Scale)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced security features

## Roadmap Pengembangan

### Penyempurnaan Backend

#### Autentikasi & Otorisasi
- [x] **DONE**: Implementasi endpoint login/register
- [x] **DONE**: Middleware untuk verifikasi token JWT
- [x] **DONE**: Manajemen role (admin/user)
- [ ] Enhanced session management
- [ ] Password reset functionality
- [ ] Email verification system

#### Manajemen Thread
- [ ] CRUD endpoint untuk thread
- [ ] Endpoint summarization thread
- [ ] Filter dan pencarian thread
- [ ] Thread categories dan tags
- [ ] Thread sharing dan collaboration

#### Integrasi AI
- [x] **DONE**: Implementasi service AI agent
- [ ] Error handling untuk API AI
- [ ] Rate limiting untuk API AI
- [ ] AI model versioning
- [ ] Advanced prompt engineering

#### Pembayaran (Stripe)
- [x] **DONE**: Webhook handler untuk pembayaran
- [ ] Manajemen subscription
- [ ] Endpoint untuk upgrade/downgrade plan
- [ ] Invoice generation
- [ ] Payment analytics

### Pengembangan Frontend

#### Halaman Utama
- [x] **DONE**: Daftar thread
- [x] **DONE**: Form buat thread baru
- [x] **DONE**: Tampilan hasil summarization
- [ ] Advanced search and filtering
- [ ] Real-time notifications

#### Autentikasi
- [x] **DONE**: Halaman login/register
- [x] **DONE**: Manajemen session
- [x] **DONE**: Proteksi rute
- [ ] Social login integration
- [ ] Remember me functionality

#### Manajemen Akun
- [ ] Profil pengguna
- [ ] Riwayat pembayaran
- [ ] Manajemen subscription
- [ ] Account settings
- [ ] Data export

### Deployment

#### Deployment Backend
- [ ] Dockerfile
- [ ] Konfigurasi environment
- [ ] Setup database production
- [ ] CI/CD pipeline
- [ ] Health checks

#### Deployment Frontend
- [x] **DONE**: Build untuk production
- [x] **DONE**: Konfigurasi environment
- [x] **DONE**: Deployment ke Vercel
- [ ] Performance optimization
- [ ] SEO improvements

### Testing

#### Unit Test
- [ ] Test untuk model
- [ ] Test untuk service
- [ ] Test utility functions
- [ ] Test coverage > 80%

#### Integration Test
- [ ] Test endpoint API
- [ ] Test alur autentikasi
- [ ] Test integrasi dengan layanan eksternal
- [ ] E2E testing

### Monitoring & Logging

#### Error Tracking
- [ ] Setup Sentry
- [ ] Logging yang bermakna
- [ ] Monitoring performa
- [ ] Error rate monitoring

#### Analytics
- [ ] Tracking penggunaan fitur
- [ ] Dashboard admin
- [ ] Laporan aktivitas pengguna
- [ ] User behavior analytics

### Keamanan

#### Hardening
- [ ] Rate limiting
- [ ] Input validation
- [ ] Proteksi XSS/CSRF
- [ ] Security headers

#### Backup
- [ ] Otomatisasi backup database
- [ ] Recovery plan
- [ ] Enkripsi data sensitif
- [ ] Data retention policy

### Dokumentasi

#### API
- [ ] Dokumentasi Swagger/OpenAPI
- [ ] Contoh request/response
- [ ] Panduan autentikasi
- [ ] API versioning guide

#### Pengguna
- [ ] Panduan penggunaan
- [ ] FAQ
- [ ] Video tutorial
- [ ] Knowledge base

## Panduan Instalasi

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- npm/yarn/pnpm

### Frontend Setup

```bash
# Clone repository
git clone <repository-url>
cd pasalku-ai-5

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Environment variables
cp .env.example .env.local

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment variables
cp .env.example .env

# Run database migrations
python -m alembic upgrade head

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pasalku_db
SECRET_KEY=your-secret-key
ARK_API_KEY=your-ark-api-key
ARK_BASE_URL=https://ark.cn-beijing.volces.com
ARK_MODEL_ID=your-model-id
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

## Dokumentasi API

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123
```

#### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### AI Chat Endpoints

#### Chat with AI
```http
POST /chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "query": "Apa saja syarat mendirikan PT di Indonesia?"
}
```

Response:
```json
{
  "answer": "Untuk mendirikan PT di Indonesia...",
  "citations": ["Pasal 7 UU No. 40 Tahun 2007"],
  "disclaimer": "Informasi ini bukan merupakan nasihat hukum..."
}
```

### Payment Endpoints

#### Create Checkout Session
```http
POST /create-checkout-session
Authorization: Bearer <token>
```

## Struktur Proyek

```
pasalku-ai-5/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── chat-interface.tsx # Chat component
│   ├── navigation.tsx    # Navigation component
│   └── ...               # Other components
├── backend/              # FastAPI backend
│   ├── core/            # Core modules
│   │   ├── config.py    # Configuration
│   │   └── security.py  # Security utilities
│   ├── services/        # Business logic
│   │   ├── ai_agent.py  # AI service
│   │   └── stripe_service.py # Payment service
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI app
├── supabase/            # Supabase functions
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
├── public/              # Static assets
├── lib/                 # Utility functions
└── README.md           # This file
```

## 9. Deployment

### Frontend (Vercel)
- **Production URL**: [https://pasalku-ai.vercel.app](https://pasalku-ai.vercel.app)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Backend (Railway/Heroku)
- **Framework**: FastAPI
- **Buildpack**: Python
- **Environment**: Production environment variables

## Kontribusi

Kami menyambut kontribusi! Silakan ikuti langkah-langkah berikut:

1. **Fork** repository ini
2. **Buat branch** untuk fitur baru (`git checkout -b feature/amazing-feature`)
3. **Commit** perubahan (`git commit -m 'Add amazing feature'`)
4. **Push** ke branch (`git push origin feature/amazing-feature`)
5. **Buat Pull Request**

### Development Guidelines
- Ikuti konvensi penamaan yang ada
- Tulis test untuk fitur baru
- Update dokumentasi jika diperlukan
- Pastikan code review sebelum merge

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## Kontak

**Project Link**: [https://github.com/your-username/pasalku-ai-5](https://github.com/your-username/pasalku-ai-5)

**Email**: contact@pasalku.ai

---

<div align="center">

**Dibuat dengan ❤️ untuk kemajuan akses informasi hukum di Indonesia**

[🌐 Kunjungi Website](https://pasalku-ai.vercel.app) • [📖 Dokumentasi API](#dokumentasi-api) • [💬 Chat dengan Kami](https://t.me/pasalku_ai)

</div>

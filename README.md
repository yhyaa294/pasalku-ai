# Pasalku.ai - AI Legal Assistant

Sistem AI asisten hukum Indonesia yang membantu pengguna dengan konsultasi hukum berbasis kecerdasan buatan.

## Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Registrasi dan login pengguna
- JWT token dengan refresh mechanism
- Role-based access control (Public, Legal Professional, Admin)
- Rate limiting dan keamanan input

### 💬 Konsultasi AI
- Chat dengan AI untuk pertanyaan hukum
- Session-based conversation management
- Riwayat chat yang tersimpan
- Streaming response (dalam pengembangan)
- Citations dan disclaimer hukum

### 🛡️ Keamanan
- Rate limiting per IP dan per user
- Input validation dan sanitization
- XSS protection
- SQL injection prevention
- CORS configuration

### 📊 Database
- PostgreSQL/SQLite support
- UUID-based primary keys
- Audit trails (created_at, updated_at)
- Relationship management

## Teknologi Stack

- **Backend**: FastAPI (Python)
- **Database**: SQLAlchemy + Alembic migrations
- **AI Service**: BytePlus Ark API
- **Authentication**: JWT tokens
- **Security**: Rate limiting, input validation
- **Testing**: Pytest
- **Documentation**: OpenAPI/Swagger

## Instalasi

### Prerequisites
- Python 3.8+
- pip
- Git

### Setup Development Environment

1. **Clone repository**
```bash
git clone https://github.com/your-username/pasalku-ai.git
cd pasalku-ai
```

2. **Install dependencies**
```bash
pip install -r backend/requirements.txt
```

3. **Environment configuration**
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

4. **Database setup**
```bash
cd backend
alembic upgrade head
```

5. **Run application**
```bash
uvicorn backend.main:app --reload
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login dan dapatkan token
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Info pengguna saat ini

### Chat
- `POST /api/chat/consult` - Konsultasi dengan AI
- `GET /api/chat/history` - Riwayat sesi chat
- `GET /api/chat/session/{session_id}` - Detail sesi chat
- `DELETE /api/chat/session/{session_id}` - Hapus sesi chat

## Testing

```bash
cd backend
pytest tests/
```

## Environment Variables

```env
# Environment
ENVIRONMENT=development
DEBUG=True

# BytePlus Ark Configuration
ARK_API_KEY=your-api-key-here
ARK_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
ARK_MODEL_ID=ep-20250830093230-swczp
ARK_REGION=ap-southeast

# Database
DATABASE_URL=sqlite:///sql_app.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000
```

## Development Guidelines

### Code Style
- Follow PEP 8
- Use type hints
- Write comprehensive docstrings
- Use meaningful variable names

### Testing
- Write unit tests for all functions
- Integration tests for API endpoints
- Test edge cases and error conditions

### Security
- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Implement proper error handling

## Deployment

### Production Setup
1. Set `ENVIRONMENT=production`
2. Use strong `SECRET_KEY`
3. Configure PostgreSQL database
4. Set up proper CORS origins
5. Enable HTTPS
6. Configure monitoring and logging

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@pasalku.ai or join our Discord community.

## Roadmap

- [ ] Streaming responses
- [ ] Multi-language support
- [ ] Advanced legal document analysis
- [ ] Integration with legal databases
- [ ] Mobile app development
- [ ] Voice consultation feature

# Pasalku AI - Backend

Backend untuk aplikasi Pasalku AI yang dibangun dengan FastAPI dan PostgreSQL.

## Fitur

- Autentikasi pengguna dengan JWT
- API untuk chat dengan AI
- Manajemen pengguna
- Riwayat chat
- Integrasi dengan layanan AI BytePlus

## Persyaratan Sistem

- Python 3.10+
- PostgreSQL 13+
- pip (Python package manager)

## Instalasi

1. Clone repository ini

   ```bash
   git clone https://github.com/username/pasalku-ai.git
   cd pasalku-ai/backend
   ```

2. Buat dan aktifkan virtual environment

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Unix/macOS
   source venv/bin/activate
   ```

3. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

4. Buat file `.env` berdasarkan `.env.example`

   ```bash
   cp .env.example .env
   ```

   Kemudian edit file `.env` dengan konfigurasi yang sesuai.

5. Jalankan migrasi database

   ```bash
   alembic upgrade head
   ```

6. Jalankan server pengembangan

   ```bash
   uvicorn app:app --reload
   ```

## Struktur Proyek

```text
backend/
├── alembic/               # File migrasi database
├── core/                  # File konfigurasi inti
├── models/                # Model database
├── routers/               # Router API
│   ├── __init__.py
│   ├── auth.py           # Autentikasi
│   ├── chat.py           # Endpoint chat
│   └── users.py          # Manajemen pengguna
├── schemas/              # Skema Pydantic
├── services/             # Layanan bisnis
├── tests/                # Unit test
├── .env.example          # Contoh file env
├── alembic.ini           # Konfigurasi Alembic
├── app.py               # Aplikasi utama
├── database.py          # Koneksi database
└── requirements.txt     # Dependensi
```

## Variabel Lingkungan

Buat file `.env` di direktori backend dengan variabel berikut:

```ini
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pasalku_ai

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 jam

# BytePlus AI
BYTEPLUS_ACCESS_KEY=your-byteplus-access-key
BYTEPLUS_SECRET_KEY=your-byteplus-secret-key
BYTEPLUS_REGION=ap-singapore-1
BYTEPLUS_MODEL_ID=your-model-id

# Environment
ENVIRONMENT=development
```

## Penggunaan

### Menjalankan Aplikasi

```bash
uvicorn app:app --reload
```

Aplikasi akan berjalan di `http://localhost:8000`

### Dokumentasi API

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Migrasi Database

Buat migrasi baru:

```bash
alembic revision --autogenerate -m "deskripsi perubahan"
```

Terapkan migrasi:

```bash
alembic upgrade head
```

### Menjalankan Test

```bash
pytest
```

## Lisensi

MIT
